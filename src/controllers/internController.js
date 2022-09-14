const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const createIntern = async function (req, res) {
    try {
        let requestBody = req.body
        if (Object.keys(requestBody).length === 0) return res.status(400).send({ status: false, message: "Please enter Intern details" });
        let { name, mobile, email, collegeName } = requestBody
        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is Required" });
        if (!isValid(mobile)) return res.status(400).send({ status: false, message: "Mobile no. is Required" });
        const valid = mobile.length
        if (!valid == 10) {
            res.status(400).send({ message: "Please enter valid Mobile Number" })
        }
     

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is Required" });
        const regx = /^([a-z0-9\._]+)@([a-z0-9]+.)([a-z]+)(.[a-z])?$/;
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" });
        
    
        if (!isValid(collegeName)) return res.status(400).send({ status: false, message: "College Name is Required" });

        const unique = await internModel.findOne({ email: email, mobile: mobile });
        if (!unique) return res.status(401).send({ status: false, message: "Use Different Email or Mobile Number" });

        const college = await collegeModel.findOne({ name: collegeName })
        if(!college){
            res.status(404).send({status: false, message: `${collegeName} no college found!!`})
        }

        const collegeId = college._id 
        requestBody["collegeId"] = collegeId

        let createIntern = await internModel.create(requestBody)
        res.status(201).send({ status: true, message: "Intern Created Successfully", data: createIntern })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createIntern }