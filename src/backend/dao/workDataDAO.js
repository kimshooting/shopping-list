import { OK, WORK_TABLE } from "../../data/constants";
import { db } from "../db";

export function getWorkDataAsDAO(sql) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(sql, [ ], (tx, result) => {
        const len = result.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          data.push(result.rows.item(i));
        }
        resolve({
          responseCode: OK,
          response: data
        });
      }, (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}

export function insertWorkDataAsDAO(valuesSql) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        INSERT INTO ${ WORK_TABLE } (title, checked, image_path, priority, price, circle_id) VALUES
          ${ valuesSql };
      `, [ ], (tx, result) => {
        resolve({
          responseCode: OK,
          response: result
        });
      }, (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}

export function updateWorkDataAsDAO(to, targetIds) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        UPDATE ${ WORK_TABLE } SET ${ to }
        WHERE id IN (${ targetIds });
      `, [ ], (tx, result) => {
        resolve({
          responseCode: OK,
          response: result
        });
      }, (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}

export function deleteWorkDataByIdAsDAO(id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        DELETE FROM ${ WORK_TABLE }
        WHERE id = ${ id };
      `, [ ], (tx, result) => {
        resolve({
          responseCode: OK,
          response: result
        });
      }, (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}

export function deleteWorkDataByCircleIdAsDAO(circleId) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        DELETE FROM ${ WORK_TABLE }
        WHERE circle_id = ${ circleId };
      `, [ ], (tx, result) => {
        resolve({
          responseCode: OK,
          response: result
        });
      }, (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}

export function truncateWorkDataAsDAO() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        DELETE FROM ${ WORK_TABLE };
      `, [ ], (tx, result) => {
        resolve({
          responseCode: OK,
          response: result
        });
      }, (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}

export function getPriceSumAsDAO(whereStatement) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT SUM(price) FROM ${ WORK_TABLE }
        WHERE ${ whereStatement };
      `, [ ], (tx, result) => {
        const res = result.rows.item(0)['SUM(price)']
        resolve({
          responseCode: OK,
          response: res == null ? 0 : res
        });
      }, (err) => {
        console.error(err);
        reject(err);
      });
    });
  });
}