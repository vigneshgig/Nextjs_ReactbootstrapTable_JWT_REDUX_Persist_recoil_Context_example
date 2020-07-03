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
                await statement.run(value[i].Starting,
                    value[i].Ending,
                    value[i].id);


                // result_array.push(result)
            }



            await statement.finalize();
            const delete_string = 'DELETE FROM Video WHERE id = ?'
            const statement_1 = await db.prepare(delete_string)
            const ids_value = req.body.ids_value
            for (let i = 0; i < ids_value.length; i++) {
                statement_1.run(ids_value[i])
                // result_array.push(result)
            }



            statement_1.finalize();

            res.json({ message: statement, statement_delete:statement_1,Updated: true })
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