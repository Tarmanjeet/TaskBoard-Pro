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
        type:{
            type:String,
            enum:['Status Change','Due Date','Task Created','Assigned To','Assignee change','Task Completed','Task Unassigned','Task Deleted','Task Updated','Task Commented'],
             required:[true,'Add a trigger']
        },
        condition:{
            type:mongoose.Schema.Types.Mixed,
            required:true
        }
    },
    action:{
       type:{
         type:String,
         enum:['Send Notification','Change Status','Assign Task','Add Comment','Delete Task','Update Task'],
         required:[true,'Add an action']
       },
       value:{
         type:mongoose.Schema.Types.Mixed,
         required:true
       }
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