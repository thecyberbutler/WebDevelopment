require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://192.168.159.200/users", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRETKEY
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.route("/")
  .get((req, res) => {
    res.render("home");
  });

app.route("/login")
  .get((req, res) => {
    res.render("login")
  })
  .post((req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.findOne({email: username}, (err, doc) => {
      if (err) {
        res.send(err)
      } else if (doc) {
        if (doc.password === password) {
          res.render("secrets");
        } else {
          res.redirect("/login")
        }
      } else {
        res.redirect("/login")
      }
    })
  });

app.route("/register")
  .get((req, res) => {
    res.render("register")
  })
  .post((req, res) => {
    const username = req.body.username
    const password = req.body.password
    const newUser = new User({
      email: username,
      password: password
    })
    newUser.save(err => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets")
      }
    })
  }
);

app.route("/logout")
  .get((req, res) => {
    res.redirect("/")
  });



app.listen(3000, () => {
  console.log("Server started on port 3000.");
})
