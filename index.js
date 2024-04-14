const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const app = express();
app.set('view engine','handlebars');
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.engine('handlebars',exphbs.engine({
    defaultLayout: 'main'}
));

require('dotenv').config();
// Database connection
const dbURI = 'mongodb+srv://'+process.env.DBUSERNAME+':'+process.env.DBPASSWORD+'@'+process.env.cluster+'.mongodb.net/'

mongoose.connect(dbURI)
.then((result) => 
{
    console.log('Connected to DB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log("Listening on " + PORT));
})
.catch((err) => {
    console.log(err);
})

app.get('/', (req,res) => {
    //res.send("Testing");
    res.render('index',
);

// Tuotteen lisäys schema
const Tuote = require('./models/lisaatuote');


// GET Kaikki tuotteet
app.get('/tuotteet', async (req, res) => {
    try{
        const tuotteet = await Tuote.find();
        //res.json(result);
        res.render('tuotteet', {
            otsikko: 'Kaikki tuotteet',
            tuotteet: tuotteet.map(doc => doc.toJSON())
        });
        console.log(tuotteet);
    }
    catch (error){
        res.status(404).render('tuotteet', {
            title: 'We got an error here'
        })
        console.log(error);
    }
});

// osoite tuotteen lisäämiselle
app.get('/lisaatuote', (req, res) => {
    res.render('lisaatuote');
});

// POST toiminto tuotteen lisäämiselle
app.post('/tuotteet', async (req, res) => {
    const uusiTuote = new Tuote(req.body);
    await uusiTuote.save();
    res.send("<h1>Uusi myytävä kohde lisätty kirppikselle</h1>");
});


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




