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

// osoite tuotteen lisäämis handlebarille
app.get('/lisaatuote', (req, res) => {
    res.render('lisaatuote');
});

// READ Kaikki tuotteet
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


// CREATE toiminto tuotteen lisäämiselle 
// API:n kautta toimii, selainversio vaatii hienosäätöä, lähinnä joku redirect homma. 
app.post('/tuotteet', async (req, res) => {
    const uusiTuote = new Tuote(req.body);
    try{
        await uusiTuote.save();
        res.redirect('/tuotteet');
        // res.status(201).json({
        //     status: 'Success',
        //     message: 'Tuote lisätty onnistuneesti',
        //     data: {
        //         uusiTuote
        //     }
        // });

    }catch(err){
        res.status(400).json({
            status: 'Failed',
            message: err
        });
    }
});

// UPDATE Toiminto tuotteelle
app.patch('/tuotteet/:id', async (req, res) => {
    const paivitaTuote = await Tuote.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    })
    try{
        res.status(200).json({
            status: 'Success',
            data: {
                paivitaTuote
            }
        })
    }catch(err){
        res.send(err)
    }
});

// DELETE toiminto api 
app.delete('/tuotteet/:id', async (req, res) => {
    // Jos findByIdAndDelete ei löydä mitään, niin catch ei löydä siitä virhettä. Eli ensin pitää checkata jääkö funktio tyhjäksi 
    idHaku = await Tuote.findByIdAndDelete(req.params.id);
    if (idHaku === null){
        res.status(400).json({
            status: 'Failed',
            msg: 'Ei löydy kyseistä ID:tä'
        })
    }
    else{
        try{
            res.status(200).json(
            {
                status: 'Success',
                msg: 'Tuote poistettu onnistuneesti'
            })
        }catch(err){
            res.status(400).json({
                status: 'Failed',
                message: err
            })
        }
    }
});

// Delete toiminto
app.delete('/tuotteet/:id', async (req, res) => {
    const id = req.params.id;
    await Tuote.findByIdAndDelete(id);
    try {
        await Tuote.findByIdAndDelete(id);
        res.json({ message: 'Tuote poistettu' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' });
    }
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
app.get('/nav', (req,res) => {
    //res.send("Testing");
    res.render('nav');
});
//folder for static files like styles/jpg's and so on.
app.use(express.static('public'));




