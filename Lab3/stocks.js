const axios = require('axios');
const people = require('./people');

const get_stock_list = async _ => {
   const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json');
   return data;
};

const get_stock = async (stock_name) => {
    let sname = people.check_string_nonempty(stock_name);
    let stocks = await get_stock_list();
    let stock;

    for (let s of stocks) {
        if (s.stock_name == sname) {
            stock = s;
            break;
        }
    }

    if (stock == undefined) throw 'Error: Stock not found.';

    return stock;
}


async function listShareholders(stockName) {
    let stock = await get_stock(stockName);

    let shldrs = [];
    for (let sh of stock.shareholders) {
        let person = await people.getPersonById(sh.userId);
        let {first_name, last_name} = person;
        shldrs.push({
            first_name: first_name,
            last_name: last_name,
            number_of_shares: sh.number_of_shares});
    }

    stock.shareholders = shldrs;

    return stock;
}

async function totalShares(stockName) {
    let stock = await get_stock(stockName);
    let num_shldrs = stock.shareholders.length;

    if (num_shldrs < 1)
        return `${stockName} currently has no shareholders.`;

    let num_shares = 0;
    for (let sh of stock.shareholders)
        num_shares += sh.number_of_shares;

    let only_one = num_shldrs > 1;

    return `${stockName}, has `
        + `${num_shldrs} shareholder${only_one ? 's' : ''} `
        + `that own${only_one ? '' : 's'} a total of `
        + `${num_shares} share${only_one ? 's' : ''}.`
        .replaceAll('\n', '');
}

async function listStocks(firstName, lastName) {
    let { id } = await people.getPersonByName(firstName, lastName);
    let stocks = await get_stock_list();

    let slist = [];

    for (let s of stocks) {
        for (let sh of s.shareholders) {
            if (sh.userId === id) {
                slist.push({
                    stock_name: s.stock_name,
                    number_of_shares: sh.number_of_shares
                });
                break;
            }
        }
    }

    return slist;
}

async function getStockById(id) {
    let sid = people.check_string_nonempty(id);
    let stocks = await get_stock_list();

    for (let s of stocks) {
        if (s.id === sid)
            return s;
    }

    throw 'Error: Stock not found.';
}

module.exports = {
  description: 'People Module',
  listShareholders,
  totalShares,
  listStocks,
  getStockById,
};
