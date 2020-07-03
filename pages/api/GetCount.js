// import { NextApiRequest, NextApiResponse } from 'next';
import sqlite from 'sqlite';
import authenticated from '../../authentication/auth_route';
import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import { Topicslist } from '../../TopicsList';
// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default authenticated(async function GetTopicsSheet(req, res) {
    await cors(req, res)
    const db = await sqlite.open('./mydb.sqlite')
    if (req.method === 'GET') {
        for (let i = 0; Topicslist.length > i; i++) {
            Tmp = await db.each('select * from Video where Topic = ? AND Tagged = ? AND AssignedTo = ?', [Topicslist[i], 0, assignedto], (err, row) => {
                if (err) {
                    throw err
                }

            })
            Alltopiccount[Topicslist[i]] = Tmp;
        }



        res.json({ result: Video, count: Count, alltopiccount: Alltopiccount, success: 'Pass' })

    }
    else {
        res.status(405).json({ message: 'Wrong Method Type', success: 'failed' })
    }

})


