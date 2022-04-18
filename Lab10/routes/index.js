const user_routes = require('./users');

const constructorMethod = (app) => {
    app.use('/', user_routes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;
