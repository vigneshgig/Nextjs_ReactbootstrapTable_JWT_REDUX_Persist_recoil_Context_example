import { verify } from 'jsonwebtoken';
// import JWTR from 'jwt-redis';
// import { client } from '../pages/api/SignIn';
import { token } from './token';
const redis = require("redis");

var client = redis.createClient();
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

// var jwtr = new JWTR(redisClient);
const authenticated = (fn) => async (
    req, res
) => {
    verify(req.cookies.auth, token, async function (err, decoded) {
        if (!err && decoded) {
            const redis_get = await getAsync(decoded.username);
            if (req.cookies.auth === redis_get) {
                return await fn(req, res)
            } else {
                return res.status(401).json({ message: 'authentication failed!!!!', verfication: false })

            }


        }
        return res.status(401).json({ message: 'authentication failed!!!!', verfication: false })
    });
};
export default authenticated;
// export default authenticated_admin = (fn) => async (
//     req, res
// ) => {
//     verify(req.cookie.auth, secret, function (err, decoded) {
//         if (!err && decoded && re) {

//             return await fn(req, res)
//         }
//         res.status(401).json({ message: 'authentication failed!!!!' })
//     });
// };