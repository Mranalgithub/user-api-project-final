require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(flash());

// expose flash messages for debugging (not used by React but kept)
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use('/api/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

// error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Unexpected server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend started on port ${PORT}`));
