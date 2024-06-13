const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")

const {blogmodel}=require("./models/blog")

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://aseera:aseera@cluster0.x0tifel.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedpassword= async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
    
}

app.post("/signup",async(req,res)=>{
  let input=req.body
  let hashedpassword=await generateHashedpassword(input.password)
  console.log(hashedpassword)
  input.password=hashedpassword
  let blog=new blogmodel(input)
  blog.save()
    res.json({"status":"success"})
})

app.listen(8081,()=>{
    console.log("server start")
})