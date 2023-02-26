const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const prisma = require("../../db");
const convertDocumentToObject = require("../../utils/docToObject");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

async function googleLogin(req, res, next) {
  const { credential } = req.body;

  try {
    if (credential) {
      const verificationResponse = await verifyGoogleToken(credential);
      if (verificationResponse.error) {
        return next(new Error(verificationResponse.error));
      }

      const profile = verificationResponse?.payload;

      const existingUser = await prisma.user.findUnique({
        where: { email: profile?.email },
      });

      if (!existingUser) {
        return next(new Error("You are not registered. Please sign up"));
      }

      res.status(201).json({
        ...convertDocumentToObject(existingUser),
        // Since this user was created via google, if it has an image we attach it
        // Here in the format it was originally created. otherwise we attach "NA"
        image: existingUser?.image ? existingUser.image : "NA",
        token: jwt.sign({ userId: profile?.id }, process.env.SECRET_TOKEN_KEY, {
          expiresIn: "2h",
        }),
        // Sets time to 15 Seconds for TESTING
        // expiration: new Date().getTime() + 1000 * 15
        // Sets time to 2 Hours for THIS application
        expiration: new Date().getTime() + 1000 * 60 * 60 * 2,
      });
    }
  } catch (error) {
    return next(new Error(`Login failed: ${error?.message || error}`));
  }
}

module.exports = googleLogin;
