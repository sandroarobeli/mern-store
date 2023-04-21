const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

async function googleRegister(req, res, next) {
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
      if (existingUser) {
        return next(new Error("The account already exists. Please Login."));
      }

      const newUser = await prisma.user.create({
        data: {
          name: profile?.given_name,
          email: profile?.email,
          password: bcrypt.hashSync("123456"),
        },
      });

      let token;
      try {
        token = jwt.sign({ userId: newUser.id }, process.env.SECRET_TOKEN_KEY, {
          expiresIn: "2h",
        });
      } catch (error) {
        return next(new Error("Registration failed. Please try again"));
      }

      res.status(201).json({
        ...convertDocumentToObject(newUser),
        // Since this user comes from google and not from existingUser,
        // what we call image is called picture in google profile
        // So unlike googleLogin controller, I use picture here
        // Thus, if it has a picture we attach it
        // Here in the format it was originally created. otherwise we attach "NA"
        image: profile?.picture ? profile.picture : "NA",
        token: token,
        // Sets time to 2 Hours for THIS application
        expiration: new Date().getTime() + 1000 * 60 * 60 * 2,
      });
    }
  } catch (error) {
    return next(new Error(`Registration failed: ${error?.message || error}`));
  }
}

module.exports = googleRegister;
