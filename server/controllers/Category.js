const Category = require('../models/category');

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
//create category handler function
exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }
    //create entry in DB
    const categoryDetails = await Category.create({ name, description });
    console.log(categoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created Successfully"
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//get all category
exports.showAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find({}, { name: true, description: true })
    res.status(200).json({
      success: true,
      message: "All Categories returned successfully",
      data: allCategory
    });

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//get category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
        populate: "instructor",
      })
      .exec()

    // console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      // console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      // console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "instructor",
      })
      .exec()
    // console.log()
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate:"instructor"
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      //made change in the line below
      .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
      .slice(0, 10)
      

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}