const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim:true,
    required: [true, "Name is required"],
    unique: [true, "Name should be unique"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  }
},
{
  // this second object adds extra properties: `createdAt` and `updatedAt`
  timestamps: true
}
);

const User = model("User", userSchema);

module.exports = User;
