import { verify } from 'jsonwebtoken';
// import JWTR from 'jwt-redis';
// import { client } from '../pages/api/SignIn';
import { token } from './token';
const redis = require("redis");

var client = redis.createClient();
// var jwtr = new JWTR(redisClient);
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

const authenticated_logout = (fn) => async (
    req, res
) => {
    verify(req.cookies.auth, token, async function (err, decoded) {
        if (!err && decoded) {
            const result = await getAsync(decoded.username)
            if (req.cookies.auth === result) {
                return await fn(req, res, decoded.username)
            }
            else {
                res.status(401).json({ message: 'authentication failed!!!!', verfication: false })

            }
        }


        res.status(401).json({ message: 'authentication failed!!!!', verfication: false })
    });
};
export default authenticated_logout;
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