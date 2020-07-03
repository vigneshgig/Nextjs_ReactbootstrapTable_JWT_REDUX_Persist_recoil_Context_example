const fs = require('fs')
// const youtubedl = require('youtube-dl')
const sqlite = require('sqlite');
const download = require('download');
const { getVideoDurationInSeconds } = require('get-video-duration');
const arrSum = arr => arr.reduce((a, b) => a + b, 0)
const ytdl = require('ytdl-core');

async function setup() {
    const db = await sqlite.open('./mydb.sqlite');
    const result = await db.all('select * from Video where Downloaded = ? AND Download_Try_Count <= ?', [0, 25])
    console.log(result, ';;;;;;')
    const query_string_downloaded_youtube = 'UPDATE Video SET Download_Try_Count = ? , Downloaded = ? , Orginal_Seconds = ? , Tagged_Seconds = ? WHERE id = ?'
    const statement_downloaded_youtube = await db.prepare(query_string_downloaded_youtube)
    const query_string_downloaded_download = 'UPDATE Video SET Download_Try_Count = ? , Downloaded = ? , Orginal_Seconds = ? , Tagged_Seconds = ? WHERE id = ?'
    const statement_downloaded_download = await db.prepare(query_string_downloaded_download)
    const query_string_error_youtube = 'UPDATE Video SET Download_Try_Count = ? , Error = ? WHERE id = ?'
    const statement_error_youtube = await db.prepare(query_string_error_youtube)
    const query_string_error_download = 'UPDATE Video SET Download_Try_Count = ? , Error = ? WHERE id = ?'
    const statement_error_download = await db.prepare(query_string_error_download)
    let tmp_starting = await JSON.stringify({ time0: "00:00:12", time1: "00:00:22", time2: "00:00:00" })
    let tmp_ending = await JSON.stringify({ time0: "00:00:20", time1: "00:00:30", time2: "00:00:00" })
    const total_length = result.length
    let duration_original = 0
    for (index in result) {
        const value = result[index]
        const dir = value.Topic
        console.log('.....',total_length-index,'......')
        let tmp_starting = value.Starting
        let tmp_ending = value.Ending
        if (!fs.existsSync('./video/' + dir)) {
            fs.mkdirSync('./video/' + dir);
        }

        if (value.Link.startsWith('https://www.youtube.com/') || value.Link.startsWith('https://vimeo.com/')) {
            try {
                const metainfo = await ytdl.getBasicInfo(value.Link)
                duration_original = metainfo.length_seconds

                await ytdl(value.Link)
                    .pipe(fs.createWriteStream('./video/' + dir + '/' + value.Link.replace(/https\:\/\//g, '').replace(/\:/g, '').replace(/\//g, '') + '_' + value.Topic.replace(/\//g, '') + '.mp4'));
                const json_starting = await JSON.parse(tmp_starting)

                const Starting_Seconds_list = await Promise.all(Object.keys(json_starting).map((key, index) => {
                    const Starting = json_starting[key]
                    var a = Starting.split(':'); // split it at the colons
                    const Starting_Seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    return Starting_Seconds
                }))

                const json_ending = await JSON.parse(tmp_ending)

                const Ending_Seconds_list = await Promise.all(Object.keys(json_ending).map((key, index) => {
                    const Ending = json_ending[key]
                    var a = Ending.split(':'); // split it at the colons
                    const Ending_Seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    return Ending_Seconds
                }));
                const list_duration = await Promise.all(Starting_Seconds_list.map((start, index) => {
                    return Ending_Seconds_list[index] - start
                }))
                const Tagged_Seconds = await parseInt(arrSum(list_duration))
                let Downtr = await parseInt(value.Download_Try_Count) + 1
                console.log(Downtr, 1, duration_original, Tagged_Seconds)
                await statement_downloaded_youtube.run(Downtr, 1, duration_original, Tagged_Seconds, value.id)

            }
            catch (err) {
                try{
                let Downtr = await parseInt(value.Download_Try_Count) + 1
                let errs = err.toString()
                await statement_error_youtube.run(Downtr, errs, value.id)
                console.log(err, '::::::::::::::::::::::;;;')
            }catch(err){
                console.log(err,'<<<<<<<<<<<>>>>>>>>>>>>>>>')
            }
            }
        } else {
            try {
                (async () => {
                    await download(value.Link).pipe(fs.createWriteStream('./video/' + dir + '/' + value.Link.replace(/https\:\/\//g, '').replace(/\:/g, '').replace(/\//g, '') + '_' + value.Topic.replace(/\//g, '') + '.mp4'));

                })();
                await getVideoDurationInSeconds(value.Link).then((duration) => {
                    duration_original = parseInt(duration)
                })
                
                const json_starting = await JSON.parse(tmp_starting)

                const Starting_Seconds_list = await Promise.all(Object.keys(json_starting).map((key, index) => {
                    const Starting = json_starting[key]
                    var a = Starting.split(':'); // split it at the colons
                    const Starting_Seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    return Starting_Seconds
                }))

                const json_ending = JSON.parse(tmp_ending)

                const Ending_Seconds_list = await Promise.all(Object.keys(json_ending).map((key, index) => {
                    const Ending = json_ending[key]
                    var a = Ending.split(':'); // split it at the colons
                    const Ending_Seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    return Ending_Seconds
                }));
                const list_duration = await Promise.all(Starting_Seconds_list.map((start, index) => {
                    return Ending_Seconds_list[index] - start
                }))
                const Tagged_Seconds = await parseInt(arrSum(list_duration))
                let Downtr = await parseInt(value.Download_Try_Count) + 1
                console.log(Downtr, 1, duration_original, Tagged_Seconds)
                await statement_downloaded_download.run(Downtr, 1, duration_original, Tagged_Seconds, value.id)


            }
            catch (err) {
                try{
                let Downtr = await parseInt(value.Download_Try_Count) + 1
                let errs = err.toString()
                await statement_error_download.run(Downtr, errs, value.id)
                console.log(err, '..............')
            }
            catch(err){
                console.log(err,'<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>')
            }
            }
            

        }

        // result_array.push(result)

    }

    const results = await Promise.all([statement_downloaded_youtube.finalize(),
    statement_error_download.finalize(),
    statement_downloaded_download.finalize(),
    statement_error_youtube.finalize()])
    console.log(results, 'finished')


}
setup();