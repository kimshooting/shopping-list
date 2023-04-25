import { METADATA_TABLE, NO_SUCH_KEY, OK } from "../../data/constants";
import { db } from "../db";

export function getMetadataAsDAO(key) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT value FROM ${ METADATA_TABLE }
        WHERE key = '${ key }';
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        if (len == 0) {
          resolve({
            responseCode: NO_SUCH_KEY,
            response: null
          });
        } else {
          resolve({
            responseCode: OK,
            response: result.rows.item(0).value
          });
        }
      }, (err) => reject(err));
    });
  });
}

export async function insertMetadataAsDAO(key, value) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        INSERT INTO ${ METADATA_TABLE } VALUES
          ('${ key }', '${ value }');
      `, [ ], (tx, result) => resolve({ responseCode: OK, response: null }),
      (err) => console.log(err));
    });
  });
}

export async function updateMetadataAsDAO(key, to) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        UPDATE ${ METADATA_TABLE } SET value = '${ to }'
        WHERE key = '${ key }';
      `, [ ], (tx, result) => resolve({ responseCode: OK, response: result }),
      (err) => reject(err));
    });
  });
}