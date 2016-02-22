var express = require('express');
var expressHandelbars = require('express-handlebars');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var app = express();

var PORT = process.env.NODE_ENV || 3000;

// Database setup
var sequelize = new Sequelize('RCB_class_db', 'root');


app.use('/static', express.static('public'));

app.engine('handlebars', expressHandelbars({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
	extended: false
}));

// Models
var Student_information = sequelize.define('student_information', {
	first_name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			is: ["^[a-z]+$",'i']
		}
	},
	last_name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			is: ["^[a-z]+$",'i']
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [5,20],
				msg: "Your password must be between 5-20 characters"
			}
		}
	},
	hooks: {
		beforeCreate: function(input) {
			input.password = bcrypt.hashSync(input.password, 10);
		}
	}
});

var Instructor_information = sequelize.define('Instructor_information', {
	first_name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			is: ["^[a-z]+$",'i']
		}
	},
	last_name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			is: ["^[a-z]+$",'i']
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [5,20],
				msg: "Your password must be between 5-20 characters"
			}
		}
	},
	hooks: {
		beforeCreate: function(input) {
			input.password = bcrypt.hashSync(input.password, 10);
		}
	}
});

var TA_information = sequelize.define('ta_information', {
	first_name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			is: ["^[a-z]+$",'i']
		}
	},
	last_name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			is: ["^[a-z]+$",'i']
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: {
				args: [5,20],
				msg: "Your password must be between 5-20 characters"
			}
		}
	}, 
	hooks: {
		beforeCreate: function(input) {
			input.password = bcrypt.hashSync(input.password, 10);
		}
	}
});

// Table Associations
TA_information.belongsToMany(Student_information, {
	through: "class"
});
Student_information.belongsToMany(TA_information, {
	through: "class"
});
Instructor_information.hasMany(Student_information);

// Routes
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

// Posting Routes
app.post('/save', function(req, res) {

});

// Database connection via sequelize
sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Listening on PORT %s", PORT);
	});
});
