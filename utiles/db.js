const mongoose = require('mongoose');

module.exports.dbConnect = async () => {
  console.log('Connecting to database at:', process.env.DB_URL);  // Log the database URL
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Database Connected Successfully...");
  } catch (error) {
    console.log("Database connection error:", error.message);
  }
}
