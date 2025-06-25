import mongoose  from "mongoose";

export const connectdb = (url) => {
    return mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}