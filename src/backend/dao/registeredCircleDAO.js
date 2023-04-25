import { CIRCLE_PARTICIPATE_TABLE, OK, PRIORITY_TABLE, REGISTERED_TABLE } from "../../data/constants";
import { db } from "../db";

export function getRegisteredCircleDataAsDAO(where, orderby) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT r.id, r.circle_image_path, r.circle_id, p.space,
               p.penname, p.circle_name, pr.priority, pr.title, pr.color
        FROM ${ REGISTERED_TABLE } AS r
        INNER JOIN ${ CIRCLE_PARTICIPATE_TABLE } AS p ON r.circle_id = p.id
        INNER JOIN ${ PRIORITY_TABLE } AS pr ON r.priority = pr.priority
        ${ where }
        ${ orderby };
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

export function getRegisteredCircleDataJoiningAllCircleDataAsDAO() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT p.circle_name, p.penname, p.space, r.circle_image_path, r.priority
        FROM ${ REGISTERED_TABLE } AS r
        INNER JOIN ${ CIRCLE_PARTICIPATE_TABLE } AS p ON r.circle_id = p.id;
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

export function insertRegisteredCircleDataAsDAO(valuesSql) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        INSERT INTO ${ REGISTERED_TABLE } (circle_image_path, circle_id, priority) VALUES
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

export function updateRegisteredCircleDataByIdAsDAO(to, targetIds) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        UPDATE ${ REGISTERED_TABLE } SET ${ to }
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

export function deleteRegisteredCircleDataByCircleIdAsDAO(circleId) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        DELETE FROM ${ REGISTERED_TABLE }
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

export function truncateRegisteredCircleAsDAO() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        DELETE FROM ${ REGISTERED_TABLE };
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