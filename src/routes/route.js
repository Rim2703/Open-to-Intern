const express=require("express")
const router=express.Router();
const collegeController=require("../Controllers/collegeController")
const internController=require("../Controllers/internController")

router.post("/functionup/colleges", collegeController.createColleges)

router.post("/functionup/interns", internController.createIntern)
module.exports = router;