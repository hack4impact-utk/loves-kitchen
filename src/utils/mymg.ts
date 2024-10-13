import mongoose from 'mongoose'


// Establish connection statistics type
export interface ConnectStat {
    success: boolean,
    message: string,
}


// Try to connect to the MongoDB server
let isConnectedVar: ConnectStat
if (!process.env.MONGODB_URI) {
    isConnectedVar = {
        success: false,
        message: "Connection failed, missing MONGODB_URI environment variable.",
    }
}
else {
    const uri = process.env.MONGODB_URI;
    try {
        mongoose.connect(uri)
        isConnectedVar = {
            success: true,
            message: "Connection successful!",
        }
    } catch {
        isConnectedVar = {
            success: false,
            message: "MONGODB_URI variable is set, but connection failed.",
        }
    }
}


const isConnected: ConnectStat = isConnectedVar
export { isConnected }