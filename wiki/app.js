const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://192.168.159.200/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = new mongoose.Schema(
  {
    title: String,
    content: String
  }
);

const Article = new mongoose.model("Article", articleSchema);

//TODO

app.route("/articles")
  .get((req, res) => {
    Article.find({}, (err, docs) => {
      if (err) {
        res.send(err);
      } else {
        res.send(docs);
      }
    });
  })
  .post((req, res) => {
    const articleData = {
      title: req.body.title,
      content: req.body.content
    }
    const article = new Article(articleData)
    article.save()
    res.status(201).end()
  })
  .delete((req, res) => {
    Article.deleteMany({}, err => {
      if (err) {
        res.send(err)
      } else {
        res.status(204).end()
      }
    })
  });

app.route("/articles/:name")
  .get((req, res) => {
    const name = req.params.name
    Article.findOne({title: name}, (err, doc) => {
      if (err) {
        res.send(err)
      } else if (doc) {
        res.send(doc);
      } else {
        res.send(`No Article ${name} Found`)
      }
    });
  })
  .put((req, res) => {
    const title = req.params.name
    const articleTitle = req.body.title
    const content = req.body.content
    Article.update(
      {title: title},
      {title: articleTitle, content: content},
      {overwrite: true},
      (err) => {
        if (err) {
          res.send(err)
        } else {
          res.send("Updated Article")
        }
      }
    )
  })
  .patch((req, res) => {
    const title = req.params.name
    Article.update(
      {title: title},
      {$set: req.body},
      (err) => {
        if (err) {
          res.send(err)
        } else {
          res.send("Patched Article")
        }
      }
    )
  })
  .delete((req, res) => {
    const title = req.params.name
    Article.deleteOne({title: title}, (err) => {
      if (err) {
        res.send(err)
      } else {
        res.send(`Deleted article ${title}`)
      }
    })
  });

app.get("/articles/:name", (req, res) => {
  const name = req.params.name
  Article.findOne({title: name}, (err, doc) => {
    if (err) {
      res.send(err)
    } else {
      res.send(doc);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
