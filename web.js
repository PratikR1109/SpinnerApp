var express        = require('express')
    http           = require('http')
    ejs            = require('ejs')
    path           = require('path')
    fs             = require('fs')
    bodyParser     = require('body-parser')
    bcrypt         = require('bcryptjs')
    MongoClient    = require('mongodb').MongoClient
    objectId       = require('mongodb').ObjectID
    fileUpload     = require('express-fileupload')
    uniqid         = require('randomatic'),
    assets         = require('assert')
    _date          = require('moment')
    schedule       = require('node-schedule')
    app            = express()
    config         = require('./config/config.json')
    saltRounds     = 10
    verson         = config.verson
    port           = config.port
    dbName         = config.mongodb.dbname
    leftCount      = module.exports = 10
    dailywinCount  = module.exports = 1
    RestApi        = module.exports = require('./model/model.js')
    // url            = 'mongodb://'+config.mongodb.username+':'+config.mongodb.password+'@'+config.mongodb.host+':'+config.mongodb.port+'/'+config.mongodb.dbname
    // BaseUrl        = 'http://'+config.mongodb.host +':'+ config.port +'/'+ config.verson
    url              = 'mongodb://localhost:27017/spinner'

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())




MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  assets.equal(null, err);
  if (err) throw err;
  db = module.exports = client.db(dbName);
  console.log("mongodb is connected with database =", dbName)

  RestApi.myapi();


})


const server = app.listen(port, () => {
  console.log("We Are Live On " + port)
})