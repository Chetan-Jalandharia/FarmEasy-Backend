const borrows = require('../Borrow/borrowerModel')
const issues = require('./issueModel')



exports.raiseIssue = async (req, res) => {
    data = req.body
    try {
        let borrowData = await borrows.findOne({ _id: data.orderId })
    

        const issue = new issues()

        if (borrowData) {
            if (commodityData.ownerId == req.decoded.userId) {
                issue.isIssuedByOwner = true
                issue.productBorrowId = borrowData._id
                issue.ownerId = borrowData.ownerId
                issue.borrowerId = borrowData.borrowerId
            }
            else {
                issue.isIssuedByBorrower = true
                issue.productBorrowId = borrowData._id
                issue.ownerId = borrowData.ownerId
                issue.borrowerId = borrowData.borrowerId
            }
            
        issue.issueDetails = data.issueDetails
        issue.save()
        }
       
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