const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');

exports.createSection = async (req, res) => {
    try {
        //DATA fetch
        const { sectionName, courseId } = req.body;
        //data validaton
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            })
        }
        //create section
        const newSection = await Section.create({ sectionName })
        //update course with section object id
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
              $push: {
                courseContent: newSection._id,
              },
            },
            { new: true }
          )
            .populate({
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            })
            .exec()
        //return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Unable to create section",
            error: err.message,
        })
    }
}

//update section
exports.updateSection = async (req, res) => {
    try {
      const { sectionName, sectionId, courseId } = req.body
      const section = await Section.findByIdAndUpdate(
        sectionId,
        { sectionName },
        { new: true }
      )
      const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
      // console.log(course)
      res.status(200).json({
        success: true,
        message: section,
        data: course,
      })
    } catch (error) {
      // console.error("Error updating section:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

//delete section
exports.deleteSection = async (req, res) => {
    try {
        //get id-assuming that we are sending id in params
        const { sectionId, courseId } = req.body;
        await Course.findByIdAndUpdate(courseId, {
            $pull: { courseContent: sectionId }
        })
        const section = Section.findById(sectionId)
        //deleting the subsections
        //This tells MongoDB:
        //Look for all documents in the SubSection collection.
        //Select documents whose _id matches any value in the section.subSection array
        await SubSection.deleteMany({
            _id:
            {
                $in: section.subSection
            }
        })
        //find by id and delete
        await Section.findByIdAndDelete(sectionId);
        //find the updated course
        
        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: course
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update section",
            error: error.message,
        })
    }
}