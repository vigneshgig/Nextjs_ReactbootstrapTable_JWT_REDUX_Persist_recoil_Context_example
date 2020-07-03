// import { NextApiRequest, NextApiResponse } from 'next';
import sqlite from 'sqlite';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
// import JWTR from 'jwt-redis';
import cookie from 'cookie';
import { token } from '../../authentication/token';
import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
// import { redis } from 'redis'
const redis = require("redis");
// const client = redis.createClient();
// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
var client = redis.createClient(); // this creates a new client
client.on('connect', function () {
    console.log('Redis client connected');
});
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

export default async function login(req, res) {
    await cors(req, res)
    const db = await sqlite.open('./mydb.sqlite')
    if (req.method === 'POST') {
        const user = await db.get('select * from User where Username = ?', [req.body.username]);
        if (user) {
            await compare(req.body.password, user.Password, function (err, result) {
                if (!err && result) {
                    const claims = { sub: user.id, username: user.Username };
                    const jwt = sign(claims, token, { expiresIn: '10d' });
                    client.set(user.Username, jwt, redis.print);
                    res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
                        httpOnly: true,
                        secure:false,
                        sameSite: "none",
                        path: '/'
                    }))
                    res.status(200).json({ message: 'Sucess', username: user.Username })
                }
                else {
                    console.log(err)
                    res.status(401).json({ message: 'Password wrong or some other error' });
                }
            })


        }
        else {
            res.status(401).json({ message: 'Wrong UserName and Password' })
        }

    }
    else {
        res.status(405).json({ message: 'Wrong Method Type' })
    }

}


