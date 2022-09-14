const collegeModel = require("../models/collegeModel")

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const createColleges = async function (req, res) {
    try {
        let requestBody = req.body
        if (Object.keys(requestBody).length === 0) return res.status(400).send({ status: false, message: "Please enter College details" });
        const { name, fullName, logoLink, } = data; //Destructuring

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is Required" });
        if (!isValid(fullName)) return res.status(400).send({ status: false, message: "FullName is Required" });
        if (!isValid(logoLink)) return res.status(400).send({ status: false, message: "LogoLink is required" });
        const regx= /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/+#-]*[\w@?^=%&amp;\/+#-])?/;
        if (!regx.test(logoLink)) return res.status(400).send({status:false,message:"Enter Valid Url"})

        const unique = await collegeModel.findOne({ name: name });
        if (unique) return res.status(401).send({ status: false, message: "College Allready Exist" })



        let collegeCreate = await collegeModel.create(requestBody)
        res.status(201).send({ status: true, message: "College is successfully Created", data: collegeCreate })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createColleges }