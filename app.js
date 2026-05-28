require("dotenv").config();

const express = require("express");
const app = express();
const apichangeproduct = require("./router/apichangeproduct");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PORT = process.env.PORT || 3005;

app.use("/apichange", apichangeproduct)

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