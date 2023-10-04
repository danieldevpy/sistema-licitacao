
import sqlite3 from 'sqlite3'


class Sqlite {

    private static instance: Sqlite | null = null;
    database: sqlite3.Database;

    private constructor(name?: string) {
      this.database = new sqlite3.Database('cisbafdb.sqlite');
      this.createTableUser();
      this.createTableProcess();
      this.createTableSector();
      this.createTableDispatch();
      this.createTableFile();
    }
  
    get_db(){
      return this.database;
    }

    private createTableUser(){
      const query = `
        CREATE TABLE IF NOT EXISTS "user" (
          id INTEGER PRIMARY KEY,
          username VARCHAR(15) UNIQUE,
          fullname VARCHAR(100),
          password VARCHAR(120),
          sector_id INTEGER,
          is_staff BOOLEAN DEFAULT 0,
          is_adm BOOLEAN DEFAULT 0,
          FOREIGN KEY (sector_id) REFERENCES sector(id) ON DELETE SET NULL
      );
      `
      this.database.run(query);
    }

    private createTableProcess(){
      const query = `
        CREATE TABLE IF NOT EXISTS "process" (
          id INTEGER PRIMARY KEY,
          process_number VARCHAR(255) NOT NULL,
          object VARCHAR(255) NOT NULL,
          sector_id INTEGER NOT NULL,
          status INTEGER NOT NULL DEFAULT 0,
          active INTEGER NOT NULL DEFAULT 1,
          FOREIGN KEY (sector_id) REFERENCES sector(id)
      );
        `
      this.database.run(query);
    }

    private createTableSector(){
      const query = `
        CREATE TABLE IF NOT EXISTS "sector" (
          id INTEGER PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        );
      `
      this.database.run(query);
    }

    private createTableDispatch(){
      const query = `
        CREATE TABLE IF NOT EXISTS "dispatch" (
          id INTEGER PRIMARY KEY,
          process_id INTEGER,
          from_sector_id INTEGER,
          to_sector_id INTEGER,
          user_id INTEGER,
          observation VARCHAR(500),
          date DATETIME DEFAULT (datetime('now', 'localtime')),
          status BOOLEAN DEFAULT 0,
          FOREIGN KEY (process_id) REFERENCES process(id) ON DELETE CASCADE,
          FOREIGN KEY (from_sector_id) REFERENCES sector(id) ON DELETE SET NULL,
          FOREIGN KEY (to_sector_id) REFERENCES sector(id) ON DELETE SET NULL,
          FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
        );
     `
     this.database.run(query);
    }

    private createTableFile(){
      const query = `
        CREATE TABLE IF NOT EXISTS file (
          id INTEGER PRIMARY KEY,
          dispatch_id INTEGER UNIQUE,
          filename TEXT,
          mimetype TEXT,
          filedata BLOB,
          FOREIGN KEY (dispatch_id) REFERENCES dispatch(id) ON DELETE CASCADE
      )
      `
      this.database.run(query);
    }

    public static getInstance(name?: string): Sqlite {
      if (!Sqlite.instance) {
        Sqlite.instance = new Sqlite(name);
      }
  
      return Sqlite.instance;
    }


  } export default Sqlite;