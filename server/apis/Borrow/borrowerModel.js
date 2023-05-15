const mongoose = require('mongoose')

let borrowSchema = new mongoose.Schema({

    borrowerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "Product" },

    borrowDuration: { type: Number, default: 0 },

    startDate: { type: Date },
    endDate: { type: Date },

    isAccepted: { type: Boolean, default: false },
    isrejected: { type: Boolean, default: false },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },

})

module.exports = mongoose.model('Borrow', borrowSchema)       