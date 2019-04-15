const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GatewaySchema = new Schema({
    serial: { type: String, required: true, max: 200 },
    name: { type: String, required: true, max: 200 },
    ipv4_address: { type: String, required: true, max: 200 },
});


// Export the model
module.exports = mongoose.model('Gateway', GatewaySchema);
