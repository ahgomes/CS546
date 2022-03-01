const express = require('express');
const app = express();
const configRoutes = require('./routes');

configRoutes(app);

app.listen(3000, _ => {
    console.log('Routes running on http://localhost:3000');
});
