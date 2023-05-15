const mongoose = require('mongoose')

let commidityCategorySchema = new mongoose.Schema({

    categoryImage: { type: String, default: "", required: true },
    imgPath: { type: String, default: "", required: true },
    categoryName: { type: String, default: "", unique: true, required: true },
    categoryDesc: { type: String, default: "" },

    addedBy: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },

    updateLogs: [{
        ip: { type: String, default: "" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
        updatedAt: { type: Date, default: Date.now() }
    }],

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },

})

module.exports = mongoose.model('commodityCategory', commidityCategorySchema)       