var express = require("express");
var bodyParser = require('body-parser')
var http = require("http");

var planificacion = require('./api/planificacion.service');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/planificacion', planificacion);

var hijos = ["Roxely", "Pol", "Alexia"];


app.get("/hijos", (req, res) => {
  res.send(hijos);
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to API REST");
});

app.post("/hijos", (req, res) => {
  hijos.push("User " + hijos.length);
  res.send("New user add");
});

app.patch("/hijos", (req, res) => {
  res.send("PATCH method");
});

app.delete("/hijos", (req, res) => {
  res.send("DELETE method");
});

app.get("/hijos/pol/avatar", (req, res) => {
  //var Poligono = require('./poligono');
  //let p = new Poligono(100, 200);

  res.send("Hello GET:/hijos/pol/avatar");
});

app.get("/hijos/:hijo", (req, res) => {
  res.send("Hello " + req.params.hijo);
});


http.createServer(app).listen(8888, () => {
  console.log("Server started at http://localhost:8888");
});

/*
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Primer servidor con Node.Js');
});

server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`);
});
*/
