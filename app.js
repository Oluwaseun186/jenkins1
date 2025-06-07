const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();

const path = require('path');

const app = express();
const PORT = process.env.PORT

// In-memory user storage
const users = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});



app.get('/home', (req, res) => {
    res.render('home', { companyName: 'Your Company Name' });
});


app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const exists = users.find(u => u.username === username);
    if (exists) return res.send('User already exists.');
    users.push({ username, password });
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid login.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('dashboard', { user: req.session.user });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});