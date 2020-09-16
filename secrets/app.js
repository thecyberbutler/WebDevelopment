require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://192.168.159.200/users", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// const secret = process.env.SECRETKEY
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

const secretSchema = new mongoose.Schema({
  userId: String,
  secret: String
})

const Secret = new mongoose.model("Secret", secretSchema)

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.route("/")
  .get((req, res) => {
    res.render("home");
  });

app.route("/secrets")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      let secrets = [];
      Secret.find({userId: req.user.id}, (err, docs) => {
        docs.forEach((doc) => {
          secrets.push(doc.secret)
        });
        console.log(secrets);
        res.render("secrets", {secrets: secrets});
      })
    } else {
      res.redirect("/login")
    }
  });

app.route("/submit")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render("submit")
    } else {
      res.redirect("/login")
    }
  })
  .post((req, res) => {
    const newSecret = new Secret({
      userId: req.user.id,
      secret: req.body.secret
    });
    newSecret.save()

    res.redirect("/secrets");

  })

app.route("/login")
  .get((req, res) => {
    res.render("login")
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets")
        })
      }
    })
  });

app.route("/register")
  .get((req, res) => {
    res.render("register")
  })
  .post((req, res) => {
    User.register({username: req.body.username}, req.body.password, (err, user) => {
      if (err) {
        console.log(error);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets")
        })
      }
    })
  });

app.route("/auth/google")
  .get(passport.authenticate('google', { scope: ['profile'] }));

app.route("/auth/google/secrets")
  .get(passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect("/secrets")
});

app.route("/auth/facebook").get(passport.authenticate("facebook"));

app.route("/auth/facebook/callback")
  .get(passport.authenticate("facebook", { failureRedirect: "/login"}),
  (req, res) => {
    res.redirect("/secrets")
  })

app.route("/logout")
  .get((req, res) => {
    req.logout();
    res.redirect("/");
  });


app.listen(3000, () => {
  console.log("Server started on port 3000.");
})
