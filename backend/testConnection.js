import mongoose from 'mongoose';

const uri = "mongodb+srv://diwateyash2004_db_user:25699652@cluster0.cxer5y3.mongodb.net/smartrental?retryWrites=true&w=majority";

console.log("Testing connection...");

mongoose.connect(uri)
    .then(() => {
        console.log("✅ SUCCESS! Connected to MongoDB.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ FAILED! Could not connect.");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.codeName) console.error("CodeName:", err.codeName);
        process.exit(1);
    });
