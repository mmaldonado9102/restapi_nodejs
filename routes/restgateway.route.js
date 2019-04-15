const express = require('express');
const router = express.Router();

// Require the controllers
const gateway_controller = require('../controllers/gateway.controller');
const peripheraldevice_controller = require('../controllers/peripheraldevice.controller');


router.get('/gateway/list', gateway_controller.gateway_list);
router.post('/gateway/create', gateway_controller.gateway_create);
//router.post('/gateway/create', gateway_controller.validated('gateway_create'),gateway_controller.gateway_create);
router.get('/gateway/view/:id', gateway_controller.gateway_details);
router.put('/gateway/update/:id', gateway_controller.gateway_update);
router.delete('/gateway/delete/:id', gateway_controller.gateway_delete);


router.get('/device/list', peripheraldevice_controller.peripheraldevice_list);
router.post('/device/create', peripheraldevice_controller.peripheraldevice_create);
router.get('/device/view/:id', peripheraldevice_controller.peripheraldevice_details);
router.put('/device/update/:id', peripheraldevice_controller.peripheraldevice_update);
router.delete('/device/delete/:id', peripheraldevice_controller.peripheraldevice_delete);


router.post('/device/add-gateway', peripheraldevice_controller.peripheraldevice_add_gateway);
router.put('/device/remove-gateway/:id', peripheraldevice_controller.peripheraldevice_remove_gateway);

module.exports = router;
