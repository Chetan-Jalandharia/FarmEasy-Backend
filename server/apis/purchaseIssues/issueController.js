const issues = require('./issueModel')
const commodityorders = require('../purchases/commodity purchase/commodityPurchaseModel')
const productorders = require('../purchases/product purchase/productPurchaseModel')

exports.raiseIssue = async (req, res) => {
    data = req.body
    try {
        let commodityData = await commodityorders.findOne({ _id: data.orderId })
        let productData = await productorders.findOne({ _id: data.orderId })

        const issue = new issues()

        if (commodityData) {
            if (commodityData.buyerId == req.decoded.userId) {
                issue.isIssuedByBuyer = true
                issue.commodityorderId = commodityData._id
                issue.buyerId = commodityData.buyerId
                issue.sellerId = commodityData.sellerId
            }
            else {
                issue.isIssuedBySeller = true
                issue.commodityorderId = commodityData._id
                issue.buyerId = commodityData.buyerId
                issue.sellerId = commodityData.sellerId
            }
        }
        else {

            if (productData.buyerId == req.decoded.userId) {
                issue.isIssuedByBuyer = true
                issue.productorderId = productData._id
                issue.buyerId = productData.buyerId
                issue.sellerId = productData.sellerId
            }
            else {
                issue.isIssuedBySeller = true
                issue.productorderId = productData._id
                issue.buyerId = productData.buyerId
                issue.sellerId = productData.sellerId
            }
        }

        issue.issueDetails = data.issueDetails

        issue.save()

    } catch (error) {
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