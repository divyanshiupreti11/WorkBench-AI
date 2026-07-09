import Conversation
from "../models/conversation.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userId:", userId);

    const conversation = await Conversation.create({
      userId,
    });

    console.log("Conversation created:", conversation);

    return res.json(conversation);
  } catch (error) {
    console.log("========== CHAT ERROR ==========");
    console.error(error);
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
    console.log("===============================");

    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const conversations = await Conversation.find({
      userId,
    }).sort({
      updatedAt: -1,
    });

    return res.json(conversations);
  } catch (error) {
    console.log("========== GET CONVERSATIONS ERROR ==========");
    console.error(error);
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);

    return res.status(500).json({
      message: error.message,
    });
  }
};

import Message
from "../models/message.model.js";

export const saveMessage =async(req,res)=>{

 try{

  const {
   conversationId,
   role,
   content,
   images,
  artifacts
  } = req.body;

  const message =await Message.create({

   conversationId,

   role,
  images,
   content,
   artifacts:
  artifacts || []

  });

  res.json(
   message
  );

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

}



export const getMessages =async(req,res)=>{

 try{

  const messages =await Message.find({

   conversationId:
   req.params.id

  })
  .sort({
   createdAt:1
  });

  res.json(
   messages
  );

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

}


export const updateConversation=async (req,res)=>{
try {
    const {conversationId,title}=req.body
    const conversation=await Conversation.findByIdAndUpdate( conversationId,{
        title
    })
     res.json(
   conversation
  );

 }catch(error){

  res.status(500).json({
   message:error.message
  });

}
}
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    // Conversation delete
    await Conversation.findByIdAndDelete(id);

    // Saare messages delete
    await Message.deleteMany({
      conversationId: id,
    });

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};