const methodOverride = require('method-override'),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose'),
      session        = require('express-session'),
      express        = require('express'),
      helmet         = require('helmet'),
      exphbs         = require('express-handlebars'),
      flash          = require('express-flash'),
      app            = express();

const port = process.env.PORT || 5000;

/*==========================
      mongoose config
==========================*/
const db = require('./config/keys');

mongoose
  .connect(db.MONGOURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(`There was an error connecting to MongoDB. Error details: ${err}`));

/*==========================
        middleware
==========================*/
app.use(helmet());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(session({
  secret: "elilie",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

/*==========================
          routes
==========================*/
const contacts = require('./routes');

app.use('/', contacts);

/*==========================
    server configuration
==========================*/
app.listen(port, process.env.IP, () => {
  console.log(`Server started on port: ${port}`);
});