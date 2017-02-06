var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('ahs:app');

var routes = require('./routes/index');
var users = require('./routes/users');
var oauth = require('./routes/oauth');

var app = express();

function ensureSec(req, res, next) {
    if (app.get('env') === 'development' || req.headers['x-forwarded-proto'] === 'https') {
        return next();
    }
    debug('Request over HTTP, redirecting to HTTPS.');
    res.redirect('https://' + req.headers.host + req.url);
};

function ensureCanonical(req, res, next) {
    if (req.path.length > 1 && req.path.endsWith('/')) {
        debug('Redirecting to canonical URL without trailing /');
        res.redirect(req.protocol + '://' + req.headers.host + req.url.slice(0, -1));
    } else {
        return next();
    }
}

function logRequests(req, res, next) {
    debug(req.method, req.originalUrl, req.headers['user-agent'], JSON.stringify(req.body));
    return next();
}

function registerErrorHandlers() {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

function registerRoutes() {
    app.use('/', routes);
    app.use('/users', users);
    app.use('/oauth', oauth);
}

(function init() {
    debug('Environment: ' + app.get('env'))
        // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(ensureSec);
    app.use(ensureCanonical);
    app.use(logRequests);

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    registerRoutes();
    registerErrorHandlers();
})();

module.exports = app;
