require("dotenv").config();

const express = require("express");
const app = express();
const apichangeproduct = require("./router/apichangeproduct");
const apiloadchangeproduct = require("./router/loadchangeproduct");
const { pool } = require("./module/config");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PORT = process.env.PORT || 3005;

pool.connect((err) => {

    if (err) {
        console.log('connect database success.');
    } else {
        console.log('connect database success.');
    }
});


app.use("/apichange", apichangeproduct);

app.use("/load" , apiloadchangeproduct);




app.get("/", async (req, res) => {
    try {

        return res.status(200).json("status : ok");

    } catch (error) {
        console.log(error)
    }
});

app.listen(PORT, () => {
    console.log(`running is port : ` + PORT);
})