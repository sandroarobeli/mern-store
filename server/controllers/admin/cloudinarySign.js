const cloudinary = require("cloudinary").v2;
require("dotenv").config();

function signature(req, res) {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json({ signature, timestamp });
}

module.exports = signature;
