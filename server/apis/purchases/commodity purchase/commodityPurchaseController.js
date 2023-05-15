const nodeMailer = require('nodemailer')

const users=require('../../users/userModel')
const purchases = require('./commodityPurchaseModel')
const products = require('../../products/productModel')
const commodities = require('../../commodities/commodityModel')

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

exports.sendCommodityPurchaseRequest = async (req, res) => {

    try {
        const { commodityId,quantity } = req.body

        let commodity = await commodities.findOne({ _id: commodityId })
        let owner = commodity.userId
        let ownerData=await users.findOne({_id:owner})
        // console.log(ownerEmail.email);
        const newRequest = new purchases()

        newRequest.buyerId = req.decoded.userId
        newRequest.sellerId = owner
        newRequest.commodityId = commodityId
        newRequest.quantity = quantity
                // console.log(commodity.price);
        newRequest.price = parseInt(commodity.commodityPrice)*parseInt(quantity)

        newRequest.save()
            .then(value => {
                sendMail(value._id, ownerData.email)
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



exports.showCommodityPurchaseRequest = async (req, res) => {
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


exports.showAllCommodityPurchaseRequests = async (req, res) => {

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


exports.acceptCommodityPurchaseRequests = async (req, res) => {
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

exports.rejectCommodityPurchaseRequests = async (req, res) => {
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


exports.showSelledCommodity=(req,res)=>{
    purchases.find({ sellerId:req.decoded.userId })
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

exports.showBuyedCommodity=(req,res)=>{
    purchases.find({ buyerId:req.decoded.userId })
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