import { OK, PRIORITY_TABLE, RESPONSE_CODE } from "../../data/constants";
import { db } from "../db";

export function getPrioritySetAsDAO() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT * FROM ${ PRIORITY_TABLE };
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          data.push(result.rows.item(i));
        }
        resolve({
          responseCode : OK,
          response: data
        });
      }, (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}