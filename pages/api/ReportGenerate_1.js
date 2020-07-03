// import { NextApiRequest, NextApiResponse } from 'next';
import sqlite from 'sqlite';
import authenticated from '../../authentication/auth_admin';
import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
// import { Topicslist } from '../../TopicsList';
// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default authenticated(async function ReportGenerator_1(req, res) {
    await cors(req, res)
    const db = await sqlite.open('./mydb.sqlite')
    if (req.method === 'GET') {
        let list_db = []
        let dicts = { Sno: 0, Scenario: '', Date: '', Total_Uploaded_Video: 0, No_Of_Video_Tagged: 0, Overall_Video_Timing: 0, TaggedTiminig: 0, DailyCount: 0, Downloaded: 0, DailyCount: 0, NotDownloaded: 0, No_Of_Failed: 0 }
        // if (Topics.toLowerCase() !== 'all') {
        //     Video = await db.all('select * from Video where Topic = ? AND Tagged = ? AND AssignedTo = ? LIMIT 2', [Topics, Tagged, assignedto]);

        // }
        // else if (Topics.toLowerCase() === 'all') {
        //     Video = await db.all('select * from Video where Tagged = ?', [Tagged]);

        // }

        // const Count = await db.each('select * from Video where Topic = ? AND Tagged = ?', [Topics, ], (err, row) => {
        //     if (err) {
        //         throw err
        //     }
        // });
        // let count = 1;
        // for (let i = 0; Topicslist.length > i; i++) {


        let query_result = await db.all(`select strftime("%d-%m-%Y",A.DATETIME) as Date, A.Topic, IFNULL(EE.Downloaded,0)+IFNULL(FF.UnDownloaded,0) as Total_Uploaded_Video, IFNULL(BB.No_Of_Video_Tagged,0) as No_Of_Video_Tagged, IFNULL(CC.No_Of_Video_UnTagged,0) as No_Of_Video_UnTagged , IFNULL(DD.Overall_Video_Timing,0) as Overall_Video_Timing , IFNULL(DD.TaggedTiminig,0) as TaggedTiminig, IFNULL(EE.Downloaded,0) as Downloaded , IFNULL(FF.UnDownloaded,0) as UnDownloaded, IFNULL(GG.Failed,0) as Download_Failed  from Video A
        Left JOIN(select strftime("%d-%m-%Y",B.DATETIME) as Date ,B.Topic, count(B.id) as No_Of_Video_Tagged  from Video B where B.Tagged = 1  group by strftime("%d-%m-%Y",B.DATETIME),B.Topic) BB ON strftime("%d-%m-%Y",A.DATETIME) = BB.Date AND A.Topic = BB.Topic
        Left JOIN(select strftime("%d-%m-%Y",C.DATETIME) as Date ,C.Topic, count(C.id) as No_Of_Video_UnTagged from Video C  where C.Tagged = 0  group by strftime("%d-%m-%Y",C.DATETIME),C.Topic) CC ON strftime("%d-%m-%Y",A.DATETIME) = CC.Date AND A.Topic = CC.Topic
        Left JOIN(select strftime("%d-%m-%Y",D.DATETIME) as Date ,D.Topic, sum(D.Orginal_Seconds) as Overall_Video_Timing , sum(D.Tagged_Seconds) as TaggedTiminig  from Video D  group by strftime("%d-%m-%Y",D.DATETIME),D.Topic) DD ON strftime("%d-%m-%Y",A.DATETIME) = DD.Date AND A.Topic = DD.Topic
        Left JOIN(select strftime("%d-%m-%Y",E.DATETIME) as Date ,E.Topic, count(E.id) as Downloaded from Video E  where E.Downloaded = 1  group by strftime("%d-%m-%Y",E.DATETIME), E.Topic) EE ON strftime("%d-%m-%Y",A.DATETIME) = EE.Date AND A.Topic = EE.Topic
        Left JOIN(select strftime("%d-%m-%Y",F.DATETIME) as Date ,F.Topic, count(F.id) as UnDownloaded from Video F  where F.Downloaded = 0  group by strftime("%d-%m-%Y",F.DATETIME),F.Topic) FF ON strftime("%d-%m-%Y",A.DATETIME) = FF.Date AND A.Topic = FF.Topic
        Left JOIN(select strftime("%d-%m-%Y",G.DATETIME) as Date ,G.Topic, count(G.id) as Failed from Video G where G.Download_Try_Count >= 5  group by strftime("%d-%m-%Y",G.DATETIME),G.Topic) GG ON strftime("%d-%m-%Y",A.DATETIME) = GG.Date AND A.Topic = GG.Topic
        group by strftime("%d-%m-%Y",A.DATETIME),A.Topic ORDER BY strftime("%d-%m-%Y", A.DATETIME) DESC`, [], (err, row) => {
            if (err) {
                throw err
            }

        })
        // let No_Of_Video_Tagged = await db.all(' select strftime("%d-%m-%Y",DATETIME) as Date ,Topic, count(id) as No_Of_Video_Tagged  from Video  where Tagged = 1  group by strftime("%d-%m-%Y",DATETIME), Topic', [], (err, row) => {
        //     if (err) {
        //         throw err
        //     }

        // })
        // let No_Of_Video_UnTagged = await db.all('select strftime("%d-%m-%Y",DATETIME) as Date ,Topic, count(id) as No_Of_Video_UnTagged from Video  where Tagged = 0  group by strftime("%d-%m-%Y",DATETIME), Topic', [], (err, row) => {
        //     if (err) {
        //         throw err
        //     }

        // })
        // let Overall_Video_Timing_and_TaggedTiminig = await db.all(' select strftime("%d-%m-%Y",DATETIME) as Date ,Topic, sum(Orginal_Seconds) as Overall_Video_Timing , sum(Tagged_Seconds) as TaggedTiminig  from Video  group by strftime("%d-%m-%Y",DATETIME) ,Topic', [], (err, row) => {
        //     if (err) {
        //         throw err
        //     }

        // })
        // let Downloaded = await db.all(' select strftime("%d-%m-%Y",DATETIME) as Date ,Topic, count(id) as Downloaded from Video  where Downloaded = 1  group by strftime("%d-%m-%Y",DATETIME), Topic', [], (err, row) => {
        //     if (err) {
        //         throw err
        //     }

        // })
        // let UnDownloaded = await db.all(' select strftime("%d-%m-%Y",DATETIME) as Date ,Topic, count(id) as UnDownloaded from Video  where Downloaded = 0  group by strftime("%d-%m-%Y",DATETIME), Topic', [], (err, row) => {
        //     if (err) {
        //         throw err
        //     }

        // })
        // let UnDownloaded = await db.all(' select strftime("%d-%m-%Y",DATETIME) as Date ,Topic, count(id) as Failed from Video  where Download_Try_Count >= 5  group by strftime("%d-%m-%Y",DATETIME), Topic', [], (err, row) => {
        //     if (err) {
        //         throw err
        //     }

        // })


        //[Total_Uploaded_Video,No_Of_Video_Tagged, No_Of_Video_UnTagged, Overall_Video_Timing_and_TaggedTiminig, Downloaded, UnDownloaded]
        res.json({
            result: query_result, success: 'Pass'
        })

    }
    else {
        res.status(405).json({ message: 'Wrong Method Type', success: 'failed' })
    }

})


