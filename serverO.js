var express = require("express");
var http = require("http");
var app = express();
var sql = require("mssql");

var config = {
  user: "sa",
  password: "asdf!1234",
  server: "192.168.37.100",
  database: "SIAP-ARICA",
  options: {
    encrypt: true
  }
};

sql.connect(
  config,
  function(err) {
    console.log(err);
  }
);

var sqlRequest = new sql.Request();

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

app.get("/consulta/:tabla", (req, res) => {
  var tabla = req.params.tabla;
  //console.log(tabla);
  sqlRequest.query(`select top 100 * from ${tabla}`, function(err, recordset) {
    //console.log(recordset);
    res.send(recordset);
  });
});

app.get("/planificacion", (req, res) => {
  sqlRequest.query(``, function(err, recordset) {
    res.send(recordset);
  });
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
