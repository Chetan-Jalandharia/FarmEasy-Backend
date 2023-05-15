const nodeMailer = require('nodemailer')
const borrow = require('./borrowerModel')
const products = require('../products/productModel')
const users = require('../users/userModel')

const sendMail = (id, email) => {
    let transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    })
    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'FarmEasy New Borrow Request',

        html: `<a href="http://localhost:3000/customer/showborrowrequest?id=${id}">Show Request</a>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendBorrowRequest = async (req, res) => {
    // console.log(req.body);
    try {
        const { productId, startDate, endDate } = req.body
        // console.log(productId);
        let product = await products.findOne({ _id: productId })
        // console.log(product);
        let owner = product.userId
        let ownerData = await users.findOne({ _id: owner })
        const newRequest = new borrow()

        newRequest.borrowerId = req.decoded.userId
        newRequest.ownerId = owner
        newRequest.productId = productId
        newRequest.borrowDuration = Math.floor((Date.parse(endDate) - Date.parse(startDate)) / (1000 * 60 * 60 * 24))
        newRequest.startDate = new Date(startDate)
        newRequest.endDate = new Date(endDate)

        newRequest.save()
            .then(value => {
                sendMail(value._id, ownerData.email)
                res.json({
                    success: true,
                    status: 200,
                    data: value,
                    message:"Request Send Successfully"
                })
            })
            .catch(err => {
                res.json({
                    success: false,
                    status: 400,
                    message: "error:" + err
                })
            })
    } catch (error) {
        res.json({
            success: false,
            status: 400,
            message: "error:" + error
        })
    }


}


exports.showAllBorrowRequests = async (req, res) => {

    try {
        let data = await borrow.find({ $and: [{ ownerId: req.decoded.userId }, { isAccepted: false }] })
        res.status(200).json({
            data
        })
    } catch (error) {
        res.json({
            success: false,
            status: 400,
            message: "error:" + error
        })
    }
}
exports.showAllBorrowRequestSend = async (req, res) => {

    try {
        let data = await borrow.find({ $and: [{ borrowerId: req.decoded.userId }, { isAccepted: false }] })
        res.status(200).json({
            data
        })
    } catch (error) {
        res.json({
            success: false,
            status: 400,
            message: "error:" + error
        })
    }
}

exports.showBorrowRequest = async (req, res) => {
    try {
        let data = await borrow.findOne({ _id: req.query.id })
            .populate({
                path: 'ownerId',
                select: 'name email',
                populate: {
                    path: 'customerId',
                    model: 'Customer',
                    select: 'customerName customerEmail'
                }
            })
        res.status(200).json({
            data
        })
    } catch (error) {
        res.json({
            success: false,
            status: 400,
            message: "error:" + error
        })
    }
}

exports.acceptBorrowRequests = async (req, res) => {
    try {
        let data = await borrow.findOne({ _id: req.body.id })
        data.isAccepted = true
        data.save()

        res.status(200).json({
            data
        })

    } catch (error) {
        res.json({
            success: false,
            status: 400,
            message: "error:" + error
        })
    }
}

exports.rejectBorrowRequests = async (req, res) => {
    try {
        let data = await borrow.findOne({ _id: req.body.id })
        data.isrejected = true
        data.save()

        res.status(200).json({
            data
        })

    } catch (error) {
        res.json({
            success: false,
            status: 400,
            message: "error:" + error
        })
    }
}