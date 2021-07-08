var session = require('express-session');
var express = require('express');
const app = express();
var https = require('https');
var http = require('http');
var ejs = require('ejs');
var path = require('path');
var _date = require('moment');
var _req = require('request');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var admin = require("firebase-admin");
// var helmet = require('helmet');
var uniqid = require('randomatic');
var fs = require('fs');
var excel = require('excel4node');
var workbook = new excel.Workbook();
// var serviceAccount = require("./ludo-champions-firebase-adminsdk-kpvyr-8c8ebf27e.json");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var crypto = require('crypto-js')

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://ludo-champions.firebaseio.com"
// })




var removetimes;
var dblink = 'mongodb://localhost:27017/spinner';
// var dblink = 'mongodb://ludoIsChampion:errorIsChampion@localhost:53584/championLudo';
var dbName = "spinner";

// var BaseUrl = "http://192.168.0.103" + ":3000";
var BaseUrl = "http://localhost" + ":3030";
//BaseUrl = "https://ludochampions.com/admin";


// console.log(CN[1])


app.use(session({ secret: 'ssshhhhh', resave: true, saveUninitialized: true }));

app.engine('html', ejs.renderFile);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.set('proofImg', path.join(__dirname, 'proofImg'));

app.set('offerImg', path.join(__dirname, 'offerImg'));

app.use(express.static('views'));
app.use(express.static('proofImg'));
app.use(express.static('offerImg'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// app.use(helmet());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var server = app.listen(3030, () => { //"192.168.0.106"
    console.log("We are live on " + 3000);
});

var CronJob = require('cron').CronJob;

MongoClient.connect(dblink, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
    if (err) {
        throw err;
    }
    var db = client.db(dbName);


// var job = new CronJob('*/20 * * * *', function () {
//         db.collection('orderDetails').count({ STATUS: "TXN_BEFORE", TXNDATE : {$lt: new Date(new Date().getTime() - (1000 * 60 * 18)) } }, (err, totalBefore) => {
//             var limit = 10;
//             if (totalBefore >= 100) {
//                 limit = 85;
//             }
//             else if (totalBefore >= 80) {
//                 limit = 65;
//             }
//             else if (totalBefore >= 60) {
//                 limit = 45;
//             }
//             else if (totalBefore >= 40) {
//                 limit = 25;
//             }
//             else if (totalBefore >= 20) {
//                 limit = 10;
//             }
//             else {
//                 limit = totalBefore;
//             }
//             db.collection('orderDetails').find({ $or: [{ STATUS: "TXN_BEFORE" , TXNDATE : {$lt : new Date(new Date().getTime() - (1000 * 60 * 18)) } }] }).sort({ _id: 1 }).skip(0).limit(limit).toArray((err, orderList) => {
//                 if (orderList.length) {
//                     function temp(orderList, i, done) {
//                         console.log(orderList[i].ORDERID)
//                         console.log(orderList[i].uId)
// 			var amount=parseInt(orderList[i].TXNAMOUNT)+".0";
//                         if (orderList[i].email == undefined || orderList[i].email == null || orderList[i].phone == undefined || orderList[i].phone == null) {
// 			    console.log("..dd")
//                             db.collection('LudoNewUser').findOne({ uID: orderList[i].uId }, { playGameId: 0 }, (err, item) => {
//                                 if (item) {
// 				    console.log("..ddx")
//                                     var mNo = item.mobileNo;
//                                     var email = item.mobileNo + "@gmail.com";
//                                     var text = "Q7LD0P3NS2|" + orderList[i].ORDERID + "|" + amount + "|" + email + "|" + mNo + "|DU3UA4IV7O";
//                                     var chksum = crypto.SHA512(text).toString();
//                                     var jsonData = {
//                                         txnid: orderList[i].ORDERID,
//                                         amount: amount,
//                                         email: email,
//                                         phone: mNo,
//                                         key: "Q7LD0P3NS2",
//                                         hash: chksum
//                                     }
//                                     _req({
//                                         "url": "https://dashboard.easebuzz.in/transaction/v1/retrieve",
//                                         "json": true,
//                                         "method": "post",
//                                         "form": jsonData,
//                                         "headers": {
//                                             "Content-Type": "application/json",
//                                             'Content-Length': jsonData.length
//                                         }
//                                     }, (err, httpResponse, body) => {
// 					console.log(body);
//                                         if (typeof (body) == 'object') {
//                                             if (body.status) {
//                                                 var respData = body.msg;
//                                                 var insertData={};
// 						insertData.STATUS = respData.status;
//                                                 if (respData.status == 'pending') {
//                                                     insertData.STATUS = 'PENDING';
//                                                 }
//                                                 else if (respData.status == 'success') {
//                                                     insertData.STATUS = 'TXN_SUCCESS';
//                                                 }
//                                                 else if (respData.status == 'Failure' || respData.status == 'failure') {
//                                                     insertData.STATUS = 'TXN_FAILURE';
//                                                 }
//                                                 insertData.firstname = respData.firstname;
//                                                 insertData.email = respData.email;
//                                                 insertData.phone = respData.phone;
//                                                 insertData.unmappedstatus = respData.unmappedstatus;
//                                                 insertData.cardCategory = respData.cardCategory;
//                                                 insertData.PG_TYPE = respData.PG_TYPE;
//                                                 insertData.bankcode = respData.bankcode;
//                                                 insertData.error = respData.error;
//                                                 insertData.name_on_card = respData.name_on_card;
//                                                 insertData.cardnum = respData.cardnum;
//                                                 insertData.issuing_bank = respData.issuing_bank;
//                                                 insertData.net_amount_debit = respData.net_amount_debit;
//                                                 insertData.cash_back_percentage = respData.cash_back_percentage;
//                                                 insertData.deduction_percentage = respData.deduction_percentage;
//                                                 insertData.surl = respData.surl;
//                                                 insertData.furl = respData.furl;
//                                                 insertData.ORDERID = respData.txnid;
//                                                 insertData.RESPMSG = respData.error_Message;
//                                                 insertData.PAYMENTMODE = respData.mode;
//                                                 insertData.TXNID = respData.easepayid;
//                                                 insertData.TXNDATE = new Date(respData.addedon);
//                                                 insertData.BANKTXNID = respData.bank_ref_num;
//                                                 insertData.TXNAMOUNT = respData.amount;
            
//                                                 db.collection('orderDetails').updateOne({ ORDERID: insertData.ORDERID }, { $set: insertData }, (e, r) => {
//                                                     if (e) {
//                                                         if (typeof orderList[++i] != 'undefined') {
//                                                             temp(orderList, i, done);
//                                                         } else {
//                                                             return done();
//                                                         }
//                                                         return;
//                                                     }
//                                                     if (insertData.STATUS == 'TXN_SUCCESS') {
//                                                         db.collection('LudoNewUser').updateOne({
//                                                             uID: orderList[i].uId
//                                                         }, {
//                                                             $inc: {
//                                                                 depositeAmount: parseInt(insertData.TXNAMOUNT)
//                                                             }
//                                                         });
            
//                                                         if (typeof orderList[++i] != 'undefined') {
//                                                             temp(orderList, i, done);
//                                                         } else {
//                                                             return done();
//                                                         }
//                                                     }
//                                                     else{
//                                                         if (typeof orderList[++i] != 'undefined') {
//                                                             temp(orderList, i, done);
//                                                         } else {
//                                                             return done();
//                                                         }
//                                                     }
//                                                 });
//                                             }
//                                             else{
// 						console.log("..ddy")
//                                                 db.collection('orderDetails').deleteOne({
//                                                     ORDERID: orderList[i].ORDERID
//                                                 }, () => {
//                                                     if (typeof orderList[++i] != 'undefined') {
//                                                         temp(orderList, i, done);
//                                                     } else {
//                                                         return done();
//                                                     }
//                                                 });
//                                                 return;
//                                             }
            
//                                         }
//                                         else{
// 					    console.log("..ddz")
//                                             db.collection('orderDetails').deleteOne({
//                                                 ORDERID: orderList[i].ORDERID
//                                             }, () => {
//                                                 if (typeof orderList[++i] != 'undefined') {
//                                                     temp(orderList, i, done);
//                                                 } else {
//                                                     return done();
//                                                 }
//                                             });
//                                             return;
//                                         }
//                                     })

//                                 }

//                             })
//                         }
//                         else{
// 			    var text = "Q7LD0P3NS2|" + orderList[i].ORDERID + "|" + amount + "|" + orderList[i].email + "|" + orderList[i].phone + "|DU3UA4IV7O";
//                             var chksum = crypto.SHA512(text).toString();
// 			    var jsonData = {
//                                 txnid: orderList[i].ORDERID,
//                                 amount: amount,
//                                 email: orderList[i].email,
//                                 phone: orderList[i].phone,
//                                 key: "Q7LD0P3NS2",
//                                 hash: chksum
//                             }
//                             _req({
//                                 "url": "https://dashboard.easebuzz.in/transaction/v1/retrieve",
//                                 "json": true,
//                                 "method": "post",
//                                 "form": jsonData,
//                                 "headers": {
//                                     "Content-Type": "application/json",
//                                     'Content-Length': jsonData.length
//                                 }
//                             }, (err, httpResponse, body) => {
//                                 if (typeof (body) == 'object') {
//                                     if (body.status) {
//                                         var respData = body.msg;
//                                         var insertData={};
// 					insertData.STATUS = respData.status;
//                                         if (respData.status == 'pending') {
//                                             insertData.STATUS = 'PENDING';
//                                         }
//                                         else if (respData.status == 'success') {
//                                             insertData.STATUS = 'TXN_SUCCESS';
//                                         }
//                                         else if (respData.status == 'Failure' || respData.status == 'failure') {
//                                             insertData.STATUS = 'TXN_FAILURE';
//                                         }
//                                         insertData.firstname = respData.firstname;
//                                         insertData.email = respData.email;
//                                         insertData.phone = respData.phone;
//                                         insertData.unmappedstatus = respData.unmappedstatus;
//                                         insertData.cardCategory = respData.cardCategory;
//                                         insertData.PG_TYPE = respData.PG_TYPE;
//                                         insertData.bankcode = respData.bankcode;
//                                         insertData.error = respData.error;
//                                         insertData.name_on_card = respData.name_on_card;
//                                         insertData.cardnum = respData.cardnum;
//                                         insertData.issuing_bank = respData.issuing_bank;
//                                         insertData.net_amount_debit = respData.net_amount_debit;
//                                         insertData.cash_back_percentage = respData.cash_back_percentage;
//                                         insertData.deduction_percentage = respData.deduction_percentage;
//                                         insertData.surl = respData.surl;
//                                         insertData.furl = respData.furl;
//                                         insertData.ORDERID = respData.txnid;
//                                         insertData.RESPMSG = respData.error_Message;
//                                         insertData.PAYMENTMODE = respData.mode;
//                                         insertData.TXNID = respData.easepayid;
//                                         insertData.TXNDATE = new Date(respData.addedon);
//                                         insertData.BANKTXNID = respData.bank_ref_num;
//                                         insertData.TXNAMOUNT = respData.amount;
    
//                                         db.collection('orderDetails').updateOne({ ORDERID: insertData.ORDERID }, { $set: insertData }, (e, r) => {
//                                             if (e) {
//                                                 if (typeof orderList[++i] != 'undefined') {
//                                                     temp(orderList, i, done);
//                                                 } else {
//                                                     return done();
//                                                 }
//                                                 return;
//                                             }
//                                             if (insertData.STATUS == 'TXN_SUCCESS') {
//                                                 db.collection('LudoNewUser').updateOne({
//                                                     uID: orderList[i].uId
//                                                 }, {
//                                                     $inc: {
//                                                         depositeAmount: parseInt(insertData.TXNAMOUNT)
//                                                     }
//                                                 });
    
//                                                 if (typeof orderList[++i] != 'undefined') {
//                                                     temp(orderList, i, done);
//                                                 } else {
//                                                     return done();
//                                                 }
//                                             }
//                                             else{
//                                                 if (typeof orderList[++i] != 'undefined') {
//                                                     temp(orderList, i, done);
//                                                 } else {
//                                                     return done();
//                                                 }
//                                             }
//                                         });
//                                     }
//                                     else{
// 					console.log("..ddxxa")
//                                         db.collection('orderDetails').deleteOne({
//                                             ORDERID: orderList[i].ORDERID
//                                         }, () => {
//                                             if (typeof orderList[++i] != 'undefined') {
//                                                 temp(orderList, i, done);
//                                             } else {
//                                                 return done();
//                                             }
//                                         });
//                                         return;
//                                     }
    
//                                 }
//                                 else{
// 					console.log("..ddxfa")
//                                     db.collection('orderDetails').deleteOne({
//                                         ORDERID: orderList[i].ORDERID
//                                     }, () => {
//                                         if (typeof orderList[++i] != 'undefined') {
//                                             temp(orderList, i, done);
//                                         } else {
//                                             return done();
//                                         }
//                                     });
//                                     return;
//                                 }
//                             })
//                         }
                        
                        
//                     }
//                     temp(orderList, 0, (done) => {
//                         // console.log(done);
//                         return;
//                     })
//                 }
//             })
//         })
    
//     }, null,
//         true
//     );



//     var job = new CronJob('0 0 */6 * * *', function () {
//         db.collection('orderDetails').count({ STATUS: "PENDING", TXNDATE : {$lt: new Date(new Date().getTime() - (1000 * 60 * 18)) } }, (err, totalBefore) => {
//             var limit = 10;
//             if (totalBefore >= 100) {
//                 limit = 85;
//             }
//             else if (totalBefore >= 80) {
//                 limit = 65;
//             }
//             else if (totalBefore >= 60) {
//                 limit = 45;
//             }
//             else if (totalBefore >= 40) {
//                 limit = 25;
//             }
//             else if (totalBefore >= 20) {
//                 limit = 10;
//             }
//             else {
//                 limit = totalBefore;
//             }
//             db.collection('orderDetails').find({ $or: [{ STATUS: "PENDING" , TXNDATE : {$lt : new Date(new Date().getTime() - (1000 * 60 * 18)) } }] }).sort({ _id: 1 }).skip(0).limit(limit).toArray((err, orderList) => {
//                 if (orderList.length) {
//                     function temp(orderList, i, done) {
//                         console.log(orderList[i].ORDERID)
//                         console.log(orderList[i].uId)
//                         var amount=parseInt(orderList[i].TXNAMOUNT)+".0";
//                         if (orderList[i].email == undefined || orderList[i].email == null || orderList[i].phone == undefined || orderList[i].phone == null) {
//                             db.collection('LudoNewUser').findOne({ uID: orderList[i].uId }, { playGameId: 0 }, (err, item) => {
//                                 if (item) {
//                                     var mNo = item.mobileNo;
//                                     var email = item.mobileNo + "@gmail.com";
//                                     var text = "Q7LD0P3NS2|" + orderList[i].ORDERID + "|" + amount + "|" + email + "|" + mNo + "|DU3UA4IV7O";
//                                     var chksum = crypto.SHA512(text).toString();
//                                     var jsonData = {
//                                         txnid: orderList[i].ORDERID,
//                                         amount: amount,
//                                         email: email,
//                                         phone: mNo,
//                                         key: "Q7LD0P3NS2",
//                                         hash: chksum
//                                     }
//                                     _req({
//                                         "url": "https://dashboard.easebuzz.in/transaction/v1/retrieve",
//                                         "json": true,
//                                         "method": "post",
//                                         "form": jsonData,
//                                         "headers": {
//                                             "Content-Type": "application/json",
//                                             'Content-Length': jsonData.length
//                                         }
//                                     }, (err, httpResponse, body) => {
//                                         if (typeof (body) == 'object') {
//                                             if (body.status) {
//                                                 var respData = body.msg;
//                                                 var insertData={};
// 						insertData.STATUS = respData.status;
//                                                 if (respData.status == 'pending') {
//                                                     insertData.STATUS = 'PENDING';
//                                                 }
//                                                 else if (respData.status == 'success') {
//                                                     insertData.STATUS = 'TXN_SUCCESS';
//                                                 }
//                                                 else if (respData.status == 'Failure' || respData.status == 'failure') {
//                                                     insertData.STATUS = 'TXN_FAILURE';
//                                                 }
//                                                 insertData.firstname = respData.firstname;
//                                                 insertData.email = respData.email;
//                                                 insertData.phone = respData.phone;
//                                                 insertData.unmappedstatus = respData.unmappedstatus;
//                                                 insertData.cardCategory = respData.cardCategory;
//                                                 insertData.PG_TYPE = respData.PG_TYPE;
//                                                 insertData.bankcode = respData.bankcode;
//                                                 insertData.error = respData.error;
//                                                 insertData.name_on_card = respData.name_on_card;
//                                                 insertData.cardnum = respData.cardnum;
//                                                 insertData.issuing_bank = respData.issuing_bank;
//                                                 insertData.net_amount_debit = respData.net_amount_debit;
//                                                 insertData.cash_back_percentage = respData.cash_back_percentage;
//                                                 insertData.deduction_percentage = respData.deduction_percentage;
//                                                 insertData.surl = respData.surl;
//                                                 insertData.furl = respData.furl;
//                                                 insertData.ORDERID = respData.txnid;
//                                                 insertData.RESPMSG = respData.error_Message;
//                                                 insertData.PAYMENTMODE = respData.mode;
//                                                 insertData.TXNID = respData.easepayid;
//                                                 insertData.TXNDATE = new Date(respData.addedon);
//                                                 insertData.BANKTXNID = respData.bank_ref_num;
//                                                 insertData.TXNAMOUNT = respData.amount;
            
//                                                 db.collection('orderDetails').updateOne({ ORDERID: insertData.ORDERID }, { $set: insertData }, (e, r) => {
//                                                     if (e) {
//                                                         if (typeof orderList[++i] != 'undefined') {
//                                                             temp(orderList, i, done);
//                                                         } else {
//                                                             return done();
//                                                         }
//                                                         return;
//                                                     }
//                                                     if (insertData.STATUS == 'TXN_SUCCESS') {
//                                                         db.collection('LudoNewUser').updateOne({
//                                                             uID: orderList[i].uId
//                                                         }, {
//                                                             $inc: {
//                                                                 depositeAmount: parseInt(insertData.TXNAMOUNT)
//                                                             }
//                                                         });
            
//                                                         if (typeof orderList[++i] != 'undefined') {
//                                                             temp(orderList, i, done);
//                                                         } else {
//                                                             return done();
//                                                         }
//                                                     }
//                                                     else{
//                                                         if (typeof orderList[++i] != 'undefined') {
//                                                             temp(orderList, i, done);
//                                                         } else {
//                                                             return done();
//                                                         }
//                                                     }
//                                                 });
//                                             }
//                                             else{
//                                                 db.collection('orderDetails').deleteOne({
//                                                     ORDERID: orderList[i].ORDERID
//                                                 }, () => {
//                                                     if (typeof orderList[++i] != 'undefined') {
//                                                         temp(orderList, i, done);
//                                                     } else {
//                                                         return done();
//                                                     }
//                                                 });
//                                                 return;
//                                             }
            
//                                         }
//                                         else{
//                                             db.collection('orderDetails').deleteOne({
//                                                 ORDERID: orderList[i].ORDERID
//                                             }, () => {
//                                                 if (typeof orderList[++i] != 'undefined') {
//                                                     temp(orderList, i, done);
//                                                 } else {
//                                                     return done();
//                                                 }
//                                             });
//                                             return;
//                                         }
//                                     })

//                                 }

//                             })
//                         }
//                         else{
//                             var text = "Q7LD0P3NS2|" + orderList[i].ORDERID + "|" + amount + "|" + orderList[i].email + "|" + orderList[i].phone + "|DU3UA4IV7O";
//                             var chksum = crypto.SHA512(text).toString();
//                             var jsonData = {
//                                 txnid: orderList[i].ORDERID,
//                                 amount: amount,
//                                 email: orderList[i].email,
//                                 phone: orderList[i].phone,
//                                 key: "Q7LD0P3NS2",
//                                 hash: chksum
//                             }
//                             _req({
//                                 "url": "https://dashboard.easebuzz.in/transaction/v1/retrieve",
//                                 "json": true,
//                                 "method": "post",
//                                 "form": jsonData,
//                                 "headers": {
//                                     "Content-Type": "application/json",
//                                     'Content-Length': jsonData.length
//                                 }
//                             }, (err, httpResponse, body) => {
//                                 if (typeof (body) == 'object') {
//                                     if (body.status) {
//                                         var respData = body.msg;
//                                         var insertData={};
// 					insertData.STATUS = respData.status;
//                                         if (respData.status == 'pending') {
//                                             insertData.STATUS = 'PENDING';
//                                         }
//                                         else if (respData.status == 'success') {
//                                             insertData.STATUS = 'TXN_SUCCESS';
//                                         }
//                                         else if (respData.status == 'Failure' || respData.status == 'failure') {
//                                             insertData.STATUS = 'TXN_FAILURE';
//                                         }
//                                         insertData.firstname = respData.firstname;
//                                         insertData.email = respData.email;
//                                         insertData.phone = respData.phone;
//                                         insertData.unmappedstatus = respData.unmappedstatus;
//                                         insertData.cardCategory = respData.cardCategory;
//                                         insertData.PG_TYPE = respData.PG_TYPE;
//                                         insertData.bankcode = respData.bankcode;
//                                         insertData.error = respData.error;
//                                         insertData.name_on_card = respData.name_on_card;
//                                         insertData.cardnum = respData.cardnum;
//                                         insertData.issuing_bank = respData.issuing_bank;
//                                         insertData.net_amount_debit = respData.net_amount_debit;
//                                         insertData.cash_back_percentage = respData.cash_back_percentage;
//                                         insertData.deduction_percentage = respData.deduction_percentage;
//                                         insertData.surl = respData.surl;
//                                         insertData.furl = respData.furl;
//                                         insertData.ORDERID = respData.txnid;
//                                         insertData.RESPMSG = respData.error_Message;
//                                         insertData.PAYMENTMODE = respData.mode;
//                                         insertData.TXNID = respData.easepayid;
//                                         insertData.TXNDATE = new Date(respData.addedon);
//                                         insertData.BANKTXNID = respData.bank_ref_num;
//                                         insertData.TXNAMOUNT = respData.amount;
    
//                                         db.collection('orderDetails').updateOne({ ORDERID: insertData.ORDERID }, { $set: insertData }, (e, r) => {
//                                             if (e) {
//                                                 if (typeof orderList[++i] != 'undefined') {
//                                                     temp(orderList, i, done);
//                                                 } else {
//                                                     return done();
//                                                 }
//                                                 return;
//                                             }
//                                             if (insertData.STATUS == 'TXN_SUCCESS') {
//                                                 db.collection('LudoNewUser').updateOne({
//                                                     uID: orderList[i].uId
//                                                 }, {
//                                                     $inc: {
//                                                         depositeAmount: parseInt(insertData.TXNAMOUNT)
//                                                     }
//                                                 });
    
//                                                 if (typeof orderList[++i] != 'undefined') {
//                                                     temp(orderList, i, done);
//                                                 } else {
//                                                     return done();
//                                                 }
//                                             }
//                                             else{
//                                                 if (typeof orderList[++i] != 'undefined') {
//                                                     temp(orderList, i, done);
//                                                 } else {
//                                                     return done();
//                                                 }
//                                             }
//                                         });
//                                     }
//                                     else{
//                                         db.collection('orderDetails').deleteOne({
//                                             ORDERID: orderList[i].ORDERID
//                                         }, () => {
//                                             if (typeof orderList[++i] != 'undefined') {
//                                                 temp(orderList, i, done);
//                                             } else {
//                                                 return done();
//                                             }
//                                         });
//                                         return;
//                                     }
    
//                                 }
//                                 else{
//                                     db.collection('orderDetails').deleteOne({
//                                         ORDERID: orderList[i].ORDERID
//                                     }, () => {
//                                         if (typeof orderList[++i] != 'undefined') {
//                                             temp(orderList, i, done);
//                                         } else {
//                                             return done();
//                                         }
//                                     });
//                                     return;
//                                 }
//                             })
//                         }              
//                     }
//                     temp(orderList, 0, (done) => {
//                         // console.log(done);
//                         return;
//                     })
//                 }
//             })
//         })
    
//     }, null,
//         true
//     );

//     var job = new CronJob('*/20 * * * *', function () {
/*
         db.collection('orderDetails').count({ STATUS: "TXN_BEFORE" }, (err, totalBefore) => {
             var limit = 10;
             if (totalBefore >= 100) {
                 limit = 85;
             }
             else if (totalBefore >= 80) {
                 limit = 65;
             }
             else if (totalBefore >= 60) {
                 limit = 45;
             }
             else if (totalBefore >= 40) {
                 limit = 25;
             }
             else if (totalBefore >= 20) {
                 limit = 10;
             }
             else {
                  limit = 5;
             }

             db.collection('orderDetails').find({ $or: [{ STATUS: "TXN_BEFORE" }] }).sort({ _id: 1 }).skip(0).limit(limit).toArray((err, orderList) => {
                 if (orderList.length) {
                     function temp(orderList, i, done) {
                         var jsonData = {
                             "MID": orderList[i].MID,
                             "ORDERID": orderList[i].ORDERID,
                             "CHECKSUMHASH": orderList[i].CHECKSUMHASH
                         };
                         console.log(jsonData);
                         _req({
                             "url": "https://securegw.paytm.in/order/status",
                             "json": true,
                             "method": "post",
                             "body": jsonData,
                             "headers": {
                                 "Content-Type": "application/json",
                                 'Content-Length': jsonData.length
                             }
                         }, (err, httpResponse, body) => {
                             if (typeof (body) == 'object') {
                                 var insertData = {
                                     STATUS: body.STATUS,
                                     BANKNAME: body.BANKNAME != undefined ? body.BANKNAME : '',
                                     ORDERID: body.ORDERID,
                                     TXNAMOUNT: body.TXNAMOUNT,
                                     TXNDATE: body.TXNDATE,
                                     MID: body.MID,
                                     TXNID: body.TXNID,
                                     RESPCODE: body.RESPCODE,
                                     PAYMENTMODE: body.PAYMENTMODE != undefined ? body.PAYMENTMODE : '',
                                     BANKTXNID: body.BANKTXNID,
                                     CURRENCY: "INR",
                                     GATEWAYNAME: body.GATEWAYNAME != undefined ? body.GATEWAYNAME : '',
                                     RESPMSG: body.RESPMSG,
                                     UPDATE: 1
                                 }

                                 db.collection('orderDetails').update({ ORDERID: body.ORDERID }, { $set: insertData }, (e, r) => {
                                     if (e) {
                                         if (typeof orderList[++i] != 'undefined') {
                                             console.log('0');
                                             temp(orderList, i, done);
                                         } else {
                                             return done();
                                         }
                                         return;
                                     }
                                     if (insertData.STATUS == 'TXN_SUCCESS') {
                                         db.collection('orderDetails').findOne({ ORDERID: body.ORDERID }, (er, oder) => {
                                             db.collection('LudoNewUser').updateOne({
                                                 uID: oder.uId
                                             }, {
                                                 $inc: {
                                                     depositeAmount: parseInt(insertData.TXNAMOUNT)
                                                 }
                                             });
                                             if (typeof orderList[++i] != 'undefined') {
                                                 console.log('0');
                                                 temp(orderList, i, done);
                                             } else {
                                                 return done();
                                             }
                                         });

                                     }
                                     else {
                                         if (typeof orderList[++i] != 'undefined') {
                                             temp(orderList, i, done);
                                         } else {
                                             return done();
                                         }
                                     }
                                 });
                             }
                             else {
                                 if (typeof orderList[++i] != 'undefined') {
                                     temp(orderList, i, done);
                                 } else {
                                     return done();
                                 }
                             }

                         })
                     }

                     temp(orderList, 0, (done) => {
                         // console.log(done);
                         return;
                     })
                 }
             });
         });
     }, null,
         true
     );

*/

    // var job = new CronJob('*/25 * * * *', function () {
    //     return;
    //     db.collection('orderDetails').find({ STATUS: "PENDING" }).sort({ _id: 1 }).skip(0).limit(20).toArray((err, orderList) => {
    //         if (orderList.length) {

    //             function temp(orderList, i, done) {
    //                 var jsonData = {
    //                     "MID": orderList[i].MID,
    //                     "ORDERID": orderList[i].ORDERID,
    //                     "CHECKSUMHASH": orderList[i].CHECKSUMHASH
    //                 };
    //                 console.log(i);
    //                 _req({
    //                     "url": "https://securegw.paytm.in/order/status",
    //                     "json": true,
    //                     "method": "post",
    //                     "body": jsonData,
    //                     "headers": {
    //                         "Content-Type": "application/json",
    //                         'Content-Length': jsonData.length
    //                     }
    //                 }, (err, httpResponse, body) => {
    //                     if (typeof (body) == 'object') {
    //                         console.log(i + "  i :: " + body.STATUS);
    //                         if (body.STATUS == 'TXN_FAILURE') {
    //                             db.collection('orderDetails').deleteOne({
    //                                 ORDERID: body.ORDERID
    //                             }, () => {
    //                                 if (typeof orderList[++i] != 'undefined') {
    //                                     temp(orderList, i, done);
    //                                 } else {
    //                                     return done();
    //                                 }
    //                             });
    //                             return;
    //                         }
    //                         if (body.STATUS == 'PENDING') {
    //                             if (typeof orderList[++i] != 'undefined') {
    //                                 console.log('---');
    //                                 temp(orderList, i, done);
    //                             } else {
    //                                 return done();
    //                             }
    //                         }
    //                         else {
    //                             var insertData = {
    //                                 STATUS: body.STATUS,
    //                                 BANKNAME: body.BANKNAME != undefined ? body.BANKNAME : '',
    //                                 ORDERID: body.ORDERID,
    //                                 TXNAMOUNT: body.TXNAMOUNT,
    //                                 TXNDATE: body.TXNDATE,
    //                                 MID: body.MID,
    //                                 TXNID: body.TXNID,
    //                                 RESPCODE: body.RESPCODE,
    //                                 PAYMENTMODE: body.PAYMENTMODE != undefined ? body.PAYMENTMODE : '',
    //                                 BANKTXNID: body.BANKTXNID,
    //                                 CURRENCY: "INR",
    //                                 GATEWAYNAME: body.GATEWAYNAME != undefined ? body.GATEWAYNAME : '',
    //                                 RESPMSG: body.RESPMSG
    //                             }
    //                             db.collection('orderDetails').update({ ORDERID: body.ORDERID }, { $set: insertData }, (e, r) => {
    //                                 if (e) {
    //                                     if (typeof orderList[++i] != 'undefined') {
    //                                         console.log('0');
    //                                         temp(orderList, i, done);
    //                                     } else {
    //                                         return done();
    //                                     }
    //                                     return;
    //                                 }

    //                                 if (insertData.STATUS == 'TXN_SUCCESS') {
    //                                     db.collection('orderDetails').findOne({ ORDERID: body.ORDERID }, (er, oder) => {
    //                                         console.log(body.ORDERID + '    ::   ' + oder.uId)
    //                                         db.collection('LudoNewUser').updateOne({
    //                                             uID: oder.uId
    //                                         }, {
    //                                             $inc: {
    //                                                 depositeAmount: parseInt(insertData.TXNAMOUNT)
    //                                             }
    //                                         });
    //                                         if (typeof orderList[++i] != 'undefined') {
    //                                             console.log('0');
    //                                             temp(orderList, i, done);
    //                                         } else {
    //                                             return done();
    //                                         }
    //                                     });

    //                                 }
    //                                 else {
    //                                     if (typeof orderList[++i] != 'undefined') {
    //                                         console.log('0');
    //                                         temp(orderList, i, done);
    //                                     } else {
    //                                         return done();
    //                                     }
    //                                 }
    //                             });
    //                         }

    //                     }
    //                     else {
    //                         if (typeof orderList[++i] != 'undefined') {
    //                             temp(orderList, i, done);
    //                         } else {
    //                             return done();
    //                         }
    //                     }

    //                 })
    //             }

    //             temp(orderList, 0, (done) => {
    //                 console.log(done);
    //                 return;
    //             })
    //         }
    //     });

    // }, null,
    //     true
    // );


    function responseData(file, data, res) {
        data['BaseUrl'] = BaseUrl;
        data['active'] = typeof sess.active != 'undefined' ? sess.active : 'dashboard';
        res.render(file, data);
    }

    // function getTotalCount() {
    //     var data = {
    //         TotalUser: 0,
    //         TotalRoom: 0,
    //         TotalActiveUser: 0,
    //         TotalTopUser: 0,
    //     }
    //     db.collection('LudoNewUser').count({}, (err, TU) => {
    //         if (err) return err;
    //         data.TotalUser = TU
    //         console.log(TU);
    //         return data;
    //     });

    //     // return data;
    // }


    // app.post('/notifyVerification', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'notification';
    //     if (true || typeof sess.user != 'undefined') {
    //         console.log(req.body);
    //         if (typeof req.query.id != 'undefined') {
    //             db.collection('LudoNewUser').findOne({ uID: req.query.id }, (e, rep) => {
    //                 if (err) {
    //                     throw err;
    //                 }
    //                 var registrationToken = []
    //                 var payload = {
    //                     notification: {
    //                         title: req.body.title,
    //                         body: req.body.msg
    //                     }
    //                 }
    //                 var options = {
    //                     priority: "high",
    //                     timeToLive: 60 * 60 * 24
    //                 }
    //                 if (rep.fireBaseId) {
    //                     var token = rep.fireBaseId;
    //                     admin.messaging().sendToDevice(token, payload, options)
    //                         .then((response) => {
    //                             console.log("Successfully sent message:", response);
    //                         })
    //                         .catch((error) => {
    //                             console.log("Error sending message:", error);
    //                         })
    //                 }
    //             })
    //         }
    //         else {
    //             res.redirect('/');
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })


    // app.post('/paytmResponse', (req, res) => {
    //     console.log("paytmResponse Call");
    //     console.log(req.body);
    // });

    // app.get('/v1/zaakpayResponse', (req, res) => {
	// console.log("Get zaakpayResponse");
	// console.log(req.body);

    // });


    // app.post('/v1/zaakpayResponse', (req, res) => {
    //     console.log("Post zaakpayResponse");
    //     console.log(req.body);
	// //res.send(req.body);
	// if (req.body.responseCode == "100" || req.body.responseCode == "601") {
    //         isSuc = true;
    //     }
    //     db.collection('orderDetails').updateOne({ ORDERID: req.body.orderId }, { $set: { isSuccess: isSuc } }, (e, r) => {
    //         if (e) {
    //         }
    //         res.send(req.body);
    //     });
    // });

    app.get('/', (req, res) => {
        sess = req.session;
        sess.active = 'dashboard';
        if (typeof sess.user != 'undefined') {
            console.log('here');
            res.redirect('/dashboard');
        } else {
            responseData('login.html', {
                error: false
            }, res);
        }
        console.log('done');
        // req.session.destroy(function (err) {
        //     res.redirect('/');
        // })
        // res.redirect('/login.html');
    });

    app.get('/admin', (req, res) => {
        sess = req.session;
        sess.active = 'dashboard';
        if (typeof sess.user != 'undefined') {
            console.log('here');
            res.redirect('/dashboard');
        } else {
            responseData('login.html', {
                error: false
            }, res);
        }
        // console.log('done');
        // req.session.destroy(function (err) {
        //     res.redirect('/');
        // })
        // res.redirect('/login.html');
    });

    app.get('/dashboard', (req, res) => {
        sess = req.session;
        sess.active = 'dashboard';
        if (typeof sess.user != 'undefined') {

            db.collection('user').countDocuments((err, data) => {
                var data = {
                    error: false,
                    total: data
                };
                responseData('dashboard.html', data, res);
            })

        } else {
            res.redirect('/');
        }
    })

    // app.get('/paytmKey', (req, res) => {
    //     sess = req.session;
    //     console.log('  :: ' + sess)
    //     sess.active = 'gkey';
    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         db.collection('paytmGkey').findOne({ id: '0' }, (er, result) => {
    //             data.key = result.key;
    //             responseData('keyPage.html', data, res);
    //         });


    //     } else {
    //         res.redirect('/');
    //     }
    // })


    // app.get('/rules', (req, res) => {
    //     sess = req.session;
    //     console.log('  :: ' + sess)
    //     sess.active = 'rules';
    //     var datas = {
    //         referAmount: 0,
    //         p2: 0,
    //         p4: 0,
    //         p6: 0,
    //         wL: 0
    //     }
    //     if (typeof sess.user != 'undefined') {
    //         db.collection('EandWamount').find().toArray(function (err, rep) {
    //             if (err) {
    //                 throw err;
    //             }
    //             datas.p2 = rep[0].player2.length;
    //             datas.p4 = rep[1].player4.length;
    //             datas.p6 = rep[2].player6.length;
    //             db.collection('addWithdrawAmount').find().toArray(function (err, r) {
    //                 datas.wL = r[0].amount.length + r[1].amount.length
    //                 db.collection('referAmount').findOne({ id: '0' }, (er, resu) => {
    //                     db.collection('VerificationOnOff').findOne({ id: 1 }, (er, result) => {
    //                         db.collection('ReferMoneyOnOff').findOne({ id: 1 }, (er, refer) => {
    //                             datas.referAmount = resu.amount;
    //                             var data = {
    //                                 error: false,
    //                                 total: datas
    //                             };
    //                             data['config'] = result;
    //                             data['Refer'] = refer;
    //                             responseData('rules.html', data, res);
    //                         });
    //                     });

    //                 });

    //             })


    //         });



    //     } else {
    //         res.redirect('/');
    //     }
    // })

    app.post('/', (req, res) => {
        sess = req.session;
        sess.active = 'dashboard';
        if (typeof req.body.user == 'undefined' || typeof req.body.password == 'undefined') {
            return res.send({
                error: true,
                msg: 'parameter invalid'
            });
        }

        console.log("body ::::::: ", req.body);

        db.collection('admin').find({
            user: req.body.user,
            password: req.body.password
        }).toArray((err, results) => {
            if (results.length) {
                sess.user = req.body.user;
                res.redirect('/dashboard');

            } else {
                responseData('login.html', {
                    msg: 'Login Invalid',
                    error: true
                }, res);
            }
        })
    });

     app.post('/admin', (req, res) => {
        sess = req.session;
        sess.active = 'dashboard';
        if (typeof req.body.user == 'undefined' || typeof req.body.password == 'undefined') {
            return res.send({
                error: true,
                msg: 'parameter invalid'
            });
        }

        console.log("body ::::::: ", req.body);

        db.collection('admin').find({
            user: req.body.user,
            password: req.body.password
        }).toArray((err, results) => {
            if (results.length) {
                sess.user = req.body.user;
                res.redirect('/dashboard');

            } else {
                responseData('login.html', {
                    msg: 'Login Invalid',
                    error: true
                }, res);
            }
        })
    });

    // app.get('/verifylist/:page', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'verifylist';
    //     var perPage = 20;
    //     var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    //     var skip = (perPage * page) - perPage;
    //     var limit = "LIMIT " + skip + ", " + perPage;
    //     console.log(skip);

    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         db.collection('verificationInfo').count((err, userCount) => {
    //             if (skip > userCount) {
    //                 return res.redirect('/verifylist/1');
    //             }
    //             db.collection('verificationInfo').find({}).skip(skip).limit(perPage).sort({_id : -1}).toArray((err, users) => {
    //                 data['data'] = users;
    //                 data['search'] = {};
    //                 data['current'] = page;
    //                 data['pages'] = Math.ceil(userCount / perPage);
    //                 responseData('verificationList.html', data, res);
    //             });
    //         });
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/verifylist/:page', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'verifylist';
    //     var perPage = 20;
    //     var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    //     var skip = (perPage * page) - perPage;
    //     var limit = "LIMIT " + skip + ", " + perPage;

    //     console.log(req.body);

    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         var wh = {};
    //         if (req.body.search != '') {
    //             if (req.body.by != '') {
    //                 if (req.body.by == 'userId') {
    //                     wh['userId'] = req.body.search;
    //                 }
    //             }
    //         }

    //         db.collection('verificationInfo').count(wh, (err, userCount) => {
    //             if (skip > userCount) {
    //                 return res.redirect('/verifylist/1');
    //             }
    //             db.collection('verificationInfo').find(wh).skip(skip).limit(perPage).sort({_id : -1}).toArray((err, users) => {
    //                 data['data'] = users;
    //                 data['search'] = req.body;
    //                 data['current'] = page;
    //                 // data['config'] = results[0];
    //                 data['pages'] = Math.ceil(userCount / perPage);
    //                 console.log("data ::::::::::: ", data);
    //                 responseData('verificationList.html', data, res);
    //             })
    //         })
    //     }
    //     else {
    //         res.redirect('/');
    //     }
    // })

/*
    app.post('/approveVerification/:uid/:status', (req, res) => {
        // console.log(req);
        sess = req.session;
        sess.active = 'rules';
        if (typeof sess.user != 'undefined') {
            console.log('4567 + _ ' + req.params.status)
            console.log(req.body);
            if (req.params.uid != undefined) {
                db.collection('verificationInfo').updateOne({ userId: req.params.uid }, { $set: { status: parseInt(req.params.status) } }, (e, r) => {
                    if (e) {
                        return res.send({
                            error: true,
                            status: 500
                        });
                    }

                    db.collection('LudoNewUser').updateOne({ uID: req.params.uid }, { $set: { isAccVerified: parseInt(req.params.status) } }, (er, rr) => {

                    });

                    return res.send({
                        error: false,
                        status: 200
                    });

                });
            }
            else {
                return res.send({
                    error: true,
                    status: 500
                });
            }

        } else {
            res.redirect('/');
        }
    })
*/


    // app.post('/approveVerification/:uid/:status/:txt/:title', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         // console.log('4567 + _ ' + req.params.status)
    //         // console.log(req.body);
    //         if (req.params.uid != undefined) {
    //             try {
    //                 db.collection('verificationInfo').updateOne({ userId: req.params.uid }, { $set: { status: parseInt(req.params.status) } }, (e, r) => {
    //                     if (e) throw e

    //                     db.collection('LudoNewUser').updateOne({ uID: req.params.uid }, { $set: { isAccVerified: parseInt(req.params.status) } }, (er, rr) => {
    //                         if (er) throw er

	// 		                db.collection('LudoNewUser').findOne({ uID: req.params.uid }, (err, rep) => {
    //                             if (err) throw err
    //                             if (rep == undefined) {
    //                                 return res.send({ error: true, status: 500 })
    //                             }
    //                             var payload = {
    //                                 notification: {
    //                                     title: req.params.title,
    //                                     body: req.params.txt
    //                                 }
    //                             }
    //                             var options = {
    //                                 priority: "high",
    //                                 timeToLive: 60 * 60 * 24
    //                             }
    //                             if (rep.fireBaseId) {
    //                                 var token = rep.fireBaseId;
    //                                 admin.messaging().sendToDevice(token, payload, options)
    //                                     .then((response) => {
    //                                         // console.log("Successfully sent message:", response);
    //                                         return res.send({ error: false, status: 200 })
    //                                     })
    //                                     .catch((error) => {
    //                                         // console.log("Error sending message:", error);
    //                                         return res.send({ error: true, status: 500 })
    //                                     })
    //                             }
    //                         })
    //                     });
    //                 });
    //             } catch (error) {
    //                 return res.send({ error: true, status: 500 })
    //             }
    //         }
    //         else {
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })



    app.get('/userlist/:page', (req, res) => {
        sess = req.session;
        sess.active = 'userlist';
        var perPage = 20;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;

        if (typeof sess.user != 'undefined') {
            var data = {
                error: false
            };
            if (typeof sess.error != 'undefined') {
                data.error = true;
                data.msg = sess.error;
                delete sess.error;
            }
            db.collection('user').count((err, userCount) => {
                if (skip > userCount) {
                    return res.redirect('/userlist/1');
                }
                db.collection('user').find({}).skip(skip).limit(perPage).toArray((err, users) => {
                    data['data'] = users;
                    data['search'] = {};
                    data['current'] = page;
                    // data['config'] = results[0];
                    data['pages'] = Math.ceil(userCount / perPage);
                    // console.log("data ::::::::::: ", data) ;
                    responseData('userlist.html', data, res);
                });
            });
        } else {
            res.redirect('/');
        }
    })

    app.post('/userlist/:page', (req, res) => {
        sess = req.session;
        sess.active = 'userlist';
        var perPage = 20;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;

        console.log(req.body);

        if (typeof sess.user != 'undefined') {
            var data = {
                error: false
            };
            if (typeof sess.error != 'undefined') {
                data.error = true;
                data.msg = sess.error;
                delete sess.error;
            }
            var wh = {};
            if (req.body.search != '') {
                if (req.body.by != '') {
                    if (req.body.by == 'deviceid') {
                        wh['DeviceId'] = req.body.search.trim();
                    }
                }
            }
            if (req.body.todate != '' && req.body.fromdate != '') {
                wh['$and'] = [{
                    date: {
                        $gte: new Date(req.body.todate + ' 00:00:00')
                    }
                }, {
                    date: {
                        $lte: new Date(req.body.fromdate + ' 23:59:59')
                    }
                }]
            }

            db.collection('user').countDocuments(wh, (err, userCount) => {
                db.collection('user').find(wh).skip(skip).limit(perPage).toArray((err, users) => {
                    data['data'] = users
                    data['search'] = req.body
                    data['current'] = page
                    data['pages'] = Math.ceil(userCount / perPage)
                    responseData('userlist.html', data, res)
                })
            })
        }
        else {
            res.redirect('/');
        }
    })

    app.get('/paytmlist/:page', (req, res) => {
        sess = req.session;
        sess.active = 'paytmlist';
        var perPage = 20;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;
        console.log(skip);

        if (typeof sess.user != 'undefined') {
            var data = {
                error: false
            }
            if (typeof sess.error != 'undefined') {
                data.error = true;
                data.msg = sess.error;
                delete sess.error;
            }
            db.collection('withdrow').countDocuments({type: 'paytm'},(err, userCount) => {
                if (skip > userCount) {
                    return res.redirect('/paytmlist/1');
                }
                db.collection('withdrow').find({type: 'paytm'}).skip(skip).sort({ _id: -1 }).limit(perPage).toArray((err, paytmList) => {
                    for (var i = 0; i < paytmList.length; i++) {
                        paytmList[i].date = new Date(paytmList[i].date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        paytmList[i].date = _date(new Date(paytmList[i].date)).format('DD MMMM, YYYY HH:mm:ss');
                        if (paytmList[i].approveDate != undefined) {
                            paytmList[i].approveDate = new Date(paytmList[i].approveDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                            paytmList[i].approveDate = _date(new Date(paytmList[i].approveDate)).format('DD MMMM, YYYY HH:mm:ss');
                        }
                    }
                    data['data'] = paytmList;
                    data['search'] = { perpage: perPage };
                    data['current'] = page;
                    // data['config'] = results[0];
                    data['pages'] = Math.ceil(userCount / perPage);
                    // console.log("data ::::::::::: ", data) ;
                    responseData('paytmlist.html', data, res);
                });
            });
        } else {
            res.redirect('/');
        }
    })

    app.post('/paytmlist/:page', (req, res) => {
        sess = req.session;
        sess.active = 'paytmlist';
        var perPage = (typeof req.body.perpage != 'undefined') ? parseInt(req.body.perpage) : 20;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;

        console.log(req.body);

        if (typeof sess.user != 'undefined') {
            var data = {
                error: false
            };
            if (typeof sess.error != 'undefined') {
                data.error = true;
                data.msg = sess.error;
                delete sess.error;
            }
            var wh = {};
            if (req.body.search != '') {
                if (req.body.by != '') {
                    if (req.body.by == 'uID') {
                        // wh['PlayerName'] = {
                        //     $regex: req.body.search,
                        //     $options: '$i'
                        // };
                        wh['uId'] = req.body.search;
                    }
                    else if (req.body.by == 'txnID') {
                        wh['TxnID'] = req.body.search;
                    }
                    else if (req.body.by == 'paytmNo') {
                        wh['paytmNo'] = req.body.search;
                    }
                }
            }
            wh['type'] = 'paytm'
            if (typeof req.body.byStatus != 'undefined' && req.body.byStatus != '') {
                wh['Status'] = parseInt(req.body.byStatus);
            }
            if (typeof req.body.byAmount != 'undefined' && req.body.byAmount != '') {
                wh['Amount'] = parseInt(req.body.byAmount);
                if (parseInt(req.body.byAmount) == 5000) {
                    wh['Amount'] = { $gte: 3500 }
                }
                else if (parseInt(req.body.byAmount) == 1000) {
                    wh['Amount'] = { $gte: 999, $lte: 3501 }
                }
                else if (parseInt(req.body.byAmount) == 500) {
                    wh['Amount'] = { $gte: 499, $lte: 999 }
                }
                else if (parseInt(req.body.byAmount) == 200) {
                    wh['Amount'] = { $gte: 199, $lte: 499 }
                }
            }
            // else {
            //     if (req.body.by != '') {
            //         if (req.body.by == 'cat' && req.body.categoriesId != '') {
            //             wh['categoriesId'] = parseInt(req.body.categoriesId);
            //         }
            //     }
            // }
            if (req.body.todate != '' && req.body.fromdate != '') {
                wh['$and'] = [{
                    date: {
                        $gte: new Date(req.body.todate + ' 00:00:00')
                    }
                }, {
                    date: {
                        $lte: new Date(req.body.fromdate + ' 23:59:59')
                    }
                }]
            }

            db.collection('withdrow').count(wh, (err, userCount) => {
                db.collection('withdrow').find(wh).skip(skip).sort({ _id: -1 }).limit(perPage).toArray((err, paytmList) => {
                    for (var i = 0; i < paytmList.length; i++) {
                        paytmList[i].date = new Date(paytmList[i].date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        paytmList[i].date = _date(new Date(paytmList[i].date)).format('DD MMMM, YYYY HH:mm:ss');
                        if (paytmList[i].approveDate != undefined) {
                            paytmList[i].approveDate = new Date(paytmList[i].approveDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                            paytmList[i].approveDate = _date(new Date(paytmList[i].approveDate)).format('DD MMMM, YYYY HH:mm:ss');
                        }

                    }
                    data['data'] = paytmList;
                    data['search'] = req.body;
                    data['current'] = page;
                    // data['config'] = results[0];
                    data['pages'] = Math.ceil(userCount / perPage);
                    console.log("data ::::::::::: ", data);
                    responseData('paytmlist.html', data, res);
                })
            })
        }
        else {
            res.redirect('/');
        }
    })


    app.get('/paypallist/:page', (req, res) => {
        sess = req.session;
        sess.active = 'paypal';
        var perPage = 20;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;
        console.log(skip);

        if (typeof sess.user != 'undefined') {
            var data = {
                error: false
            }
            if (typeof sess.error != 'undefined') {
                data.error = true;
                data.msg = sess.error;
                delete sess.error;
            }
            db.collection('withdrow').countDocuments({type: 'paytm'},(err, userCount) => {
                if (skip > userCount) {
                    return res.redirect('/paytmlist/1');
                }
                db.collection('withdrow').find({type: 'paypal'}).skip(skip).sort({ _id: -1 }).limit(perPage).toArray((err, paytmList) => {
                    for (var i = 0; i < paytmList.length; i++) {
                        paytmList[i].date = new Date(paytmList[i].date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        paytmList[i].date = _date(new Date(paytmList[i].date)).format('DD MMMM, YYYY HH:mm:ss');
                        if (paytmList[i].approveDate != undefined) {
                            paytmList[i].approveDate = new Date(paytmList[i].approveDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                            paytmList[i].approveDate = _date(new Date(paytmList[i].approveDate)).format('DD MMMM, YYYY HH:mm:ss');
                        }
                    }
                    data['data'] = paytmList;
                    data['search'] = { perpage: perPage };
                    data['current'] = page;
                    // data['config'] = results[0];
                    data['pages'] = Math.ceil(userCount / perPage);
                    // console.log("data ::::::::::: ", data) ;
                    responseData('paypal.html', data, res);
                });
            });
        } else {
            res.redirect('/');
        }
    })

    app.post('/paypallist/:page', (req, res) => {
        sess = req.session;
        sess.active = 'paypal';
        var perPage = (typeof req.body.perpage != 'undefined') ? parseInt(req.body.perpage) : 20;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;

        console.log(req.body);

        if (typeof sess.user != 'undefined') {
            var data = {
                error: false
            };
            if (typeof sess.error != 'undefined') {
                data.error = true;
                data.msg = sess.error;
                delete sess.error;
            }
            var wh = {};
            if (req.body.search != '') {
                if (req.body.by != '') {
                    if (req.body.by == 'uID') {
                        // wh['PlayerName'] = {
                        //     $regex: req.body.search,
                        //     $options: '$i'
                        // };
                        wh['DeviceId'] = req.body.search;
                    }
                    else if (req.body.by == 'txnID') {
                        wh['TxnID'] = req.body.search;
                    }
                    else if (req.body.by == 'mobile') {
                        wh['mobile'] = req.body.search;
                    }
                }
            }
            wh['type'] = 'paypal'
            if (typeof req.body.byStatus != 'undefined' && req.body.byStatus != '') {
                wh['Status'] = parseInt(req.body.byStatus);
            }
            if (typeof req.body.byAmount != 'undefined' && req.body.byAmount != '') {
                wh['Amount'] = parseInt(req.body.byAmount);
                if (parseInt(req.body.byAmount) == 5000) {
                    wh['Amount'] = { $gte: 3500 }
                }
                else if (parseInt(req.body.byAmount) == 1000) {
                    wh['Amount'] = { $gte: 999, $lte: 3501 }
                }
                else if (parseInt(req.body.byAmount) == 500) {
                    wh['Amount'] = { $gte: 499, $lte: 999 }
                }
                else if (parseInt(req.body.byAmount) == 200) {
                    wh['Amount'] = { $gte: 199, $lte: 499 }
                }
            }
            // else {
            //     if (req.body.by != '') {
            //         if (req.body.by == 'cat' && req.body.categoriesId != '') {
            //             wh['categoriesId'] = parseInt(req.body.categoriesId);
            //         }
            //     }
            // }
            if (req.body.todate != '' && req.body.fromdate != '') {
                wh['$and'] = [{
                    date: {
                        $gte: new Date(req.body.todate + ' 00:00:00')
                    }
                }, {
                    date: {
                        $lte: new Date(req.body.fromdate + ' 23:59:59')
                    }
                }]
            }

            db.collection('withdrow').count(wh, (err, userCount) => {
                db.collection('withdrow').find(wh).skip(skip).sort({ _id: -1 }).limit(perPage).toArray((err, paytmList) => {
                    for (var i = 0; i < paytmList.length; i++) {
                        paytmList[i].date = new Date(paytmList[i].date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        paytmList[i].date = _date(new Date(paytmList[i].date)).format('DD MMMM, YYYY HH:mm:ss');
                        if (paytmList[i].approveDate != undefined) {
                            paytmList[i].approveDate = new Date(paytmList[i].approveDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                            paytmList[i].approveDate = _date(new Date(paytmList[i].approveDate)).format('DD MMMM, YYYY HH:mm:ss');
                        }

                    }
                    data['data'] = paytmList;
                    data['search'] = req.body;
                    data['current'] = page;
                    // data['config'] = results[0];
                    data['pages'] = Math.ceil(userCount / perPage);
                    console.log("data ::::::::::: ", data);
                    responseData('paypal.html', data, res);
                })
            })
        }
        else {
            res.redirect('/');
        }
    })

    app.get('/banklist/:page', (req, res) => {
        sess = req.session;
        sess.active = 'banklist';
        var perPage = 20;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;
        console.log(skip);

        if (typeof sess.user != 'undefined') {
            var data = {
                error: false
            };
            if (typeof sess.error != 'undefined') {
                data.error = true;
                data.msg = sess.error;
                delete sess.error;
            }
            db.collection('withdrow').countDocuments({type: 'bank'},(err, userCount) => {
                if (skip > userCount) {
                    return res.redirect('/banklist/1');
                }
                db.collection('withdrow').find({type: 'bank'}).skip(skip).sort({ _id: -1 }).limit(perPage).toArray((err, bankList) => {
                    for (var i = 0; i < bankList.length; i++) {
                        bankList[i].date = new Date(bankList[i].date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        bankList[i].date = _date(new Date(bankList[i].date)).format('DD MMMM, YYYY HH:mm:ss');
                        if (bankList[i].approveDate != undefined) {
                            bankList[i].approveDate = new Date(bankList[i].approveDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                            bankList[i].approveDate = _date(new Date(bankList[i].approveDate)).format('DD MMMM, YYYY HH:mm:ss');
                        }
                    }
                    data['data'] = bankList;
                    data['search'] = {};
                    data['current'] = page;
                    // data['config'] = results[0];
                    data['pages'] = Math.ceil(userCount / perPage);
                    // console.log("data ::::::::::: ", data) ;
                    responseData('banklist.html', data, res);
                });
            });
        } else {
            res.redirect('/');
        }
    })

    app.post('/banklist/:page', (req, res) => {
        sess = req.session;
        sess.active = 'banklist';
        var perPage = 20;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;

        console.log(req.body);

        if (typeof sess.user != 'undefined') {
            var data = {
                error: false
            };
            if (typeof sess.error != 'undefined') {
                data.error = true;
                data.msg = sess.error;
                delete sess.error;
            }
            var wh = {};
            if (req.body.search != '') {
                if (req.body.by != '') {
                    if (req.body.by == 'uID') {
                        // wh['PlayerName'] = {
                        //     $regex: req.body.search,
                        //     $options: '$i'
                        // };
                        wh['uId'] = req.body.search;
                    }
                    else if (req.body.by == 'txnID') {
                        wh['TxnID'] = req.body.search;
                    }
                }
            }
            if (typeof req.body.byStatus != 'undefined' && req.body.byStatus != '') {
                wh['Status'] = parseInt(req.body.byStatus);
            }
            // else {
            //     if (req.body.by != '') {
            //         if (req.body.by == 'cat' && req.body.categoriesId != '') {
            //             wh['categoriesId'] = parseInt(req.body.categoriesId);
            //         }
            //     }
            // }
            if (req.body.todate != '' && req.body.fromdate != '') {
                wh['$and'] = [{
                    created_at: {
                        $gte: new Date(req.body.todate + ' 00:00:00')
                    }
                }, {
                    created_at: {
                        $lte: new Date(req.body.fromdate + ' 23:59:59')
                    }
                }]
            }

            db.collection('bankWithdraw').count(wh, (err, userCount) => {
                db.collection('bankWithdraw').find(wh).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, bankList) => {
                    for (var i = 0; i < bankList.length; i++) {
                        bankList[i].created_at = new Date(bankList[i].created_at).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        bankList[i].created_at = _date(new Date(bankList[i].created_at)).format('DD MMMM, YYYY HH:mm:ss');
                        if (bankList[i].approveDate != undefined) {
                            bankList[i].approveDate = new Date(bankList[i].approveDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                            bankList[i].approveDate = _date(new Date(bankList[i].approveDate)).format('DD MMMM, YYYY HH:mm:ss');
                        }
                    }
                    data['data'] = bankList;
                    data['search'] = req.body;
                    data['current'] = page;
                    // data['config'] = results[0];
                    data['pages'] = Math.ceil(userCount / perPage);
                    console.log("data ::::::::::: ", data);
                    responseData('banklist.html', data, res);
                })
            })
        }
        else {
            res.redirect('/');
        }
    })


//    app.get('/checkOrder/:id', (req, res) => {
//         // console.log(req);
//         sess = req.session;
//         sess.active = 'orderlist';
//         if (typeof sess.user != 'undefined') {
//             console.log('0000 + _ ' + req.params.id)
//             console.log(req.body);
//             if (req.params.id != undefined) {
//                 db.collection('orderDetails').findOne({ ORDERID: req.params.id }, (er, myOrder) => {
//                     if (myOrder) {
//                         var amount=parseInt(myOrder.TXNAMOUNT)+".0";
//                         if (myOrder.email == undefined || myOrder.email == null || myOrder.phone == undefined || myOrder.phone == null) {
//                             db.collection('LudoNewUser').findOne({ uID: myOrder.uId }, { playGameId: 0 }, (err, item) => {
//                                 if (item) {
//                                     var mNo = item.mobileNo;
//                                     var email = item.mobileNo + "@gmail.com";
//                                     var text = "Q7LD0P3NS2|" + myOrder.ORDERID + "|" + amount + "|" + email + "|" + mNo + "|DU3UA4IV7O";
//                                     var chksum = crypto.SHA512(text).toString();
//                                     var jsonData = {
//                                         txnid: myOrder.ORDERID,
//                                         amount: amount,
//                                         email: email,
//                                         phone: mNo,
//                                         key: "Q7LD0P3NS2",
//                                         hash: chksum
//                                     }
//                                     _req({
//                                         "url": "https://dashboard.easebuzz.in/transaction/v1/retrieve",
//                                         "json": true,
//                                         "method": "post",
//                                         "form": jsonData,
//                                         "headers": {
//                                             "Content-Type": "application/json",
//                                             'Content-Length': jsonData.length
//                                         }
//                                     }, (err, httpResponse, body) => {
//                                         if (typeof (body) == 'object') {
//                                             if (body.status) {
//                                                 var respData = body.msg;
//                                                 var insertData={};
//                                                 if (respData.status == 'pending') {
//                                                     insertData.STATUS = 'PENDING';
//                                                 }
//                                                 else if (respData.status == 'success') {
//                                                     insertData.STATUS = 'TXN_SUCCESS';
//                                                 }
//                                                 else if (respData.status == 'Failure' || respData.status == 'failure') {
//                                                     insertData.STATUS = 'TXN_FAILURE';
//                                                 }
//                                                 insertData.firstname = respData.firstname;
//                                                 insertData.email = respData.email;
//                                                 insertData.phone = respData.phone;
//                                                 insertData.unmappedstatus = respData.unmappedstatus;
//                                                 insertData.cardCategory = respData.cardCategory;
//                                                 insertData.PG_TYPE = respData.PG_TYPE;
//                                                 insertData.bankcode = respData.bankcode;
//                                                 insertData.error = respData.error;
//                                                 insertData.name_on_card = respData.name_on_card;
//                                                 insertData.cardnum = respData.cardnum;
//                                                 insertData.issuing_bank = respData.issuing_bank;
//                                                 insertData.net_amount_debit = respData.net_amount_debit;
//                                                 insertData.cash_back_percentage = respData.cash_back_percentage;
//                                                 insertData.deduction_percentage = respData.deduction_percentage;
//                                                 insertData.surl = respData.surl;
//                                                 insertData.furl = respData.furl;
//                                                 insertData.ORDERID = respData.txnid;
//                                                 insertData.RESPMSG = respData.error_Message;
//                                                 insertData.PAYMENTMODE = respData.mode;
//                                                 insertData.TXNID = respData.easepayid;
//                                                 insertData.TXNDATE = new Date(respData.addedon);
//                                                 insertData.BANKTXNID = respData.bank_ref_num;
//                                                 insertData.TXNAMOUNT = respData.amount;
            
//                                                 db.collection('orderDetails').updateOne({ ORDERID: insertData.ORDERID }, { $set: insertData }, (e, r) => {
//                                                     if (e) {
//                                                         res.redirect('/orderlist/1');
//                                                         return;
//                                                     }
//                                                     if (insertData.STATUS == 'TXN_SUCCESS') {
//                                                         db.collection('LudoNewUser').updateOne({
//                                                             uID: myOrder.uId
//                                                         }, {
//                                                             $inc: {
//                                                                 depositeAmount: parseInt(insertData.TXNAMOUNT)
//                                                             }
//                                                         });
//                                                     }
//                                                     res.redirect('/orderlist/1');
//                                                 });
//                                             }
//                                             else{
//                                                 db.collection('orderDetails').deleteOne({
//                                                     ORDERID: myOrder.ORDERID
//                                                 }, () => {
//                                                     res.redirect('/orderlist/1');
//                                                 });
//                                                 return;
//                                             }
            
//                                         }
//                                         else{
//                                             db.collection('orderDetails').deleteOne({
//                                                 ORDERID: myOrder.ORDERID
//                                             }, () => {
//                                                 res.redirect('/orderlist/1');
//                                             });
//                                             return;
//                                         }
//                                     })
//                                 }
//                             })
//                         }
//                         else{
//                             var text = "Q7LD0P3NS2|" + myOrder.ORDERID + "|" + amount + "|" + myOrder.email + "|" + myOrder.phone + "|DU3UA4IV7O";
//                             var chksum = crypto.SHA512(text).toString();
//                             var jsonData = {
//                                 txnid: myOrder.ORDERID,
//                                 amount: amount,
//                                 email: myOrder.email,
//                                 phone: myOrder.phone,
//                                 key: "Q7LD0P3NS2",
//                                 hash: chksum
//                             }
//                             _req({
//                                 "url": "https://dashboard.easebuzz.in/transaction/v1/retrieve",
//                                 "json": true,
//                                 "method": "post",
//                                 "form": jsonData,
//                                 "headers": {
//                                     "Content-Type": "application/json",
//                                     'Content-Length': jsonData.length
//                                 }
//                             }, (err, httpResponse, body) => {
//                                 if (typeof (body) == 'object') {
//                                     if (body.status) {
//                                         var respData = body.msg;
//                                         var insertData={};
//                                         if (respData.status == 'pending') {
//                                             insertData.STATUS = 'PENDING';
//                                         }
//                                         else if (respData.status == 'success') {
//                                             insertData.STATUS = 'TXN_SUCCESS';
//                                         }
//                                         else if (respData.status == 'Failure' || respData.status == 'failure') {
//                                             insertData.STATUS = 'TXN_FAILURE';
//                                         }
//                                         insertData.firstname = respData.firstname;
//                                         insertData.email = respData.email;
//                                         insertData.phone = respData.phone;
//                                         insertData.unmappedstatus = respData.unmappedstatus;
//                                         insertData.cardCategory = respData.cardCategory;
//                                         insertData.PG_TYPE = respData.PG_TYPE;
//                                         insertData.bankcode = respData.bankcode;
//                                         insertData.error = respData.error;
//                                         insertData.name_on_card = respData.name_on_card;
//                                         insertData.cardnum = respData.cardnum;
//                                         insertData.issuing_bank = respData.issuing_bank;
//                                         insertData.net_amount_debit = respData.net_amount_debit;
//                                         insertData.cash_back_percentage = respData.cash_back_percentage;
//                                         insertData.deduction_percentage = respData.deduction_percentage;
//                                         insertData.surl = respData.surl;
//                                         insertData.furl = respData.furl;
//                                         insertData.ORDERID = respData.txnid;
//                                         insertData.RESPMSG = respData.error_Message;
//                                         insertData.PAYMENTMODE = respData.mode;
//                                         insertData.TXNID = respData.easepayid;
//                                         insertData.TXNDATE = new Date(respData.addedon);
//                                         insertData.BANKTXNID = respData.bank_ref_num;
//                                         insertData.TXNAMOUNT = respData.amount;
    
//                                         db.collection('orderDetails').updateOne({ ORDERID: insertData.ORDERID }, { $set: insertData }, (e, r) => {
//                                             if (e) {
//                                                 res.redirect('/orderlist/1');
//                                                 return;
//                                             }
//                                             if (insertData.STATUS == 'TXN_SUCCESS') {
//                                                 db.collection('LudoNewUser').updateOne({
//                                                     uID: myOrder.uId
//                                                 }, {
//                                                     $inc: {
//                                                         depositeAmount: parseInt(insertData.TXNAMOUNT)
//                                                     }
//                                                 });
//                                             }
//                                             res.redirect('/orderlist/1');
//                                         });
//                                     }
//                                     else{
//                                         db.collection('orderDetails').deleteOne({
//                                             ORDERID: myOrder.ORDERID
//                                         }, () => {
//                                             res.redirect('/orderlist/1');
//                                         });
//                                         return;
//                                     }
    
//                                 }
//                                 else{
//                                     db.collection('orderDetails').deleteOne({
//                                         ORDERID: myOrder.ORDERID
//                                     }, () => {
//                                         res.redirect('/orderlist/1');
//                                     });
//                                     return;
//                                 }
//                             })
//                         } 
//                     }
//                     else {
//                         res.redirect('/orderlist/1');
//                     }
//                 });
//             }
//             else {
//                 res.redirect('/orderlist/1');
//             }

//         } else {
//             res.redirect('/');
//         }
//     })

/*
   app.get('/checkOrder/:id', (req, res) => {
        // console.log(req);
        sess = req.session;
        sess.active = 'orderlist';
        if (typeof sess.user != 'undefined') {
            console.log('0000 + _ ' + req.params.id)
            console.log(req.body);
            if (req.params.id != undefined) {
                db.collection('orderDetails').findOne({ ORDERID: req.params.id }, (er, myOrder) => {
                    if (myOrder) {
                        var jsonData = {
                            "MID": myOrder.MID,
                            "ORDERID": myOrder.ORDERID,
                            "CHECKSUMHASH": myOrder.CHECKSUMHASH
                        };
                        _req({
                            "url": "https://securegw.paytm.in/order/status",
                            "json": true,
                            "method": "post",
                            "body": jsonData,
                            "headers": {
                                "Content-Type": "application/json",
                                'Content-Length': jsonData.length
                            }
                        }, (err, httpResponse, body) => {
                            if (typeof (body) == 'object') {
                                console.log("  i :: " + body.STATUS);
                                var insertData = {
                                    STATUS: body.STATUS,
                                    BANKNAME: body.BANKNAME != undefined ? body.BANKNAME : '',
                                    ORDERID: body.ORDERID,
                                    TXNAMOUNT: body.TXNAMOUNT,
                                    TXNDATE: body.TXNDATE,
                                    MID: body.MID,
                                    TXNID: body.TXNID,
                                    RESPCODE: body.RESPCODE,
                                    PAYMENTMODE: body.PAYMENTMODE != undefined ? body.PAYMENTMODE : '',
                                    BANKTXNID: body.BANKTXNID,
                                    CURRENCY: "INR",
                                    GATEWAYNAME: body.GATEWAYNAME != undefined ? body.GATEWAYNAME : '',
                                    RESPMSG: body.RESPMSG
                                }

                                db.collection('orderDetails').update({ ORDERID: body.ORDERID }, { $set: insertData }, (e, r) => {
                                    if (e) {
                                        res.redirect('/orderlist/1');
                                        return;
                                    }

                                    if (insertData.STATUS == 'TXN_SUCCESS') {
                                        db.collection('orderDetails').findOne({ ORDERID: body.ORDERID }, (er, oder) => {
                                            console.log(body.ORDERID + '    ::   ' + oder.uId)
                                            db.collection('LudoNewUser').updateOne({
                                                uID: oder.uId
                                            }, {
                                                $inc: {
                                                    depositeAmount: parseInt(insertData.TXNAMOUNT)
                                                }
                                            },(errr,done)=>{
                                                res.redirect('/orderlist/1');
                                            });
                                        });

                                    }
                                    else{
                                        res.redirect('/orderlist/1');
                                    }
                                });


                            }
                            else{
                                res.redirect('/orderlist/1');
                            }

                        })


                    }
                    else {
			res.redirect('/orderlist/1');
                    }
                });
            }
            else {
                res.redirect('/orderlist/1');
            }

        } else {
            res.redirect('/');
        }
    })
*/

    // app.get('/orderlist/:page', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'orderlist';
    //     var perPage = 20;
    //     var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    //     var skip = (perPage * page) - perPage;
    //     var limit = "LIMIT " + skip + ", " + perPage;
    //     console.log(skip);

    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         db.collection('orderDetails').count((err, userCount) => {
    //             if (skip > userCount) {
    //                 return res.redirect('/orderlist/1');
    //             }
    //             db.collection('orderDetails').find({}).skip(skip).sort({ _id: -1 }).limit(perPage).toArray((err, orderList) => {
    //                 for (var i = 0; i < orderList.length; i++) {
    //                     orderList[i].TXNDATE = _date(orderList[i].TXNDATE).format('DD MMMM, YYYY HH:mm:ss');
	// 		orderList[i].TXNDATE = new Date(orderList[i].TXNDATE).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    //                     orderList[i].TXNDATE = _date(new Date(orderList[i].TXNDATE)).format('DD MMMM, YYYY HH:mm:ss');
    //                 }
    //                 data['data'] = orderList;
    //                 data['search'] = {};
    //                 data['current'] = page;
    //                 // data['config'] = results[0];
    //                 data['pages'] = Math.ceil(userCount / perPage);
    //                 // console.log("data ::::::::::: ", data) ;
    //                 responseData('orderlist.html', data, res);
    //             });
    //         });
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/orderlist/:page', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'orderlist';
    //     var perPage = 20;
    //     var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    //     var skip = (perPage * page) - perPage;
    //     var limit = "LIMIT " + skip + ", " + perPage;

    //     console.log(req.body);

    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         var wh = {};
    //         if (req.body.search != '') {
    //             if (req.body.by != '') {
    //                 if (req.body.by == 'uID') {
    //                     wh['uId'] = req.body.search;
    //                 }
    //                 else if (req.body.by == 'orderID') {
    //                     wh['ORDERID'] = req.body.search;
    //                 }
    //             }
    //         }
    //         //if (typeof req.body.byStatus != 'undefined' && req.body.byStatus != '') {
    //         //    wh['Status'] = parseInt(req.body.byStatus);
    //         //}
    //         if (typeof req.body.byStatus != 'undefined' && req.body.byStatus != '') {
    //           wh['STATUS'] = req.body.byStatus
    //         }
    //         // else {
    //         //     if (req.body.by != '') {
    //         //         if (req.body.by == 'cat' && req.body.categoriesId != '') {
    //         //             wh['categoriesId'] = parseInt(req.body.categoriesId);
    //         //         }
    //         //     }
    //         // }
    //         if (req.body.todate != '' && req.body.fromdate != '') {
    //             wh['$and'] = [{
    //                 TXNDATE: {
    //                     $gte: new Date(req.body.todate + ' 00:00:00')
    //                 }
    //             }, {
    //                 TXNDATE: {
    //                     $lte: new Date(req.body.fromdate + ' 23:59:59')
    //                 }
    //             }]
    //         }

    //         db.collection('orderDetails').count(wh, (err, userCount) => {
    //             db.collection('orderDetails').find(wh).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, orderList) => {
    //                 for (var i = 0; i < orderList.length; i++) {
    //                     orderList[i].TXNDATE = _date(orderList[i].TXNDATE).format('DD MMMM, YYYY HH:mm:ss');
    //                     orderList[i].TXNDATE = new Date(orderList[i].TXNDATE).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    //                     orderList[i].TXNDATE = _date(new Date(orderList[i].TXNDATE)).format('DD MMMM, YYYY HH:mm:ss');

    //                 }
    //                 data['data'] = orderList;
    //                 data['search'] = req.body;
    //                 data['current'] = page;
    //                 // data['config'] = results[0];
    //                 data['pages'] = Math.ceil(userCount / perPage);
    //                 console.log("data ::::::::::: ", data);
    //                 responseData('orderlist.html', data, res);
    //             })
    //         })
    //     }
    //     else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/addReferAmount', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log('456')
    //         console.log(req.body);
    //         // console.log(req.query.id);
    //         if (req.body.amount != undefined) {

    //             db.collection('referAmount').updateOne({ id: "0" }, { $set: { amount: parseInt(req.body.amount) } }, (e, r) => {
    //                 if (e) {
    //                     return res.send({ error: 'Y', 'msg': 'Database Error !!' });
    //                 }
    //                 res.send({ error: 'N', 'msg': 'ReferAmount Updated !!' });
    //                 // res.redirect('/userlist/1');
    //             });

    //         }
    //         else {
    //             console.log("123")
    //             res.send({ error: 'Y', 'msg': 'Data Not Found !!' });
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/addEntryFee/:id', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log('4567')
    //         console.log(req.body);
    //         // console.log(req.query.id);
    //         if (req.body.Eamount != undefined) {
    //             db.collection('EandWamount').find().toArray(function (err, rep) {
    //                 if (err) {
    //                     throw err;
    //                 }
    //                 // console.log(rep[0].player2);
    //                 var id = parseInt(req.params.id);
    //                 var tk;
    //                 var no = 2;
    //                 if (id == 0) {
    //                     tk = rep[0].player2;
    //                     no = 2;
    //                 }
    //                 else if (id == 1) {
    //                     tk = rep[1].player4;
    //                     no = 4;
    //                 }
    //                 else if (id == 2) {
    //                     tk = rep[2].player6;
    //                     no = 6;
    //                 }


    //                 for (var i = 0; i < tk.length; i++) {
    //                     if (tk[i].eAmount == parseInt(req.body.Eamount)) {
    //                         return res.send({ error: 'Y', 'msg': 'Same Entry Fee Already Present' });
    //                     }
    //                 }
    //                 db.collection('EandWamount').updateOne({ id: id }, {
    //                     $push: { ['player' + no]: { eAmount: parseInt(req.body.Eamount), wAmount: [parseInt(req.body.w1), parseInt(req.body.w2), parseInt(req.body.w3), parseInt(req.body.w4), parseInt(req.body.w5), parseInt(req.body.w6)] } }
    //                 }, (er, rs) => {
    //                     if (er) {
    //                         return res.send({ error: 'Y', 'msg': 'Database Error!!' });
    //                     }
    //                     return res.send({ error: 'N', 'msg': 'Added Succsfully' });
    //                 });


    //             });

    //             // db.collection('referAmount').updateOne({ id : "0" }, { $set: { amount : parseInt(req.body.amount) } },(e,r)=>{
    //             //     if(e){
    //             //      return  res.send({error: 'Y', 'msg': 'Database Error !!'});
    //             //     }
    //             //     res.send({error: 'N', 'msg': 'ReferAmount Updated !!'});
    //             //     // res.redirect('/userlist/1');
    //             // });
    //             // res.send({error: 'Y', 'msg': 'Done Got Data'});
    //         }
    //         else {
    //             console.log("123")
    //             res.send({ error: 'Y', 'msg': 'Data Not Found !!' });
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.get('/deleteFee/:id/:amount', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined' && typeof req.params.id != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         var no = parseInt(req.params.id);
    //         no = 2 + (no * 2);

    //         db.collection('EandWamount').updateOne({ id: parseInt(req.params.id) }, {
    //             $pull: { ['player' + no]: { eAmount: parseInt(req.params.amount) } }
    //         }, (er, rs) => {
    //             if (er) {
    //                 return res.send({
    //                     error: true,
    //                     status: 200
    //                 });
    //             }
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         });

    //         // db.collection('EandWamount').remove({
    //         //     uID : req.params.id
    //         // }, (err, results) => {
    //         //     if (!err) {
    //         //         return res.send({
    //         //             error: true,
    //         //             status: 200
    //         //         });
    //         //     } else {
    //         //         return res.send({
    //         //             error: true,
    //         //             status: 500
    //         //         });
    //         //     }
    //         // })
    //     } else {
    //         res.redirect('/userlist/1');
    //     }
    // })

    // app.get('/2pList/:page', (req, res) => {
    //     console.log('dasdasda')
    //     sess = req.session;
    //     sess.active = 'rules';
    //     var perPage = 40;
    //     var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    //     var skip = (perPage * page) - perPage;
    //     var limit = "LIMIT " + skip + ", " + perPage;
    //     console.log(skip);

    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }

    //         db.collection('EandWamount').find().toArray(function (err, rep) {
    //             if (err) {
    //                 throw err;
    //             }
    //             console.log(rep[0])
    //             console.log(rep[0].player2);
    //             var tk = rep[0].player2;
    //             console.log(":::::::::", tk.length);
    //             var p2count = tk.length;
    //             if (skip > p2count) {
    //                 return res.redirect('/2pList/1');
    //             }
    //             var p2 = tk.sort(function (a, b) { return a.eAmount - b.eAmount });
    //             // var p4 = res[1].player4.sort(function(a, b) {return a.eAmount - b.eAmount});
    //             // var p6 = res[2].player6.sort(function(a, b) {return a.eAmount - b.eAmount});
    //             data['data'] = p2;
    //             data['search'] = {};
    //             data['current'] = page;
    //             // data['config'] = results[0];
    //             data['pages'] = Math.ceil(p2count / perPage);
    //             // console.log("data ::::::::::: ", data) ;
    //             responseData('player2List.html', data, res);

    //         });


    //         // db.collection('paytmWithdraw').count((err, userCount) => {
    //         //     if (skip > userCount) {
    //         //         return res.redirect('/paytmlist/1');
    //         //     }
    //         //     db.collection('paytmWithdraw').find({}).skip(skip).sort({
    //         //         _id: -1
    //         //     }).limit(perPage).toArray((err, paytmList) => {
    //         //         for (var i = 0; i < paytmList.length; i++) {
    //         //             paytmList[i].created_at = _date(paytmList[i].created_at).format('DD MMMM, YYYY HH:mm:ss');
    //         //         }
    //         //         data['data'] = paytmList;
    //         //         data['search'] = {};
    //         //         data['current'] = page;
    //         //         // data['config'] = results[0];
    //         //         data['pages'] = Math.ceil(userCount / perPage);
    //         //         // console.log("data ::::::::::: ", data) ;
    //         //         responseData('paytmlist.html', data, res);
    //         //     });
    //         // });
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.get('/4pList/:page', (req, res) => {
    //     console.log('dasdasda')
    //     sess = req.session;
    //     sess.active = 'rules';
    //     var perPage = 40;
    //     var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    //     var skip = (perPage * page) - perPage;
    //     var limit = "LIMIT " + skip + ", " + perPage;
    //     console.log(skip);

    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }

    //         db.collection('EandWamount').find().toArray(function (err, rep) {
    //             if (err) {
    //                 throw err;
    //             }
    //             var tk = rep[1].player4;
    //             console.log(":::::::::", tk.length);
    //             var p4count = tk.length;
    //             if (skip > p4count) {
    //                 return res.redirect('/4pList/1');
    //             }
    //             var p4 = tk.sort(function (a, b) { return a.eAmount - b.eAmount });
    //             // var p4 = res[1].player4.sort(function(a, b) {return a.eAmount - b.eAmount});
    //             // var p6 = res[2].player6.sort(function(a, b) {return a.eAmount - b.eAmount});
    //             data['data'] = p4;
    //             data['search'] = {};
    //             data['current'] = page;
    //             // data['config'] = results[0];
    //             data['pages'] = Math.ceil(p4count / perPage);
    //             // console.log("data ::::::::::: ", data) ;
    //             responseData('player4List.html', data, res);

    //         });
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.get('/6pList/:page', (req, res) => {
    //     console.log('dasdasda')
    //     sess = req.session;
    //     sess.active = 'rules';
    //     var perPage = 40;
    //     var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    //     var skip = (perPage * page) - perPage;
    //     var limit = "LIMIT " + skip + ", " + perPage;
    //     console.log(skip);

    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }

    //         db.collection('EandWamount').find().toArray(function (err, rep) {
    //             if (err) {
    //                 throw err;
    //             }
    //             var tk = rep[2].player6;
    //             console.log(":::::::::", tk.length);
    //             var p6count = tk.length;
    //             if (skip > p6count) {
    //                 return res.redirect('/6pList/1');
    //             }
    //             var p6 = tk.sort(function (a, b) { return a.eAmount - b.eAmount });
    //             // var p4 = res[1].player4.sort(function(a, b) {return a.eAmount - b.eAmount});
    //             // var p6 = res[2].player6.sort(function(a, b) {return a.eAmount - b.eAmount});
    //             data['data'] = p6;
    //             data['search'] = {};
    //             data['current'] = page;
    //             // data['config'] = results[0];
    //             data['pages'] = Math.ceil(p6count / perPage);
    //             // console.log("data ::::::::::: ", data) ;
    //             responseData('player6List.html', data, res);

    //         });
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.get('/withdrawAddAmountList/:page', (req, res) => {
    //     console.log('dasdasda')
    //     sess = req.session;
    //     sess.active = 'rules';
    //     var perPage = 40;
    //     var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    //     var skip = (perPage * page) - perPage;
    //     var limit = "LIMIT " + skip + ", " + perPage;
    //     console.log(skip);

    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }

    //         db.collection('addWithdrawAmount').find().toArray(function (err, rep) {
    //             if (err) {
    //                 throw err;
    //             }
    //             console.log(rep[0].amount);
    //             console.log(rep[1].amount);
    //             var newData = []
    //             for (var i = 0; i < rep[0].amount.length; i++) {
    //                 newData.push({ type: 'paytm', amount: rep[0].amount[i] })
    //             }
    //             for (var i = 0; i < rep[1].amount.length; i++) {
    //                 newData.push({ type: 'bank', amount: rep[1].amount[i] })
    //             }
    //             // var tk=rep[0].amount.concat(rep[1].amount);
    //             // console.log(":::::::::",tk.length);
    //             var count = newData.length;
    //             if (skip > count) {
    //                 return res.redirect('/withdrawAddAmountList/1');
    //             }
    //             console.log(newData)
    //             var p2 = newData.sort(function (a, b) { return a.amount - b.amount });
    //             data['data'] = p2;
    //             data['search'] = {};
    //             data['current'] = page;
    //             // data['config'] = results[0];
    //             data['pages'] = Math.ceil(count / perPage);
    //             // console.log("data ::::::::::: ", data) ;
    //             responseData('withdrawAmount.html', data, res);

    //         });
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/addWithdrawAmount/:id', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log('4567')
    //         console.log(req.body);
    //         // console.log(req.query.id);
    //         var id = parseInt(req.params.id);
    //         if (id != undefined) {

    //             db.collection('addWithdrawAmount').find({ id: parseInt(req.params.id) }).toArray(function (err, rep) {
    //                 if (err) {
    //                     throw err;
    //                 }
    //                 // console.log(rep[0].player2);

    //                 var tk = rep[0].amount;
    //                 for (var i = 0; i < tk.length; i++) {
    //                     if (tk[i] == parseInt(req.body.amount)) {
    //                         return res.send({ error: 'Y', 'msg': 'Already Present !!!' });
    //                     }
    //                 }

    //                 db.collection('addWithdrawAmount').updateOne({ id: id }, {
    //                     $push: { amount: parseInt(req.body.amount) }
    //                 }, (er, rs) => {
    //                     if (er) {
    //                         return res.send({ error: 'Y', 'msg': 'Database Error!!' });
    //                     }
    //                     return res.send({ error: 'N', 'msg': 'Added Succsfully' });
    //                 });


    //             });
    //         }
    //         else {
    //             console.log("123")
    //             res.send({ error: 'Y', 'msg': 'Data Not Found !!' });
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.get('/deleteWithdrawAmount/:id/:amount', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined' && typeof req.params.id != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         var id = parseInt(req.params.id);

    //         console.log(parseInt(req.params.amount) + ' :::::' + parseInt(req.params.id))

    //         db.collection('addWithdrawAmount').updateOne({ id: id }, {
    //             $pull: { amount: parseInt(req.params.amount) }
    //         }, (er, rs) => {
    //             if (er) {
    //                 return res.send({
    //                     error: true,
    //                     status: 200
    //                 });
    //             }
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         });
    //     } else {
    //         res.redirect('/userlist/1');
    //     }
    // })

    // app.post('/PaytmchangeStatus/:id/:status/:uid/:amount', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log('4567 + _ ' + req.params.status)
    //         console.log(req.body);
    //         if (req.params.id != undefined) {
    //             db.collection('withdrow').updateOne({ TxnID: req.params.id }, { $set: { Status: parseInt(req.params.status), approveDate: new Date() } }, (e, r) => {
    //                 if (e) {
    //                     return res.send({
    //                         error: true,
    //                         status: 500
    //                     });
    //                 }
    //                 if (req.params.status == '2' || req.params.status == 2) {
    //                     db.collection('user').updateOne({ DeviceId: req.params.uid }, { $inc: { coin: + parseInt(req.params.amount * 1000) } })
    //                 }
    //                 return res.send({
    //                     error: false,
    //                     status: 200
    //                 });

    //             });
    //         }
    //         else {
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })


    //     app.post('/PaytmchangeStatus/:id/:status/:uid/:amount', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         // console.log('4567 + _ ' + req.params.status)
    //         // console.log(req.body);
    //         if (req.params.id != undefined) {
    //             db.collection('paytmWithdraw').updateOne({ TxnID: req.params.id }, { $set: { Status: parseInt(req.params.status), approveDate: new Date() } }, (e, r) => {
    //                 if (e) {
    //                     return res.send({
    //                         error: true,
    //                         status: 500
    //                     });
    //                 }
    //                 var title = 'Congratulations! Withdraw Successful';
    //                 var msg = "Congratulations! Your Withdraw Request ₹ " + req.params.amount + " Successful...";
    //                 if (req.params.status == '2' || req.params.status == 2) {
    //                     title = 'Your Withdraw Request Canceled';
    //                     msg = 'Your Withdraw Request Canceled plz contact support team at telegram.';
    //                 }
    //                 var payload = {
    //                     notification: {
    //                         title: title,
    //                         body: msg
    //                     }
    //                 }
    //                 var options = {
    //                     priority: "high",
    //                     timeToLive: 60 * 60 * 24
    //                 }

    //                 db.collection('LudoNewUser').findOne({ uID: req.params.uid }, (err, rep) => {
    //                     if (rep) {
    //                         if (req.params.status == '2' || req.params.status == 2) {
    //                             db.collection('LudoNewUser').updateOne({ uID: req.params.uid }, { $inc: { winAmount: + parseInt(req.params.amount) } }, (er, rr) => {
    //                                 var token = rep.fireBaseId;
    //                                 admin.messaging().sendToDevice(token, payload, options)
    //                                     .then((response) => {
    //                                         // console.log("Successfully sent message:", response);
    //                                         return res.send({ error: false, status: 200 })
    //                                     })
    //                                     .catch((error) => {
    //                                         // console.log("Error sending message:", error);
    //                                         return res.send({ error: true, status: 500 })
    //                                     })
    //                             });
    //                         } else {
    //                             var token = rep.fireBaseId;
    //                             admin.messaging().sendToDevice(token, payload, options)
    //                                 .then((response) => {
    //                                     // console.log("Successfully sent message:", response);
    //                                     return res.send({ error: false, status: 200 })
    //                                 })
    //                                 .catch((error) => {
    //                                     // console.log("Error sending message:", error);
    //                                     return res.send({ error: true, status: 500 })
    //                                 })
    //                         }
    //                     } else {
    //                         return res.send({ error: true, status: 500 })
    //                     }
    //                 })
    //             });
    //         }
    //         else {
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/PaytmDeleteReq/:id/:status/:uid/:amount', (req, res) => {
    //     // console.log(req);
    //     //return;
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log('4567 + _ ' + req.params.status)
    //         console.log(req.body);
    //         if (req.params.id != undefined) {
    //             db.collection('paytmWithdraw').deleteOne({ TxnID: req.params.id }, (e, r) => {
    //                 db.collection('LudoNewUser').updateOne({ uID: req.params.uid }, { $inc: { winAmount: + parseInt(req.params.amount) } }, (er, rr) => {
    //                     return res.send({
    //                         error: false,
    //                         status: 200
    //                     });
    //                 });
    //             });
    //         }
    //         else {
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })



    // app.post('/BankchangeStatus/:id/:status/:uid/:amount', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log('4567 + _ ' + req.params.status + ' _ ' + req.params.uid)
    //         console.log(req.body);
    //         if (req.params.id != undefined) {
    //             db.collection('withdrow').updateOne({ TxnID: req.params.id }, { $set: { Status: parseInt(req.params.status), approveDate: new Date() } }, (e, r) => {
    //                 if (e) {
    //                     return res.send({
    //                         error: true,
    //                         status: 500
    //                     });
    //                 }
    //                 if (req.params.status == '2' || req.params.status == 2) {
    //                     db.collection('LudoNewUser').updateOne({ DeviceId: req.params.uid }, { $inc: { winAmount: + parseInt(req.params.amount) } })
    //                 }
    //                 return res.send({
    //                     error: false,
    //                     status: 200
    //                 });

    //             });
    //         }
    //         else {
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })



    // app.post('/BankchangeStatus/:id/:status/:uid/:amount', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log('4567 + ' + req.params.status + ' ' + req.params.uid)
    //         console.log(req.body);
    //         if (req.params.id != undefined) {
    //             db.collection('bankWithdraw').updateOne({ TxnID: req.params.id }, { $set: { Status: parseInt(req.params.status), approveDate: new Date() } }, (e, r) => {
    //                 if (e) {
    //                     return res.send({
    //                         error: true,
    //                         status: 500
    //                     });
    //                 }
    //                 var title = 'Congratulations! Withdraw Successful';
    //                 var msg = "Congratulations! Your Withdraw Request ₹ " + req.params.amount + " Successful...";
    //                 if (req.params.status == '2' || req.params.status == 2) {
    //                     title = 'Your Withdraw Request Canceled';
    //                     msg = 'Your Withdraw Request Canceled plz contact support team at telegram.';
    //                 }
    //                 var payload = {
    //                     notification: {
    //                         title: title,
    //                         body: msg
    //                     }
    //                 }
    //                 var options = {
    //                     priority: "high",
    //                     timeToLive: 60 * 60 * 24
    //                 }

	// 	    db.collection('LudoNewUser').findOne({ uID: req.params.uid }, (err, rep) => {
    //                     if (rep) {
    //                         if (req.params.status == '2' || req.params.status == 2) {
    //                             db.collection('LudoNewUser').updateOne({ uID: req.params.uid }, { $inc: { winAmount: + parseInt(req.params.amount) } }, (er, rr) => {
    //                                 var token = rep.fireBaseId;
    //                                 admin.messaging().sendToDevice(token, payload, options)
    //                                     .then((response) => {
    //                                         // console.log("Successfully sent message:", response);
    //                                         return res.send({ error: false, status: 200 })
    //                                     })
    //                                     .catch((error) => {
    //                                         // console.log("Error sending message:", error);
    //                                         return res.send({ error: true, status: 500 })
    //                                     })
    //                             });
    //                         }
    //                         else {
    //                             var token = rep.fireBaseId;
    //                             admin.messaging().sendToDevice(token, payload, options)
    //                                 .then((response) => {
    //                                     // console.log("Successfully sent message:", response);
    //                                     return res.send({ error: false, status: 200 })
    //                                 })
    //                                 .catch((error) => {
    //                                     // console.log("Error sending message:", error);
    //                                     return res.send({ error: true, status: 500 })
    //                                 })
    //                         }
    //                     }
    //                     else{
    //                         return res.send({ error: true, status: 500 })
    //                     }
    //                 })

    //             });
    //         }
    //         else {
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })


    // app.get('/addNotification', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'notification';
    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         if (typeof req.query.id != 'undefined') {
    //             console.log(req.query.id)
    //             db.collection('LudoNewUser').findOne({ uID: req.query.id }, (e, r) => {
    //                 if (r) {
    //                     data.data = {
    //                         uID: r.uID,
    //                         name: r.PlayerName,
    //                         coin: r.Coin,
    //                         Country: r.Country,
    //                         pic: r.ProfilePic
    //                     }
    //                     responseData('adduser.html', data, res);
    //                 }
    //             })

    //         } else {
    //             data.data = { uID: 123 };
    //             responseData('sendNotification.html', data, res);
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/sendNotification', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'notification';
    //     res.redirect('/dashboard');
    //     return;
    //     if (typeof sess.user != 'undefined') {
    //         console.log(req.body);
    //         if (req.query.id != undefined) {
    //             db.collection('LudoNewUser').find({}, { fireBaseId: 1 }).toArray(function (err, rep) {
    //                 if (err) {
    //                     throw err;
    //                 }
    //                 // This registration token comes from the client FCM SDKs.
    //                 var registrationToken = []
    //                 // registrationToken.push('e3inRHF0gv8:APA91bFGS_vgdMvmYaez7DXt3pWV8AXdEQMtA7CdoICnolSwLaU6mr2nyRab8BOb-MsNKWxt4sVab0h3UF34_Q1JKIaKnzadWWVpk_HrfYxlrQW4fqr_6iQe91pA8FKdAbmDNqzyLwql');
    //                 // registrationToken.push('fIgInlvGgIg:APA91bHCtehH20LEWrMZ9q28XrlLozjD7ex8T5eRX5pNDw1vmV2Wm29cPAmKrE5AkeQXKMKM5GijbSOJC4Ogec3Kx4EtQzIL442AJSFbpgo2BFQZqx4lugqlN5QImLw-jOKudei5h3JS');
    //                 // registrationToken.push("cIfchH1JKPQ:APA91bEUmR3klW45VFBZ12XqnbV3XyGd35JIvx0WM3ZkLK8ZfhhtziR_e9Jv4adf_8gs85fVKdJBIqvqKMfDPI4NZnORJOMPXDPRew4zD_kGnbNt-mBJHYK-Zzmsx_6Jx6CYlzSC5WnT");
    //                 /* for (var i = 0; i < rep.length; i++) {
    //                      if (rep[i].fireBaseId) {
    //                          registrationToken.push(rep[i].fireBaseId);
    //                      }
    //                  }
    //                  console.log('6 ::: ')
 
    //                  var message = {
    //                      notification: {
    //                          title: "Ludo Premier League",
    //                          body: "Message Message"
    //                      },
    //                      data: {
    //                          score: 'i am something',
    //                          time: '2:45'
    //                      },
    //                      token: registrationToken
    //                  };*/

    //                 var payload = {
    //                     notification: {
    //                         title: req.body.title,
    //                         body: req.body.msg
    //                     }
    //                 };


    //                 var options = {
    //                     priority: "high",
    //                     timeToLive: 60 * 60 * 24
    //                 };

    //                 function temp(rep, i, payload, options, done) {
    //                     if (rep[i].fireBaseId) {
    //                         var token = rep[i].fireBaseId;
    //                         admin.messaging().sendToDevice(token, payload, options)
    //                             .then(function (response) {
    //                                 // console.log("Successfully sent message:", response);
    //                                 if (typeof rep[++i] != 'undefined') {
    //                                     temp(rep, i, payload, options, done);
    //                                 } else {
    //                                     return done();
    //                                 }
    //                             })
    //                             .catch(function (error) {
    //                                 // console.log("Error sending message:", error);
    //                                 if (typeof rep[++i] != 'undefined') {
    //                                     temp(rep, i, payload, options, done);
    //                                 } else {
    //                                     return done();
    //                                 }
    //                             });
    //                     }
    //                     else {
    //                         if (typeof rep[++i] != 'undefined') {
    //                             temp(rep, i, payload, options, done);
    //                         } else {
    //                             return done();
    //                         }
    //                     }

    //                 }


    //                 temp(rep, 0, payload, options, (done) => {
    //                     // console.log(done);
    //                     return;
    //                 })
    //                 res.redirect('/dashboard');
    //             });

    //         }
    //         else {

    //             // res.redirect('/');    
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.get('/adduser', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'adduser';
    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         if (typeof req.query.id != 'undefined') {
    //             console.log(req.query.id)
    //             db.collection('LudoNewUser').findOne({ uID: req.query.id }, (e, r) => {
    //                 if (r) {
    //                     data.data = {
    //                         uID: r.uID,
    //                         name: r.PlayerName,
    //                         coin: r.Coin,
    //                         Country: r.Country,
    //                         pic: r.ProfilePic
    //                     }
    //                     responseData('adduser.html', data, res);
    //                 }
    //             })

    //         } else {
    //             // data.data = {};
    //             // responseData('adduser.html', data, res);
    //             res.redirect('/userlist/1');
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })
    // app.post('/adduser', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'adduser';
    //     if (typeof sess.user != 'undefined') {
    //         console.log(req.body);
    //         if (req.query.id != undefined) {
    //             db.collection('LudoNewUser').updateOne({ uID: req.query.id }, { $set: { PlayerName: req.body.name, Coin: parseInt(req.body.coin), Country: parseInt(req.body.country), ProfilePic: req.body.pic } }, (e, r) => {
    //                 res.redirect('/userlist/1');
    //             });

    //         }
    //         else {
    //             res.redirect('/');
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.get('/deleteUser/:id', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'userlist';
    //     if (typeof sess.user != 'undefined' && typeof req.params.id != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         db.collection('user').remove({
    //             uID: req.params.id
    //         }, (err, results) => {
    //             if (!err) {
    //                 return res.send({
    //                     error: true,
    //                     status: 200
    //                 });
    //             } else {
    //                 return res.send({
    //                     error: true,
    //                     status: 500
    //                 });
    //             }
    //         })
    //     } else {
    //         res.redirect('/userlist/1');
    //     }
    // })

    // app.get('/blockUser/:id/:block', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'userlist';
    //     if (typeof sess.user != 'undefined' && typeof req.params.id != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         db.collection('LudoNewUser').updateOne({ uID: req.params.id }, { $set: { isAccountBlock: Boolean(parseInt(req.params.block)) } }, (err, results) => {
    //             if (!err) {
    //                 return res.send({
    //                     error: false,
    //                     msg: req.params.block == '1' ? 'Block' : 'unBlock',
    //                     status: 200
    //                 });
    //             } else {
    //                 return res.send({
    //                     error: true,
    //                     status: 500
    //                 });
    //             }
    //         });

    //     } else {
    //         res.redirect('/userlist/1');
    //     }
    // })

    // app.get('/removeDeviceID/:id', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'userlist';
    //     if (typeof sess.user != 'undefined' && typeof req.params.id != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         db.collection('LudoNewUser').updateOne({ uID: req.params.id }, { $set: { deviceId: [] } }, (err, results) => {
    //             if (!err) {
    //                 return res.send({
    //                     error: false,
    //                     status: 200
    //                 });
    //             } else {
    //                 return res.send({
    //                     error: true,
    //                     status: 500
    //                 });
    //             }
    //         });

    //     } else {
    //         res.redirect('/userlist/1');
    //     }
    // })

    // app.get('/verficationOnOFF/:status', (req, res) => {
    //     console.log("req.params.status :::::: ", req.params.status)
    //     if (typeof req.params.status != 'undefined') {
    //         db.collection('VerificationOnOff').update({
    //             id: 1
    //         }, {
    //             $set: {
    //                 onOff: parseInt(req.params.status)
    //             }
    //         }, (err, results) => {
    //             console.log("changeCodStatus ::::: error :::::::: ", err);
    //             var data = {
    //                 status: req.params.status == '0' ? 'inactive' : 'active'
    //             };
    //             return res.send(JSON.stringify(data));
    //         })
    //     } else {
    //         res.send(400);
    //     }
    // })

    // app.get('/referMoneyOnOff/:status', (req, res) => {
    //     console.log("req.params.status :::::: ", req.params.status)
    //     if (typeof req.params.status != 'undefined') {
    //         db.collection('ReferMoneyOnOff').update({
    //             id: 1
    //         }, {
    //             $set: {
    //                 onOff: parseInt(req.params.status)
    //             }
    //         }, (err, results) => {
    //             console.log("changeCodStatus ::::: error :::::::: ", err);
    //             var data = {
    //                 status: req.params.status == '0' ? 'inactive' : 'active'
    //             };
    //             return res.send(JSON.stringify(data));
    //         })
    //     } else {
    //         res.send(400);
    //     }
    // })

    app.get('/logout', (req, res) => {
        req.session.destroy(function (err) {
            res.redirect('/');
        })
    })

    app.get('/userlist', (req, res) => {
        res.redirect('/userlist/1');
    })

    // app.get('/getTopUser', (req, res) => {
    //     var agg = [{
    //         $match: {
    //             isCPU: false
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 0,
    //             PlayerName: 1,
    //             // ProfilePic: 1,
    //             Coin: 1,
    //             // OMPW: {
    //             //     $sum: ['$OMPWin', '$SOMPWin']
    //             // },
    //             // vsFWin: {
    //             //     $sum: ['$vsFriendWin', '$SvsFriendWin']
    //             // },
    //             wRate: {
    //                 $toInt: {
    //                     $cond: [{
    //                         $eq: [{
    //                             $sum: ['$OMPPlayGame', '$vsFriendPlayGame', '$SOMPPlayGame', '$SvsFriendPlayGame']
    //                         }, 0]
    //                     }, 0, {
    //                         $divide: [{
    //                             $multiply: [{
    //                                 $sum: ['$OMPWin', '$vsFriendWin', '$SOMPWin', '$SvsFriendWin']
    //                             }, 100]
    //                         }, {
    //                             $sum: ['$OMPPlayGame', '$vsFriendPlayGame', '$SOMPPlayGame', '$SvsFriendPlayGame']
    //                         }]
    //                     }]
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $sort: {
    //             wRate: -1
    //         }
    //     },
    //     {
    //         $limit: 10
    //     }
    //     ]

    //     var agg2 = [{
    //         $match: {
    //             isCPU: false
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 0,
    //             PlayerName: 1,
    //             wRate: {
    //                 $cond: [{
    //                     $eq: [{
    //                         $sum: ['$OMPPlayGame', '$vsFriendPlayGame', '$SOMPPlayGame', '$SvsFriendPlayGame']
    //                     }, 0]
    //                 }, 0, {
    //                     $divide: [{
    //                         $multiply: [{
    //                             $sum: ['$OMPWin', '$vsFriendWin', '$SOMPWin', '$SvsFriendWin']
    //                         }, 100]
    //                     }, {
    //                         $sum: ['$OMPPlayGame', '$vsFriendPlayGame', '$SOMPPlayGame', '$SvsFriendPlayGame']
    //                     }]
    //                 }]
    //             }
    //         }
    //     },
    //     {
    //         $sort: {
    //             wRate: -1
    //         }
    //     },
    //     {
    //         $limit: 10
    //     }
    //     ]

    //     db.collection('LudoNewUser').aggregate(agg).toArray((err, aggreResults) => {
    //         var data = {
    //             data: aggreResults
    //         };
    //         // console.log(data);
    //         return res.send(data);
    //     });
    // });

    // app.get('/resellerProfile', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'resellerlist';
    //     if (typeof sess.user != 'undefined') {
    //         var data = { error: false };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         if (typeof req.query.id != 'undefined') {
    //             console.log('::::' + req.query.id);
    //             db.collection('LudoNewUser').find({ uID: req.query.id }).toArray((err, userDetails) => {
    //                 db.collection('bankAndPaytmDetails').find({ userId: req.query.id }).toArray((err, bankDetails) => {
    //                     console.log('::::' + bankDetails);
    //                     db.collection('paytmWithdraw').find({ uId: req.query.id }).toArray((err, paytmWithdraw) => {
    //                         db.collection('bankWithdraw').find({ uId: req.query.id }).toArray((err, bankWithdraw) => {
    //                             db.collection('verificationInfo').find({ userId: req.query.id }).toArray((err, verificationInfo) => {
    //                                 db.collection('gameInfo').find({ id: { $in: userDetails[0].playGameId }, created_at: { $gte: new Date("2019-12-23") } }).sort({ _id: -1 }).toArray((err, gameInfo) => {
    //                                     db.collection('orderDetails').find({ uId: req.query.id, STATUS: 'TXN_SUCCESS' }).toArray((err, orderList) => {
    //                                         var totalAddMoney = 0;
    //                                         if (orderList.length) {
    //                                             for (var i = 0; i < orderList.length; i++) {
    //                                                 totalAddMoney = totalAddMoney + parseInt(orderList[i].TXNAMOUNT);
    //                                             }
    //                                         }

    //                                         var gamesInfo = []
    //                                         var totalEntryAmount = 0;
    //                                         var totalWinAmount = 0;
    //                                         var totalCount = 0;
    //                                         for (var i = 0; i < gameInfo.length; i++) {
    //                                             var win = gameInfo[i]['win'];
    //                                             gameInfo[i].created_at = new Date(gameInfo[i]['created_at']).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    //                                             gameInfo[i].created_at = _date(new Date(gameInfo[i]['created_at'])).format('DD MMMM, YYYY HH:mm:ss');

    //                                             if (gameInfo[i]['gamestartTime'] == undefined) {
    //                                                 gameInfo[i]['gamestartTime'] = '-';
    //                                             }
    //                                             else {
    //                                                 gameInfo[i].gamestartTime = new Date(gameInfo[i]['gamestartTime']).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    //                                                 gameInfo[i].gamestartTime = _date(new Date(gameInfo[i]['gamestartTime'])).format('DD MMMM, YYYY HH:mm:ss');
    //                                             }

    //                                             totalEntryAmount = totalEntryAmount + parseInt(gameInfo[i]['eAmount']);
    //                                             var dta = { id: gameInfo[i]['id'], eAmount: gameInfo[i]['eAmount'], created_at: gameInfo[i]['created_at'], sTime: gameInfo[i]['gamestartTime'] }
    //                                             for (var j = 0; j < win.length; j++) {
    //                                                 if (win[j]['u_id'] == req.query.id) {
    //                                                     dta['wAmount'] = win[j]['wAmount']
    //                                                     totalWinAmount = totalWinAmount + parseInt(win[j]['wAmount']);
    //                                                 }

    //                                             }
    //                                             dta['count'] = parseInt(dta['wAmount']) - parseInt(dta['eAmount']);
    //                                             totalCount = totalCount + dta['count'];
    //                                             gamesInfo.push(dta);
    //                                         }
    //                                         gamesInfo.unshift({ id: 'Total', eAmount: totalEntryAmount, created_at: '-', wAmount: totalWinAmount, count: totalCount });
    //                                         // console.log(gamesInfo);
    //                                         data['gameInfo'] = gamesInfo;
    //                                         data['userInfo'] = userDetails[0];
    //                                         data['bankDetails'] = typeof bankDetails[0] != 'undefined' ? bankDetails[0] : {};
    //                                         data['verificationInfo'] = typeof verificationInfo[0] != 'undefined' ? verificationInfo[0] : {};
    //                                         var totalWithdraw = 0;
    //                                         var pandingWithdraw = 0;
    //                                         var withdraws = []
    //                                         for (var i = 0; i < paytmWithdraw.length; i++) {
    //                                             if (paytmWithdraw[i].Status == 0) {
    //                                                 pandingWithdraw = pandingWithdraw + paytmWithdraw[i].Amount;
    //                                             }
    //                                             else if (paytmWithdraw[i].Status == 1) {
    //                                                 totalWithdraw = totalWithdraw + paytmWithdraw[i].Amount;
    //                                             }
    //                                             paytmWithdraw[i].created_at = new Date(paytmWithdraw[i].created_at).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    //                                             paytmWithdraw[i].created_at = _date(new Date(paytmWithdraw[i].created_at)).format('DD MMMM, YYYY HH:mm:ss');
    //                                             paytmWithdraw[i].type = 'Paytm';
    //                                             withdraws.push(paytmWithdraw[i])
    //                                         }
    //                                         for (var i = 0; i < bankWithdraw.length; i++) {
    //                                             if (bankWithdraw[i].Status == 0) {
    //                                                 pandingWithdraw = pandingWithdraw + bankWithdraw[i].Amount;
    //                                             }
    //                                             else if (bankWithdraw[i].Status == 1) {
    //                                                 totalWithdraw = totalWithdraw + bankWithdraw[i].Amount;
    //                                             }
    //                                             bankWithdraw[i].created_at = new Date(bankWithdraw[i].created_at).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    //                                             bankWithdraw[i].created_at = _date(new Date(bankWithdraw[i].created_at)).format('DD MMMM, YYYY HH:mm:ss');
    //                                             bankWithdraw[i].type = 'Bank';
    //                                             withdraws.push(bankWithdraw[i])
    //                                         }
    //                                         var afterSort = withdraws.sort(function (a, b) {
    //                                             return new Date(b.created_at) - new Date(a.created_at);
    //                                         });
    //                                         console.log(":::::::")
    //                                         // console.log(after)
    //                                         console.log(":::::::")
    //                                         data['withdraw'] = afterSort;
    //                                         data['total'] = { totalWithdraw: totalWithdraw, pandingWithdraw: pandingWithdraw, winAmount: userDetails[0].winAmount, bonusAmount: userDetails[0].bonusAmount, depositeAmount: userDetails[0].depositeAmount, totalAddmoney: totalAddMoney }
    //                                         data.data = {};
    //                                         // console.log(data)
    //                                         responseData('resellerprofile.html', data, res);
    //                                     });
    //                                 })
    //                             });
    //                         })
    //                     })

    //                 });
    //             })
    //         } else {
    //             data.data = {};
    //             responseData('addreseller.html', data, res);
    //         }
    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.get('/itsMyMoney', (req, res) => {
    //     console.log('My Ip : ', req.connection.remoteAddress);
    //     if (req.connection.remoteAddress != '::ffff:123.201.227.2') {
    //       //  console.log('Block : ', req.connection.remoteAddress);
    //        // return;
    //     }
    //     //return;
    //     sess = req.session;
    //     sess.active = 'addAmount';
    //     if (typeof sess.user != 'undefined') {
    //         var data = {
    //             error: false
    //         };
    //         if (typeof sess.error != 'undefined') {
    //             data.error = true;
    //             data.msg = sess.error;
    //             delete sess.error;
    //         }
    //         if (true || typeof req.query.id != 'undefined') {
    //             db.collection('checkID').findOne({ id: "0" }, (r, check) => {
    //                 if (check || true) {
    //                     if (true || req.query.id == check.check) {
    //                         data.data = { uID: 123 };
    //                         responseData('page404.html', data, res);
    //                     }
    //                 }
    //                 else {
    //                     res.redirect('/');
    //                 }
    //             })
    //         }
    //         else {
    //             res.redirect('/');
    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/itsMyMoney', (req, res) => {
    //     console.log('My Ip : ', req.connection.remoteAddress);
    //     console.log(req.body);
    //     if (req.connection.remoteAddress != '::ffff:123.201.227.2') {
    //         //console.log('Block : ', req.connection.remoteAddress);
    //         //return;
    //     }
    //     //return;
    //     sess = req.session;
    //     sess.active = 'addAmount';
    //     if (typeof sess.user != 'undefined') {
    //         console.log(req.body);
    //         if (req.body.adminNo == '-1') {
    //             responseData('page404.html', {
    //                 msg: 'Please Select Admin',
    //                 data: {},
    //                 error: true
    //             }, res);
    //         }
    //         else {
    //             if (true || req.body.sessID != undefined) {
    //                 db.collection('checkID').findOne({ id: "0" }, (r, check) => {
    //                     if (true ||check) {
    //                         if (true || req.body.sessID == check.check) {
    //                             db.collection('LudoNewUser').find({ mobileNo: req.body.mNo }).toArray((err, users) => { //panding work check tomorrow
    //                                 console.log(users.length)
    //                                 if (users.length) {
    //                                     var insertDatas = {
    //                                         uId: users[0].uID,
    //                                         STATUS: "TXN_SUCCESS",
    //                                         CHECKSUMHASH: "ADDED BY ADMIN",
    //                                         BANKNAME: req.body.adminNo,
    //                                         ORDERID: uniqid('Aa0', 25) + 'Admin',
    //                                         TXNAMOUNT: req.body.amount,
    //                                         TXNDATE: new Date(),
    //                                         MID: "LudoPr19581827610860",
    //                                         TXNID: uniqid('Aa0', 25) + 'Admin',
    //                                         RESPCODE: "01",
    //                                         PAYMENTMODE: "PPI",
    //                                         BANKTXNID: "ADMIN",
    //                                         CURRENCY: "INR",
    //                                         GATEWAYNAME: "WALLET",
    //                                         RESPMSG: req.body.msg
    //                                     }
    //                                     db.collection('addByAdmin').insert(insertDatas, (e, r) => {
    //                                         db.collection('LudoNewUser').updateOne({
    //                                             mobileNo: req.body.mNo
    //                                         }, {
    //                                             $inc: {
    //                                                 depositeAmount: +parseInt(req.body.amount)
    //                                             }
    //                                         });
    //                                         if (req.body.oAmount != undefined && req.body.oAmount != '0' && parseInt(req.body.oAmount) != 0 && req.body.oAmount != '') {
    //                                             insertDatas.TXNAMOUNT = req.body.oAmount;
    //                                             db.collection('orderDetails').insert(insertDatas, (e, r) => {
    //                                                 // console.log(r);
    //                                                 responseData('page404.html', {
    //                                                     msg: 'Data Insert Success',
    //                                                     data: {},
    //                                                     error: true
    //                                                 }, res);
    //                                             })
    //                                         }
    //                                     })

    //                                 }
    //                                 else {
    //                                     responseData('page404.html', {
    //                                         msg: 'Please Select Valid Mobile No',
    //                                         data: {},
    //                                         error: true
    //                                     }, res);
    //                                 }
    //                                 responseData('page404.html', {
    //                                     msg: 'Money Add Success',
    //                                     data: {},
    //                                     error: true
    //                                 }, res);
    //                             });
    //                         }
    //                         else {
    //                             res.redirect('/');
    //                         }
    //                     }
    //                     else {
    //                         res.redirect('/');
    //                     }
    //                 })
    //             }

    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/processingSelectedBankWithdraw', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log(req.body);
    //         var jsn = req.body.data;
    //         var data = []
    //         for (var i = 0; i < jsn.length; i++) {
    //             data.push(jsn[i].txnId);
    //         }
    //         if (data != undefined && data.length != 0) {
    //             console.log(data)
    //             db.collection('withdrow').updateMany({ TxnID: { $in: data } }, { $set: { Status: 3 } }, (e, r) => {
    //                 if (e) {
    //                     return res.send({
    //                         error: true,
    //                         status: 500
    //                     });
    //                 }
    //                 return res.send({
    //                     error: false,
    //                     status: 200
    //                 });
    //             });
    //         }
    //         else {
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })

    // app.post('/approveSelectedBankWithdraw', (req, res) => {
    //     // console.log(req);
    //     sess = req.session;
    //     sess.active = 'rules';
    //     if (typeof sess.user != 'undefined') {
    //         console.log(req.body);
    //         var jsn = req.body.data;
    //         var data = []
    //         for (var i = 0; i < jsn.length; i++) {
    //             data.push(jsn[i].txnId);
    //         }
    //         if (data != undefined && data.length != 0) {
    //             console.log(data)
    //             db.collection('withdrow').updateMany({ TxnID: { $in: data } }, { $set: { Status: 1, approveDate: new Date() } }, (e, r) => {
    //                 if (e) {
    //                     return res.send({
    //                         error: true,
    //                         status: 500
    //                     });
    //                 }
    //                 return res.send({
    //                     error: false,
    //                     status: 200
    //                 });
    //             });
    //         }
    //         else {
    //             return res.send({
    //                 error: true,
    //                 status: 500
    //             });
    //         }

    //     } else {
    //         res.redirect('/');
    //     }
    // })

//     app.post('/approveSelectedBankWithdraw', (req, res) => {
//         // console.log(req);
//         sess = req.session;
//         sess.active = 'rules';
//         if (typeof sess.user != 'undefined') {
//             console.log(req.body);
//             var jsn = req.body.data;
//             var data = []
// 	    var userID=[]
// 	    var both=[]
//             for (var i = 0; i < jsn.length; i++) {
//                 data.push(jsn[i].txnId);
// 		userID.push(jsn[i].uId);
// 		both.push({uid : jsn[i].uId , amount : jsn[i].amount});
//             }
//             if (data != undefined && data.length != 0) {
//                 console.log(data)
//                 db.collection('withdrow').updateMany({ TxnID: { $in: data } }, { $set: { Status: 1, approveDate: new Date() } }, (e, r) => {
//                     if (e) {
//                         return res.send({
//                             error: true,
//                             status: 500
//                         });
//                     }
// 		    db.collection('LudoNewUser').find({ uID: { $in: userID } }).toArray(function (err, rep) {
//                     if (err) {
//                         throw err;
//                     }

//                     var registrationToken = []
//                    /* var payload = {
//                         notification: {
//                             title: "",
//                             body: ""
//                         }
//                     }*/

//                     var options = {
//                         priority: "high",
//                         timeToLive: 60 * 60 * 24
//                     }

//                     function temp(rep, i,  options, done) {
//                         if (rep[i].fireBaseId) {
//                             var token = rep[i].fireBaseId;
// 			    var found = both.find(element => element.uid == rep[i].uID);
// 			    var amnt=found.amount;
// 			    var payload = {
//                         	notification: {
//                             	   title: "Congratulations! Withdraw Successful",
//                             	   body: "Congratulations! Your Withdraw Request ₹ "+amnt+" Successful..."
//                         	}
//                     	    }
//                             admin.messaging().sendToDevice(token, payload, options)
//                                 .then(function (response) {
//                                     // console.log("Successfully sent message:", response);
//                                     if (typeof rep[++i] != 'undefined') {
//                                         temp(rep, i, payload, options, done);
//                                     } else {
//                                         return done();
//                                     }
//                                 })
//                                 .catch(function (error) {
//                                     // console.log("Error sending message:", error);
//                                     if (typeof rep[++i] != 'undefined') {
//                                         temp(rep, i, payload, options, done);
//                                     } else {
//                                         return done();
//                                     }
//                                 });
//                         }
//                         else {
//                             if (typeof rep[++i] != 'undefined') {
//                                 temp(rep, i, payload, options, done);
//                             } else {
//                                 return done();
//                             }
//                         }

//                     }

//                     temp(rep, 0,  options, (done) => {
//                         // console.log(done);
// 			return res.send({
//                         	error: false,
//                         	status: 200
//                     	});
//                         return;
//                     })
//                 });

// /*
//                     return res.send({
//                         error: false,
//                         status: 200
//                     }); */
//                 });
//             }
//             else {
//                 return res.send({
//                     error: true,
//                     status: 500
//                 });
//             }

//         } else {
//             res.redirect('/');
//         }
//     })

    app.post('/createBankXmlFile', (req, res) => {
        sess = req.session;
        console.log('  :: ' + sess)
        sess.active = 'dashboard';
        if (typeof sess.user != 'undefined') {
            var jsn = req.body.data;
	    console.log(jsn);
	    try {
	    	fs.unlinkSync('bankData.xlsx');
	    } catch (err) {
  		// handle the error
	    }
        var worksheet = workbook.addWorksheet('Sheet 1');
            worksheet.cell(1, 1).string('Beneficiary Name');
            worksheet.cell(1, 2).string('Account Number');
            worksheet.cell(1, 3).string('IFSC Code');
            worksheet.cell(1, 4).string('UPI Handle');
            worksheet.cell(1, 5).string('Unique Request Number');
            worksheet.cell(1, 6).string('Amount');
            worksheet.cell(1, 7).string('Payment Mode');
            worksheet.cell(1, 8).string('Narration');
            // worksheet.cell(1, 9).string('Beneficiary Email ID');
            // worksheet.cell(1, 10).string('Beneficiary Phone Number');
            
            for (var i = 0; i < jsn.length; i++) {
                worksheet.cell(i + 2, 1).string(jsn[i].ACHoldername);
                worksheet.cell(i + 2, 2).string(jsn[i].ACnumber);
                worksheet.cell(i + 2, 3).string(jsn[i].ifsc);
                worksheet.cell(i + 2, 5).string(jsn[i].TxnID);
                worksheet.cell(i + 2, 6).string(jsn[i].amount);
                worksheet.cell(i + 2, 7).string('IMPS');
                worksheet.cell(i + 2, 8).string('cashback by SpinnerApp');
                // worksheet.cell(i + 2, 9).string(jsn[i].mNo);
                // worksheet.cell(i + 2, 10).string(jsn[i].mNo);
            }

            workbook.write('bankData.xlsx');
	    workbook.write('bankData.xlsx', function(err, stats) {
    if (err) {
      console.error(err);
    } else {
        res.redirect('/createBankXmlFile');
    }
  	});	

	
        } else {
            res.redirect('/');
        }
    })

    app.get('/createBankXmlFile', (req, res) => {
        console.log('download??? 2.0')
        // res.download("Excel.xls");
        res.download("bankData.xlsx");
	
	setTimeout(() => {
		try {
                fs.unlinkSync('bankData.xlsx');
            } catch (err) {
                // handle the error
            }
	}, 1000 * 60 * 4);
        return true;
    });

    app.post('/processingSelectedPaytmWithdraw', (req, res) => {
        // console.log(req);
        sess = req.session;
        sess.active = 'rules';
        if (typeof sess.user != 'undefined') {
            console.log(req.body);
            var jsn = req.body.data;
            var data = []
            for (var i = 0; i < jsn.length; i++) {
                data.push(jsn[i].txnId);
            }
            if (data != undefined && data.length != 0) {
                console.log(data)
                db.collection('withdrow').updateMany({ TxnID: { $in: data } }, { $set: { Status: 3 } }, (e, r) => {
                    if (e) {
                        return res.send({
                            error: true,
                            status: 500
                        });
                    }
                    return res.send({
                        error: false,
                        status: 200
                    });
                });
            }
            else {
                return res.send({
                    error: true,
                    status: 500
                });
            }

        } else {
            res.redirect('/');
        }
    })


   /* app.post('/processingSelectedPaytmWithdraw', (req, res) => {
        // console.log(req);
        sess = req.session;
        sess.active = 'rules';
        if (typeof sess.user != 'undefined') {
            console.log(req.body);
            var jsn = req.body.data;
            var data = []
            for (var i = 0; i < jsn.length; i++) {
                data.push(jsn[i].txnId);
            }
            if (data != undefined && data.length != 0) {
                console.log(data)
                db.collection('paytmWithdraw').updateMany({ TxnID: { $in: data } }, { $set: { Status: 3 } }, (e, r) => {
                    if (e) {
                        return res.send({
                            error: true,
                            status: 500
                        });
                    }

                    title = 'Your Withdraw Request is in Processing....';
                    msg = 'Your Withdraw Request Has Been Under Processing so Keep Waiting.';

                    var payload = {
                        notification: {
                            title: title,
                            body: msg
                        }
                    }
                    var options = {
                        priority: "high",
                        timeToLive: 60 * 60 * 24
                    }

                    db.collection('LudoNewUser').findOne({ uID: req.params.uid }, (err, rep) => {
                        if (rep) {
                            var token = rep.fireBaseId;
                            admin.messaging().sendToDevice(token, payload, options)
                                .then((response) => {
                                    // console.log("Successfully sent message:", response);
                                    return res.send({ error: false, status: 200 })
                                })
                                .catch((error) => {
                                    // console.log("Error sending message:", error);
                                    return res.send({ error: true, status: 500 })
                                })
                        }
                    })
                });
            }
            else {
                return res.send({
                    error: true,
                    status: 500
                });
            }

        } else {
            res.redirect('/');
        }
    })*/


//    app.post('/processingSelectedPaytmWithdraw', (req, res) => {
//         // console.log(req);
//         sess = req.session;
//         sess.active = 'rules';
//         if (typeof sess.user != 'undefined') {
//             // console.log(req.body);
//             var jsn = req.body.data;
//             var data = []
//             for (var i = 0; i < jsn.length; i++) {
//                 data.push(jsn[i].txnId);
//             }
//             if (data != undefined && data.length != 0) {
//                 // console.log(data)
//                 db.collection('paytmWithdraw').updateMany({ TxnID: { $in: data } }, { $set: { Status: 3 } }, (e, r) => {
//                     if (e) {
//                         return res.send({
//                             error: true,
//                             status: 500
//                         });
//                     }
//                     db.collection('paytmWithdraw').find({ TxnID: { $in: data } }).toArray((err2, selecteduser) => {

//                         if (err2) {
//                             return res.send({
//                                 error: true,
//                                 status: 500
//                             })
//                         }

//                         var userId = []
//                         for (var i = 0; i < selecteduser.length; i++) {
//                             userId.push(selecteduser[i].uId);
//                         }

//                         console.log(userId, 'userid')      

//                         db.collection('LudoNewUser').find({ uID: { $in: userId } }).toArray(function (err, rep) {
//                             console.log(rep, 'userdetail')
//                             if (err) {
//                                 return res.send({
//                                     error: true,
//                                     status: 500
//                                 })
//                             }
            
//                             var registrationToken = []
//                             var payload = {
//                                 notification: {
//                                     title: 'Withdraw in processing',
//                                     body: 'Your paytm withdraw in processing...'
//                                 }
//                             }
            
//                             var options = {
//                                 priority: "high",
//                                 timeToLive: 60 * 60 * 24
//                             }
            
//                             function temp(rep, i, payload, options, done) {
//                                 if (rep[i].fireBaseId) {
//                                     var token = rep[i].fireBaseId
//                                     admin.messaging().sendToDevice(token, payload, options)
//                                         .then(function (response) {
//                                             // console.log("Successfully sent message:", response)
//                                             if (typeof rep[++i] != 'undefined') {
//                                                 temp(rep, i, payload, options, done)
//                                             } else {
//                                                 return done()
//                                             }
//                                         })
//                                         .catch(function (error) {
//                                             // console.log("Error sending message:", error)
//                                             if (typeof rep[++i] != 'undefined') {
//                                                 temp(rep, i, payload, options, done)
//                                             } else {
//                                                 return done();
//                                             }
//                                         })
//                                 } else {
//                                     if (typeof rep[++i] != 'undefined') {
//                                         temp(rep, i, payload, options, done)
//                                     } else {
//                                         return done()
//                                     }
//                                 }
//                             }
            
//                             temp(rep, 0, payload, options, (done) => {
//                                 // console.log(done)
//                                 return res.send({
//                                     error: false,
//                                     status: 200
//                                 });
//                                 // return
//                             })
//                             // res.redirect('/dashboard')
//                         })
//                     })
//                 });
//             }
//             else {
//                 return res.send({
//                     error: true,
//                     status: 500
//                 });
//             }

//         } else {
//             res.redirect('/');
//         }
//     })

    

    app.post('/approveSelectedPaytmWithdraw', (req, res) => {
        // console.log(req);
        sess = req.session;
        sess.active = 'rules';
        if (typeof sess.user != 'undefined') {
            console.log(req.body);
            var jsn = req.body.data;
            var data = []
            for (var i = 0; i < jsn.length; i++) {
                data.push(jsn[i].txnId);
            }
            if (data != undefined && data.length != 0) {
                console.log(data)
                db.collection('withdrow').updateMany({ TxnID: { $in: data } }, { $set: { Status: 1, approveDate: new Date() } }, (e, r) => {
                    if (e) {
                        return res.send({
                            error: true,
                            status: 500
                        });
                    }
                    return res.send({
                        error: false,
                        status: 200
                    });
                });
            }
            else {
                return res.send({
                    error: true,
                    status: 500
                });
            }

        } else {
            res.redirect('/');
        }
    })


//    app.post('/approveSelectedPaytmWithdraw', (req, res) => {
//         // console.log(req);
//         sess = req.session;
//         sess.active = 'rules';
//         if (typeof sess.user != 'undefined') {
//             console.log(req.body);
//             var jsn = req.body.data;
//             var data = []
//             for (var i = 0; i < jsn.length; i++) {
//                 data.push(jsn[i].txnId);
//             }
//             if (data != undefined && data.length != 0) {
//                 console.log(data)
//                 db.collection('paytmWithdraw').updateMany({ TxnID: { $in: data } }, { $set: { Status: 1, approveDate: new Date() } }, (e, r) => {
//                     if (e) {
//                         return res.send({
//                             error: true,
//                             status: 500
//                         });
//                     }

//                     db.collection('paytmWithdraw').find({ TxnID: { $in: data } }).toArray((err2, selecteduser) => {

//                         if (err2) {
//                             return res.send({
//                                 error: true,
//                                 status: 500
//                             })
//                         }
//                         var userId = []
//                         for (var i = 0; i < selecteduser.length; i++) {
//                             userId.push(selecteduser[i].uId)
//                         }

//                         db.collection('LudoNewUser').find({ uID: { $in: userId } }).toArray(function (err, rep) {
//                             if (err) {
//                                 return res.send({
//                                     error: true,
//                                     status: 500
//                                 })
//                             }

//                             var options = {
//                                 priority: "high",
//                                 timeToLive: 60 * 60 * 24
//                             }
//                             var payload = {
//                                     notification: {
//                                         title: 'Withdraw Request Approved',
//                                         body: `Your paytm withdraw in Approved...`
//                                     }
//                                 }
//                             function temp(rep, i, payload, options, done) {
//                                 /*var payload = {
//                                     notification: {
//                                         title: 'Withdraw Request Approved',
//                                         body: `Your rs paytm withdraw in Approved...`
//                                     }
//                                 }*/
//                                 if (rep[i].fireBaseId) {
//                                     var token = rep[i].fireBaseId
//                                     admin.messaging().sendToDevice(token, payload, options)
//                                         .then(function (response) {
//                                             // console.log("Successfully sent message:", response)
//                                             if (typeof rep[++i] != 'undefined') {
//                                                 temp(rep, i, payload, options, done)
//                                             } else {
//                                                 return done()
//                                             }
//                                         })
//                                         .catch(function (error) {
//                                             // console.log("Error sending message:", error)
//                                             if (typeof rep[++i] != 'undefined') {
//                                                 temp(rep, i, payload, options, done)
//                                             } else {
//                                                 return done();
//                                             }
//                                         })
//                                 } else {
//                                     if (typeof rep[++i] != 'undefined') {
//                                         temp(rep, i, payload, options, done)
//                                     } else {
//                                         return done()
//                                     }
//                                 }
//                             }

//                             temp(rep, 0, payload, options, (done) => {
//                                 // console.log(done)
//                                 return res.send({
//                                     error: false,
//                                     status: 200
//                                 });
//                                 // return
//                             })
//                             // res.redirect('/dashboard')
//                         })
//                     })
//                 });
//             }
//             else {
//                 return res.send({
//                     error: true,
//                     status: 500
//                 });
//             }

//         } else {
//             res.redirect('/');
//         }
//     })


   /* app.post('/approveSelectedPaytmWithdraw', (req, res) => {
        // console.log(req);
        sess = req.session;
        sess.active = 'rules';
        if (typeof sess.user != 'undefined') {
            console.log(req.body);
            var jsn = req.body.data;
            var data = []
            for (var i = 0; i < jsn.length; i++) {
                data.push(jsn[i].txnId);
            }
            if (data != undefined && data.length != 0) {
                console.log(data)
                db.collection('paytmWithdraw').updateMany({ TxnID: { $in: data } }, { $set: { Status: 1, approveDate: new Date() } }, (e, r) => {
                    if (e) {
                        return res.send({
                            error: true,
                            status: 500
                        });
                    }
                        var userId = []
                        for (var i = 0; i < selecteduser.length; i++) {
                            userId.push(selecteduser[i].uId)
                        }

                        db.collection('LudoNewUser').find({ uID: { $in: userId } }).toArray(function (err, rep) {
                            if (err) {
                                return res.send({
                                    error: true,
                                    status: 500
                                })
                            }
            
                            var options = {
                                priority: "high",
                                timeToLive: 60 * 60 * 24
                            }
            
                            function temp(rep, i, payload, options, done) {
                                var payload = {
                                    notification: {
                                        title: 'Withdraw Request Approved',
                                        body: `Your rs paytm withdraw in Approved...`
                                    }
                                }
                                if (rep[i].fireBaseId) {
                                    var token = rep[i].fireBaseId
                                    admin.messaging().sendToDevice(token, payload, options)
                                        .then(function (response) {
                                            // console.log("Successfully sent message:", response)
                                            if (typeof rep[++i] != 'undefined') {
                                                temp(rep, i, payload, options, done)
                                            } else {
                                                return done()
                                            }
                                        })
                                        .catch(function (error) {
                                            // console.log("Error sending message:", error)
                                            if (typeof rep[++i] != 'undefined') {
                                                temp(rep, i, payload, options, done)
                                            } else {
                                                return done();
                                            }
                                        })
                                } else {
                                    if (typeof rep[++i] != 'undefined') {
                                        temp(rep, i, payload, options, done)
                                    } else {
                                        return done()
                                    }
                                }
                            }
            
                            temp(rep, 0, payload, options, (done) => {
                                // console.log(done)
                                return res.send({
                                    error: false,
                                    status: 200
                                });
                                // return
                            })
                            // res.redirect('/dashboard')
                        })
                });
            }
            else {
                return res.send({
                    error: true,
                    status: 500
                });
            }

        } else {
            res.redirect('/');
        }
    })*/

    app.post('/createXmlFile', (req, res) => {
        sess = req.session;
        console.log('  :: ' + sess)
        sess.active = 'dashboard';
        if (typeof sess.user != 'undefined') {
            var jsn = req.body.data;
            // var data = '';
            // data = "Order id" + '\t' + 'Users Mobile Number' + '\t' + 'Amount' + '\t' + 'Comment' + '\n';
            // for (var i = 0; i < jsn.length; i++) {
            //     data = data + jsn[i].txnId + '\t' + jsn[i].mNo + '\t' + jsn[i].amount + '\t' + ' ' + '\n';
            // }
            // fs.truncate("Excel.xls", 0, function () {
            //     fs.writeFile("Excel.xls", data, function (err) {
            //         if (err) {
            //             return console.log("Error writing file: " + err);
            //         }
            //         setTimeout(function () {
            //             // res.download("Excel.xls");
            //             res.redirect('/createXmlFile');
            //             return true;
            //         }, 500);
            //     });
            // });

            const csvWriter = createCsvWriter({
                path: 'paytmData.csv',
                header: [
                    // { id: 'oid', title: 'Order id' },
                    { id: 'mNo', title: "User's Mobile Number/Email" },
                    { id: 'Amount', title: 'Amount' },
                    { id: 'BeneficiaryName', title: 'Beneficiary Name' },
                    { id: 'Comment', title: 'Comment' },
                ]
            });

            var data = [];
            for (var i = 0; i < jsn.length; i++) {
                // data.push({ oid: jsn[i].txnId, mNo: jsn[i].mNo, Amount: jsn[i].amount, Comment: '' });
                data.push({ mNo: jsn[i].mNo, Amount: jsn[i].amount, BeneficiaryName: "Champion", Comment: 'cashback by ludo champions' });
            }

            csvWriter
                .writeRecords(data)
                .then(() => {
                    res.redirect('/createXmlFile');
                    // console.log('The CSV file was written successfully')
                    // res.download("paytmData.csv");
                    return true;
                });
        } else {
            res.redirect('/');
        }
    })

    app.get('/createXmlFile', (req, res) => {
        console.log('download??? 2.0')
        // res.download("Excel.xls");
	//res.download("Data2.xlsx");
        res.download("paytmData.csv");
        return true;
    });

    // app.post("/getGameInfo/:id", (req, responce) => {
    //     console.log(req.params.id);
    //     db.collection('gameInfo').findOne({ id: req.params.id }, (req, res) => {
    //         console.log(res);
    //         return responce.send(res);

    //     })
    // })

    // app.get("/sortFinishGame", (req, res) => {
    //     var dt = new Date();
    //     dt.setDate(dt.getDate() - 1);
    //     db.collection('gameInfo').find({ $query: { gamestartTime: { "$gte": dt } }, $maxTimeMS: 100 }).toArray((err, games) => {
    //         console.log(games.length)
    //         var tGame = []
    //         var countGame = 0;
    //         var gameID = new Map();
    //         if (games.length) {
    //             for (var i = 0; i < games.length; i++) {
    //                 var start = new Date(games[i].gamestartTime);
    //                 var oldDate = new Date(games[i].created_at);
    //                 if (((oldDate - start) / 1000 / 60) <= 3) {
    //                     countGame++;
    //                     tGame.push(games[i])
    //                     var win = games[i]['win'];
    //                     for (var j = 0; j < win.length; j++) {
    //                         var item = gameID.get(win[j].u_id);
    //                         if (item!=undefined) {
    //                             item.count = item.count + 1;
    //                             item.TE = item.TE + games[i]['eAmount'];
    //                             if(win[j].wAmount != 0){
    //                                 item.winA=item.winA+1;
    //                                 item.TW = item.TW + win[j].wAmount;
    //                             }
    //                             else {
    //                                 item.loss=item.loss+1;
    //                             }
    //                         }
    //                         else {
    //                             var winA=0;
    //                             var loss=0;
    //                             var totalW=0;
    //                             var totalE=games[i]['eAmount'];
    //                             if(win[j].wAmount != 0){
    //                                 winA=1;
    //                                 totalW=win[j].wAmount
    //                             }
    //                             else {
    //                                 loss=1;
    //                             }
    //                             gameID.set(win[j].u_id, { id: BaseUrl+"/resellerProfile?id="+win[j].u_id, count: 1 , winA : winA , loss : loss , TE : totalE , TW : totalW});
    //                         }
    //                     }

    //                 }
    //             }
    //         }
    //         var arry=[]
    //         gameID.forEach((key, value) => {
    //             arry.push(key);
    //         });
    //         arry.reverse();
    //         res.send({ totalGame: games.length != undefined ? games.length : 0, sortGame: countGame, UserID: arry, Games: tGame })

    //     });
    // })

    // app.post("/checkTime", (req, res) => {
    //     var today = new Date();
    //     console.log(today.getHours())

    //     return res.send({
    //         Error: 'N'
    //     });
    //     if (today.getDay() != 0) {
    //         if (today.getHours() > 9 && today.getHours() < 20) {
    //             console.log("You Can Play it.");
    //             return res.send({
    //                 Error: 'N'
    //             });
    //         }
    //         else {
    //             console.log("You cant play it");
    //             return res.send({
    //                 Error: 'Y'
    //             });
    //         }
    //     }
    //     else {
    //         console.log("You cant play it");
    //         return res.send({
    //             Error: 'Y'
    //         });
    //     }
    // })



/*    app.get('/marketing', (req, res) => {
        sess = req.session;
        sess.active = 'marketing';
        var perPage = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
        var data2 = {
               error: false
           }
        data2['perPage'] = perPage;
        if (typeof sess.user != 'undefined') {
            data = {
                error: false,
                msg: '',
                msgs: '',
                data: '',
                data1: data2
            }
            responseData('marketing.html', data, res)
        } else {
            res.redirect('/');
        }
    })*/


// app.get('/marketing', (req, res) => {
//             sess = req.session;
//             sess.active = 'marketing';

//             var data2 = {
//                 error: false
//             }
            
//             var data4 = {
//                 error: false
//             }


//             if (typeof sess.smsPerPage != 'undefined') {
//                 data2['perPage'] = sess.smsPerPage
//             } else {
//                 data2['perPage'] = 10
//             }

//             if (typeof sess.user != 'undefined') {
                
//                 return responseData('marketing.html', {
//                     data1: data2,
//                     data4: data4,
//                     data: '',
//                     msgs: '',
//                     msg: '',
//                     msg3: '',
//                     smsdata: ''
//                 }, res)
//             } else {
//                 res.redirect('/');
//             }
//         })

//          app.post('/marketingnumber', (req, res) => {
//             sess = req.session;
//             sess.active = 'marketing';
//             var perPage = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;

//             if (typeof sess.user != 'undefined') {
//                 var array = req.body.mobile.split(/\r\n|\r|\n/g);
//                 console.log(array)
//                 var array2 = []
//             for (var i = 0; i < array.length; i++) {
//               if (array[i].toString().length == 10) {
//                 if(/^-?\d+$/.test(array[i])){
//                   if(array[i].charAt(0) == 6 || array[i].charAt(0) == 7 || array[i].charAt(0) == 8 || array[i].charAt(0) == 9){
//                     array2.push(array[i])
//                   }
//                 }
//               }
//             }
//                // console.log(req.body.mobile)
//                 db.collection('marketing').find({}).toArray((err, existmobileNo) => {

//                     var array1 = []
//                     for (var i = 0; i < existmobileNo.length; i++) {
//                         var mydata = existmobileNo[i].mobileNo
//                         array1.push(mydata)
//                     }
//                     var data2 = {
//                          error: false
//                     }
//                     data2['perPage'] = perPage;
//                    // console.log(array1, array2)

//                     var data = {
//                         error: false
//                     }
    

//                     var InsertMobile = array2.filter(function (obj) { return array1.indexOf(obj) == -1; });
//                     var common = array1.filter(value => array2.includes(value));

//                     if (InsertMobile.length != 0) {
//                         for (var i = 0; i < InsertMobile.length; i++) {
//                             db.collection('marketing').insertOne({ mobileNo: InsertMobile[i] }, (err, ifexist) => {
//                                 i--
//                                // console.log((InsertMobile.length - i) == InsertMobile.length, (InsertMobile.length - i), InsertMobile.length)
//                                 if ((InsertMobile.length - i) == InsertMobile.length) {
//                                     return responseData('marketing.html',
//                                         {
//                                             data: common,
//                                             data1: data2,
//                                             msg: 'successfully inserted',
//                                             msgs: '',
//                                             msg3: '',
//                                             smsdata: ''
//                                         },
//                                         res
//                                     )
//                                 }
//                             })
//                         }
//                     } else {
//                         return responseData('marketing.html',
//                             {
//                                 data: common,
//                                 data1: '',
//                                 msg: 'All Number Is Commen',
//                                 msgs: '',
//                                 msg3: '',
//                                 smsdata: ''
//                             },
//                             res
//                         )
//                     }
//                 })
//             } else {
//                 res.redirect('/');
//             }
//         })


//       app.post('/storeSessionPerPage', (req, res) => {
//             sess = req.session;
//             sess.active = 'marketing';
//             sess.smsPerPage = req.body.perPage;
//             var data = {
//                 error: false
//             }
//             data['perPage'] = sess.smsPerPage;
//             if (typeof sess.user != 'undefined') {
//             return responseData('marketing.html', {
//                     data1: data,
//                     data: '',
//                     msg: '',
//                     msgs: '',
//                     msg3: '',
//                     smsdata: ''
//                 }, res)
//             } else {
//             return res.render('/')
//           }
//         })


//   app.post('/deleteMarketingNumber', (req, res) => {
//     sess = req.session;
//     sess.active = 'marketing';

//     if (typeof sess.user != 'undefined') {

//       var data = {
//           error: false
//       }


//       var array = req.body.mobile.split(/\r\n|\r|\n/g)
//       db.collection('marketing').deleteMany({ mobileNo: { $in: array } }, (err, existmobileNo) => {
//         return responseData('marketing.html', {
//           data1: '',
//           data: '',
//           msg: '',
//           msgs: '',
//           smsdata: '',
//           msg3: 'mobile Number Deleted Successfully'
//         }, res)
//       })

//     } else {
//       res.redirect('/');
//     }
//   })


      /*  app.post('/smsPerPage', (req, res) => {

            sess = req.session;
            sess.active = 'marketing';

            var perPage = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
            var page = (typeof req.body.page != 'undefined') ? (req.body.page == 0) ? 1 : req.body.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;

            if (typeof sess.user != 'undefined') {

                var data1 = {
                    error: false
                }

                db.collection('marketing').find({}).skip(skip).limit(perPage).toArray((err, smsNo) => {
                    db.collection('marketing').countDocuments((err, numCount) => {
                        for (var i = 0; i < smsNo.length; i++) {

                            link = `http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=123456&mobile=${smsNo[i].mobileNo}&text=HI&senderid=DEMOOO&route_id=1&Unicode=0`
                            _req({
                                "url": link,
                                "json": true,
                                "method": "get"
                            }, (err, httpResponse, body) => {
                                if (err) {
                                    var failedsms = []
                                    failedsms = {
                                        mobile: smsNo[i].mobileNo
                                    }
                                    return true
                                }

                                data1['current'] = page;
                                data1['pages'] = Math.ceil(numCount / perPage);
                                data1['msg'] = '';
                                data1['skip'] = skip;
                                data1['perPage'] = perPage;

                                i--
                                console.log((smsNo.length - i) == smsNo.length, (smsNo.length - i), smsNo.length)
                                if ((smsNo.length - i) == smsNo.length) {
                                    return responseData('marketing.html', {
                                        data1: data,
                                        data: '',
                                        msgs: `opt send successfully to this ${data['current']} Page Number`,
                                        msg: ''
                                    }, res)

                                }
                            })
                        }
                    })
                })
            } else {
                return res.render('/')
            }
        })*/




/*app.post('/smsPerPage', (req, res) => {

            sess = req.session;
            sess.active = 'marketing';

            var perPage = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
            var page = (typeof req.body.page != 'undefined') ? (req.body.page == 0) ? 1 : req.body.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;

            if (typeof sess.user != 'undefined') {

                var data2 = {
                    error: false
                }

                db.collection('marketing').find({}).skip(skip).limit(perPage).toArray((err, smsNo) => {
                    db.collection('marketing').countDocuments((err, numCount) => {
                        for (var i = 0; i < smsNo.length; i++) {

                            link = `http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=123456&mobile=${smsNo[i].mobileNo}&text=${req.body.text}&senderid=SSVLTE&route_id=1&Unicode=0`
                            _req({
                                "url": link,
                                "json": true,
                                "method": "get"
                            }, (err, httpResponse, body) => {
                                if (err) {
                                    var failedsms = []
                                    failedsms = {
                                        mobile: smsNo[i].mobileNo
                                    }
                                    return true
                                }

                                data2['current'] = page;
                                data2['pages'] = Math.ceil(numCount / perPage);
                                data2['msg'] = '';
                                data2['skip'] = skip;
                                data2['perPage'] = perPage;

                                i--
                                console.log((smsNo.length - i) == smsNo.length, (smsNo.length - i), smsNo.length)
                                if ((smsNo.length - i) == smsNo.length) {
                                    return responseData('marketing.html', {
                                        data1: data2,
                                        data: '',
                                        msgs: `opt send successfully to this ${data2['current']} Page Number`,
                                        msg: '',
                                        msg3: ''
                                    }, res)

                                }
                            })
                        }
                    })
                })
            } else {
            return res.render('/')
          }
        })*/


//        app.post('/smsPerPage', (req, res) => {

//     sess = req.session;
//     sess.active = 'marketing';

//     var perPage = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
//     var page = (typeof req.body.page != 'undefined') ? (req.body.page == 0) ? 1 : req.body.page || 1 : 1;
//     var skip = (perPage * page) - perPage;
//     var limit = "LIMIT " + skip + ", " + perPage;

//     if (typeof sess.user != 'undefined') {

//       var data2 = {
//         error: false
//       }

//       var data = {
//         error: false
//       }

//       db.collection('marketing').find({}).skip(skip).limit(perPage).toArray((err, smsNo) => {
//         db.collection('marketing').countDocuments((err, numCount) => {

//           var smsNumber = []
//           for (var i = 0; i < smsNo.length; i++) {
//             smsNumber.push(smsNo[i].mobileNo)
//           }

//           link = `http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=123456&mobile=${smsNumber}&text=${req.body.text}&senderid=SSVLTE&route_id=1&Unicode=0`
//           console.log(link)
//           _req({
//             "url": link,
//             "json": true,
//             "method": "get"
//           }, (err, httpResponse, body) => {

//             data2['current'] = page;
//             data2['pages'] = Math.ceil(numCount / perPage);
//             data2['msg'] = '';
//             data2['skip'] = skip;
//             data2['perPage'] = perPage;

//             if (err) {
//               return responseData('marketing.html', {
//                 data1: data2,
//                 data: '',
//                 msgs: `Something Going Wrong`,
//                 msg: '',
//                 msg3: '',
//                 smsdata: ''
//               }, res)
//             }

//             return responseData('marketing.html', {
//               data1: data2,
//               data: '',
//               msgs: `otp send successfully to this ${data2['current']} Page Number`,
//               msg: '',
//               msg3: '',
//               smsdata: ''
//             }, res)

//           })
//         })
//       })
//     } else {
//       return res.render('/')
//     }
//   })

/*  function callbeforeTime(req, res) {
            sess = req.session;
            sess.active = 'marketing';

            var perPage = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
            var page = (typeof req.body.page != 'undefined') ? (req.body.page == 0) ? 1 : parseInt(req.body.page) || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            removetimes = setInterval(() => {
                if (typeof sess.user != 'undefined') {

                    var data2 = {
                        error: false
                    }

                    var data = {
                        error: false
                    }

                    db.collection('marketing').find({}).skip(skip).limit(perPage).toArray((err, smsNo) => {
                        db.collection('marketing').countDocuments((err, numCount) => {

                            var smsNumber = []
                            for (var i = 0; i < smsNo.length; i++) {
                                smsNumber.push(smsNo[i].mobileNo)
                            }

                            if (smsNo.length == 0) {
                                clearTimeout(removetimes)
                            }

                            console.log(smsNo)

                            link = `http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=123456&mobile=${smsNumber}&text=${req.body.text}&senderid=SSVLTE&route_id=1&Unicode=0`
                            _req({
                                "url": link,
                                "json": true,
                                "method": "get"
                            }, (err, httpResponse, body) => {
                                return
                            })

                            page = page + 1;
                            skip = (perPage * page) - perPage;
                        })
                    })
                } else {
                    return res.render('/')
                }
            }, parseInt(req.body.second)*1000)
        }

        app.post('/autoSMS', (req, res) => {
            callbeforeTime(req, res)
            return res.redirect('/marketing')
        })

        function stopLiveSMS() {
          clearTimeout(removetimes)
        }
        app.post('/stopSMS', (req, res) => {
            stopLiveSMS()
            return res.redirect('/marketing')
        })*/




      /*  var perPagesms
        var pagesms = 1;
        var skipsms = (perPagesms * pagesms) - perPagesms;

        function callbeforeTime(req, res) {
            sess = req.session;
            sess.active = 'marketing';

            var perPagesms = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;

            removetimes = setInterval(() => {
                if (typeof sess.user != 'undefined') {

                    var data2 = {
                        error: false
                    }

                    var data = {
                        error: false
                    }

                    db.collection('marketing').find({}).skip(skipsms).limit(perPagesms).toArray((err, smsNo) => {
                        db.collection('marketing').countDocuments((err, numCount) => {

                            var smsNumber = []
                            for (var i = 0; i < smsNo.length; i++) {
                                smsNumber.push(smsNo[i].mobileNo)
                            }

                            if (smsNo.length == 0) {
                                perPagesms = 1; pagesms = 1; skipsms = (perPagesms * pagesms) - perPagesms;
                                clearTimeout(removetimes)
                            }

                            link = `http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=123456&mobile=${smsNumber}&text=${req.body.text}&senderid=SSVLTE&route_id=1&Unicode=0`
                            _req({
                                "url": link,
                                "json": true,
                                "method": "get"
                            }, (err, httpResponse, body) => {
                                return
                            })

                            pagesms = pagesms + 1;
                            skipsms = (perPagesms * pagesms) - perPagesms;
                        })
                    })
                } else {
                    return res.render('/')
                }
            }, parseInt(req.body.second)*1000)
        }

        app.post('/autoSMS', (req, res) => {
            callbeforeTime(req, res)
            return res.redirect('/marketing')
        })

        function stopLiveSMS() {
            clearTimeout(removetimes)
        }
          
        app.post('/stopSMS', (req, res) => {
            stopLiveSMS()
            var smsstoppages = {
                page: pagesms,
                skip: skipsms
            }
            responseData('marketing.html', {
                data1: '',
                data: '',
                msgs: '',
                msg: '',
                msg3: '',
                smsdata: smsstoppages
              }, res)
            perPagesms = 1; pagesms = 1; skipsms = (perPagesms * pagesms) - perPagesms;
        })*/


       /* var perPagesms;
        var pagesms;
        var skipsms = (perPagesms * pagesms) - perPagesms;

        function callbeforeTime(req, res) {
            sess = req.session;
            sess.active = 'marketing';

            perPagesms = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
            pagesms = (typeof req.body.startpage != 'undefined') ? (req.body.startpage == 0) ? 1 : parseInt(req.body.startpage) || 1 : 1;
            removetimes = setInterval(() => {
                if (typeof sess.user != 'undefined') {

                    var data2 = {
                        error: false
                    }

                    var data = {
                        error: false
                    }

                    db.collection('marketing').find({}).skip(skipsms).limit(perPagesms).toArray((err, smsNo) => {
                        db.collection('marketing').countDocuments((err, numCount) => {

                            var smsNumber = []
                            for (var i = 0; i < smsNo.length; i++) {
                                smsNumber.push(smsNo[i].mobileNo)
                            }

                            if (smsNo.length == 0) {
                                perPagesms = 1; pagesms = 1; skipsms = (perPagesms * pagesms) - perPagesms;
                                clearTimeout(removetimes)
                            }

                            if (pagesms == (typeof req.body.lastpage != 'undefined') ? parseInt(req.body.lastpage) : 1000000000000000) {
                                perPagesms = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
                                pagesms = (typeof req.body.startpage != 'undefined') ? (req.body.startpage == 0) ? 1 : parseInt(req.body.startpage) || 1 : 1;
                                clearTimeout(removetimes)
                            }

                            link = `http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=123456&mobile=${smsNumber}&text=${req.body.text}&senderid=SSVLTE&route_id=1&Unicode=0`
                            _req({
                                "url": link,
                                "json": true,
                                "method": "get"
                            }, (err, httpResponse, body) => {
                                return
                            })

                            pagesms = pagesms + 1;
                            skipsms = (perPagesms * pagesms) - perPagesms;
                        })
                    })
                } else {
                    return res.render('/')
                }
            }, parseInt(req.body.second) * 1000)
        }*/

        // var perPagesms;
        // var pagesms;
        // var skipsms;

        // function callbeforeTime(req, res) {
        //     sess = req.session;
        //     sess.active = 'marketing';

        //     perPagesms = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
        //     pagesms = (typeof req.body.startpage != 'undefined') ? (req.body.startpage == 0) ? 1 : parseInt(req.body.startpage) || 1 : 1;
        //     skipsms = (perPagesms * pagesms) - perPagesms;
            
        //     removetimes = setInterval(() => {
        //         if (typeof sess.user != 'undefined') {
                    
        //             db.collection('marketing').find({}).skip(skipsms).limit(perPagesms).toArray((err, smsNo) => {
        //                 db.collection('marketing').countDocuments((err, numCount) => {
        //                     var smsNumber = []
        //                     for (var i = 0; i < smsNo.length; i++) {
        //                         smsNumber.push(smsNo[i].mobileNo)
        //                     }
        //                     if (smsNo.length == 0) {
        //                         perPagesms = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
        //                         pagesms = (typeof req.body.startpage != 'undefined') ? (req.body.startpage == 0) ? 1 : parseInt(req.body.startpage) || 1 : 1;
        //                         return clearTimeout(removetimes)
        //                     }
        //                     if(((typeof req.body.lastpage != 'undefined') ? parseInt(req.body.lastpage) : 10000000000000000) == pagesms) {
        //                         perPagesms = (typeof sess.smsPerPage != 'undefined') ? parseInt(sess.smsPerPage) : 10;
        //                         pagesms = (typeof req.body.startpage != 'undefined') ? (req.body.startpage == 0) ? 1 : parseInt(req.body.startpage) || 1 : 1;
        //                         clearTimeout(removetimes)
        //                     }
        //                     link = `http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=123456&mobile=${smsNumber}&text=${req.body.text}&senderid=SSVLTE&route_id=1&Unicode=0`
        //                     _req({
        //                         "url": link,
        //                         "json": true,
        //                         "method": "get"
        //                     }, (err, httpResponse, body) => {
        //                         console.log(link)
        //                         pagesms = pagesms + 1;
        //                         skipsms = (perPagesms * pagesms) - perPagesms;
        //                         return
        //                     })

        //                 })
        //             })
        //         } else {
        //             return res.render('/')
        //         }
        //     }, parseInt(req.body.second) * 1000)
        // }

        // app.post('/autoSMS', (req, res) => {
        //     callbeforeTime(req, res)
        //     return res.redirect('/marketing')
        // })

        // function stopLiveSMS() {
        //     clearTimeout(removetimes)
        // }

        // app.post('/stopSMS', (req, res) => {
        //     stopLiveSMS()
        //     var smsstoppages = {
        //         page: pagesms,
        //         skip: skipsms
        //     }
        //     responseData('marketing.html', {
        //         data1: '',
        //         data: '',
        //         msgs: '',
        //         msg: '',
        //         msg3: '',
        //         smsdata: smsstoppages
        //     }, res)
        //     perPagesms = 1; pagesms = 1; skipsms = (perPagesms * pagesms) - perPagesms;
        // })

});
