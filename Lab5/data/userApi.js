const axios = require('axios');

const get_people = async _ => {
   const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/31e9ef8b7d7caa742f56dc5f5649a57f/raw/43356c676c2cdc81f81ca77b2b7f7c5105b53d7f/people.json');
   return data;
};

const get_work = async _ => {
   const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/febcdd2ca91ddc685c163158ee126b4f/raw/c9494f59261f655a24019d3b94dab4db9346da6e/work.json');
   return data;
};

const check_valid_id = (id_str) => {
    if (!id_str)
        throw 'Error: No ID provided.';

    if (isNaN(id_str) || !(id_str >= 0))
        throw 'Error: Invalid ID.'

    return parseInt(id_str);
};

async function getPersonById(id) {
    let valid_id = check_valid_id(id);
    let ppl = await get_people();

    for (let person of ppl) {
        if (person.id === valid_id)
            return person;
    }

    throw 'Error: Person not found.';
}


async function getWorkById(id) {
    let valid_id = check_valid_id(id);
    let work = await get_work();

    for (let w of work) {
        if (w.id === valid_id)
            return w;
    }

    throw 'Error: Company not found.';
}


module.exports = {
    check_valid_id,
    get_people,
    getPersonById,
    get_work,
    getWorkById,
};
