import dotenv from 'dotenv';
dotenv.config();

const Status = process.env.STATUS.split(' ');

export default Status;