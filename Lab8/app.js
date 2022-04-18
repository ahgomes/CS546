const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, _ => {
    console.log('Routes running on http://localhost:3000');
});
