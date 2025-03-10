// // Import the required modules
const express = require("express")
const router = express.Router()

// // Import the Controllers

// // Course Controllers Import
// const {
//   createCourse,
//   showAllCourses,
//   getCourseDetails,
//   // getFullCourseDetails,
//   // editCourse,
//   // getInstructorCourses,
//   // deleteCourse,
// } = require("../controllers/Course");

// // Tags Controllers Import

// // Categories Controllers Import
// const {
//   showAllCategory,
//   createCategory,
//   categoryPageDetails,
// } = require("../controllers/Category")

// // Sections Controllers Import
// const {
//   createSection,
//   updateSection,
//   deleteSection,
// } = require("../controllers/Section")

// // Sub-Sections Controllers Import
// const {
//   createSubSection,
//   updateSubSection,
//   deleteSubSection,
// } = require("../controllers/Subsection")

// // Rating Controllers Import
// const {
//   createRating,
//   getAverageRating,
//   getAllRatingAndReviews,
// } = require("../controllers/RatingAndReviews")
const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/courseProgress")
// // Importing Middlewares
// const { auth, isInstructor, is , isAdmin } = require("../middlewares/auth");

// // ********************************************************************************************************
// //                                      Course routes
// // ********************************************************************************************************

// // Courses can Only be Created by Instructors
// router.post("/createCourse", auth, isInstructor, createCourse);
// // Edit Course routes
// //router.post("/editCourse", auth, isInstructor, editCourse)
// //Add a Section to a Course
// router.post("/addSection", auth, isInstructor, createSection);
// // Update a Section
// router.post("/updateSection", auth, isInstructor, updateSection);
// // Delete a Section
// router.post("/deleteSection", auth, isInstructor, deleteSection);
// // Edit Sub Section
// router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// // Delete Sub Section
// router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// // Add a Sub Section to a Section
// router.post("/addSubSection", auth, isInstructor, createSubSection)
// // Get all Courses Under a Specific Instructor
// //router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// // Get all Registered Courses
// router.get("/getAllCourses", showAllCourses)
// // Get Details for a Specific Courses
// router.post("/getCourseDetails", getCourseDetails)
// // Get Details for a Specific Courses
// //router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// // To Update Course Progress
// //router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// // To get Course Progress
// // router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// // Delete a Course
// //router.delete("/deleteCourse", deleteCourse)

// // ********************************************************************************************************
// //                                      Category routes (Only by Admin)
// // ********************************************************************************************************
// // Category can Only be Created by Admin
// // TODO: Put IsAdmin Middleware here
// router.post("/createCategory", auth, isAdmin, createCategory)
// router.get("/showAllCategories", showAllCategory)
// router.post("/getCategoryPageDetails", categoryPageDetails)


// //                                      Rating and Review

// router.post("/createRating", auth, isStudent, createRating)
// router.get("/getAverageRating", getAverageRating)
// router.get("/getReviews", getAllRatingAndReviews)




const{createCourse,getAllCourses,getCourseDetails,deleteCourse,editCourse,getFullCourseDetails,getInstructorCourses}=require("../controllers/Course");
const {createCategory,showAllCategory,categoryPageDetails} =require("../controllers/Category");
const {createSection,updateSection,deleteSection}=require("../controllers/Section");
const {createSubSection,updateSubSection,deleteSubSection}=require("../controllers/Subsection");
const {createRating,getAllRatingAndReviews}=require("../controllers/RatingAndReviews");
const{auth,isStudent,isInstructor,isAdmin}=require("../middlewares/auth");


router.post("/createCourse",auth,isInstructor,createCourse);
router.get("/getAllCourses",getAllCourses);
router.delete("/deleteCourse", deleteCourse);
router.post("/getCourseDetails", getCourseDetails);
router.post("/editCourse", auth, isInstructor, editCourse)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

router.post("/addSection",auth,isInstructor,createSection);
router.post("/updateSection",auth,isInstructor,updateSection);
router.post("/deleteSection",auth,isInstructor,deleteSection);

router.post("/addSubSection",auth,isInstructor,createSubSection);
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);
router.post("/updateSubSection",auth,isInstructor,updateSubSection);

router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategories",showAllCategory);
router.post("/getCategoryPageDetails",categoryPageDetails);

router.post("/createRating", auth,isStudent,createRating);
router.get("/getAverageRating",auth,getAllRatingAndReviews);


module.exports = router