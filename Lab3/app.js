const people = require('./people');
const stocks = require('./stocks');

const is_equal_arr = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length != arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i])) {
            if (!is_equal_arr(arr1[i], arr2[i])) return false;
        } else if (typeof arr1[i] == 'object') {
            if (!is_equal_obj(arr1[i], arr2[i])) return false;
        } else if (arr1[i] != arr2[i]) return false;
    }

    return true;
}

const is_equal_obj = (obj1, obj2) => {
    if (obj1 == undefined || obj2 == undefined) return false;
    if (obj1 == null || obj2 == null) return false;

    let keys_1 = Object.keys(obj1).sort(),
        keys_2 = Object.keys(obj2).sort();
    if (!is_equal_arr(keys_1, keys_2)) return false;

    for (let i = 0; i < keys_1.length; i++) {
        let el1 = obj1[keys_1[i]],
            el2 = obj2[keys_2[i]];
        if (Array.isArray(el1)) {
            if (!is_equal_arr(el1, el2))
                return false;
        } else if (typeof el1 == 'object') {
            if (!is_equal_obj(el1, el2)) return false;
        } else if (!Object.is(el1, el2)) return false;
    }

    return true;
}

let passed = 0;
let tested = 0;

async function test(tests, name) {
    console.log(`TESTING ${name} ...`);

    let err_count = 0;
    let test_count = tests.length;

    for (let i = 0; i < tests.length; i++) {
        let t = tests[i];
        let result;
        try {
            result = await t.func.apply(null, t.args);
            //console.log(i, result);
            if (Object.is(result, t.exp)) continue;
            if (Array.isArray(result)) {
                if (is_equal_arr(result, t.exp)) continue;
            } else if (typeof result == 'object') {
                if (is_equal_obj(result, t.exp)) continue;
            }
        } catch (e) {
            //console.log(i, e);
            if (Object.is(e, t.exp)) continue;
            result = e;
        }

        console.log(`- TEST ${name}#${i+1} FAILED`);
        console.log(`  RECEIVED: ${JSON.stringify(result)} | EXPECTED: ${JSON.stringify(t.exp)}`);
        ++err_count;
    }

    passed += test_count - err_count;
    tested += test_count;

    if (err_count) {
        console.log(`* ${name} failed ${err_count}/${test_count}`);
        return false;
    }

    console.log('* PASSED');
    return true;
}

let ppl_tests = [
    {func: people.getPersonById, args: [],
        exp: 'Error: No string provided.'},
    {func: people.getPersonById, args: [-1],
        exp: 'Error: No string provided.'},
    {func: people.getPersonById, args: [1001],
        exp: 'Error: No string provided.'},
    {func: people.getPersonById,
        args: ['7989fa5e-5617-43f7-a931-46036f9dbcff'],
        exp: 'Error: Person not found.'},
    {func: people.getPersonById,
        args: ["7989fa5e-8f3f-458d-ad58-23c8d9ef5a10"],
        exp: {
            id: "7989fa5e-8f3f-458d-ad58-23c8d9ef5a10",
            first_name: "Val",
            last_name: "Kinsell",
            email: "vkinsell4@icq.com",
            ip_address: "169.162.241.22",
            ssn: "578-08-2277",
            date_of_birth: "11/30/1979",
            address: {
              home: {
                street_number: "0",
                street_name: "Schiller",
                street_suffix: "Junction",
                city: "Houston",
                state: "TX",
                zip: "77090"
              },
             work: {
               street_number: "21",
               street_name: "Dryden",
               street_suffix: "Trail",
               city: "New York City",
               state: "NY",
               zip: "10034"
            }}
        }},
    {func: people.sameEmail, args: [],
        exp: 'Error: No string provided.'},
    {func: people.sameEmail, args: ["foobar"],
        exp: 'Error: Invalid domain.'},
    {func: people.sameEmail, args: ["foobar."],
        exp: 'Error: Invalid domain.'},
    {func: people.sameEmail, args: ["foobar.123"],
        exp: 'Error: Invalid domain.'},
    {func: people.sameEmail, args: ["foobar.a"],
        exp: 'Error: Invalid domain.'},
    {func: people.sameEmail, args: [".com"],
        exp: 'Error: Invalid domain.'},
    {func: people.sameEmail, args: ["google.com.hk"],
        exp: 'Error: Two or more people with this domain not found.'},
    {func: people.sameEmail, args: ["harvard.edu"],
        exp: [
            {"id":"9573b4d0-1666-4bff-ac03-6f0b7b5b99ca","first_name":"Ardenia","last_name":"Seid","email":"aseid1@harvard.edu","ip_address":"39.122.18.68","ssn":"116-84-0804","date_of_birth":"10/24/1946","address":{"home":{"street_number":"1","street_name":"Bluejay","street_suffix":"Parkway","city":"Tampa","state":"FL","zip":"33680"},"work":{"street_number":"84000","street_name":"Ruskin","street_suffix":"Junction","city":"Fort Worth","state":"TX","zip":"76110"}}},{"id":"b25be6d3-036d-4b18-9fda-6afac4623603","first_name":"Tracee","last_name":"Farmiloe","email":"tfarmiloe15@harvard.edu","ip_address":"110.44.186.56","ssn":"830-02-0272","date_of_birth":"07/25/1981","address":{"home":{"street_number":"99395","street_name":"Shopko","street_suffix":"Parkway","city":"Nashville","state":"TN","zip":"37235"},"work":{"street_number":"50804","street_name":"North","street_suffix":"Plaza","city":"Waterbury","state":"CT","zip":"06721"}}},{"id":"1380f2af-e0d8-4231-a9e7-f09650afc0bb","first_name":"Vonnie","last_name":"Skoate","email":"vskoatend@harvard.edu","ip_address":"136.44.63.233","ssn":"752-11-3294","date_of_birth":"09/30/1999","address":{"home":{"street_number":"43","street_name":"Hermina","street_suffix":"Street","city":"Port Washington","state":"NY","zip":"11054"},"work":{"street_number":"65522","street_name":"Hayes","street_suffix":"Avenue","city":"Mobile","state":"AL","zip":"36616"}}},{"id":"3c9e028d-c739-4c70-b81a-cfcf8c094cb0","first_name":"Arlin","last_name":"Awdry","email":"aawdryql@harvard.edu","ip_address":"220.107.136.220","ssn":"291-66-6045","date_of_birth":"06/30/1985","address":{"home":{"street_number":"9","street_name":"Columbus","street_suffix":"Center","city":"Rochester","state":"NY","zip":"14609"},"work":{"street_number":"69431","street_name":"Scofield","street_suffix":"Alley","city":"Green Bay","state":"WI","zip":"54305"}}}]},
    {func: people.sameEmail, args: ["HARVARD.EDU"],
        exp: [
            {"id":"9573b4d0-1666-4bff-ac03-6f0b7b5b99ca","first_name":"Ardenia","last_name":"Seid","email":"aseid1@harvard.edu","ip_address":"39.122.18.68","ssn":"116-84-0804","date_of_birth":"10/24/1946","address":{"home":{"street_number":"1","street_name":"Bluejay","street_suffix":"Parkway","city":"Tampa","state":"FL","zip":"33680"},"work":{"street_number":"84000","street_name":"Ruskin","street_suffix":"Junction","city":"Fort Worth","state":"TX","zip":"76110"}}},{"id":"b25be6d3-036d-4b18-9fda-6afac4623603","first_name":"Tracee","last_name":"Farmiloe","email":"tfarmiloe15@harvard.edu","ip_address":"110.44.186.56","ssn":"830-02-0272","date_of_birth":"07/25/1981","address":{"home":{"street_number":"99395","street_name":"Shopko","street_suffix":"Parkway","city":"Nashville","state":"TN","zip":"37235"},"work":{"street_number":"50804","street_name":"North","street_suffix":"Plaza","city":"Waterbury","state":"CT","zip":"06721"}}},{"id":"1380f2af-e0d8-4231-a9e7-f09650afc0bb","first_name":"Vonnie","last_name":"Skoate","email":"vskoatend@harvard.edu","ip_address":"136.44.63.233","ssn":"752-11-3294","date_of_birth":"09/30/1999","address":{"home":{"street_number":"43","street_name":"Hermina","street_suffix":"Street","city":"Port Washington","state":"NY","zip":"11054"},"work":{"street_number":"65522","street_name":"Hayes","street_suffix":"Avenue","city":"Mobile","state":"AL","zip":"36616"}}},{"id":"3c9e028d-c739-4c70-b81a-cfcf8c094cb0","first_name":"Arlin","last_name":"Awdry","email":"aawdryql@harvard.edu","ip_address":"220.107.136.220","ssn":"291-66-6045","date_of_birth":"06/30/1985","address":{"home":{"street_number":"9","street_name":"Columbus","street_suffix":"Center","city":"Rochester","state":"NY","zip":"14609"},"work":{"street_number":"69431","street_name":"Scofield","street_suffix":"Alley","city":"Green Bay","state":"WI","zip":"54305"}}}]},
    {func: people.manipulateIp, args: [],
        exp: {
            "highest":{"firstName":"Merell","lastName":"Pecht"},"lowest":{"firstName":"Merell","lastName":"Pecht"},"average":7457119356}},
    {func: people.sameBirthday, args: [9, 25],
        exp: ['Khalil Ovitts',  'Erny Van Merwe', 'Emanuel Saben', 'Iorgos Tembridge']},
    {func: people.sameBirthday, args: ['09', '25'],
        exp: ['Khalil Ovitts',  'Erny Van Merwe', 'Emanuel Saben', 'Iorgos Tembridge']},
    {func: people.sameBirthday, args: [], exp: 'Error: Missing month.'},
    {func: people.sameBirthday, args: [1], exp: 'Error: Missing day.'},
    {func: people.sameBirthday, args: [1, 0], exp: 'Error: Invalid day.'},
    {func: people.sameBirthday, args: [-1, 0], exp: 'Error: Invalid month.'},
    {func: people.sameBirthday, args: [1, 45], exp: 'Error: Invalid day.'},
    {func: people.sameBirthday, args: [2, 29], exp: 'Error: Invalid day.'},
    {func: people.sameBirthday, args: [11, 31], exp: 'Error: Invalid day.'},
    {func: people.sameBirthday, args: ['09', '31'], exp: 'Error: Invalid day.'},
    {func: people.sameBirthday, args: ['  ', 25], exp: 'Error: Invalid month.'},
    {func: people.sameBirthday, args: [2, 'gg'],
        exp: 'Error: Invalid type for day.'},
    {func: people.sameBirthday, args: [2, {day: 12}],
        exp: 'Error: Invalid type for day.'},
    {func: people.sameBirthday, args: [{month: 3, day: 15}],
        exp: 'Error: Missing day.'},
    {func: people.sameBirthday, args: [1, 30],
        exp: 'Error: Person not found with this birthday.'},
    {func: people.getPersonByName, args: [],
        exp: 'Error: No string provided for "firstName".'},
    {func: people.getPersonByName, args: ['Grenville'],
        exp: 'Error: No string provided for "lastName".'},
    {func: people.getPersonByName, args: ['Patrick', 'Hill'],
        exp: 'Error: Person not found.'},
    {func: people.getPersonByName, args: ["Grenville", "Pawelke"],
        exp: {
        	"id": "5e0442fe-555b-428d-8388-e952a8ca9868",
        	"first_name": "Grenville",
        	"last_name": "Pawelke",
        	"email": "gpawelke5a@reuters.com",
        	"ip_address": "192.239.144.219",
        	"ssn": "157-89-0138",
        	"date_of_birth": "01/22/1940",
        	"address": {
        		"home": {
        			"street_number": "171",
        			"street_name": "Monica",
        			"street_suffix": "Circle",
        			"city": "Sacramento",
        			"state": "CA",
        			"zip": "95833"
        		},
        		"work": {
        			"street_number": "10724",
        			"street_name": "John Wall",
        			"street_suffix": "Terrace",
        			"city": "Houston",
        			"state": "TX",
        			"zip": "77271"
        		}
        	}
        }},
];

let stocks_tests = [
    {func: stocks.listShareholders, args: ["Aeglea BioTherapeutics, Inc."],
        exp: {
           id: '7283e5d6-7481-41cb-83b3-5a4a2da34717',
           stock_name: 'Aeglea BioTherapeutics, Inc.',
           shareholders: [
              { first_name: "Paolo", last_name: "Victoria", number_of_shares: 55 },
              { first_name: "Caresse",last_name: "Clissett", number_of_shares: 449 },
              { first_name: "Benedikta",last_name: "Meller", number_of_shares: 120 },
              { first_name: "Kristy",last_name: "Goady", number_of_shares: 14 },
              { first_name: "Balduin",last_name: "Blackmuir", number_of_shares: 25 }
        ] }},
    {func: stocks.totalShares, args: [],
        exp: 'Error: No string provided.'},
    {func: stocks.totalShares, args: ['   '],
        exp: 'Error: Provided string is empty.'},
    {func: stocks.totalShares, args: [43],
        exp: 'Error: No string provided.'},
    {func: stocks.totalShares, args: ['Foobar Inc'],
        exp: 'Error: Stock not found.'},
    {func: stocks.totalShares, args: ['Aeglea BioTherapeutics, Inc.'],
        exp: "Aeglea BioTherapeutics, Inc., has 5 shareholders that own a total of 663 shares."},
    {func: stocks.listStocks, args: [1, 2],
        exp: 'Error: No string provided for "firstName".'},
    {func: stocks.listStocks, args: ["      ", "        "],
        exp: 'Error: Provided string for "firstName" is empty.'},
    {func: stocks.listStocks, args: ["Grenville", "Pawelke"],
        exp: [
           {stock_name: "PAREXEL International Corporation", number_of_shares: 433},
           {stock_name: "Vanguard Russell 2000 ETF", number_of_shares: 59},
           {stock_name: "National CineMedia, Inc.", number_of_shares: 320},
           {stock_name: "CombiMatrix Corporation", number_of_shares: 434}
         ]},
    {func: stocks.listStocks, args: ['Patrick', 'Hill'],
        exp: 'Error: Person not found.'},
    {func: stocks.getStockById, args: [],
        exp: 'Error: No string provided.'},
    {func: stocks.getStockById, args: [-1],
        exp: 'Error: No string provided.'},
    {func: stocks.getStockById, args: [1001],
        exp: 'Error: No string provided.'},
    {func: stocks.getStockById, args: ['7989fa5e-5617-43f7-a931-46036f9dbcff'],
        exp: 'Error: Stock not found.'},
    {func: stocks.getStockById, args: ['f652f797-7ca0-4382-befb-2ab8be914ff0'],
        exp: {
           id: 'f652f797-7ca0-4382-befb-2ab8be914ff0',
           stock_name: 'Transcat, Inc.',
           shareholders: [
             {userId: '55ce26c4-915c-4a99-afe9-544e57227fcd',number_of_shares: 155},
             {userId: 'b9245e24-0ac7-49fc-a487-af4b7142a7e4',number_of_shares: 307},
             {userId: 'ed0ec3bf-3ec4-4025-8b26-ebd17487cb22',number_of_shares: 44},
             {userId: '56b285ff-ff97-417b-a9c7-d423b13c25a6',number_of_shares: 396},
             {userId: 'bf8b066a-3f06-4987-9e61-0388f6374a4d',number_of_shares: 335},
             {userId: '9369a0eb-9d4c-434a-901b-b29a92da91ed',number_of_shares: 399},
             {userId: '74fd73cb-1ca9-443d-9c8a-b263fe4e0ce3',number_of_shares: 139}
            ]
         }},

];

async function main() {
    await test(ppl_tests, 'People Tests');
    await test(stocks_tests, 'Stocks Tests');

    console.log('-------');
    console.log(`PASSED ${passed}/${tested} tests!`);
}

main();
