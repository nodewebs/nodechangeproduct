require("dotenv").config()
const app = require("express").Router();
const axios = require("axios");
const https = require("https");

const { createToken } = require("../module/moduleuser");
const { datefirstload } = require("../module/dateload");
const { STATUS_CODES } = require("http");


app.get("/getchangeproduct", async (req, res) => {

    try {

        const { list, page, pageSize, sortBy, sortOrder, isdn, orderNo, actionTypeId, invoiceNo, shopId, accountCode, productId, invoiceStatus, createdBy, startDate, endDate } = req.query;

        let token = await createToken();
        if (token == '') {
            return res.status(400).json({ status: false, code: 0, message: "cannot login user token." })
        }
        let pagesize = 0;
        if (pageSize) {
            if (parseInt(pageSize) > 0) {
                pagesize = parseInt(pageSize);
            } else {
                pagesize = 100;
            }
        } else {
            pagesize = 100;
        }

        let resmodel = [];
        const date = datefirstload(1);
        // 

        if (date == '') {
            return res.status(400).json({ status: false, code: 0, message: "cannot load date invalid." });
        }

        let key = `page=1&pageSize=${pagesize}&sortBy=createdDate&sortOrder=desc&isdn=&orderNo=&actionTypeId=27&invoiceNo=&shopId=&accountCode=&productId=&invoiceStatus=&createdBy=&startDate=${date}&endDate=${date}`

        const result = await axios.get(`https://172.28.32.4/order-service/api/order/list?${key}`, { httpsAgent: new https.Agent({ rejectUnauthorized: false }), headers: { Authorization: `Bearer ${token}` } });


        if (result.status == 200) {

            if (result.data != null) {
                if (result.data.result != null) {
                    if (result.data.result.result != null) {
                        if (result.data.result.result.length > 0) {
                            for (var item = 0; item < result.data.result.result.length; item++) {
                                resmodel.push(result.data.result.result[item]);
                            }
                        }

                    }
                }

                if (resmodel.length == 0) {
                    return res.status(200).json({ status: true, code: 1, message: "query changeproduct model count is 0 .", result: [] })
                }
            }
        }

        return res.status(200).json({ status: true, code: 0, message: "query changeproduct success.", result: resmodel });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "cannot query changeproduct ." })
    }
});

app.post("/loadchangeproduct/:date", async (req, res) => {
    try {

        const { date } = req.params;




        return res.status(200).json({ status: true, code: 0, message: "", result: [] })
    } catch (error) {



    }

})



module.exports = app;