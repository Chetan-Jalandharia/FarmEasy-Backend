require('dotenv').config()
const users = require('./userModel')
const bcrypt = require('bcrypt');
const fs = require('fs')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')

const path = require('path')
const ref = require('firebase/storage').ref
const storage = require('../../config/firebase')
const uploadBytes = require('firebase/storage').uploadBytes
const getURL = require('firebase/storage').getDownloadURL

const customer = require('../customers/customerModel')
const user = require('./userModel')

const deleteUserImage = (path) => {
    if (fs.existsSync(path)) {
        fs.rmSync(path)
    }
}

const sendMail = (token, email) => {
    // let verifyLink = `localhost:3000/user/verify?data=${token}`
    console.log(email);
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
        subject: 'Email Verification FarmEasy',

        html: `<a href="https://farmeasy-fa062.web.app/user/verify?id=${token}">Click to verify your Email_ID</a>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
exports.verifyUser = async (req, res) => {
    try {
        console.log(req.body.id);
        let verify_data = jwt.verify(req.body.id, process.env.SECRET_KEY)
        let verify_user = await users.updateOne({ _id: verify_data.userId }, { isVerified: true })

        res.status(200).json({
            success: true,
            status: 200,
            message: "Email Verified Successfully",
            data: verify_user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            status: 400,
            message: "Error :" + error,
        })
    }
}


exports.registerUser = async (req, res) => {
    let data = req.body

    const image = req.file.buffer
    const metaData = {
        contentType: req?.file?.mimeType,
    }
    const imgName = `Image_${Date.now()}${path.extname(req.file.originalname)}`;
    const imgRef = ref(storage, `Customer/${imgName}`)
    const imgData = await uploadBytes(imgRef, image, metaData)
    const filePath = await getURL(imgData.ref)

    const value = await user.findOne({ email: data.email });
    if (value == null) {
        try {
            let address = {
                state: data.state,
                city: data.city,
                street: data.street,
                landmark: data.landmark,
                pincode: data.pincode,
                district: data.district
            }
            let newCustomer = new customer()
            newCustomer.customerImage = imgName
            newCustomer.imgPath = filePath
            newCustomer.customerName = data.name
            newCustomer.customerEmail = data.email
            newCustomer.customerPhone = data.phone
            newCustomer.customerAddress.push(address)
            newCustomer.save()
                .then(val => {
                    let newUser = new user()
                    newUser.name = data.name
                    newUser.email = data.email
                    newUser.password = bcrypt.hashSync(data.password, 10)
                    newUser.isCustomer = true
                    newUser.customerId = val._id
                    newUser.save()
                        .then(val => {
                            let token_data = {
                                userId: val._id,
                            }
                            let token = jwt.sign(token_data, process.env.SECRET_KEY, { expiresIn: "1d" })
                            sendMail(token, data.email)
                            res.status(200).json({
                                success: true,
                                status: 200,
                                message: "Verify Your Email",
                                data: val
                            })
                        })
                })
        }
        catch (error) {
            deleteUserImage(req.file.path)
            res.status(400).json({
                success: false,
                status: 400,
                message: "error : " + error
            })
        }
    } else {
        deleteUserImage(req.file.path)
        res.status(403).json({
            success: false,
            status: 400,
            message: "User Allready Exists",
        })
    }
}



exports.Login = (req, res) => {

    let data = req.body;
    // console.log(req);
    // console.log(data);
    users.findOne({ email: data.email })
        .then(value => {

            let logger = {
                ip: req.ip,
                isLoged: false
            }
            if (value != null) {

                let token_data = {
                    userId: value._id,
                    userEmail: value.email,
                    isAdmin: value.isAdmin,
                    isCustomer: value.isCustomer,
                    customerId: value.customerId
                }
                let token = jwt.sign(token_data, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 });

                if (value.isVerified == true) {
                    if (bcrypt.compareSync(req.body.password, value.password)) {

                        logger.isLoged = true;
                        value.loginLogs.push(logger)
                        value.save()

                        // res.cookie('authToken', token)
                        // console.log(cookie);
                        res.status(200).json({
                            success: true,
                            status: 200,
                            message: "login successfully",
                            token,

                            data: value
                        })
                    }
                    else {
                        value.loginLogs.push(logger)
                        res.status(400).json({
                            status: 400,
                            success: false,
                            message: "Invalid Email or Password"
                        })
                    }
                }
                else {
                    let token_data = {
                        userId: value._id,
                        userEmail: value.email,
                    }
                    let token = jwt.sign(token_data, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 });
                    sendMail(token, value.email)
                    res.status(401).json({
                        status: 401,
                        success: false,
                        message: "Verify Your Email",
                        token
                    })
                }

            }
            else {
                res.status(400).json({
                    message: "user not found",
                    success: false,
                    status: 400
                })
            }
        })
}

exports.Logout = (req, res) => {

    res.clearCookie('authFarmEasy')
    res.status(200).json({
        success: true,
        status: 200,
        message: "Logout successfully"
    })
}

