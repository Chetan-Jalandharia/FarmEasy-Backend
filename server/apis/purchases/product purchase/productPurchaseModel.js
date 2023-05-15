const mongoose = require('mongoose')

let productPurchaseSchema = new mongoose.Schema({

    buyerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "Product" },

    isAccepted: { type: Boolean, default: false },
    isrejected: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },

    issueId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "Issue" },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }

})

module.exports = mongoose.model('productPurchase', productPurchaseSchema)