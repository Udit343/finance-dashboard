
import mongoose, { Types } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema({
      name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
      },

      email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
        lowercase:true,
        trim:true,
      },

      password:{
         type:String,
         required:[true,"Password is Required"],
         minlength: [6, "password must be at least 6 characters"],

            // never send password field in any query response by default
         select:false,
      },

      role:{
        type:String,
        enum:["viewer","analyst","accountant","admin"],
        default:"viewer",
      },

      isActive:{
        type:Boolean,
        default:true,
      },
},
{
    timestamps: true,

}
)

userSchema.pre("save", async function (next) {

  // only hash if password was actually changed — prevents re-hashing on other updates
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
})

// method to compare login password against stored hash
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default  mongoose.model("User", userSchema);