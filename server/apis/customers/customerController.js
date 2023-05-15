const customer = require('./customerModel')
const user = require('../users/userModel')


exports.showAllCustomer = (req, res) => {

    customer.find()
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
                message: err
            })
        })
}

exports.showCustomer = async (req, res) => {

    // console.log(req.params.id);
    user.findOne({ _id: req.params.id }).populate("customerId")
        .then(val => {
            res.json({
                success: true,
                status: 200,
                data: val
            })
        })

        .catch(error => {
            res.json({
                success: false,
                status: 400,
                message: error
            })
        })

}

exports.updateCustomerInfo = (req, res) => {
    console.log(req.body);
    customer.findOne({ _id: req.body.id })
        .then(value => {
            value.customerName = req.body?.name ?? value.customerName
            value.customerEmail = req.body?.email ?? value.customerEmail
            value.customerPhone = req.body?.phone ?? value.customerPhone
            value.updatedBy = req.body?.userId

            value.save()
                .then(data => {
                    res.json({
                        success: true,
                        status: 200,
                        message: "customer updated successfully",
                        data: data
                    })
                })
                .catch(err => {
                    res.json({
                        success: false,
                        status: 400,
                        message: "message:" + err
                    })
                })
        })
        .catch(err => {
            res.json({
                success: false,
                status: 400,
                message: "message:" + err
            })
        })
}

exports.deleteCustomer = (req, res) => {

    customer.deleteOne({ _id: req.body.id })
        .then(value => {
            res.success(200).json({
                data: value
            })
        })
        .catch(err => {
            res.success(400).json({
                message: "error:" + err
            })
        })
}

