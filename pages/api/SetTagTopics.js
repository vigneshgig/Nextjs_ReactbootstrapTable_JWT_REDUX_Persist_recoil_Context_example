import sqlite from 'sqlite';
import authenticated from '../../authentication/auth_route';

export default authenticated(async function SetTag(req, res) {
    const db = await sqlite.open('./mydb.sqlite');

    if (req.method === 'POST') {
        try {

            const value = req.body.value.map((x) => {
                if (x.Starting.length === 5) {
                    x.Starting = x.Starting + ':00'
                }
                if (x.Ending.length === 5) {
                    x.Ending = x.Ending + ':00'
                }
                return x
            });
            // console.log(value, '::::::::::::::::::::::::::::::')
            const query_string = 'UPDATE Video SET Starting = ? , Ending = ? , Tagged = 1 WHERE id = ?'
            const statement = await db.prepare(query_string)

            for (let i = 0; i < value.length; i++) {
                statement.run(value[i].Starting,
                    value[i].Ending,
                    value[i].id);


                // result_array.push(result)
            }



            statement.finalize();
            res.json({ message: statement, Updated: true })
        }
        catch (err) {
            console.log(err)
            res.json({ message: 'Failed', Updated: false })
        }
    }
    else {
        res.status(405).json({ message: 'Wrong Method', Updated: false })
    }

})