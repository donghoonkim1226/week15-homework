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

//requiring passport last
var passport = require('passport');
var passportLocal = require('passport-local');
//middleware init
app.use(require('express-session')({
    secret: 'crackalackin',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }, // 4 hours
}));
app.use(passport.initialize());
app.use(passport.session());

//passport use methed as callback when being authenticated
passport.use(new passportLocal.Strategy(function(username, password, done) {
  //check password in db
  Student_information.findOne({
    where: {
      email: email
  }
}).then(function(user) {
  //check password against hash
  if(user){
    bcrypt.compare(password, user.dataValues.password, function(err, user) {
      if (Student_information) {
        //if password is correct authenticate the user with cookie
        done(null, { id: email, email: email });
        } else{
          done(null, null);
        }
      });
    } else {
      done(null, null);
    }
  });
}));

//change the object used to authenticate to a smaller token, and protects the server from attacks
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  done(null, { id: id, username: id })
});

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
	}	
}, {
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
	}
}, {
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
	}
}, {
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
  res.render('index', { msg: "Test" });
});

app.get('/registration', function(req, res) {
  res.render('registration', { msg: req.query.msg});
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
	Student_information.create(req.body).then(function(result) {
		res.redirect('/?msg=Account created');
	}).catch(function(err) {
		res.redirect('/?msg=' + err.errors[0].message);
	});
});

// check login with DB Route
app.post('/check', passport.authenticate('local', {
	successRedirect: '/index',
	failureRedirect: '/?msg=Login failure, please try again'
}));


// Database connection via sequelize
sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Listening on PORT %s", PORT);
	});
});
