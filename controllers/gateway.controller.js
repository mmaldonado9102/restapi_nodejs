const Gateway = require('../models/gateway.model');

exports.gateway_list = function (req, res) {
    Gateway.aggregate([
        {
            "$lookup": {
                "from": "peripheraldevices",
                "localField": "_id",
                "foreignField": "gateway_id",
                "as": "peripheraldevices"
            }
        },
    ]).exec(function (err, results) {
        if (err)
            res.send(err);
        res.json(results);
    })
};

exports.gateway_create = function (req, res) {
    const { serial, name, ipv4_address } = req.body
    req.assert('serial', 'Serial is required').notEmpty();
    //req.assert('serial','Enter a serial 6 - 20').len(6,20);
    req.assert('name', 'A valid name is required').notEmpty();
    req.assert('ipv4_address', 'Ipv4 address is required').notEmpty();
    req.assert('ipv4_address', 'Ipv4 address is wrong').isIP(4);
    var errors = req.validationErrors();
    if (errors) {
        res.status(422).json(errors);
        return;
    }

    let gateway = new Gateway(
        {
            serial: req.body.serial,
            name: req.body.name,
            ipv4_address: req.body.ipv4_address
        }
    );

    gateway.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Gateway Created successfully')
    })
};

exports.gateway_details = function (req, res) {


    // Gateway.findById(req.params.id).aggregate([
    //     {
    //         "$lookup": {
    //             "from": "peripheraldevices",
    //             "localField": "_id",
    //             "foreignField": "gateway_id",
    //             "as": "peripheraldevices"
    //         }
    //     },
    // ]).exec(function (err, results) {
    //     if (err)
    //         res.send(err);
    //     res.json(results);
    // })

    Gateway.findById(req.params.id, function (err, gateway) {
        if (err) return next(err);
        res.send(gateway);
    })
};

exports.gateway_update = function (req, res) {
    const { serial, name, ipv4_address } = req.body

    if (serial != "") {
        req.assert('serial', 'Serial is required').notEmpty();
    } else if (name != "") {
        req.assert('name', 'A valid name is required').notEmpty();
    } else if (ipv4_address != "") {
        req.assert('ipv4_address', 'Ipv4 address is required').notEmpty();
        req.assert('ipv4_address', 'Ipv4 address is wrong').isIP(4);
    }

    var errors = req.validationErrors();
    if (errors) {
        res.status(422).json(errors);
        return;
    }


    Gateway.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, gateway) { //findOneandUpdate
        if (err) return next(err);
        res.send('Gateway udpated.');
    });
};

exports.gateway_delete = function (req, res) {
    Gateway.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};