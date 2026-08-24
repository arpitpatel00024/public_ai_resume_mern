require("dotenv").config();

const dns = require("dns");

// Use public DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGO_URI, {
        family: 4,
        tls: true,
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000
    })
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((err) => {
        console.log("Something Error MongoNetworkError:", err);
    });