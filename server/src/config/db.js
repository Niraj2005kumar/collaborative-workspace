const mongoose = require("mongoose");
const dns = require("dns");

// Set public DNS servers to resolve MongoDB SRV records on networks with misconfigured local DNS resolvers
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers:", e.message);
}

const connectDB = async () => {
  console.log("DB Function Started");
  console.log(process.env.MONGO_URI);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongo Connected:", conn.connection.host);
  } catch (err) {
    console.error("DB Error:");
    console.error(err);
    throw err;
  }
};

module.exports = connectDB;