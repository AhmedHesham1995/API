/* eslint-disable no-undef */
const nodemailer=require('nodemailer')
module.exports=async (email,subject,text)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:process.env.HOST,
            service:"gmail",
            port:465 ,
            secure: true,
            logger:true,
            debug:true ,
            secureConnection : false ,

            auth:{
                user:"maramoamed8@gmail.com",
                pass:"nikawfnnwfohywxw"
            },
            tls:{
                rejectUnauthorized:true 
            }
        });
        transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
          });
        await transporter.sendMail({
            from :"maramoamed8@gmail.com" ,
            to :email,
            subject :subject ,
            text :text
        })
        console.log("Email sent successfully");
    }catch(error) {
        console.log("Email not sent ");
        console.log(error )
    }
}