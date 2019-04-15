const PeripheralDevice = require('../models/peripheraldevice.model');
const Gateway = require('../models/gateway.model');
var ObjectId = require('mongoose').ObjectId;

exports.peripheraldevice_list = function (req, res) {

    PeripheralDevice.aggregate([
        {
            "$lookup": {
                "from": "gateways",
                "localField": "gateway_id",
                "foreignField": "_id",
                "as": "gateways"
            }
        },
    ]).exec(function (err, results) {
        if (err)
            res.send(err);
        res.json(results);
    })
};

exports.peripheraldevice_create = function (req, res) {


    req.assert('uid', 'Uid is required').notEmpty();
    req.assert('uid', 'Uid is invalid').isInt();
    req.assert('vendor', 'Vendor is required').notEmpty();
    //req.assert('date', 'Date is required').notEmpty();
    req.assert('status', 'Status is required').notEmpty();
    req.assert('status', 'Status is invalid. Valid: 0(offline) or 1(online)').isIn(['0', '1']); //offline/online.
    req.assert('gateway_id', 'gateway_id address is wrong').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(422).json(errors);
        return;
    }
    PeripheralDevice.countDocuments({ gateway_id: req.body.gateway_id }, function (err, count) {
        console.log('There are %d PeripheralDevice whith this gateway.', count);
        if (count == 10) {
            res.status(422).json({ msg: "Not more that 10 peripheral devices are allowed for a gateway." });
            return;
        } else {
            let peripheraldevice = new PeripheralDevice(
                {
                    uid: req.body.uid,
                    vendor: req.body.vendor,
                    date: req.body.date,
                    status: req.body.status,
                    gateway_id: req.body.gateway_id
                }
            );

            peripheraldevice.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.send('PeripheralDevice Created successfully')
            })

        }
    });
};

exports.peripheraldevice_details = function (req, res) {
    PeripheralDevice.findById(req.params.id, function (err, peripheraldevice) {
        if (err) return next(err);
        res.send(peripheraldevice);
    })
};

exports.peripheraldevice_update = function (req, res) {
    const { uid, vendor, date, status, gateway_id } = req.body

    if (uid != "") {
        req.assert('uid', 'Uid is required').notEmpty();
        req.assert('uid', 'Uid is invalid').isInt();
    } else if (vendor != "") {
        req.assert('vendor', 'Vendor is required').notEmpty();
    } else if (status != "") {
        req.assert('status', 'Status is required').notEmpty();
        req.assert('status', 'Status is invalid. Valid: 0(offline) or 1(online)').isIn(['0', '1']); //offline/online.
    } else if (gateway_id != "") {
        req.assert('gateway_id', 'Gateway ID is required').notEmpty();
    }

    var errors = req.validationErrors();
    if (errors) {
        res.status(422).json(errors);
        return;
    }

    PeripheralDevice.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, peripheraldevice) { 
        if (err) return next(err);
        res.send('PeripheralDevice udpated.');
    });
};

exports.peripheraldevice_delete = function (req, res) {
    PeripheralDevice.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};


exports.peripheraldevice_add_gateway = function (req, res) {
    const { id_gateway, id_peripheraldevices } = req.body

    req.assert('id_gateway', 'Gateway to add is required').notEmpty();
    req.assert('id_peripheraldevices', 'Peripheraldevice is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.status(422).json(errors);
        return;
    }


    PeripheralDevice.find().where('_id').equals(id_peripheraldevices).exec(function (err, result) {
        if (!result) {
            res.status(422).json({ msg: "The Value of id_peripheraldevices is incorrect." });
            return;
        }

        Gateway.find().where('_id').equals(id_gateway).exec(function (err, resultg) {
            if (!resultg) {
                res.status(422).json({ msg: "The Value of id_gateway is incorrect." });
                return;
            }

            PeripheralDevice.findOneAndUpdate({ _id: id_peripheraldevices }, { gateway_id: id_gateway }, function (err, peripheraldevice) { //findOneandUpdate
                if (err) return next(err);
                res.send('Gateway add to Peripheral Device.');
            });

        });

    });

}


exports.peripheraldevice_remove_gateway = function (req, res) {


    const { id } = req.params

    if (id != "") {
        req.assert('id', 'id_device is required').notEmpty();
    }

    var errors = req.validationErrors();
    if (errors) {
        res.status(422).json(errors);
        return;
    }


    PeripheralDevice.find().where('_id').equals(id).exec(function (err, result) {
        if (!result) {
            res.status(422).json({ msg: "The Value of id device is incorrect." });
            return;
        }

        PeripheralDevice.findByIdAndUpdate(id, {  $set: { gateway_id: null} }, function (err, peripheraldevice) { //findOneandUpdate
            if (err) return res.send(err);
            res.send('Remove gateway from Peripheral Device.');
        });

    });

}