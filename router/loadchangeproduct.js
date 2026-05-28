const app = require("express").Router();
const axios = require("axios");
const https = require("https");
const { pool } = require("../module/config");
const { datefirstload } = require("../module/dateload");
const { createToken } = require("../module/moduleuser");

const { loadserver } = require("../module/serverreload");
const { setTimeout } = require("timers");

setInterval(() => loadchangeproduct(), 20000);

const loadchangeproduct = async () => {
    try {

        const dateLoad = datefirstload(1);

        if (dateLoad == "") {

            return "";
        }

        let token = await createToken();

        if (token == '') {

            console.log('cannot load user token login .');
            return;
        }

        let modelres = [];
        let modelcount = 0;

        let key = `page=1&pageSize=1000&sortBy=createdDate&sortOrder=desc&isdn=&orderNo=&actionTypeId=27&invoiceNo=&shopId=&accountCode=&productId=&invoiceStatus=&createdBy=&startDate=${dateLoad}&endDate=${dateLoad}`;

        const result = await axios.get(`https://172.28.32.4/order-service/api/order/list?${key}`, { headers: { Authorization: `Bearer ${token}` }, httpsAgent: new https.Agent({ rejectUnauthorized: false }) });

        if (result.status == 200) {

            if (result.data != null) {
                if (result.data.result != null) {

                    if (result.data.result.result != null) {

                        if (result.data.result.result.length > 0) {

                            for (var item = 0; item < result.data.result.result.length; item++) {

                                let model = result.data.result.result[item];
                                console.log(model)
                                let createdate = model.createdDate;
                                let dateValue = createdate.split(" ");
                                let [day, month, year] = dateValue[0].toString().split("/").map(Number);
                                let time = dateValue[1].toString();
                                let newDate = new Date(year, month - 1, day);
                                let Datefirst = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(newDate);
                                let datetime = Datefirst + " " + time;

                                const resultmodel = await pool.query(`select * from changeproduct where id='${model.id}'`);
                                if (resultmodel.rowCount == 0) {

                                    await pool.query(`insert into changeproduct(id , orderno , isdn, customername  , accountcode , actiontype , product , packages , shop , orderstatus , contacttel , paymentmethod , fee , orderfee , createdby , createddate , customertype , duedate , overdue , paymenttype , invoiceno , invoicestatus,finishedtime) values
                                         ('${model.id}','${model.orderNo}','${model.isdn}','${model.customerName}','${model.accountCode}',
                                         '${model.actionType}','${model.product}','${model.packages}','${model.shop}','${model.orderStatus}',
                                         '${model.contactTel}','${model.paymentMethod}','${model.fee}','${model.orderFee}','${model.createdBy}',
                                         '${datetime}','${model.customerType}','${model.dueDate}' ,'${model.overDue}','${model.paymentType}',
                                         '${model.invoiceNo}','${model.invoiceStatus}','${model.finishedTime}')`)

                                    modelcount = parseInt(modelcount) + 1;

                                }

                                modelres.push(model);

                            }

                            console.log(`model save date : ${dateLoad}  model save :  ${modelcount} and model count : ${modelres.length} `)

                        }
                    }
                }
            }
        }


        setTimeout(() => console.log("delay running reload."), 5000)
        await loadserver();


    } catch (error) {
        console.log(error);
    }
}


module.exports = app;