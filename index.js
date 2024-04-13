const express = require('express');

const exphbs = require('express-handlebars');

const app = express();
app.set('view engine','handlebars');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.engine('handlebars',exphbs.engine({
    defaultLayout: 'main'}
));

app.get('/', (req,res) => {
    //res.send("Testing");
    res.render('index',
);
});
app.get('/register', (req,res) => {
    //res.send("Testing");
    res.render('register');
});
app.get('/dashboard', (req,res) => {
    //res.send("Testing");
    res.render('dashboard');
});
//folder for static files like styles/jpg's and so on.
app.use(express.static('public'));




