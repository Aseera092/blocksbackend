const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const jsonwebtoken=require("jsonwebtoken")

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
// api for signIn
app.post("/signIn",(req,res)=>{
    let input=req.body
    blogmodel.find({"email":req.body.email}).then(
        (response)=>{
           if (response.length>0) {
            let dbpassword=response[0].password
            console.log(dbpassword)
            bcrypt.compare(input.password,dbpassword,(error,isMatch)=>{
                if (isMatch) {
                    jsonwebtoken.sign({email:input.email},"blog-app",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {
                                res.json({"succes":"Unable to create token"})
                                
                            } else {
                                res.json({"status":"success","userId":response[0]._id,"token":token})
                            }
                            // blog-app is the name of token
                        }
                    )
                    
                } else {
                    res.json({"status":"incorrect password"})
                    
                }
            })
            
           } else {
            res.json({"status":"user not found"})
           }
        }
    ).catch()
})


app.listen(8081,()=>{
    console.log("server start")
})