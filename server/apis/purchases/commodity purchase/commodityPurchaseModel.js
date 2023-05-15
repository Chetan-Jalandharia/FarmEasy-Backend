const mongoose = require('mongoose')

let commodityPurchaseSchema = new mongoose.Schema({

    buyerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    commodityId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "Commodity" },

    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 },

    isAccepted: { type: Boolean, default: false },
    isrejected: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },

    issueId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "Issue" },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },

})

module.exports = mongoose.model('commodityPurchase', commodityPurchaseSchema)