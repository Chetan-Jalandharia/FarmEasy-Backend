const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({

    customerImage: { type: String, default: "" },
    imgPath: { type: String, default: "" },
    customerName: { type: String, default: "", required: true },
    customerEmail: { type: String, default: "", unique: true, required: true },
    customerPhone: { type: Number, default: 0, required: true },
    customerAddress: [{
        state: { type: String, default: "" },
        city: { type: String, default: "" },
        street: { type: String, default: "" },
        landmark: { type: String, default: "" },
        pincode: { type: Number, default: 0 },
        district: { type: String, default: "" }
    }],


    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },

    addedBy: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" }

})

module.exports = mongoose.model('Customer', customerSchema)