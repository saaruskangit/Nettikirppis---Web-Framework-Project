const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const app = express();
app.set("view engine", "handlebars");
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
  })
);

const urlencodedParser = bodyParser.urlencoded({ extended: false });

require("dotenv").config();
// Database connection
const dbURI =
  "mongodb+srv://" +
  process.env.DBUSERNAME +
  ":" +
  process.env.DBPASSWORD +
  "@" +
  process.env.cluster +
  ".mongodb.net/";

mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("Connected to DB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log("Listening on " + PORT));
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  //res.send("Testing");
  res.render("index");

  // Tuotteen lisäys schema
  const Tuote = require("./models/lisaatuote");

  // osoite tuotteen lisäämis handlebarille
  app.get("/lisaatuote", (req, res) => {
    res.render("lisaatuote");
  });

  // READ Kaikki tuotteet
  app.get("/tuotteet", async (req, res) => {
    try {
      const tuotteet = await Tuote.find();
      //res.json(result);
      res.render("tuotteet", {
        otsikko: "Kaikki tuotteet",
        tuotteet: tuotteet.map((doc) => doc.toJSON()),
      });
      console.log(tuotteet);
    } catch (error) {
      res.status(404).render("tuotteet", {
        title: "We got an error here",
      });
      console.log(error);
    }
  });

  // CREATE toiminto tuotteen lisäämiselle
  app.post(
    "/tuotteet",
    urlencodedParser,
    [
      check("nimi", "Anna tuotteelle nimi, syötä vähintään 3 kirjainta.")
        .exists()
        .isLength({ min: 3 }),
      check("hinta", "Syötä 'Tuotteen hinta' - kenttään ainoastaan numeroita.")
        .exists()
        .isNumeric(),
    ],

    async (req, res) => {
      const errors = validationResult(req);
      const uusiTuote = new Tuote(req.body);
      if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render("lisaatuote", {
          alert,
        });
        //return res.status(422).jsonp(errors.array());
      } else {
        const alert2 = "Tuote lisätty onnistuneesti";
        res.render("lisaatuote", {
          alert2,
        });
        try {
          await uusiTuote.save();
          //   res.render("lisaatuote", {
          //     alert2,
          //   });
          //   setTimeout(() => {
          //     res.redirect("/tuotteet");
          //   }, 2000);

          //   res.redirect("/tuotteet");
          // res.status(201).json({
          //     status: 'Success',
          //     message: 'Tuote lisätty onnistuneesti',
          //     data: {
          //         uusiTuote
          //     }
          // });
        } catch (err) {
          res.status(400).json({
            status: "Failed",
            message: err,
          });
        }
      }
    }
  );

  // UPDATE Toiminto tuotteelle
  app.patch("/tuotteet/:id", async (req, res) => {
    const paivitaTuote = await Tuote.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    try {
      res.status(200).json({
        status: "Success",
        data: {
          paivitaTuote,
        },
      });
    } catch (err) {
      res.send(err);
    }
  });

  // DELETE toiminto api
  app.delete("/tuotteet/:id", async (req, res) => {
    // Jos findByIdAndDelete ei löydä mitään, niin catch ei löydä siitä virhettä. Eli ensin pitää checkata jääkö funktio tyhjäksi
    idHaku = await Tuote.findByIdAndDelete(req.params.id);
    if (idHaku === null) {
      res.status(400).json({
        status: "Failed",
        msg: "Ei löydy kyseistä ID:tä",
      });
    } else {
      try {
        res.status(200).json({
          status: "Success",
          msg: "Tuote poistettu onnistuneesti",
        });
      } catch (err) {
        res.status(400).json({
          status: "Failed",
          message: err,
        });
      }
    }
  });

  // Delete toiminto
  app.delete("/tuotteet/:id", async (req, res) => {
    const id = req.params.id;
    await Tuote.findByIdAndDelete(id);
    try {
      await Tuote.findByIdAndDelete(id);
      res.json({ message: "Tuote poistettu" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error" });
    }
  });
});
app.get("/register", (req, res) => {
  //res.send("Testing");
  res.render("register");
});
app.get("/dashboard", (req, res) => {
  //res.send("Testing");
  res.render("dashboard");
});
app.get("/nav", (req, res) => {
  //res.send("Testing");
  res.render("nav");
});
//folder for static files like styles/jpg's and so on.
app.use(express.static("public"));

// Admin area
app.get("/admin", (req, res) => {
  res.render("admin");
});

// Käyttäjät
app.get("/kayttajat", (req, res) => {
  res.render("kayttajat");
});

// Kalenteri
app.get("/kalenteri", (req, res) => {
  res.render("kalenteri");
});

// Varaus
app.get("/varaus", (req, res) => {
  res.render("varaus");
});

// Varaus schema
const Varaus = require("./models/varaus");

  // CREATE toiminto varauksen tekemiselle
  app.post(
    "/varaus",
    urlencodedParser,
    [
      check("nimi", "Anna tuotteelle nimi, syötä vähintään 3 kirjainta.")
        .exists()
        .isLength({ min: 3 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const alert = errors.array();
        // Send the response with validation errors
        return res.render("varaus", { alert });
      }
  
      // Create a new Varaus instance with request body
      const uusiVaraus = new Varaus(req.body);
      try {
        // Save the Varaus instance to the database
        await uusiVaraus.save();
        // Send the response with success message
        return res.render("varaus", { alert2: "Varaus lisätty onnistuneesti" });
      } catch (err) {
        // Send the response with error message
        return res.status(400).json({ status: "Failed", message: err });
      }
    }
  );
  


//Lisää Tuote peruskäyttäjille
app.get("/userlisaatuote", (req, res) => {
  res.render("userLisaaTuote");
});

//Peruskäyttäjän omat sivut
app.get("/omakirppis", (req, res) => {
  res.render("omaKirppis");
});

//Peruskäyttäjän näkymä tuotteille
app.get("/usertuotteet", async (req, res) => {
  const Tuote = require("./models/lisaatuote");
  try {
    const tuotteet = await Tuote.find();
    //res.json(result);
    res.render("userTuotteet", {
      otsikko: "Kaikki tuotteet",
      tuotteet: tuotteet.map((doc) => doc.toJSON()),
    });
    console.log(tuotteet);
  } catch (error) {
    res.status(404).render("userTuotteet", {
      title: "We got an error here",
    });
    console.log(error);
  }
});

app.post(
  "/usertuotteet",
  urlencodedParser,
  [
    check("nimi", "Anna tuotteelle nimi, syötä vähintään 3 kirjainta.")
      .exists()
      .isLength({ min: 3 }),
    check("hinta", "Syötä 'Tuotteen hinta' - kenttään ainoastaan numeroita.")
      .exists()
      .isNumeric(),
  ],

  async (req, res) => {
    const Tuote = require("./models/lisaatuote");
    const errors = validationResult(req);
    const uusiTuote = new Tuote(req.body);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("userlisaatuote", {
        alert,
      });
      //return res.status(422).jsonp(errors.array());
    } else {
      const alert2 = "Tuote lisätty onnistuneesti";
      res.render("userlisaatuote", {
        alert2,
      });
      try {
        await uusiTuote.save();
      } catch (err) {
        res.status(400).json({
          status: "Failed",
          message: err,
        });
      }
    }
  }
);