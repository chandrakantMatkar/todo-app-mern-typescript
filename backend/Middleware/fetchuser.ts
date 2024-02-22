import  dotenv  from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
dotenv.config();

type IUser ={
    id?:string,
    email?:string,
    expiry?:number | undefined
}

const fetchUser = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.header('x-auth-token');
    if (!authToken) {
       return res.status(401).send('Authentication failed. Token not found.'); 
    }
    try {
        const data = await jwt.verify(authToken as string, process.env.JWT_PRIVATE_KEY as string);
        // const tokenData:IUser = data as {}
        // if ( tokenData.expiry as number > Date.now()) {
        //     return res.status(400).send('Token expired. Please login again')
        // }
        req.user = data as {};
        next();
    } catch (error) {
        res.status(400).send({ error: 'Access denied. please authenticate using valid token' })
    }
}

export default fetchUser;