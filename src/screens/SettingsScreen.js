import { StorageAccessFramework } from 'expo-file-system';
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DIRECTORY_URI_FOR_FETCH_CIRCLE_DATA, DIRECTORY_URI_FOR_FETCH_SHARED_DATA, IS_WORK_TITLE_VISIBLE, IS_PRICE_VISIBLE, MAIN_BLUE_COLOR, MAIN_RED_COLOR, SUB_BLUE_COLOR } from '../data/constants';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { setIsPriceVisible, setIsWorkTitleVisible } from '../data/store';
import { getMetadata, updateMetadata } from '../backend/controller/metadataController';

function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const isWorkTitleVisible = useSelector((state) => state.isWorkTitleVisible);
  const isPriceVisible = useSelector((state) => state.isPriceVisible);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={ styles.settingsContainer }>
          <TouchableOpacity
              style={ [ styles.btn, { backgroundColor: `${ MAIN_BLUE_COLOR }` } ] }
              onPress={ () => fetchData(navigation, DIRECTORY_URI_FOR_FETCH_CIRCLE_DATA, 'FileSearch') }>
            <Text style={ styles.btnTitle }>서클 데이터 가져오기</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={ styles.btn }
              onPress={ () => navigation.navigate('CircleRegister') }>
            <Text style={ styles.btnTitle }>서클 등록</Text>
          </TouchableOpacity>
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
          <TouchableOpacity
              style={ styles.btn }
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
              } }>
            <Text style={ styles.btnTitle }>공유 데이터 가져오기</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={ styles.btn }
              onPress={ () => {
                Alert.alert('', '등록된 서클 데이터, 작품 데이터를 zip 파일로 압축하여 공유합니다.', [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('LoadingForExportingData')
                  }, {
                    text: 'Cancel'
                  }
                ])
              } }>
            <Text style={ styles.btnTitle }>데이터 공유 (백업)</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={ [ styles.btn, { backgroundColor: `${ MAIN_RED_COLOR }` } ] }
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
              } }>
            <Text style={ styles.btnTitle }>데이터 완전 삭제</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function onCheckboxPress(isChecked, isWorkTitleVisibleCheckbox, dispatch) {
  const key = isWorkTitleVisibleCheckbox ? IS_WORK_TITLE_VISIBLE : IS_PRICE_VISIBLE;
  const value = isChecked ? '1' : '0';
  const setMethod = isWorkTitleVisibleCheckbox ? setIsWorkTitleVisible : setIsPriceVisible;
  updateMetadata(key, value)
      .then((result) => {
        dispatch(setMethod(isChecked));
      });
}

function fetchData(navigation, key, where) {
  getMetadata(key, '', true)
      .then((result) => readDirectoryAndMoveTo(navigation, result.response, key, where));
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
        updateMetadata(key, permissions.directoryUri);
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
  settingsContainer: {
    marginTop: 30,
    gap: 20,
  },
  btn: {
    backgroundColor: `${ SUB_BLUE_COLOR }`,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
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