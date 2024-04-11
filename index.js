const express = require('express');

const exphbs = require('express-handlebars');

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.get('/', (req,res) => {
    //res.send("Testing");
    //res.render('index');
    res.render('index',
{   title: 'Home',
    author: 'Teemu'
})
});

app.get('/contact', (req,res) => {
    //res.send("Testing");
    res.render('contact');
});

app.get('/list', (req,res) => {
    //res.send("Testing");
    res.render('list',
    
    {
        title: 'Game Scores',
        author: 'Teemu',
    }
)
});
//folder for static files like styles/jpg's and so on.
app.use(express.static('public'));




