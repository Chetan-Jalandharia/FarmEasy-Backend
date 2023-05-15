const issues = require('./issueModel')
const productBorrows = require('../Borrow/borrowerModel')

exports.raiseIssue = async (req, res) => {
    data = req.body
    try {
        let productData = await productBorrows.findOne({ _id: data.orderId })

        const issue = new issues()

        if (productData.borrowerId == req.decoded.userId) {
            issue.isIssuedByBorrower = true
            issue.productId = productData._id
            issue.borrowerId = productData.borrowerId
            issue.ownerId = productData.ownerId
        }
        else {
            issue.isIssuedByOwner = true
            issue.productId = productData._id
            issue.borrowerId = productData.borrowerId
            issue.ownerId = productData.ownerId
        }

        issue.issueDetails = data.issueDetails

        issue.save()

    } catch (error) {-
        res.status(400).json({
            message: "error:" + error
        })
    }
}

exports.showAllIssues = async (req, res) => {

    try {
        let data = await issues.find(req.body)

        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).json({
            message: "error:" + error
        })
    }
}

exports.showIssue = async (req, res) => {
    try {
        let data = await issues.findOne(req.body.id)

        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).json({
            message: "error:" + error
        })
    }
}

exports.updateIssue = (req, res) => {
    try {
        let data = issues.updateOne({ _id: req.body.id }, { issueDetails: req.body.details })
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).json({
            message: "error:" + error
        })
    }
}

exports.solveIssue = (req, res) => {
    try {
        let data = issues.updateOne({ _id: req.body.id }, { isSolved: true })
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).json({
            message: "error:" + error
        })
    }
}