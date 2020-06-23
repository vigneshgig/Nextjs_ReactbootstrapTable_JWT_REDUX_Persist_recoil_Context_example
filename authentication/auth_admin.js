import { verify } from 'jsonwebtoken';
import { token } from './token';
const redis = require("redis");

var client = redis.createClient();
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);


const authenticated_admin = (fn) => async (
    req, res
) => {
    verify(req.cookies.auth, token, async function (err, decoded) {
        if (!err && decoded) {
            if (decoded.username === 'admin') {
                const result = await getAsync(decoded.username)
                if (req.cookies.auth === result) {
                    return await fn(req, res)
                }
                else {
                    res.status(401).json({ message: 'authentication failed!!!!', verfication: false })

                }
            }

            else {
                res.status(405).json({ message: 'authentication failed!!!! Your are not authorsited', verfication: false })
            }
        }
        res.status(401).json({ message: 'authentication failed!!!!', verfication: false })
    });
};
export default authenticated_admin;