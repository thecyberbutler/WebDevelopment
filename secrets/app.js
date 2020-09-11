require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const sha = require('sha');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const saltRounds = 10;

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(64); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    // console.log('UserPassword = '+userpassword);
    // console.log('Passwordhash = '+passwordData.passwordHash);
    // console.log('nSalt = '+passwordData.salt);
    return passwordData
}

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://192.168.159.200/users", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = process.env.SECRETKEY
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

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
        bcrypt.compare(password, doc.password, (err, result) => {
          if (result === true) {
            res.render("secrets");
          } else {
            res.redirect("/login");
          }
        })
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

    bcrypt.hash(password, saltRounds, (err, hash) => {
      const newUser = new User({
        email: username,
        password: hash
      })
      newUser.save(err => {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets")
        }
      })
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
