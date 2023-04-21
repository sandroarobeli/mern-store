const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

// Create the server app and designate the port
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register individual custom routers
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Handling errors for unsupported routes
app.use((req, res, next) => {
  // After urls above, all else triggers error (because there is not url but app.use --> works for every url)
  const error = new Error("Route not found");
  throw error; // Since this is synchronous, we can use throw format
});

// Register error handling middleware (GENERAL ERROR HANDLER. WHEREVER THE ERRORS MAY ORIGINATE)
// If middleware function has 4 parameters, express will recognize it as a special
// ERROR handling middleware meaning it will only be executed
// On requests that throw (contain) errors
app.use((error, req, res, next) => {
  // if response has been sent
  if (res.headerSent) {
    return next(error);
  }
  // otherwise and if error object exists, it may have status code in it or default to 500
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

// Start the server
app.listen(port, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server running on port: ${port}`);
});
