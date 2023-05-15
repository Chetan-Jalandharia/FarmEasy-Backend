const mongoose = require('mongoose')

const commoditySchema = new mongoose.Schema({

    commodityImage: { type: String, default: "", required: true },
    imgPath: { type: String, default: "", required: true },
    commodityName: { type: String, default: "", required: true },
    commodityDescription: { type: String, default: "" },
    commodityDetails: { type: String, default: "" },
    commodityPrice: { type: Number, default: 0, required: true },
    commodityWeight: { type: Number, default: 1, },
    commodityQuantity: { type: Number, default: 1, required: true },
    commodityCategory: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "commodityCategory", required: true },

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

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }

})


module.exports = mongoose.model("Commodity", commoditySchema)
