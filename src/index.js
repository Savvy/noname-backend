require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const multer = require('multer');

const app = express();

/**
 * Morgan is used to log information about requests.
 * Useful for debugging and collecting metrics.
 */

app.use(morgan('combined'));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.MONGO_CONNECTION}),
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

const {pageView} = require('./middleware');
app.use(pageView);

/*
  Include and setup routes.
*/
const routes = require('./routes');

app.use('/settings', routes.settings);
app.use('/auth', routes.auth);
app.use('/user', routes.user);
app.use('/category', routes.category);
app.use('/forum', routes.forum);
app.use('/thread', routes.thread);
app.use('/post', routes.post);
app.use('/module', routes.module);
app.use('/comment', routes.comment);
app.use('/bookmark', routes.bookmark);

/**
 * Setting up database
 */
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
});

const defaultRoles = require('./data');

defaultRoles.handleRoles();

/**
 *  Run Server
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Rover: Running on port ${PORT}`));
