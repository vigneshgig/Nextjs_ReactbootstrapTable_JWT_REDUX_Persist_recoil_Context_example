
import authenticated_admin from '../../authentication/auth_admin';

export default authenticated_admin(async function (req, res) {
    return res.status(200).json({ message: 'Verified Successfully', verification: true })
})

