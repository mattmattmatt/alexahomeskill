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
    console.log('verifying', req.body);
    if (req.body.code !== '12345abcde' && req.body.refresh_token !== 'rfrshtkn!') {
        debug('Authorization code wrong: ' + req.body.code);
        debug('Refresj token code wrong: ' + req.body.refresh_token);
        debug('Req.body: ' + JSON.stringify(req.body));
        var err = new Error('Invalid code');
        err.status = 401;
        return next(err);
    }
    res.json({
        access_token: 'accsstkn!',
        expires_in: 60 * 60 * 24,
        refresh_token: 'rfrshtkn!',
    });
});

module.exports = router;
