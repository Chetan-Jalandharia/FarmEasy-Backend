const fs = require('fs')
const path = require('path')
const ref = require('firebase/storage').ref
const storage = require('../../config/firebase')
const uploadBytes = require('firebase/storage').uploadBytes
const getURL = require('firebase/storage').getDownloadURL
const { deleteObject } = require('firebase/storage')

const product = require('./productModel')
const borrows = require('../Borrow/borrowerModel')
const p_purchase = require('../purchases/product purchase/productPurchaseModel')
const c_purchase = require('../purchases/commodity purchase/commodityPurchaseModel')
const { log } = require('console')


const replaceImage = async (imgBuffer, imgName) => {
    const imgRef = ref(storage, `Product/${imgName}`)
    const imgData = await uploadBytes(imgRef, imgBuffer)
    const filePath = await getURL(imgData.ref)
    return filePath;
}

exports.addProduct = async (req, res) => {
    const data = req.body
    const image = req?.file?.buffer
    const imgName = `Image_${Date.now()}${path.extname(req.file.originalname)}`;

    try {
        const imgRef = ref(storage, `Product/${imgName}`)
        const imgData = await uploadBytes(imgRef, image)
        const filePath = await getURL(imgData.ref)

        let newProduct = new product()
        newProduct.productImage = imgName
        newProduct.imgPath = filePath
        newProduct.productName = data.name
        newProduct.productDescription = data.description
        newProduct.productPrice = data.price
        newProduct.usageGuide = data.usageGuide
        newProduct.productCategory = data.category

        if (data.productType == "rent") {
            newProduct.isRent = true
            newProduct.productType = "rent"
        }
        else {
            newProduct.productType = "sell"
        }
        if (req.decoded?.isAdmin) {
            newProduct.isAddedByAdmin = true
            newProduct.userId = req.decoded.userId
            newProduct.isApproved = true
        }
        else {
            newProduct.isAddedByCustomer = true
            newProduct.userId = req.decoded.userId
        }
        newProduct.save()
            .then(value => {
                if (!value.isApproved) {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Product under Review Stage",
                        data: value
                    })
                }
                else {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Product added successfully",
                        data: value
                    })
                }
            })
    } catch (error) {
        // deleteImage(req.file.path)
        res.status(400).json({
            success: false,
            status: 400,
            message: "error :" + error
        })
    }
}

exports.updateProduct = async (req, res) => {
    const image = req?.file?.buffer

    let updatelog = {
        ip: req.body.ip,
        updatedBy: req.decoded.userId
    }

    product.findOne({ _id: req.body.id })
        .then(async (value) => {
            let filePath;
            if (image) {
                filePath = await replaceImage(image, value.productImage);
            }

            value.imgPath = filePath ?? value.imgPath
            value.productName = req.body.name ?? value.productName
            value.productDescription = req.body.description ?? value.productDescription
            value.productPrice = req.body.price ?? value.productPrice
            value.productCategory = req.body.category ?? value.productCategory
            value.productType = req.body.type ?? value.productType
            value.updateLogs.push(updatelog)

            value.save()
                .then(val => {

                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Product updated successfully",
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

exports.showProduct = (req, res) => {
    product.findOne({ _id: req.params.id })
        // .populate("productCategory", "categoryName categoryDesc")
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

exports.showAllProduct = (req, res) => {
    product.find({ isApproved: true })
        // .populate("productCategory")
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

exports.deleteProduct = (req, res) => {

    // console.log(req.body.id);
    product.findOne({ _id: req.body.id })
        .then(value => {
            try {
                // console.log(value);
                const delRef = ref(storage, `Product/${value?.productImage}`);
                deleteObject(delRef).then(() => {
                    product.deleteOne({ _id: req.body.id })
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


exports.showAllAddedProduct = (req, res) => {

    product.find({ userId: req.decoded.userId })
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


exports.showAllUnapproveProduct = (req, res) => {
    product.find({ isApproved: false, isRejected: false })
        // .populate("productCategory")
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

exports.showRejectedProducts = (req, res) => {
    product.find({ isRejected: true })
        // .populate("productCategory")
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

exports.approveProduct = (req, res) => {
    console.log(req.body);
    product.findOne({ _id: req.body.id })
        // .populate("productCategory")
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


exports.rejectProduct = (req, res) => {
    console.log(req.body.id);
    product.findOne({ _id: req.body.id })
        // .populate("productCategory")
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


exports.searchProduct = (req, res) => {
    product.find(req.query)
        // .populate("productCategory")
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

exports.showLendedProducts = (req, res) => {
    borrows.find({ $and: [{ ownerId: req.decoded.userId }, { isAccepted: true }] })
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

exports.showBorrowedProducts = (req, res) => {
    borrows.find({ $and: [{ borrowerId: req.decoded.userId }, { isAccepted: true }] })
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

exports.showSelledCommodity = (req, res) => {
    c_purchase.find({ sellerId: req.decoded.userId })
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

exports.showBuyedCommodity = (req, res) => {
    c_purchase.find({ buyerId: req.decoded.userId })
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