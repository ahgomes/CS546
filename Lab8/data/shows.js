const axios = require('axios');

const check_valid_id = (id_str) => {
    if (!id_str)
        throw 'Error: No ID provided.';

    if (isNaN(id_str) || !(id_str >= 0))
        throw 'Error: Invalid ID.'

    return parseInt(id_str);
};

async function get_show(id) {
    let valid_id = check_valid_id(id);
    const { data } = await axios.get(`https://api.tvmaze.com/shows/${id}`);

    if (data)
        return data;

    throw 'Error: Show not found.';
}

async function get_search(term) {
    const { data } = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);

    let shows = [];

    for (let d of data) {
        shows.push(d.show);
    }

    return shows;
}

module.exports = {
    check_valid_id,
    get_show,
    get_search,
};
