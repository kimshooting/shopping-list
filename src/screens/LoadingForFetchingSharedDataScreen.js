import { Text, View } from 'react-native';
import { CIRCLE_PARTICIPATE_TABLE, REGISTERED_TABLE, SHARED_DATA_ENTRY_FILENAME, WORK_TABLE } from '../data/metadata';
import { StorageAccessFramework, documentDirectory, readAsStringAsync } from 'expo-file-system';
import { useDispatch } from 'react-redux';
import { calculateCurrentBudget } from '../function/function';
import { setCurrentBudget } from '../data/store';
import { db } from '../backend/db';

function LoadingForFetchingSharedDataScreen({ route, navigation }) {
  const dir = route.params.dir;
  
  // readDirectoryAsync(documentDirectory + 'shared_data_dir/image').then((result) => console.log(result));
  procedure(dir, navigation, useDispatch());

  return(
    <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text style={ { color: '#000' } }>데이터 가져오는 중</Text>
    </View>
  )
}

async function procedure(dir, navigation, dispatch) {
  const rootDirectory = documentDirectory + dir.split('%2F').pop() + '/';
  await copyFiles(dir);
  const metadata = JSON.parse(await processManagementFile(rootDirectory));
  const circleData = JSON.parse(await processData(rootDirectory, metadata.circle_data_file));
  const workData = JSON.parse(await processData(rootDirectory, metadata.work_data_file));
  for (let data of circleData) {
    data.circle_image_path = rootDirectory + data.circle_image_path;
  }
  for (let data of workData) {
    data.image_path = rootDirectory + data.image_path;;
  }
  await dbTask(circleData, REGISTERED_TABLE);
  await dbTask(workData, WORK_TABLE);
  await calculateCurrentBudget().then((result) => dispatch(setCurrentBudget(result)));
  navigation.goBack();
}

async function copyFiles(dir) {
  await StorageAccessFramework.copyAsync({
    from: dir,
    to: documentDirectory
  });
}

async function processManagementFile(rootDirectory) {
  return await readAsStringAsync(rootDirectory + SHARED_DATA_ENTRY_FILENAME);
}

async function processData(rootDirectory, filename) {
  return await readAsStringAsync(`${ rootDirectory }${ filename }`);
}

async function dbTask(data, table) {
  await truncate(table);
  if (data.length == 0) {
    return;
  }
  const sql = await getSql(data, table);
  await db.transaction((tx) => {
    tx.executeSql(sql, [ ], (tx, result) => console.log(result),
        (err) => console.error(err));
  });
}

function truncate(table) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM ${ table }`, [ ], (tx, result) => {
        resolve();
      }, (err) => reject(err));
    });
  })
}

async function getSql(obj, table) {
  return new Promise(async (resolve, reject) => {
    let columns = '(';
    let ks = [ ];
    if (table == REGISTERED_TABLE) {
      ks = [
        'circle_image_path', 'circle_id', 'priority'
      ];
    }
    if (table == WORK_TABLE) {
      ks = [
        'title', 'checked', 'image_path', 'priority', 'price', 'circle_id'
      ];
    }
    for (let key of ks) {
      columns += `${ key },`;
    }
    columns = columns.substring(0, columns.length - 1) + ')';

    console.log(columns);
    
    let values = '';
    for (let ob of obj) {
      let value = '(';
      for (let key of ks) {
        if (key == 'circle_id') {
          const circleId = await getCircleId(ob.space);
          ob.circle_id = circleId;
        }
        let quote = '';
        if (isNaN(ob[key])) {
          quote = '\'';
          ob[key] = ob[key].replace(`'`, `''`);
        }
        value += `${ quote }${ ob[key] }${ quote },`;
      }
      values += value.substring(0, value.length - 1) + '),';
    }
    values = values.substring(0, values.length - 1) + ';';
    console.log(values);
    resolve(`INSERT INTO ${ table } ${ columns } VALUES ${ values }`);
  });
}

function getCircleId(space) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT id FROM ${ CIRCLE_PARTICIPATE_TABLE }
        WHERE space = '${ space }';
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        if (len > 0) {
          resolve(result.rows.item(0).id);
        } else {
          reject();
        }
      }, (err) => console.error(err));
    });
  });
}

export default LoadingForFetchingSharedDataScreen;