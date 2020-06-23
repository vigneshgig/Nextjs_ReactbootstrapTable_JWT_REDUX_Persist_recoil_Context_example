// import { NextApiRequest, NextApiResponse } from 'next';
import sqlite from 'sqlite';
import authenticated from '../../authentication/auth_admin';

export default authenticated(async function GetLinkSheet(req, res) {
    const db = await sqlite.open('./mydb.sqlite')
    if (req.method === 'GET') {
        const Video = await db.all('select * from Video');
        res.json({ result: Video, success: true })

    }
    else {
        res.status(405).json({ sucess: false, message: 'Wrong Method Type' })
    }

})


