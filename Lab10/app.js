const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
   name: 'AuthCookie',
   secret: 'asdkfjasf',
   resave: false,
   saveUninitialized: true
}));

app.use(async (req, res, next) => {
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} {authenticated: ${req.session.user != undefined}}`);
    next();
});

app.use('/private', async (req, res, next) => {
    if (!req.session.user) {
        res.status(403).render('pages/private', {title: 'Private', authenticated: false});
    } else next();
});

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log('Routes running on http://localhost:3000');
});
