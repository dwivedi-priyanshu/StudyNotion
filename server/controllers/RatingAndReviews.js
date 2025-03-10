const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//create Rating and reviews
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { rating, review, courseId } = req.body

    // Check if the user is enrolled in the course

    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    })

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      })
    }

    // Check if the user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    })

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course already reviewed by user",
      })
    }

    // Create a new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    })

    // Add the rating and review to the course
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReviews: ratingReview,
      },
    })
    await courseDetails.save()

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    })
  } catch (error) {
    // console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

//function to get all rating and reviews
exports.getAllRatingAndReviews = async (req, res) => {
  try {
    //get all rating and reviews
    const ratingAndReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({ path: 'user', select: 'firstName lastName email image' })
      .populate({ path: 'course', select: 'courseName' });
    //return response    
    return res.status(200).json({
      success: true,
      message: "Rating and reviews fetched successfully",
      ratingAndReviews
    })
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}