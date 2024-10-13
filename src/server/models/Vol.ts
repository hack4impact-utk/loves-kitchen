import mongoose from 'mongoose'


export interface Volunteer {
    name: string,
    age: number,
    createdAt: string,
}


const volSchema = new mongoose.Schema({
    name: String,
    age: Number,
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})


const volModel = mongoose.models.Vol ?? mongoose.model("Vol", volSchema)
export { volModel }