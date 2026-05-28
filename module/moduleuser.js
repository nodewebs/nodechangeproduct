
const axios = require("axios");
const https = require("https");

const createToken = async () => {

    try {


        let requser = {
            "username": process.env.USER,
            "password": process.env.PASSWORD
        }

        const result = await axios.post(`https://172.28.32.4/authentication/login`, requser, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
        if (result.status == 200) {

            if (result.data != null) {

                if (result.data.result != null) {

                    const token = result.data.result;
                    if (token != '') {
                        return token;

                    } else {
                        return "";
                    }
                } else {
                    return "";
                }

            }

        }
        return "";

    } catch (error) {
        console.log(error);
        return "";
    }


}




module.exports = { createToken };