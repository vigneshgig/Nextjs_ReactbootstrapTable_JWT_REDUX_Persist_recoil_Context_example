import authenticated from '../../authentication/auth_route';

export default authenticated(async function auth_checking(req, res) {
        return res.status(200).json({ message: 'Verified Successfully', verification: true })
})

