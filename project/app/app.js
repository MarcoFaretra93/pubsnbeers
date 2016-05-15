var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var connection = require('./configs/dbConnection').connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var pubs = require('./routes/pubs');
var beers = require('./routes/beers');
var authMiddleware = require('./routes/middlewares/isUserAuthenticated');
var loggedMiddleware = require('./routes/middlewares/isUserAlreadyLogged');



var app = express();

// linkin connection to app
app.set('connection', connection);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var handlebars = require('hbs');
var extend = require('handlebars-extend-block');

handlebars = extend(handlebars);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-method-override')('_method'));
app.use(cookieParser());
// app.use(method_override);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/logout', logout);
app.use('/login', loggedMiddleware, login);
app.use('/register', loggedMiddleware, register);
//TODO middlewares da rimettere
app.use('/beers', beers);
app.use('/pubs', pubs);
app.use('/', routes);

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


module.exports = app;