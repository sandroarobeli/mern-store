const { PrismaClient } = require("@prisma/client");

// Check to see if the client already exists and if so, use it. Otherwise, create a new one...
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

module.exports = client;
