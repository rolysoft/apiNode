var sql = require("mssql");

var config = {
    user: "sa",
    password: "xxxxx",
    server: "192.168.254.121",
    database: "SIAP",
    options: {
        encrypt: true
    },
    pool: {
        max: 1110,
        min: 0,
        idleTimeoutMillis: 50058000
    }
};

sql.connect(
    config,
    function (err) {
        console.log(err);
    }
);

module.exports = sql; 