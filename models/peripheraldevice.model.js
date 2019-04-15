const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PeripheralDeviceSchema = new Schema({
    uid: { type: String, required: true, max: 100 },
    vendor: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: Boolean, default: false },
    gateway_id: { type: mongoose.ObjectId, required: false },
});


// Export the model
module.exports = mongoose.model('PeripheralDevice', PeripheralDeviceSchema);
