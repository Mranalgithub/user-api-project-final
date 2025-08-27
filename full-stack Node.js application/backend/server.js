const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const multer = require('multer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'changeme';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- DB ---
mongoose.connect(MONGO_URI, { dbName: 'MyDB' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error', err.message); process.exit(1); });

// --- Models ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// --- Middleware ---
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

// --- Sessions ---
const sessionCookie = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
  secure: NODE_ENV === 'production'
};

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: sessionCookie,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    dbName: 'MyDB',
    collectionName: 'sessions'
  })
}));

// --- Passport ---
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return done(null, false, { message: 'No user with that email' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return done(null, false, { message: 'Invalid credentials' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-passwordHash');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// --- Multer uploads (local disk) ---
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + '-' + safe);
  }
});
const upload = multer({ storage });

// --- Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend API is live. Use /api/... routes.");
});


app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in', user: req.user });
});

app.post('/api/auth/logout', ensureAuth, (req, res) => {
  req.logout(() => res.json({ message: 'Logged out' }));
});

app.get('/api/user', ensureAuth, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/upload', ensureAuth, upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded', filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

app.get('/api/files', ensureAuth, (req, res) => {
  const files = fs.readdirSync(uploadDir).map(name => ({ name, url: `/uploads/${name}` }));
  res.json(files);
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`🚀 Backend listening on http://localhost:${PORT}`));
