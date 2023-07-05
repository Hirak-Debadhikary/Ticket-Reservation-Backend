// Import required modules
const express = require("express"); // Express web framework
const cors = require("cors"); // Enable Cross-Origin Resource Sharing
const dotenv = require("dotenv"); // Load environment variables
const db = require("./config/database"); // Database configuration

dotenv.config(); // Load environment variables from .env file

const { ErrorHandler } = require("./middleware/ErrorHandling.middleware");
const { AppError } = require("./class/AppError");

//All Routes import here
const { authRouter } = require("./routes/auth.routes");
const { adminRouter } = require("./routes/admin.routes");
const { tvShowRouter } = require("./routes/tvShows.routes");
const { showReservation } = require("./routes/reservation.routes");

// Create Express app
const app = express(); // Initialize Express application
const PORT = process.env.PORT || 3000; // Define the port to listen on (default: 3000)

// Middleware configuration
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// User Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/shows", tvShowRouter);
app.use("/api/ticket", showReservation);

// if Routes are not exists
app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} <- this Route not found!`, 404));
});

// Error handling middleware
app.use(ErrorHandler);

// Connect to the database
db.connect()
  .then(() => {
    // Database connection successful
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    // Database connection failed
    console.error("MongoDB connection error:", error);
  });
