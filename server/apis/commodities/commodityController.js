const fs = require('fs')

const path = require('path')
const ref = require('firebase/storage').ref
const storage = require('../../config/firebase')
const uploadBytes = require('firebase/storage').uploadBytes
const getURL = require('firebase/storage').getDownloadURL

const commodity = require('./commodityModel')
const borrows = require('../Borrow/borrowerModel')
const { deleteObject } = require('firebase/storage')

const replaceImage = async (imgBuffer, imgName) => {
    const imgRef = ref(storage, `Commodity/${imgName}`)
    const imgData = await uploadBytes(imgRef, imgBuffer)
    const filePath = await getURL(imgData.ref)
    return filePath;
}


exports.addcommodity = async (req, res) => {
    let data = req.body;
    const image = req.file.buffer
    const imgName = `Image_${Date.now()}${path.extname(req.file.originalname)}`;

    const imgRef = ref(storage, `Commodity/${imgName}`)
    const imgData = await uploadBytes(imgRef, image)
    const filePath = await getURL(imgData.ref)

    try {
        let newcommodity = new commodity()
        newcommodity.commodityImage = imgName
        newcommodity.imgPath = filePath
        newcommodity.commodityName = data.name
        newcommodity.commodityDescription = data.description
        newcommodity.commodityDetails = data.details
        newcommodity.commodityQuantity = data.quantity
        newcommodity.commodityWeight = data.weight
        newcommodity.commodityPrice = data.price
        newcommodity.usageGuide = data.usageGuide
        newcommodity.commodityCategory = data.category

        if (req.decoded?.isAdmin) {
            newcommodity.isAddedByAdmin = true
            newcommodity.userId = req.decoded?.userId
            newcommodity.isApproved = true
        }
        else {
            newcommodity.isAddedByCustomer = true
            newcommodity.userId = req.decoded?.userId
        }
        newcommodity.save()
            .then(value => {
                if (!value.isApproved) {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "commodity under Review Stage",
                        data: value
                    })
                }
                else {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "commodity added successfully",
                        data: value
                    })
                }
            })
    } catch (error) {
        deleteImage(req.file?.path)
        res.status(400).json({
            success: false,
            status: 400,
            message: "error :" + error
        })
    }
}

exports.updatecommodity = (req, res) => {
    const image = req?.file?.buffer

    let updatelog = {
        ip: req.body.ip,
        updatedBy: req.decoded.userId
    }
    commodity.findOne({ _id: req.body.id })
        .then(async (value) => {
            let filePath;
            if (image) {
                filePath = await replaceImage(image, value.commodityImage);
            }

            value.imgPath = filePath ?? value?.imgPath
            value.commodityName = req.body.name ?? value.commodityName
            value.commodityDescription = req.body.description ?? value.commodityDescription
            value.commodityDetails = req.body.details ?? value.commodityDetails
            value.commodityQuantity = req.body.quantity ?? value.commodityQuantity
            value.commodityWeight = req.body.weight ?? value.commodityWeight
            value.commodityPrice = req.body.price ?? value.commodityPrice
            value.commodityCategory = req.body.category ?? value.commodityCategory

            value.updateLogs.push(updatelog)

            value.save()
                .then(val => {

                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "commodity updated successfully",
                        data: val
                    })
                }).catch(err => {
                    // deleteImage(newImgPath)
                    res.status(400).json({
                        success: false,
                        status: 400,
                        message: "erroe :" + err,
                    })
                })
        })
        .catch(err => {
            console.log(err);
            // newImgPath ? deleteImage(newImgPath) : null;
            res.json({
                success: false,
                status: 400,
                message: "erroe :" + err,
            })
        })
}

exports.showcommodity = (req, res) => {
    commodity.findOne({ _id: req.params.id })
        .populate("commodityCategory", "categoryName categoryDesc")
        .then(value => {
            res.json({
                sucess: true,
                status: 200,
                data: value
            })
        })
        .catch(err => {
            res.json({
                success: false,
                status: 400,
                data: err
            })
        })
}

exports.showAllcommodity = (req, res) => {
    commodity.find({ isApproved: true })
        .populate("commodityCategory", "categoryName categoryDesc")
        .then(value => {
            res.json({
                sucess: true,
                status: 200,
                data: value
            })
        })
        .catch(err => {
            res.json({
                success: false,
                status: 400,
                data: err
            })
        })
}

exports.deletecommodity = (req, res) => {
    commodity.findOne({ _id: req.body.id })
        .then(value => {
            try {
                const delRef = ref(storage, `Commodity/${value?.commodityImage}`);
                deleteObject(delRef).then(() => {

                    commodity.deleteOne({ _id: req.body.id })
                        .then(value => {
                            res.json({
                                sucess: true,
                                status: 200,
                                data: value
                            })
                        })
                })

            } catch (error) {
                res.json({
                    success: false,
                    status: 400,
                    message: "error :" + error
                })
            }
        })
        .catch(err => {
            res.json({
                success: false,
                status: 400,
                message: "error :" + err
            })
        })
}

exports.deleteselectedcommodity = (req, res) => {
    commodity.deleteMany({ _id: { $in: req.body.list } })
        .then(value => {
            // deleteImage(value.imgPath)

            res.json({
                sucess: true,
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


exports.showAllAddedcommodity = (req, res) => {

    commodity.find({ userId: req.decoded.userId })
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


exports.showAllUnapprovecommodity = (req, res) => {
    commodity.find({ isApproved: false, isRejected: false })
        .populate("commodityCategory", "categoryName categoryDesc")
        .then(value => {
            res.json({
                sucess: true,
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

exports.showRejectedcommodity = (req, res) => {
    commodity.find({ isRejected: true })
        .populate("commodityCategory", "categoryName categoryDesc")
        .then(value => {
            res.json({
                sucess: true,
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

exports.approvecommodity = (req, res) => {

    commodity.findOne({ _id: req.body.id })
        .populate("commodityCategory")
        .then(value => {
            value.isApproved = true
            value.save()
                .then(val => {
                    res.json({
                        sucess: true,
                        status: 200,
                        data: value
                    })
                })

        })
        .catch(err => {
            res.json({
                success: false,
                status: 400,
                data: err
            })
        })

}

exports.rejectcommodity = (req, res) => {

    commodity.findOne({ _id: req.body.id })
        .populate("commodityCategory")
        .then(value => {

            value.isRejected = true
            value.save()
                .then(val => {
                    res.json({
                        sucess: true,
                        status: 200,
                        data: value
                    })
                })
        })
        .catch(err => {
            res.json({
                success: false,
                status: 400,
                data: err
            })
        })
}


exports.searchcommodity = (req, res) => {
    commodity.find(req.query)
        .populate("commodityCategory")
        .then(value => {
            res.status(200).json({
                success: true,
                status: 200,
                data: value
            })
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                message: "error :" + err
            })
        })

}

exports.showLendedcommodity = (req, res) => {
    borrows.find({ ownerId: req.decoded.userId })
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

exports.showBorrowedcommodity = (req, res) => {
    borrows.find({ borrowerId: req.decoded.userId })
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