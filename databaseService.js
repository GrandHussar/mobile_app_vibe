// databaseService.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('user_database.db');

// Initialize Database and Create Users Table
export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL);',
      [],
      () => console.log('Database initialized'),
      (_, error) => console.log('Error initializing database', error)
    );
  });
};

// Execute a query on the database
export const executeQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};
