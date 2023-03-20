require("dotenv").config();

async function getPaypalClientId(req, res, next) {
  try {
    res.status(200).json(process.env.PAYPAL_CLIENT_ID);
  } catch (error) {
    return next(
      new Error(
        error ? error : "An unknown error has ocurred. Please try again later"
      )
    );
  }
}

module.exports = getPaypalClientId;
