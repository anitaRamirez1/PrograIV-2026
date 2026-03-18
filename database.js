import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let db;

export const initDb = async () => {
    const sqlite3 = await sqlite3InitModule();
    db = new sqlite3.oo1.DB('/academico.sqlite3', 'ct');
    
    db.exec(`
        CREATE TABLE IF NOT EXISTS alumnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            carnet TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS docentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            especialidad TEXT NOT NULL
        );
    `);
};

export const insertRecord = (tabla, datos) => {
    const columnas = Object.keys(datos).join(', ');
    const valores = Object.values(datos);
    const placeholders = valores.map(() => '?').join(', ');
    
    db.exec({
        sql: `INSERT INTO ${tabla} (${columnas}) VALUES (${placeholders})`,
        bind: valores
    });
};

export const fetchRecords = (tabla) => {
    return db.exec(`SELECT * FROM ${tabla}`, { returnValue: "resultRows" });
};