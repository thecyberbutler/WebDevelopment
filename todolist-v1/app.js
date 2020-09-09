const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js")

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect("mongodb+srv://admin:test123@cluster0.xjih0.mongodb.net/toDoList?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Item = new mongoose.model(
  "Item",
  itemsSchema
);

const WorkItem = new mongoose.model(
  "WorkItem",
  itemsSchema
)

const buy = new Item (
  {
    name: "Buy Food"
  }
);
const cook = new Item (
  {
    name: "Cook Food"
  }
);
const eat = new Item (
  {
    name: "Eat Food"
  }
);

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

app.set('view engine', 'ejs');

app.get("/", function(req, res){
  //
  // Item.insertMany([buy, cook, eat], function(err){
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("Inserted Items")
  //   }
  // })

  let items = []

  Item.find({}, function(err, results){
    if (err) {
      console.log(err);
    } else {
      if (results.length === 0){
        Item.insertMany([buy, cook, eat], function(err){
          if (err) {
            console.log(err);
          } else {
            console.log("Inserted Items")
          }
        });
        res.redirect("/");
      } else {
        results.forEach(function(result) {
          items.push(result.name);
        })
        console.log(items);
        let day = date.getDate()

        res.render('list', {listTitle: day, newListItems: items});
      }
    }

  });
});

app.post("/", function(req, res) {
  console.log(req.body);
  let item = req.body.newItem;
  let wi = new WorkItem(
    {
      name: item
    }
  )
  if (req.body.list === "Work") {

    WorkItem.insertMany([wi], function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("Inserted Work Item");
      }
    })
    // workItems.push(item);
    res.redirect("/work");
  } else {
    Item.insertMany([wi], function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("Inserted Item");
      }
    })
    // items.push(item);
    res.redirect("/");
  }

})

app.post("/delete", function(req, res){
  Item.deleteOne( { name: req.body.checkbox }, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  })
})

app.get("/about", function(req, res) {
  res.render("about");
})

app.get("/:listName", function(req, res) {
  let listName = req.params.listName

  List.findOne({name: listName}, function(err, list){
    let names = [];
    if (list) {
      list.items.forEach(function(l){
        names.push(l)
      })
    } else {}
    res.render("list", {listTitle: listName, newListItems: names})
  })
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server started")
})
