const express = require('express');

const app = express();

app.get("/", (req, res) => res.send('<h1>Hello World</h1>'));

app.get("/about", (req, res) => res.send('I am me!!'));

app.get("/hobbies", (req, res) => res.send("Stuff"));

app.listen(3000, () => console.log("Listening on 3000"));
