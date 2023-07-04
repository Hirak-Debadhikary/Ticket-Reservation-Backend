const mongoose = require("mongoose"); // Import the Mongoose library for MongoDB

const connect = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true, // Use the new URL parser (deprecated options)
      useUnifiedTopology: true, // Use the new server discovery and monitoring engine
    });

    console.log("Connected to the database");
  } catch (error) {
    // Error occurred during database connection
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = {
  connect, // Export the connect function to be used in other parts of the application
};
