var express = require('express');
var expressHandelbars = require('express-handlebars');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('RCB_class_db', 'root');

var PORT = process.env.NODE_ENV || 3000;

var app = express();

app.engine('handlebars', expressHandelbars({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
	extended: false
}));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/registration', function(req, res) {
  res.render('registration');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/student', function(req, res) {
  res.render('student');
});

app.get('/instructor', function(req, res) {
  res.render('instructor');
});

sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Listening on PORT %s", PORT);
	});
});
