const mongoose = require('mongoose')

let orderIssueSchema = new mongoose.Schema({

    productorderId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "productPurchase" },
    commodityorderId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "commodityPurchase" },
    buyerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },

    isIssuedBySeller: { type: Boolean, default: false },
    isIssuedByBuyer: { type: Boolean, default: false },

    issueDetails: { type: String, default: "", required: true },
    isSolved: { type: Boolean, default: false },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },

})

module.exports = mongoose.model('OrderIssue', orderIssueSchema)