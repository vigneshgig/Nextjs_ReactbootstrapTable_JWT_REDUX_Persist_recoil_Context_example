// import { NextApiRequest, NextApiResponse } from 'next';
import sqlite from 'sqlite';
import authenticated from '../../authentication/auth_admin';

export default authenticated(async function GetUserSheet(req, res) {
    const db = await sqlite.open('./mydb.sqlite')
    if (req.method === 'GET') {
        const User = await db.all('select * from User');
        res.json({ result: User, success: true })

    }
    else {
        res.status(405).json({ sucess: false, message: 'Wrong Method Type' })
    }

})


