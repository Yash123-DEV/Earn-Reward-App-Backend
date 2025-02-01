const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/assign-01", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => console.error('Failed to connect to MongoDB:', err));


const userSchema = mongoose.Schema({
   fullname: {
     type: String,
     minLength: 3,
     trim: true,
   },
   email: String,
   password: String,
   coins: { type: Number, default: 450 },
});


module.exports = mongoose.model("users" , userSchema);