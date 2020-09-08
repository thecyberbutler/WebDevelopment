const mongoose = require('mongoose');

mongoose.connect("mongodb://192.168.159.200:27017/fruitsDB", {useNewUrlParser: true, useUnifiedTopology: true});

const fruitSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  rating: Number,
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit({
  name: "Apple",
  rating: 8,
  review: "The main fruit"
});

const kiwi = new Fruit({
  name: "Kiwi",
  rating: 10,
  review: "Its great."
});

const banana = new Fruit({
  name: "Banana",
  rating: 10,
  review: "Its great."
});
const orange = new Fruit({
  name: "Orange",
  rating: 10,
  review: "Its great."
});

// Fruit.insertMany([kiwi, banana, orange], function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Success");
//   }
// })

Fruit.find(function(err, fruits){
  if (err) {
    console.log(err);
  } else {
    // console.log(fruits);

    fruits.forEach(function(fruit){
      console.log(fruit.name);
    })
  }
});

// fruit.save();


const personSchema = new mongoose.Schema({
  name: String,
  age: Number
})

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: "John",
  age: 37
});

// person.save();
