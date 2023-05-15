const nodeMailer = require('nodemailer')

const users = require('../../users/userModel')
const purchases = require('./productPurchaseModel')
const products = require('../../products/productModel')


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
        subject: 'FarmEasy New Purchase Request',

        html: `<a href="http://localhost:3000/customer/showpurchaserequest?id=${id}">Show Request</a>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendProductPurchaseRequest = async (req, res) => {

    try {
        const { productId } = req.body
        // console.log(productId);
        let product = await products.findOne({ _id: productId })
        let owner = product.userId
        let ownerData = await users.findOne({ _id: owner })
        const newRequest = new purchases()

        newRequest.buyerId = req.decoded.userId
        newRequest.sellerId = owner
        newRequest.productId = productId

        newRequest.save()
            .then(value => {
                sendMail(value._id, ownerData.email)
                res.json({
                    success: true,
                    status: 200,
                    data: value,
                    message: "Request Send Successfully"
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

exports.showProductPurchaseRequest = async (req, res) => {
    try {
        let data = await purchases.findOne({ _id: req.query.id })
            .populate({
                path: 'sellerId',
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

exports.showAllProductPurchaseRequests = async (req, res) => {

    console.log(req.decoded);
    try {
        let data = await purchases.find({ $and: [{ sellerId: req.decoded.userId }, { isAccepted: false }] })
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
exports.showAllProductPurchaseRequestsend = async (req, res) => {

    console.log(req.decoded);
    try {
        let data = await purchases.find({ $and: [{ buyerId: req.decoded.userId }, { isAccepted: false }] })
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

exports.acceptProductPurchaseRequest = async (req, res) => {
    try {
        let data = await purchases.findOne({ _id: req.body.id })
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

exports.rejectProductPurchaseRequest = async (req, res) => {
    try {
        let data = await purchases.findOne({ _id: req.body.id })
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

exports.showSelledProducts = (req, res) => {
    purchases.find({ $and: [{ sellerId: req.decoded.userId }, { isAccepted: true }] })
        .then(value => {
            res.json({
                success: true,
                status: 200,
                data: value
            })
        })
        .catch(err => {
            res.json({
                success: false,
                status: 400,
                message: "error :" + err
            })
        })
}


exports.showBuyedProducts = (req, res) => {
    purchases.find({ buyerId: req.decoded.userId })
        .then(value => {
            res.json({
                success: true,
                status: 200,
                data: value
            })
        })
        .catch(err => {
            res.json({
                success: false,
                status: 400,
                message: "error :" + err
            })
        })
}

