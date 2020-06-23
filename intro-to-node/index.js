const superheroes = require('superheroes');
const supervillains = require('supervillains');

var mySuperHero = superheroes.random()
var mySuperVillian = supervillains.random()

console.log(mySuperHero + " vs " + mySuperVillian)
