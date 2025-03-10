const mongoose = require('mongoose');


const subSectionSchema=new mongoose.Schema({
    title:{
        type:String
    },
    timeDuration:{
        type:String
    },
    description:{
        type:String
    },
    videoUrl:{
        type:String
    },
    
})

// module.exports=mongoose.model("SubSection",subSectionSchema); 
//  Prevent model overwrite by checking if it already exists
const SubSection = mongoose.models.SubSection || mongoose.model("SubSection", subSectionSchema);

module.exports = SubSection;