import SQLite from 'react-native-sqlite-storage';
import { initTask } from './initTask';

export var db;

export function executeDBUnit(query, onSuccess, onFail) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(query, [ ], async (tx, result) => {
        await onSuccess(tx, result);
        resolve();
      }, (err) => {
        onFail(err);
        reject(err);
      });
    })
  });
}

export function init() {
  return new Promise((resolve, reject) => {
    db = SQLite.openDatabase({name: 'my.db', location: 'default'}, async () => {
      console.log('success open db');
      initTask()
          .then((result) => resolve(null));
    }, (err) => console.error(err));
  });
}