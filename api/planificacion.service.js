let express = require('express')
let router = express.Router();
let sql = require('./../config/conexion')

var sqlReq = new sql.Request();

router.get("/consulta/:tabla", (req, res) => {
    var tabla = req.params.tabla;
    //var fecha = "08/04/2018";
    //var str = `select top 100 * from '${fecha}' as  'sss'`;
    sqlReq.query(`select top 100 * from ${tabla}`, function (err, recordset) {
        //console.log(recordset);
        res.send(recordset);
    });
});

router.get("/planificacion/:fecha/:turno", (req, res) => {
    var fecha = req.params.fecha;
    let turno = req.params.turno;
    guardaLog('', 'REST', req.path, '');
    var sql = `SELECT Pla.ID_PLANIFICACION, Dpd.ID_DPDETALLE as CORRELATIVO_TPA, YEAR(Pla.FECHA_PLANIFICADA) AS GESTION, Bl.NUMERO_DPUB, Dp.NUMERO_DP, Bl.BILL_OF_LADING, Bld.TAMANIO_CONTENEDOR, Bld.CTR_MARCAS, Dpd.NUMERO_CONTENEDOR, TipE.TIPO_EMBALAJE, Dpd.TIPO_DESPACHO, TipoF.TIPO_FAENA, Dpd.TIPO_DESPACHO AS MOV, EmpT.RAZON_SOCIAL EMPRESA_TRANS, Pla.PLACA,Dest.DESCRIPCION as DESTINO_CARGA, Dpd.PESO_BRUTO, Dpd.CANTIDAD, Pla.FECHA_PLANIFICADA, Pla.TURNO, Bld.DESCRIPCION AS DESCRIPCION_BL_DETALLE, Pla.NOMBRE_CONDUCTOR, Pla.CONDUCTOR_CI, Bld.OBSERVACION OBSERVACION_BL_DETALLE, CASE WHEN TipoF.TIPO_FAENA = 'DESCONSOLIDADO' AND SitioPln.DESCRIPCION is NULL THEN 'DESCONSOLIDADO PRINCIPAL' ELSE SitioPln.DESCRIPCION END AS SITIO, Pro.CORRELATIVO AS PROVIDENCIA from DAT_PLA_PLANIFICACION Pla INNER JOIN DAT_DPE_DPDETALLE Dpd on Dpd.ID_DPDETALLE = Pla.DPDETALLE_ID INNER JOIN DAT_DPE_DESPACHO_PREFERENTE Dp on  Dp.ID_DESPACHO_PREFERENTE = Dpd.DESPACHO_PREFERENTE_ID inner join DAT_MAT_BL_DETALLE Bld on Bld.ID_BL_DETALLE = Dpd.BL_DETALLE_ID inner join DAT_MAT_BILL_OF_LADING Bl on Bl.ID_BL = Bld.BL_ID inner join DAT_PAD_EMPRESA_TRANSPORTE EmpT on EmpT.ID_EMPRESA_TRANSPORTE = Dp.EMPRESA_TRANSPORTE_ID inner join CLA_TIPO_FAENA TipoF on TipoF.ID_TIPO_FAENA = Dpd.TIPO_FAENA_ID LEFT OUTER JOIN CLA_TIPO_EMBALAJE TipE on TipE.ID_TIPO_EMBALAJE = Dpd.TIPO_EMBALAJE_ID LEFT OUTER JOIN CLA_SITIO_ALMACENAJE SitioPln on SitioPln.ID_SITIO_ALMACENAJE = Pla.SITIO_ALMACENAJE_ID LEFT OUTER join CLA_SITIO_ALMACENAJE SitioBl on SitioBl.ID_SITIO_ALMACENAJE = Bld.SITIO_ALMACENAJE_ID LEFT OUTER JOIN CLA_DESTINO_CARGA Dest on Dest.ID_DESTINO_CARGA = Dpd.DESTINO_CARGA_ID LEFT OUTER JOIN DAT_PLN_PROVEIDO_DESCONSOLIDACION Pro on Pro.ID_PROVEIDO = Pla.NUM_PROVIDENCIA_ID LEFT OUTER JOIN CLA_SITIO_SECTOR Sector on Bld.SITIO_SECTOR_ID = Sector.ID_SITIO_SECTOR WHERE Pla.FECHA_PLANIFICADA = '${fecha}' AND Pla.TURNO = ${turno} AND Pla.ESTADO IN ('VALIDADO VU', 'RECEPCIONADO') AND (TipoF.TIPO_FAENA IN ('CONTENEDOR (FCL)', 'CARGA SUELTA (LCL)') OR (TipoF.TIPO_FAENA IN ('DESCONSOLIDADO') AND Dpd.FAENA_DESCONSOLIDADO_ID IS NOT NULL))`;
    console.log(sql);
    sqlReq.query(sql, function (err, recordset) {
        res.send({ "Planificacion": recordset.recordsets[0] });
    });
});

router.get("/rtc/:fecha", (req, res) => {
    let fecha = req.params.fecha;
    let f = new Date(fecha);
    let hoy = Date.now(); //.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let gestion = fecha.substring(6, 10);
    if(gestion != 2018) {
        res.send('0')
    }
    
    console.log(gestion)
    // Pl.CODIGO_TARIFARIO , Pl.ID_PLANILLA, Tari.TARIFA, 
    let sql = `SELECT distinct Bl.BILL_OF_LADING, TipoF.TIPO_FAENA, NivE.NIVEL_ESFUERZO, Bld.TAMANIO_CONTENEDOR , Des.PESO_NETO PESO_KG, Pl.GASTOS_TPA TOTAL_SUS FROM DAT_DES_DESPACHO Des INNER JOIN DAT_PLA_PLANIFICACION Pla on Pla.ID_PLANIFICACION = Des.PLANIFICACION_ID INNER JOIN DAT_DPE_DPDETALLE Dpd on Dpd.ID_DPDETALLE = Pla.DPDETALLE_ID INNER JOIN DAT_DPE_DESPACHO_PREFERENTE Dp on  Dp.ID_DESPACHO_PREFERENTE = Dpd.DESPACHO_PREFERENTE_ID inner join DAT_MAT_BL_DETALLE Bld on Bld.ID_BL_DETALLE = Dpd.BL_DETALLE_ID inner join DAT_MAT_BILL_OF_LADING Bl on Bl.ID_BL = Bld.BL_ID inner join DAT_PAD_EMPRESA_TRANSPORTE EmpT on EmpT.ID_EMPRESA_TRANSPORTE = Dp.EMPRESA_TRANSPORTE_ID inner join CLA_TIPO_FAENA TipoF on TipoF.ID_TIPO_FAENA = Dpd.TIPO_FAENA_ID LEFT OUTER JOIN CLA_TIPO_EMBALAJE TipE on TipE.ID_TIPO_EMBALAJE = Dpd.TIPO_EMBALAJE_ID LEFT OUTER JOIN CLA_DESTINO_CARGA Dest on Dest.ID_DESTINO_CARGA = Dpd.DESTINO_CARGA_ID LEFT OUTER JOIN DAT_PLN_PROVEIDO_DESCONSOLIDACION Pro on Pro.ID_PROVEIDO = Pla.NUM_PROVIDENCIA_ID LEFT OUTER JOIN CLA_SITIO_SECTOR Sector on Bld.SITIO_SECTOR_ID = Sector.ID_SITIO_SECTOR inner join CLA_NIVEL_ESFUERZO NivE ON NivE.ID_NIVEL_ESFUERZO = Des.NIVEL_ESFUERZO_ID inner join DAT_TGA_PLANILLA Pl on Pl.DESPACHO_ID = Des.ID_DESPACHO inner join CLA_TGA_TARIFA Tari on Pl.CODIGO_TARIFARIO = Tari.COD_TARIFARIO and Tari.ENTIDAD = 'TPA' WHERE CAST(Des.FECHA_HORA_DESPACHO AS DATE) = '${fecha}'`;
    console.log(sql);
    sqlReq.query(sql, function (err, recordset) {
        res.send({ "RTC": recordset.recordsets[0] });
    });
});

router.patch("/confirmaPlanificacion", (req, res) => {
    console.log(req.body);
    var Plani = require('./../model/confirmaPlani');
    let plani = new Plani(req.body.idPlani, req.body.estado, req.body.fechaHora, req.body.obs, req.body.turno);
    let ins = `INSERT INTO DAT_TPA_WWSS (OBJETO, TIPO, PATH, BD, OBS, FECHA_REG) VALUES ('${JSON.stringify(req.body)}','REST', '${req.path}', 0, '', GETDATE())`;
    sqlReq.query(ins).then(result => {

    });

    let sql = `UPDATE DAT_PLA_PLANIFICACION SET OBSERVACIONES_TPA = '${plani.obs}', ESTADO = '${plani.estado}' WHERE ID_PLANIFICACION = ${plani.idPlani}`;
    sqlReq.query(sql).then(result => {
        console.log('Id: ' + plani.idPlani + ' Estado: ' + plani.estado);
        res.send("Ok");
    }).catch(err => {
        res.send("No");
    });
});



function guardaLog(_body, _tipo, _path, _obs) {
    let ins = `INSERT INTO DAT_TPA_WWSS (OBJETO, TIPO, PATH, BD, OBS, FECHA_REG) VALUES ('${_body}','${_tipo}', '${_path}', 0, '', GETDATE())`;
    sqlReq.query(ins).then(result => {

    });
}

module.exports = router;