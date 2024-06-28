import mongoose from "mongoose";

const connectToDB = async(req, res) => {
    try {
        await mongoose
                    .connect(process.env.MONGO_URI)
                    .then(() => console.log("Connected to DB"))
                    .catch((error) => console.log(error.message))
    } catch (error) {
        console.log("Error connecting to Mongo DB", error.message);
    }
}

export default connectToDB