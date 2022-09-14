const express=require("express")
const router=express.Router();
const collegeController=require("../Controllers/collegeController")
const internController=require("../Controllers/internController")

// ______________________COLLEGE API'S______________________
router.post("/functionup/colleges", collegeController.createColleges)

router.get("/functionup/collegeDetails", internController.collegeDetails)

// ______________________INTERN API______________________
router.post("/functionup/interns", internController.createIntern)

module.exports = router;