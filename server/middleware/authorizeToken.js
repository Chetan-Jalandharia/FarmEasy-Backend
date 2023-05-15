require('dotenv').config()

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {


    const authToken = req.headers?.auth;
    // const authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2YwOTViNGRjMTEzMDc4Njc2YjFhMzkiLCJ1c2VyRW1haWwiOiJjaGV0YW4wMDJAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaXNDdXN0b21lciI6ZmFsc2UsImN1c3RvbWVySWQiOm51bGwsImlhdCI6MTY4MDU5MDg4NiwiZXhwIjoxNjgwNjc3Mjg2fQ.gIMhhxXqeYd_AIsp2PBqHydApA_mA9NFjLLZF8J3-Ic";
    // console.log(authToken);
    try {
        jwt.verify(authToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(403).json({
                    message: "unautorize " + err
                })
            }
            else {
                req.decoded = decoded
                next()
            }
        })
    } catch (error) {
        console.log("error message:", error);
    }

}