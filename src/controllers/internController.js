const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

// ______________________CREATE INTERNS______________________

const createIntern = async function (req, res) {
    try {
        //.............take data from request body............
        let requestBody = req.body
        if (Object.keys(requestBody).length === 0) return res.status(400).send({ status: false, message: "Please enter Intern details" });

        let { name, mobile, email, collegeName } = requestBody
        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is Required" });
        if (!isValid(mobile)) return res.status(400).send({ status: false, message: "Mobile no. is Required" });

        //.............regex for mobile............
        const regMobile = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        if (!regMobile.test(mobile)) {
            return res.status(400).send({ message: "Please enter valid Mobile Number" })
        }
        let mobData = await internModel.findOne({ mobile: mobile })

        //.............when mobile number is already in use............
        if (mobData) return res.status(400).send({ status: false, msg: 'Duplicate mobile' })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is Required" });

        //.............validation for email............
        const regx = /^([a-z0-9\._]+)@([a-z0-9]+.)([a-z]+)(.[a-z])?$/;
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" });

        let emailData = await internModel.findOne({ email: email })

        //.............when email is already in use............
        if (emailData) return res.status(400).send({ status: false, msg: 'Duplicate email' })

        if (!isValid(collegeName)) return res.status(400).send({ status: false, message: "College Name is Required" });

        const college = await collegeModel.findOne({ name: collegeName })
        if (!college) {
            res.status(404).send({ status: false, message: `${collegeName} no college found!!` })
        }

        //.............compare collegeId from college model to request............
        const collegeId = college._id
        requestBody["collegeId"] = collegeId

        //.............creating interns............
        let createIntern = await internModel.create(requestBody)
        res.status(201).send({ status: true, message: "Intern Created Successfully", data: createIntern })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

// ______________________GET INTERNS LIST WITH THERE RESPECTIVE COLLEGE______________________

const collegeDetails = async function (req, res) {
    try {
        //.............take College Name in query params............
        let query = req.query
        let collegeName = query.collegeName
        if (Object.keys(query).length === 0) {
            return res.status(400).send({ status: false, message: "Please Provide filter for fetching details!!" })
        }

        //.............if college name does not match in db............
        const college = await collegeModel.findOne({ name: collegeName })
        if (!college) {
            return res.status(404).send({ status: false, message: `${collegeName} no college found!!` })
        }

        //.............destructuring all fields............
        const { name, fullName, logoLink } = college
        const data = { name, fullName, logoLink };

        //.............creating empty array for interns list............
        data.interns = []
        const collegeId = college._id
        const internsList = await internModel.find({ collegeId: collegeId , isDeleted: false}).select({name: 1, email:1, mobile: 1})
        if (!internsList) {
            return res.status(404).send({ status: false, message: `${collegeName} no interns found!!` })
        }

        //.............using spread operator for interns list............
        data.interns = [...internsList]
        res.status(200).send({ status: true, data: data })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createIntern, collegeDetails }