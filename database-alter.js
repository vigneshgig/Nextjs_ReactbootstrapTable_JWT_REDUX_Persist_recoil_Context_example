const sqlite = require('sqlite');

async function setup() {
    const db = await sqlite.open('./mydb.sqlite');

    await db.run('ALTER TABLE Video ADD COLUMN Downloaded Boolean DEFAULT FALSE')
    await db.run('ALTER TABLE Video ADD COLUMN Tagged_Seconds DEFAULT 0')
    await db.run('ALTER TABLE Video ADD COLUMN Orginal_Seconds DEFAULT 0')
    await db.run('ALTER TABLE Video ADD COLUMN Download_Try_Count DEFAULT 0')
    await db.run('ALTER TABLE Video ADD COLUMN Error Text DEFAULT Empty')

}

setup();