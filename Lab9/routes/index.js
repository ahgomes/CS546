const prime_routes = require('./prime');

const constructorMethod = (app) => {
    app.use('/', prime_routes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;
