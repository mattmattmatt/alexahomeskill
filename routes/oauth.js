var express = require('express');
var router = express.Router();
var debug = require('debug')('ahs:app');

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login',
        state: req.query.state,
        code: '12345abcde'
    });
});

router.use('/verify', function(req, res, next) {
    if (req.query.code !== '12345abcde') {
        debug('Authorization code wrong: ' + req.query.code);
        debug('Req.body: ' + JSON.stringify(req.body));
        var err = new Error('Invalid code');
        err.status = 401;
        return next(err);
    }
    res.json({
        access_token: 'aaaaabbbbb',
        expires_in: 60
    });
});

module.exports = router;
