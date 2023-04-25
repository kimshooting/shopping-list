import { CIRCLE_PARTICIPATE_TABLE, OK } from "../../data/constants";
import { db } from "../db";

export function getAllCircleDataAsDAO() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT * FROM ${ CIRCLE_PARTICIPATE_TABLE };
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          const obj = result.rows.item(i);
          obj.selected = false;
          data.push(obj);
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

export function getAllCircleDataBySpaceAsDAO(space) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT * FROM ${ CIRCLE_PARTICIPATE_TABLE }
        WHERE space ${ space };
      `, [ ], (tx, result) => {
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

export function insertAllCircleDataAsDAO(valuesSql) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        INSERT INTO ${ CIRCLE_PARTICIPATE_TABLE } (space, penname, circle_name) VALUES
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

export function truncateAllCircleDataAsDAO() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        DELETE FROM ${ CIRCLE_PARTICIPATE_TABLE };
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

export function searchCircleAsDAO(searchText, selectedRecordId) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT * FROM ${ CIRCLE_PARTICIPATE_TABLE }
        WHERE circle_name LIKE '%${ searchText }%';
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          const obj = result.rows.item(i);
          obj.selected = obj.id == selectedRecordId ? true : false;
          data.push(obj);
        }
        resolve({
          responseCode: OK,
          response: data
        });
      });
    });
  });
}