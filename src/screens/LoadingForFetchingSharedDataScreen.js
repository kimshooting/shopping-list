import { Text, View } from 'react-native';
import { REGISTERED_TABLE, SHARED_DATA_MANAGEMENT_FILENAME, SHARED_DATA_ROOT_DIRECTORY, WORK_TABLE } from '../data/metadata';
import { StorageAccessFramework, deleteAsync, documentDirectory, getInfoAsync, makeDirectoryAsync, readAsStringAsync, readDirectoryAsync } from 'expo-file-system';
import { db } from '../App';

function LoadingForFetchingSharedDataScreen({ route, navigation }) {
  const files = route.params.data;

  procedure(files, navigation);

  return(
    <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text style={ { color: '#000' } }>LoadingForFetchingSharedData</Text>
    </View>
  )
}

async function procedure(files, navigation) {
  await copyFiles(files);
  const metadata = JSON.parse(await processManagementFile());
  const circleData = JSON.parse(await processData(metadata.circle_data_file));
  const workData = JSON.parse(await processData(metadata.work_data_file));
  for (let data of circleData) {
    data.circle_image_path = SHARED_DATA_ROOT_DIRECTORY + data.circle_image_path;
  }
  for (let data of workData) {
    data.image_path = SHARED_DATA_ROOT_DIRECTORY + data.image_path;
  }
  await dbTask(circleData, REGISTERED_TABLE);
  await dbTask(workData, WORK_TABLE);
  navigation.goBack();
}

async function copyFiles(files) {
  for (let file of files) {
    await StorageAccessFramework.copyAsync({
      from: file,
      to: SHARED_DATA_ROOT_DIRECTORY
    });
  }
}

async function processManagementFile() {
  return await readAsStringAsync(SHARED_DATA_ROOT_DIRECTORY + SHARED_DATA_MANAGEMENT_FILENAME);
}

async function processData(filename) {
  return await readAsStringAsync(`${ SHARED_DATA_ROOT_DIRECTORY }${ filename }`);
}

async function dbTask(data, table) {
  await db.transaction((tx) => tx.executeSql(`DELETE FROM ${ table }`));
  if (data.length == 0) {
    return;
  }
  const sql = getSql(data, table);
  await db.transaction((tx) => {
    tx.executeSql(sql, [ ], (tx, result) => console.log(result),
        (err) => console.error(err));
  });
}

function getSql(obj, table) {
  let columns = '(';
  const ks = Object.keys(obj[0]);
  for (let key of ks) {
    columns += `${ key },`;
  }
  columns = columns.substring(0, columns.length - 1) + ')';
  
  let values = '';
  for (let ob of obj) {
    let value = '(';
    for (let key of ks) {
      const quote = isNaN(ob[key]) ? '\'' : '';
      value += `${ quote }${ ob[key] }${ quote },`;
    }
    values += value.substring(0, value.length - 1) + '),';
  }
  values = values.substring(0, values.length - 1) + ';';

  return `INSERT INTO ${ table } ${ columns } VALUES ${ values }`;
}

export default LoadingForFetchingSharedDataScreen;