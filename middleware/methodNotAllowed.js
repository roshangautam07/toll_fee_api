export const methodNotAllowed=(req,res)=>{
    res.status(405).json({'status':405,
    'message':`${req.method  } not allowed on this route`}) ;
};