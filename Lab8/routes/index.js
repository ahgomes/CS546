const show_routes = require('./shows');
const search_routes = require('./search');
const path = require('path');

const constructorMethod = (app) => {
    app.use('/show', show_routes);
    app.use('/', search_routes);

    app.use('*', (req, res) => {
        res.status(404).render('pages/error', {
            title: '404 - Not Found', error: 'Page Not Found.'});
    });
};

module.exports = constructorMethod;
