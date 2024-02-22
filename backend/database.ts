import dotenv from 'dotenv'; 
import mongoose from 'mongoose'

dotenv.config();

const db_URI: string | undefined = process.env.DB_URI;
const db_name: string | undefined = process.env.DB_Name

export const mongoConnect = ()=>{
    mongoose.connect(`${db_URI}${db_name}`)
    .then(()=>console.log('Connected to mongoDB'))
    .catch(error=>console.log('error connecting mongoDB',error))
}