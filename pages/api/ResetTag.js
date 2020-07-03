// import { NextApiRequest, NextApiResponse } from 'next';
import sqlite from 'sqlite';
import authenticated from '../../authentication/auth_admin';

export default authenticated(async function GetLinkSheet(req, res) {
    const db = await sqlite.open('./mydb.sqlite')
    if (req.method === 'GET') {
            const Video = await db.all('select * from Video where Tagged = ? AND AssignedTo != ?', [0,'admin']);
            const query_string = 'UPDATE Video SET AssignedTo = ? WHERE id = ?'
            const statement = await db.prepare(query_string)

            for (let i = 0; i < Video.length; i++) {
                await statement.run('admin',
                    Video[i].id);


                // result_array.push(result)
            }
            await statement.finalize();

        res.json({ result: Video,statement:statement ,success: true })

    }
    else {
        res.status(405).json({ sucess: false, message: 'Wrong Method Type' })
    }

})


