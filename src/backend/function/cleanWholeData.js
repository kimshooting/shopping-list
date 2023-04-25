import { deleteAsync, documentDirectory } from "expo-file-system";
import { CIRCLE_IMAGE_DIRECTORY, CIRCLE_PARTICIPATE_TABLE, DIRECTORY_URI_FOR_FETCH_SHARED_DATA, METADATA_TABLE, NO_SUCH_KEY, OK, PRIORITY_TABLE, REGISTERED_TABLE, WORK_IMAGE_DIRECTORY, WORK_TABLE } from "../../data/constants";
import { getMetadata } from "../controller/metadataController";
import { db } from "../db";

export async function cleanWholeData() {
  await deleteAsync(CIRCLE_IMAGE_DIRECTORY, { idempotent: true });
  await deleteAsync(WORK_IMAGE_DIRECTORY, { idempotent: true });
  await deleteDirectoryOfSharedData();
  await dropTable(WORK_TABLE);
  await dropTable(REGISTERED_TABLE);
  await dropTable(PRIORITY_TABLE);
  await dropTable(CIRCLE_PARTICIPATE_TABLE);
  await dropTable(METADATA_TABLE);
  return 'hi';
}

function dropTable(table) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        DROP TABLE IF EXISTS ${ table };
      `, [ ], (tx, result) => {
        const resp = {
          responseCode: OK,
          response: result
        };
        resolve();
      }, (err) => {
        console.log('err');
        console.error(err);
        reject(err);
      });
    });
  });
}

async function deleteDirectoryOfSharedData() {
  const resp = await getMetadata(DIRECTORY_URI_FOR_FETCH_SHARED_DATA);
  if (resp.responseCode == NO_SUCH_KEY) {
    return;
  }
  const value = resp.response;
  const dirName = value.split('%2F').pop();
  await deleteAsync(documentDirectory + dirName, { idempotent: true });
  return null;
}