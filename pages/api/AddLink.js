import sqlite from 'sqlite';
import authenticated from '../../authentication/auth_route'
export default authenticated(async function (req, res) {
    const db = await sqlite.open('./mydb.sqlite');

    if (req.method === 'POST') {
        try {
            const link = req.body.link.split('\n')
            const topics = req.body.topics.toString()
            const createdby = req.body.createdby.toString()
            const query_string = 'INSERT INTO Video (Topic,Link,CreatedBy) values (?,?,?)'
            const statement = await db.prepare(query_string)
            let tmp_link = ''
            for (let i = 0; i < link.length; i++) {
                tmp_link = link[i].replace(' ', '').replace(',', '')
                if (tmp_link.length !== 0) {
                    statement.run(topics,
                        tmp_link,
                        createdby);
                }



                // result_array.push(result)
            }



            statement.finalize();
            res.json({ message: statement, Inserted: true })
        }
        catch (err) {
            console.log(err)
            res.json({ message: 'Failed', Inserted: false })
        }
    }
    else {
        res.status(405).json({ message: 'Wrong Method', Inserted: false })
    }

})