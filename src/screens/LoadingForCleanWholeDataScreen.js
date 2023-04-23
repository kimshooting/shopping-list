import { deleteAsync, documentDirectory, readDirectoryAsync } from 'expo-file-system';
import { BackHandler, Text, View } from 'react-native';
import { CIRCLE_IMAGE_DIRECTORY, CIRCLE_PARTICIPATE_TABLE, DIRECTORY_URI_FOR_FETCH_SHARED_DATA, METADATA_TABLE, PRIORITY_TABLE, REGISTERED_TABLE, WORK_IMAGE_DIRECTORY, WORK_TABLE } from '../data/metadata';
import { db, initApp } from '../db';

function LoadingForCleanWholeDataScreen({ navigation }) {
  // readDirectoryAsync(documentDirectory).then((result) => console.log(result));
  // db.transaction((tx) => {
  //   tx.executeSql(`
  //     SELECT COUNT(*) FROM ${ CIRCLE_PARTICIPATE_TABLE }
  //   `, [ ], (tx, result) => console.log(result.rows.item(0)));
  // });
  // db.transaction((tx) => {
  //   tx.executeSql(`
  //     SELECT COUNT(*) FROM ${ WORK_TABLE }
  //   `, [ ], (tx, result) => console.log(result.rows.item(0)));
  // });
  // db.transaction((tx) => {
  //   tx.executeSql(`
  //     SELECT COUNT(*) FROM ${ REGISTERED_TABLE }
  //   `, [ ], (tx, result) => console.log(result.rows.item(0)));
  // });
  // db.transaction((tx) => {
  //   tx.executeSql(`
  //     SELECT COUNT(*) FROM ${ PRIORITY_TABLE }
  //   `, [ ], (tx, result) => console.log(result.rows.item(0)));
  // });
  deleteProcess(navigation);
  return (
    <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text style={ { color: '#000' } }>삭제 중</Text>
    </View>
  );
}

async function deleteProcess(navigation) {
  await deleteAsync(CIRCLE_IMAGE_DIRECTORY, { idempotent: true });
  await deleteAsync(WORK_IMAGE_DIRECTORY, { idempotent: true });
  await db.transaction((tx) => {
    tx.executeSql(`
      SELECT key, value FROM ${ METADATA_TABLE }
      WHERE key = '${ DIRECTORY_URI_FOR_FETCH_SHARED_DATA }';
    `, [ ], (tx, result) => {
      if (result.rows.length != 0) {
        const value = result.rows.item(0).value;
        const dirName = value.split('%2F').pop();
        deleteAsync(documentDirectory + dirName, { idempotent: true });
      }
    });
  });
  await db.transaction((tx) => {
    tx.executeSql(`DROP TABLE IF EXISTS ${ WORK_TABLE }`);
  });
  await db.transaction((tx) => {
    tx.executeSql(`DROP TABLE IF EXISTS ${ REGISTERED_TABLE }`);
  });
  await db.transaction((tx) => {
    tx.executeSql(`DROP TABLE IF EXISTS ${ PRIORITY_TABLE }`);
  });
  await db.transaction((tx) => {
    tx.executeSql(`DROP TABLE IF EXISTS ${ CIRCLE_PARTICIPATE_TABLE }`);
  });
  await db.transaction((tx) => {
    tx.executeSql(`DROP TABLE IF EXISTS ${ METADATA_TABLE }`);
  });
  initApp();
  navigation.goBack();
  BackHandler.exitApp();
}

export default LoadingForCleanWholeDataScreen;