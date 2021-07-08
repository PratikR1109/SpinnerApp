exports.coin = (req, res) => {

    db.collection('user').findOne({ DeviceId: req.body.DeviceId }, (err, result) => {
        if (!err) {
            if (!req.body.DeviceId) {
                return res.send({ error: 'Y', coin: 0, dueCount: 0, msg: 'Device Id Must Be Required' })
            }

            if (isNaN(req.body.coin)) {
                return res.send({ error: 'Y', coin: 0, dueCount: 0, msg: 'Coin Is Required In Intiger' })
            } else {

                if (req.body.coin == '') {
                    return res.send({ error: 'Y', coin: 0, dueCount: 0, msg: 'Coin is Not Blank' })
                } else {
                    var myCoin = +parseInt(req.body.coin)
                }

            }

            if (result) {

                if (req.body.type == 'spinner') {

                    if (result.spinnerleft > 0 && result.spinnerleft <= leftCount) {

                        db.collection('user').updateOne({ DeviceId: req.body.DeviceId, }, { $inc: { coin: myCoin, spinnerleft: -1 } }, (e, mydata) => {
                            if (!e) {
                                db.collection('user').findOne({ DeviceId: req.body.DeviceId }, (err, uCoin) => {
                                    return res.send({ error: 'N', msg: '', coin: uCoin.coin, dueCount: uCoin.spinnerleft })
                                })
                            } else {
                                return res.send({ error: 'Y', msg: 'Something Going Wrong', coin: 0, dueCount: 0 })
                            }
                        })

                    } else {
                        return res.send({ error: 'N', msg: '1', coin: 0, dueCount: 0 })
                    }

                } else if (req.body.type == 'scratch') {

                    if (result.scratchleft > 0 && result.scratchleft <= leftCount) {

                        db.collection('user').updateOne({ DeviceId: req.body.DeviceId, }, { $inc: { coin: myCoin, scratchleft: -1 } }, (e, mydata) => {
                            if (!e) {
                                db.collection('user').findOne({ DeviceId: req.body.DeviceId }, (err, uCoin) => {
                                    return res.send({ error: 'N', msg: '', coin: uCoin.coin, dueCount: uCoin.scratchleft })
                                })
                            } else {
                                return res.send({ error: 'Y', msg: 'Something Going Wrong', coin: 0, dueCount: 0 })
                            }
                        })

                    } else {
                        return res.send({ error: 'N', msg: '1', coin: 0, dueCount: 0 })
                    }

                } else if (req.body.type == 'dailywin'){

                    if (result.dailywinleft > 0 && result.dailywinleft <= dailywinCount) {

                        db.collection('user').updateOne({ DeviceId: req.body.DeviceId }, { $inc: { coin: myCoin, dailywinleft: -1 } }, (e, mydata) => {
                            if (!e) {
                                db.collection('user').findOne({ DeviceId: req.body.DeviceId }, (err, uCoin) => {
                                    return res.send({ error: 'N', msg: '', coin: uCoin.coin, dueCount: uCoin.dailywinleft })
                                })
                            } else {
                                return res.send({ error: 'Y', msg: 'Something Going Wrong', coin: 0, dueCount: 0 })
                            }
                        })

                    } else {
                        return res.send({ error: 'N', msg: '1', coin: 0, dueCount: 0 })
                    }

                } else {

                    return res.send({ error: 'Y', msg: 'Something Going Wrong', coin: 0, dueCount: 0 })

                }

            } else {

                var newData = {
                    DeviceId: req.body.DeviceId,
                    coin: myCoin,
                    spinnerleft: leftCount,
                    scratchleft: leftCount,
                    dailywinleft: dailywinCount,
                    date: new Date()
                }

                if (req.body.type == 'spinner') {
                    newData.spinnerleft = leftCount - 1
                } else if (req.body.type == 'scratch') {
                    newData.scratchleft = leftCount - 1
                } else if (req.body.type == 'dailywin') {
                    newData.dailywinleft = dailywinCount - 1
                }

                db.collection('user').insertOne(newData, (errs, response) => {
                    if (req.body.type == 'dailywin') {
                        return res.send({ error: 'N', msg: '', coin: myCoin, dueCount: dailywinCount - 1 })
                    } else {
                        return res.send({ error: 'N', msg: '', coin: myCoin, dueCount: leftCount - 1 })
                    }
                })

            }
        } else {

            return res.send({ error: 'Y', msg: 'Something Going Wrong', coin: 0, dueCount: 0 })

        }
    })
}

exports.withdrow = (req, res) => {
    var data = req.body
    if (data.DeviceId || data.email || data.mobile || data.coin) {
        db.collection('user').findOne({ DeviceId: data.DeviceId }, (err, exituser) => {
            if (exituser) {

                if (data.coin > 0 && data.coin <= exituser.coin) {

                    if (req.body.type == 'paytm') {
                        var mydata = {
                            DeviceId: data.DeviceId,
                            email: data.email,
                            mobile: data.mobile,
                            coin: data.coin,
                            amount: data.coin / 1000,
                            Status: 0,
                            TxnID: uniqid('Aa0', 12),
                            type: 'paytm',
                            date: new Date()
                        }
                        db.collection('withdrow').insertOne(mydata, (e, data) => {
                            db.collection('user').updateOne({ DeviceId: req.body.DeviceId }, { $inc: { coin: -parseInt(req.body.coin) } }, (er, mydata) => {
                                return res.send({ error: 'N', msg: 'success', data: [] })
                            })
                        })
                    } else if (req.body.type == 'paypal') {
                        var mydata = {
                            DeviceId: data.DeviceId,
                            email: data.email,
                            mobile: data.mobile,
                            coin: data.coin,
                            amount: data.coin / 1000,
                            Status: 0,
                            TxnID: uniqid('Aa0', 12),
                            type: 'paypal',
                            date: new Date()
                        }
                        db.collection('withdrow').insertOne(mydata, (e, data) => {
                            db.collection('user').updateOne({ DeviceId: req.body.DeviceId }, { $inc: { coin: -parseInt(req.body.coin) } }, (er, mydata) => {
                                return res.send({ error: 'N', msg: 'success', data: [] })
                            })
                        })
                    } else if (req.body.type == 'bank') {
                        var mydata = {
                            DeviceId: data.DeviceId,
                            ACHoldername: data.ACHoldername,
                            ACnumber: data.ACnumber,
                            ifsc: data.ifsc,
                            coin: data.coin,
                            amount: data.coin / 1000,
                            Status: 0,
                            TxnID: uniqid('Aa0', 12),
                            type: 'bank',
                            date: new Date()
                        }
                        db.collection('withdrow').insertOne(mydata, (e, data) => {
                            db.collection('user').updateOne({ DeviceId: req.body.DeviceId }, { $inc: { coin: -parseInt(req.body.coin) } }, (er, mydata) => {
                                return res.send({ error: 'N', msg: 'success', data: [] })
                            })
                        })
                    } else {
                        return res.send({ error: 'Y', msg: 'Something going Wrong', data: [] })
                    }

                } else {
                    return res.send({ error: 'Y', msg: 'Infisuunt coin', data: [] })
                }
            } else {
                return res.send({ error: 'Y', msg: 'User Not Found', data: [] })
            }
        })
    } else {
        return res.send({ error: 'Y', msg: 'fillup all detail', data: [] })
    }
}