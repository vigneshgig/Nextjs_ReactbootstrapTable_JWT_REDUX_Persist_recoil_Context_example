-- Up
CREATE TABLE User (
id INTEGER PRIMARY KEY AUTOINCREMENT,
Username TEXT UNIQUE NOT NULL,
Password TEXT NOT NULL
);

CREATE TABLE Video (
id INTEGER PRIMARY KEY AUTOINCREMENT,
Topic Text NOT NULL,
Link  Text NOT NULL,
Starting Text DEFAULT "00:00:00" NOT NULL,
Ending   Text DEFAULT "00:00:00" NOT NULL, 
Tagged Boolean DEFAULT FALSE NOT NULL,
CreatedBy TEXT,
AssignedTo TEXT DEFAULT "admin",
DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY
(CreatedBy) REFERENCES User
(Username)

);

-- INSERT INTO User ( Username, Password ) values ('admin','gihosp123*');
-- INSERT INTO Video (Topic, Link, CreatedBy) values ('Eating', 'dummy.com',1);
-- INSERT INTO Video (Topic, Link, CreatedBy) values ('Eating', 'dummy.com',1);
-- INSERT INTO Video (Topic, Link, CreatedBy) values ('Drinking', 'dummy.com',1);

-- INSERT INTO User (Username ) values ('narasimmian');
-- INSERT INTO Video (Topic, Link, CreatedBy) values ('walking', 'dummy.com',2);
-- INSERT INTO Video (Topic, Link, CreatedBy) values ('eating', 'dummy.com',2);
-- INSERT INTO Video (Topic, Link, CreatedBy) values ('talking', 'dummy.com',2);

-- Down
DROP TABLE User;
DROP TABLE Video;
