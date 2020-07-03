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
    if (req.method === 'POST') {
        // console.log(req.body, '>>>>>>>>><<<<<<<<<<<<<<<<<')
        const Topics = req.body.topics
        const Tagged = req.body.tagged
        const assignedto = req.body.username
        let Video = []
        let Alltopiccount = {}
        let Tmp = 0;
        if (Topics.toLowerCase() !== 'all') {
            Video = await db.all('select * from Video where Topic = ? AND Tagged = ? AND ( AssignedTo = ? OR AssignedTo = ?) LIMIT 20', [Topics, Tagged, assignedto,'admin']);
            const query_string = 'UPDATE Video SET AssignedTo = ? WHERE id = ?'
            const statement = await db.prepare(query_string)

            for (let i = 0; i < Video.length; i++) {
                await statement.run(assignedto,
                    Video[i].id);


                // result_array.push(result)
            }
            await statement.finalize();

        }
        else if (Topics.toLowerCase() === 'all') {
            Video = await db.all('select * from Video where Tagged = ?', [Tagged]);

        }
        const Count = await db.each('select * from Video where Topic = ? AND AssignedTo = ?', [Topics, assignedto], (err, row) => {
            if (err) {
                throw err
            }
        });
        for (let i = 0; Topicslist.length > i; i++) {
            Tmp = await db.each('select * from Video where Topic = ? AND Tagged = ?', [Topicslist[i], Tagged], (err, row) => {
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


