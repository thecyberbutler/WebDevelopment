const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
  const query = req.body.cityName; //"Atlanta";
  const apiKey = "9ffa336d009a848b8be72e5d0253b7e9";
  const units = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=" + units;
  https.get(url, function(response){
    response.on("data", function(data){
      var answer = JSON.parse(data)
      res.write("<h1>The tempature in " + query + " is " + answer.main.temp + ".</h1>");
      res.write("<p>The weather is currently " + answer.weather[0].description + ".</p>");
      var iconName = answer.weather[0].icon + "@2x.png";
      var iconUrl = "http://openweathermap.org/img/wn/" + iconName;
      res.write("<img src=" + iconUrl + ">");
      res.send();
    });
  });
})

app.listen(3000, () => console.log("Server running on port 3000"));
