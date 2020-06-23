// import { NextApiRequest, NextApiResponse } from 'next';
import sqlite from 'sqlite';
import { hash } from 'bcrypt';
import authenticated from '../../authentication/auth_route';
import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getUserNameById(req, res) {
    await cors(req, res)
    const db = await sqlite.open('./mydb.sqlite')
    if (req.method === 'POST') {

        hash(req.body.password, 10, async function (err, hash) {

            try {


                const statement = await db.prepare('INSERT INTO User (Username,Password) values (?,?)')
                const result = await statement.run(
                    req.body.username,
                    hash
                )
                result.finalize();

                res.json({ Created: 'True', 'username': req.body.username });
            }
            catch (err) {
                res.status(444).json({ Created: 'False', message: 'AlreadCreated or Username is null', 'username': req.body.username, 'err': err })
            }

        });
    }
    else {
        res.status(405).json({ message: 'Wrong Method Type', Created: '' })
    }

}


