import { db } from "../App";
import { WORK_TABLE } from "../data/metadata";

export async function calculateCurrentBudget(setBudget) {
  return new Promise((resolve, reject) => {
    db.transaction(async (tx) => {
      await tx.executeSql(`
        SELECT SUM(price) FROM ${ WORK_TABLE }
        WHERE checked = 0;
      `, [ ], (tx, result) => {
        if (result.rows.length > 0) {
          resolve(result.rows.item(0)['SUM(price)']);
        }
      }, (err) => reject(err));
    });
  });
}