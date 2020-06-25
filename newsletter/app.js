const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const port = process.env.PORT || 3000

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
  const mailChimpApi = "d4b7efe2b7b795212184fe2a269d2932-us10a";
  const audienceId = "4a72587245";
  const url = "https://us10.api.mailchimp.com/3.0/lists/" + audienceId;

  var d = {
    members: [
      {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNAME: req.body.first,
          LNAME: req.body.last
        }
      }
    ]
  }
  var jsonData = JSON.stringify(d);
  const options = {
    method: "post",
    auth: "me:" + mailChimpApi
    }
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      // console.log(data);
    });
    if (response.statusCode === 200) {
      console.log("Success");
      res.sendFile(__dirname + "/success.html")
    } else {
      console.log("Failure");
      res.sendFile(__dirname + "/failure.html")
    };
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
})



app.listen(port, () => console.log("Server running on port " + port));
