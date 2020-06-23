// import { NextApiRequest, NextApiResponse } from 'next';
import sqlite from 'sqlite';
import authenticated_logout from '../../authentication/auth_logout';
import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
const redis = require("redis");

var client = redis.createClient();
const { promisify } = require('util')
const getAsync = promisify(client.del).bind(client);
// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default authenticated_logout(async function GetTopicsSheet(req, res, username) {
    await cors(req, res)
    const db = await sqlite.open('./mydb.sqlite')
    if (req.method === 'GET') {
        const result = await getAsync(username, function (error, result) {
            if (error) {
                console.log(error);
                throw error
            }

        }
        )
        if (result) {
            res.status(200).json({ message: 'logout successfully', logout: true })
        }
        else {
            res.status(405).json({ message: 'logout failed', logout: false })

        }

    }
    else {
        res.status(405).json({ message: 'Wrong Method Type', success: 'failed' })
    }

})


