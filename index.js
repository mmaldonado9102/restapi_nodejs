const express = require('express');
const mongodb = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const gateway_route = require('./routes/restgateway.route');
const app = express();
// var port = process.env.PORT || 3001;


// Connect to the db
mongodb.connect('mongodb://localhost:27017/gatewaybd', { useNewUrlParser: true })
mongodb.connection.on('error', (err) => {
    process.exit(-1)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator())
app.use('/restcallback', gateway_route);
app.use(function (req, res) {
    res.status(404).send({ code: 404, url: req.originalUrl + ' not found!!!' })
});
module.exports = app;
// app.listen(port);
// console.log('Server is up and running on port number ' + port);
