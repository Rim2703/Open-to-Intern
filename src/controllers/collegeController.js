const collegeModel = require("../models/collegeModel")

const colleges = async function (req, res) {
    try {
        let data = req.body
        let collegeCreate = await collegeModel.create(data)
        res.status(201).send({ status: true, data: collegeCreate })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { colleges }