
//Keep all response in one shape so the frontend 
 // always know what to expect success , data, message

const successResponse=(res,data,message="ok", statusCode = 200)=>{
      return res.status(statusCode).json({
             success:true,
             message,
             data
      })
}


const errorResponse=(res,message="something went wrong", statusCode=500)=>{
      return res.status(statusCode).json({
             success:false,
             message,
             data:null
      })
}

export {successResponse,errorResponse};
