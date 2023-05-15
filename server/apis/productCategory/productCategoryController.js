const category = require('./productCategoryModel')
const fs = require('fs')

const path = require('path')
const ref = require('firebase/storage').ref
const storage = require('../../config/firebase')
const uploadBytes = require('firebase/storage').uploadBytes
const getURL = require('firebase/storage').getDownloadURL

const deleteImage = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}

exports.addCategory =async (req, res) => {
    let data = req.body;

    const image = req?.file?.buffer
    const imgName = `Image_${Date.now()}${path.extname(req.file.originalname)}`;

    const imgRef = ref(storage, `Category/Product/${imgName}`)
    const imgData = await uploadBytes(imgRef, image)
    const filePath = await getURL(imgData.ref)

    if (req.decoded.isAdmin) {
        category.findOne({ categoryName: data.name.trim().toLowerCase() })
            .then(value => {
                console.log(value);
                if (value == null) {
                    let newCategory = new category();
                    newCategory.categoryImage = imgName
                    newCategory.imgPath = filePath
                    newCategory.categoryName = data.name.trim().toLowerCase()
                    newCategory.categoryDesc = data.desc
                    newCategory.addedBy = req.decoded.userId

                    newCategory.save()
                        .then(value => {
                            res.status(200).json({
                                success: true,
                                status: 200,
                                message: "Category Added successfully",
                                data: value
                            })
                        })
                        .catch(err => {
                            // deleteImage(imgPath)
                            res.status(400).json({
                                success: false,
                                status: 400,
                                message: err,
                            })
                        })
                }
                else {
                    // deleteImage(imgPath)
                    res.status(400).json({
                        success: false,
                        status: 400,
                        message: "Category already Available"
                    })
                }
            })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    status: 400,
                    message: "error :" + err,
                })
            })
    }
    else {
        res.json({
            success: false,
            status: 400,
            message: "Invalid Access "
        })
    }
}


exports.updateCategory = (req, res) => {
    const data = req.body

    if (req.decoded.isAdmin) {
        let updatelog = {
            ip: req.ip,
            updatedBy: req.decoded.userId
        }
        category.findOne({ _id: data.id })
            .then(value => {
                if (req?.file?.path) {
                    deleteImage(value.imagePath)
                }
                value.categoryImage = req?.file?.filename ?? value.categoryImage
                value.imagePath = req?.file?.path ?? value.imagePath
                value.categoryName = data.name ?? value.categoryName
                value.categoryDesc = data.description ?? value.categoryDesc
                value.addedBy = data.addedBy ?? value.addedBy
                value.updateLogs.push(updatelog)
                value.save().then(val => {
                    res.json({
                        success: true,
                        status: 200,
                        message: "Category updated successfully",
                        data: val
                    })
                })
            }).catch(err => {
                res.json({
                    success: false,
                    status: 400,
                    message: "error :" + err,

                })
            })
    }
    else {
        res.json({
            success: false,
            status: 400,
            message: "Invalid Access "
        })
    }
}

exports.deleteCategory = (req, res) => {

    if (req.decoded.isAdmin) {
        category.deleteOne({ _id: req.body.id })
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
    else {
        res.json({
            success: false,
            status: 400,
            message: "Invalid Access "
        })
    }
}

exports.showCategory = (req, res) => {

    if (req.decoded.isAdmin) {
        category.findOne({ _id: req.params.id })
            .populate("addedBy", "name email isAdmin")
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
    else {
        res.json({
            success: false,
            status: 400,
            message: "Invalid Access "
        })
    }
}


exports.showAllCategory = (req, res) => {


    category.find()
        .populate("addedBy", "name email isAdmin")
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


