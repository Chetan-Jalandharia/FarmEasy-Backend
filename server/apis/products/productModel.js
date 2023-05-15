const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    productImage: { type: String, default: "", required: true },
    imgPath: { type: String, default: "", required: true },
    productName: { type: String, default: "", required: true },
    productDescription: { type: String, default: "" },
    productPrice: { type: Number, default: 0, required: true },
    productType: { type: String, default: "", required: true },
    productCategory: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "Category", required: true },

    isRent: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },

    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },

    isAddedByAdmin: { type: Boolean, default: false },
    isAddedByCustomer: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },

    updateLogs: [{
        ip: { type: String, default: "" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
        updatedAt: { type: Date, default: Date.now() }
    }],

    usageGuide: { type: String, default: "www.youtube.com" },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }

})


module.exports = mongoose.model("Product", productSchema)
