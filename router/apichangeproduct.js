require("dotenv").config()
const app = require("express").Router();
const axios = require("axios");
const https = require("https");

const { createToken } = require("../module/moduleuser");
const { datefirstload } = require("../module/dateload");
const { pool } = require("../module/config");

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

        let resmodel = [];

        let token = await createToken();

        if (token == '') {
            return res.status(400).json({ status: false, code: 0, message: "cannot load token user login." })
        }

        const datevalid = new Date(date.toString());
        if (datevalid == "Invalid Date") {
            return res.status(400).json({ status: false, code: 0, message: "cannot load date Invalid ." })
        }


        let key = `page=1&pageSize=1000&sortBy=createdDate&sortOrder=desc&isdn=&orderNo=&actionTypeId=27&invoiceNo=&shopId=&accountCode=&productId=&invoiceStatus=&createdBy=&startDate=${date}&endDate=${date}`;


        const result = await axios.get(`https://172.28.32.4/order-service/api/order/list?${key}`, { headers: { Authorization: `Bearer ${token}` }, httpsAgent: new https.Agent({ rejectUnauthorized: false }) });

        if (result.status == 200) {

            if (result.data != null) {
                if (result.data.result != null) {
                    if (result.data.result.result != null) {
                        if (result.data.result.result.length > 0) {
                            console.log(result.data.result.result)

                            for (var item = 0; item < result.data.result.result.length; item++) {

                                let model = result.data.result.result;

                                let overdate = model[item].createdDate;
                                let dateValue = overdate.split(" ");
                                let [day, month, year] = dateValue[0].toString().split("/").map(Number);
                                let time = dateValue[1].toString();
                                let newDate = new Date(year, month - 1, day);
                                let Datefirst = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(newDate);

                                if (Datefirst == "Invalid Date") {
                                    continue;
                                }

                                let datetime = Datefirst + " " + time;
                                // console.log(datetime);

                                resmodel.push(result.data.result.result[item]);

                                let results = await pool.query(`select * from changeproduct where id='${model[item].id}'`)

                                if (results.rowCount == 0) {
                                    await pool.query(`insert into changeproduct(id , orderno ,isdn , customername , accountcode , actiontype , product , packages , shop , orderstatus , contacttel , paymentmethod , fee , orderfee , createdby , createddate , customertype , duedate , overdue , paymenttype, invoiceno , invoicestatus , finishedtime) values('${model[item].id}','${model[item].orderNo}','${model[item].isdn}','${model[item].customerName}','${model[item].accountCode}','${model[item].actionType}','${model[item].product}','${model[item].packages}','${model[item].shop}','${model[item].orderStatus}','${model[item].contactTel}','${model[item].paymentMethod}','${model[item].fee}','${model[item].orderFee}','${model[item].createdBy}','${datetime}','${model[item].customerType}','${model[item].dueDate}', ${model[item].overDue},'${model[item].paymentType}','${model[item].invoiceNo}','${model[item].invoiceStatus}','${model[item].finishedTime}')`);
                                }
                            }
                        }
                    }
                }
            }
        }

        return res.status(200).json({ status: true, code: 0, message: "load Changeproduct model success .", result: resmodel });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "" });

    }

})



module.exports = app;