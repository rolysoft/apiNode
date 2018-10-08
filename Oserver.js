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
  var fecha = "08/04/2018";
  sqlRequest.query(`SELECT Pla.ID_PLANIFICACION, Dpd.ID_DPDETALLE as CORRELATIVO_TPA, YEAR(Pla.FECHA_PLANIFICADA) AS GESTION, Bld.BL_ID, Dp.NUMERO_DP, Bld.TAMANIO_CONTENEDOR, Bld.TIPO_CARGA, Bld.CTR_MARCAS, Dpd.NUMERO_CONTENEDOR, TipE.TIPO_EMBALAJE, Sitio.DESCRIPCION SITIO_ALMACENAJE_PLN, Dpd.TIPO_DESPACHO, Fae.TIPO_FAENA, EmpT.RAZON_SOCIAL EMPRESA_TRANS, Pla.PLACA,Dest.DESCRIPCION as DESTINO_CARGA, Dpd.PESO_BRUTO, Dpd.CANTIDAD, Pla.FECHA_PLANIFICADA, Pla.TURNO, Bld.DESCRIPCION AS DESCRIPCION_BL_DETALLE, Bl.NUMERO_DPUB, Bl.BILL_OF_LADING, Pla.NOMBRE_CONDUCTOR, Pla.CONDUCTOR_CI, Bld.OBSERVACION OBSERVACION_BL_DETALLE, SitioBl.DESCRIPCION AS DESTINO_BL, (SELECT TOP 1 CORRELATIVO FROM DAT_PLN_PROVEIDO_DESCONSOLIDACION WHERE ID_PROVEIDO =  Pla.NUM_PROVIDENCIA_ID) AS PROVIDENCIA from DAT_PLA_PLANIFICACION Pla inner join DAT_DPE_DPDETALLE Dpd on Dpd.ID_DPDETALLE = Pla.DPDETALLE_ID INNER JOIN  DAT_DPE_DESPACHO_PREFERENTE Dp on Dp.ID_DESPACHO_PREFERENTE = Dpd.DESPACHO_PREFERENTE_ID inner join CLA_TIPO_FAENA TipF on TipF.ID_TIPO_FAENA = Dpd.TIPO_FAENA_ID inner join DAT_MAT_BL_DETALLE Bld on Bld.ID_BL_DETALLE = Dpd.BL_DETALLE_ID inner join DAT_MAT_BILL_OF_LADING Bl on Bl.ID_BL = Bld.BL_ID inner join DAT_PAD_EMPRESA_TRANSPORTE EmpT on EmpT.ID_EMPRESA_TRANSPORTE = Dp.EMPRESA_TRANSPORTE_ID LEFT OUTER JOIN CLA_TIPO_FAENA Fae ON  Dpd.TIPO_FAENA_ID = Fae.ID_TIPO_FAENA left outer join CLA_TIPO_EMBALAJE TipE on TipE.ID_TIPO_EMBALAJE = Dpd.TIPO_EMBALAJE_ID  left outer join CLA_SITIO_ALMACENAJE Sitio on Sitio.ID_SITIO_ALMACENAJE = Pla.SITIO_ALMACENAJE_ID left outer join CLA_SITIO_ALMACENAJE SitioBl on Sitio.ID_SITIO_ALMACENAJE = Bld.SITIO_ALMACENAJE_ID left outer join CLA_DESTINO_CARGA Dest on Dest.ID_DESTINO_CARGA = Dpd.DESTINO_CARGA_ID where Pla.FECHA_PLANIFICADA = '${ fecha }' AND Pla.ESTADO IN ('VALIDADO VU')`, function(err, recordset) {
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
