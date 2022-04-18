const express = require('express');
const router = express.Router();
const data = require('../data');

const titles = {
    login: 'Login',
    signup: 'Sign Up',
}

router.get('/', async (req, res) => {
    if (req.session.user) res.redirect('/private');
    else res.status(200).render('pages/login', {title: titles.login});
});

router.get('/signup', async (req, res) => {
    if (req.session.user) res.redirect('/private');
    else res.status(200).render('pages/signup', {title: titles.signup});
});

router.post('/signup', async (req, res) => {
    try {
        let {uname, pswd} = data.validate(req.body.username, req.body.password);
        const create_result = await data.createUser(uname, pswd);
        if (create_result.userInserted) {
            res.redirect('/');
        } else {
            console.log(create_result);
            res.status(500).render('pages/signup', {title: titles.signup, error: 'Internal Server Error'});
        }
    } catch (e) {
        res.status(400).render('pages/signup', {title: titles.signup,
            error: e});
    }
});

router.post('/login', async (req, res) => {
    try {
        let {uname, pswd} = data.validate(req.body.username, req.body.password);
        const check_result = await data.checkUser(uname, pswd);
        if (check_result.authenticated) {
            req.session.user = {username: uname};
            res.redirect('/private');
        }
    } catch (e) {
        res.status(400).render('pages/login', {title: titles.login,
            error: e});
    }
});

router.get('/private', async (req, res) => {
    if (req.session.user) {
        res.status(200).render('pages/private', {title: 'Private', username: req.session.user.username, authenticated: true});
    } else {
        res.redirect('/');
    }
});

router.get('/logout', async (req, res) => {
    if (req.session.user) {
        req.session.destroy();
        res.status(200).render('pages/logout', {title: 'Logout', authenticated: true});
    } else {
        res.status(403).render('pages/logout', {title: 'Logout'})
    }
});

module.exports = router;
