import { StorageAccessFramework } from 'expo-file-system';
import { Alert, Button, SafeAreaView, StyleSheet } from 'react-native';
import { METADATA_TABLE, DIRECTORY_URI_FOR_FETCH_CIRCLE_DATA, DIRECTORY_URI_FOR_FETCH_SHARED_DATA } from '../data/metadata';
import { db } from '../App';
import LoadingForFetchingSharedDataScreen from './LoadingForFetchingSharedDataScreen';

function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView>
      <Button
          title='서클 등록'
          onPress={ () => navigation.navigate('CircleRegister') } />
      <Button 
          title='서클 데이터 가져오기'
          onPress={ () => fetchData(navigation, DIRECTORY_URI_FOR_FETCH_CIRCLE_DATA, 'FileSearch') } />
      <Button 
          title='공유 데이터 가져오기'
          onPress={ () => fetchData(navigation, DIRECTORY_URI_FOR_FETCH_SHARED_DATA, 'LoadingForFetchingSharedData') } />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: '#000',
  },
});

function fetchData(navigation, key, where) {
  db.transaction((tx) => {
    tx.executeSql(`
      SELECT key, value FROM ${ METADATA_TABLE } WHERE key = '${ key }';
    `, [ ], async (tx, result) => {
      const len = result.rows.length;
      if (len == 0) {
        await tx.executeSql(`
          INSERT INTO ${ METADATA_TABLE } (key, value) VALUES
            ('${ key }', '');
        `);
        readDirectoryAndMoveTo(navigation, '', key, where);
      } else {
        readDirectoryAndMoveTo(navigation, result.rows.item(0).value, key, where);
      }
    });
  });
}

async function readDirectoryAndMoveTo(navigation, dir, key, where) {
  try {
    const files = await StorageAccessFramework.readDirectoryAsync(dir);
    navigation.navigate(where, {
      data:files,
      dir: dir,
    });
  } catch (err) {
    const getPermission = async () => {
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        db.transaction((tx) => {
          tx.executeSql(`
            UPDATE ${ METADATA_TABLE } SET value = '${ permissions.directoryUri }'
            WHERE key = '${ key }';
          `);
        });
      }
    }
    Alert.alert('데이터 위치 설정', '데이터의 위치를 설정해 주세요', [
      {
        text: 'OK',
        onPress: () => getPermission()
      }
    ])
  }
}

export default SettingsScreen;