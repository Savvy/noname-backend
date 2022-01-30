require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

/**
 * Morgan is used to log information about requests.
 * Useful for debugging and collecting metrics.
 */

app.use(morgan('combined'));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/**
 * Multer
 */
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.disable('x-powered-by');
app.use(multerMid.single('file'));

/*
  Include and initialize the passport authentication middleware.
  Uses strategies to handle certain types of login.
*/
app.use(passport.initialize());
app.use(passport.session());

require('./passport/passport')(passport);

/*
  Include and setup routes.
*/
const routes = require('./routes');

app.use('/auth', routes.auth);
app.use('/category', routes.category);


/**
 * Setting up database
 */
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
});

/**
 *  Run Server
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Rover: Running on port ${PORT}`));
