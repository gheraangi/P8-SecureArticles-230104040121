import jwt from "jsonwebtoken";

export default function auth(req,res,next){
  const header = req.headers.authorization;

  if(!header){
    auditLog(req, "missing_token");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try{
    const decoded = jwt.verify(token,"secret");
    req.user = decoded;
    next();
  }catch(err){
    auditLog(req, "invalid_token");
    return res.status(401).json({ message: "Invalid token" });
  }
}
