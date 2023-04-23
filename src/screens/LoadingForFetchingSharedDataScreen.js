import { Text, View } from 'react-native';
import { REGISTERED_TABLE, SHARED_DATA_MANAGEMENT_FILENAME, SHARED_DATA_ROOT_DIRECTORY, WORK_TABLE } from '../data/metadata';
import { StorageAccessFramework, deleteAsync, documentDirectory, getInfoAsync, makeDirectoryAsync, readAsStringAsync, readDirectoryAsync } from 'expo-file-system';
import { db } from '../App';

function LoadingForFetchingSharedDataScreen({ route, navigation }) {
  const dir = route.params.dir;
  
  // readDirectoryAsync(documentDirectory + 'shared_data_dir/image').then((result) => console.log(result));
  procedure(dir, navigation);

  return(
    <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text style={ { color: '#000' } }>LoadingForFetchingSharedData</Text>
    </View>
  )
}

async function procedure(dir, navigation) {
  const rootDirectory = documentDirectory + dir.split('%2F').pop() + '/';
  await copyFiles(dir);
  const metadata = JSON.parse(await processManagementFile(rootDirectory));
  const circleData = JSON.parse(await processData(rootDirectory, metadata.circle_data_file));
  const workData = JSON.parse(await processData(rootDirectory, metadata.work_data_file));
  for (let data of circleData) {
    data.circle_image_path = rootDirectory + data.circle_image_path;
    console.log(data.circle_image_path);
  }
  console.log('--------------------');
  for (let data of workData) {
    data.image_path = rootDirectory + data.image_path;
    console.log(data.image_path);
  }
  await dbTask(circleData, REGISTERED_TABLE);
  await dbTask(workData, WORK_TABLE);
  navigation.goBack();
}

async function copyFiles(dir) {
  await StorageAccessFramework.copyAsync({
    from: dir,
    to: documentDirectory
  });
}

async function processManagementFile(rootDirectory) {
  return await readAsStringAsync(rootDirectory + SHARED_DATA_MANAGEMENT_FILENAME);
}

async function processData(rootDirectory, filename) {
  return await readAsStringAsync(`${ rootDirectory }${ filename }`);
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

  return `INSERT INTO ${ table } ${ columns } VALUES ${ values }`;
}

export default LoadingForFetchingSharedDataScreen;