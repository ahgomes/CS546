const api_routes = require('./userApi');

const constructorMethod = (app) => {
    app.use('/', api_routes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;
