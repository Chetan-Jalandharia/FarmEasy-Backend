const mongoose = require('mongoose')

let productBorrowIssueSchema = new mongoose.Schema({

    productId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "Product" },
    borrowerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },

    isIssuedByOwner: { type: Boolean, default: false },
    isIssuedByBorrower: { type: Boolean, default: false },

    issueDetails: { type: String, default: "", required: true },
    isSolved: { type: Boolean, default: false },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },

})

module.exports = mongoose.model('BorrowIssue', productBorrowIssueSchema)