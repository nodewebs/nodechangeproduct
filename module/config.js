
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "12345678",
    port: "5432",
    database: "Changeproduct",
    host: "172.28.17.243"
})


module.exports = {
    pool
}
