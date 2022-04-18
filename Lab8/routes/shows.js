const express = require('express');
const router = express.Router();
const data = require('../data');

router.get('/:id', async (req, res) => {
    let id;
    try {
        id = data.check_valid_id(req.params.id);
        const show = await data.get_show(id);
        res.render('pages/show', {title: show.name, show: show});
    } catch (e) {
        if (!e.response) {
            res.status(400).render('pages/error',
                {title: '400 - Bad Request', error: e});
            return;
        }
        if (e.response.status == 404) {
            res.status(404).render('pages/error', {
                title: '404 - Show Not Found', id: id, not_found: true});
        } else {
            res.status(e.response.status).render('pages/error',
                {title: `${e.response.status} - ${e.response.statusText}`, error: e});
        }
    }
});

module.exports = router;
