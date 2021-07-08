var controller = module.exports = require('../controller/api.js');

module.exports = {

    myapi: () => {

        app.post('/'+verson+'/coin',            controller.coin)
        app.post('/'+verson+'/withdrow',        controller.withdrow)

        schedule.scheduleJob('* 0 0 * * *', () => { // call every 12am mid-night
            db.collection('user').updateMany({}, {$set: {scratchleft: leftCount, spinnerleft: leftCount}})
        })

    }
    
}