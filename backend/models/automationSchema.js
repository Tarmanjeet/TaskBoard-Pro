const mongoose = require('mongoose');

const automationSchema=new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'project',
        required:true
    },
    name:{
        type:String,
        required:[true,'Add an automation name']
    },
    trigger:{
        type:String,
        enum:['Status Change','Due Date','Task Created','Assigned To','Task Completed','Task Unassigned','Task Deleted','Task Updated','Task Commented'],
        required:[true,'Add a trigger']
    },
    action:{
        type:String,
        enum:['Send Notification','Change Status','Assign Task','Add Comment','Delete Task','Update Task'],
        required:[true,'Add an action']
    },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})

module.exports=mongoose.model("automation",automationSchema)