const express = require('express');
const router = express.Router();
const data = require('../data');

router.get('/', async (req, res) => {
    res.render('pages/search', {title: 'Show Finder'});
});

router.post('/searchshows', async (req, res) => {
    let search_term = req.body.showSearchTerm;

    let error;
    if (!search_term) {
        error = 'Error: No string provided.';
    } else {
        search_term = search_term.trim();
        if (search_term.length < 1)
            error = 'Error: Provided string is empty.';
    }

    if (error) {
        res.status(400).render('pages/search', {title: 'Show Finder', error: error});
        return;
    }

    try {
        const shows = await data.get_search(search_term);
        res.status(200).render('pages/result', {
            title: 'Shows Found',
            search_term: search_term,
            shows: shows.slice(0, 5),
        });
    } catch (e) {
        if (e.response && e.response.status && e.responsestatusText) {
            res.status(e.response.status).render('pages/error',
                {title: `${e.response.status} - ${e.response.statusText}`, error: e});
        } else {
            res.status(500).render('pages/error',
                {title: '500 - Internal Server Error', error: e});
        }

    }
});

module.exports = router;
