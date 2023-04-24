import { StorageAccessFramework } from 'expo-file-system';
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { METADATA_TABLE, DIRECTORY_URI_FOR_FETCH_CIRCLE_DATA, DIRECTORY_URI_FOR_FETCH_SHARED_DATA, IS_WORK_TITLE_VISIBLE, IS_PRICE_VISIBLE } from '../data/metadata';
import { db } from '../db';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { setIsPriceVisible, setIsWorkTitleVisible } from '../data/store';

function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const isWorkTitleVisible = useSelector((state) => state.isWorkTitleVisible);
  const isPriceVisible = useSelector((state) => state.isPriceVisible);
  return (
    <SafeAreaView>
      <ScrollView>
        <Button 
            title='서클 데이터 가져오기'
            onPress={ () => fetchData(navigation, DIRECTORY_URI_FOR_FETCH_CIRCLE_DATA, 'FileSearch') } />
        <Button
            title='서클 등록'
            onPress={ () => navigation.navigate('CircleRegister') } />
        <View style={ styles.checkboxContainer }>
          <BouncyCheckbox
              style={ styles.checkbox }
              size={ 25 }
              fillColor='orangered'
              unfillColor='#fff'
              isChecked={ isWorkTitleVisible }
              text='작품 타이틀 보이기'
              onPress={ (isChecked) => onCheckboxPress(isChecked, true, dispatch) } />
          <BouncyCheckbox
              style={ styles.checkbox }
              size={ 25 }
              fillColor='blue'
              unfillColor='#fff'
              isChecked={ isPriceVisible }
              text='작품 가격 보이기'
              onPress={ (isChecked) => onCheckboxPress(isChecked, false, dispatch) } />
        </View>
        <Button 
            title='공유 데이터 가져오기'
            onPress={ () => {
              Alert.alert('주의', '기존 데이터가 모두 날아가게 됩니다. 이 작업을 시작하기 전 백업해 두세요.', [
                {
                  text: 'OK',
                  onPress: () => fetchData(navigation, DIRECTORY_URI_FOR_FETCH_SHARED_DATA, 'LoadingForFetchingSharedData')
                },
                {
                  text: 'Cancel'
                }
              ]);
            } } />
        <Button
            title='데이터 공유'
            onPress={ () => {
              Alert.alert('', '등록된 서클 데이터, 작품 데이터를 zip 파일로 압축하여 공유합니다.', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('LoadingForExportingData')
                }, {
                  text: 'Cancel'
                }
              ])
            } } />
        <Button
            title='데이터 완전 삭제'
            color='red'
            onPress={ () => {
              Alert.alert('', '정말 삭제하겠습니까?', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('LoadingForCleanWholeData')
                },
                {
                  text: 'Cancel'
                }
              ]);
            } } />
      </ScrollView>
    </SafeAreaView>
  )
}

function onCheckboxPress(isChecked, isWorkTitleVisibleCheckbox, dispatch) {
  const key = isWorkTitleVisibleCheckbox ? IS_WORK_TITLE_VISIBLE : IS_PRICE_VISIBLE;
  const value = isChecked ? '1' : '0';
  const setMethod = isWorkTitleVisibleCheckbox ? setIsWorkTitleVisible : setIsPriceVisible;
  db.transaction((tx) => {
    tx.executeSql(`
      UPDATE ${ METADATA_TABLE } SET value = '${ value }'
      WHERE key = '${ key }';
    `, [ ], (tx, result) => {
      dispatch(setMethod(isChecked));
    });
  });
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

export default SettingsScreen;