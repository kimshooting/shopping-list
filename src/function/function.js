import { BUDGET_CRITERION, METADATA_TABLE, WORK_TABLE } from "../data/metadata";
import { db } from "../db";

export async function calculateCurrentBudget() {
  return new Promise((resolve, reject) => {
    db.transaction(async (tx) => {
      tx.executeSql(`
        SELECT key, value FROM ${ METADATA_TABLE }
        WHERE key = '${ BUDGET_CRITERION }';
      `, [ ], (tx, result) => {
        const criterionArray = result.rows.item(0).value.split(/,+/);
        let vals = '';
        for (let i of criterionArray) {
          if (i != '') {
            vals += i + ', ';
          }
        }

        let additionalWhere = '';
        if (vals.length != 0) {
          vals = '(' + vals.substring(0, vals.length - 2) + ')';
          additionalWhere = ` AND priority IN ${ vals }`;
        }
        const sql = `
          SELECT SUM(price) FROM ${ WORK_TABLE }
          WHERE checked = 0 ${ additionalWhere };
        `;
        tx.executeSql(sql, [ ], (tx, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0)['SUM(price)']);
          }
        }, (err) => reject(err));
      });
    });
  });
}