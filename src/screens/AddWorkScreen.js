import { useEffect, useState } from 'react';
import { Alert, Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import { DEFAULT_IMAGE, MAIN_BLUE_COLOR, MAIN_GRAY_COLOR, MAIN_RED_COLOR, PRIORITY_COLOR_SQUARE_WIDTH_AND_SIZE, SUB_GRAY_COLOR } from '../data/constants';
import { getPrioritySet } from '../backend/function/function';
import { useDispatch } from 'react-redux';
import { completeAddingWork, onDeleteWorkRequest } from '../backend/controller/workDataController';
import { setCurrentBudget } from '../data/store';

function AddWorkScreen({ route, navigation }) {
  const circleData = route.params.circleData;
  const isEdit = route.params.isEdit;
  const workData = route.params.workData;
  console.log(workData);
  const defaultImage = workData.image_path == DEFAULT_IMAGE ? {
    src: require('../../public/null-image.png'),
    isDefault: true
  } : {
    src: workData.image_path,
    isDefault: false
  }
  const [ currentImage, setCurrentImage ] = useState(defaultImage);

  const [ prioritySet, setPrioritySet ] = useState([ ]);
  const [ checked, setChecked ] = useState(workData.priority);

  useEffect(() => {
    getPrioritySet()
        .then((result) => setPrioritySet(result));
  }, [ ]);

  const [ title, setTitle ] = useState(workData.title);
  const [ price, setPrice ] = useState(workData.price.toString());

  const dispatch = useDispatch();

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView>
        <View style={ styles.workImageSelectBtnContainer }>
          <TouchableOpacity
              style={ styles.workImageSelectBtn }
              onPress={ () => selectImage(setCurrentImage) }>
            <Image
                style={ styles.workImage }
                source={ currentImage.isDefault ? currentImage.src : { uri: currentImage.src } }
                resizeMode='contain' />
          </TouchableOpacity>
          <Text style={ styles.workImageSelectBtnTitle }>작품/굿즈 이미지</Text>
        </View>
        <View style={ styles.textInputContainer }>
          <TextInput style={ styles.textInput } placeholder='타이틀'
              placeholderTextColor='#868e96'
              onChangeText={ (e) => setTitle(e) }
              value={ title } />
          <TextInput style={ styles.textInput }
              placeholder='가격' placeholderTextColor='#868e96'
              inputMode='numeric'
              onChangeText={ (n) => setPrice(n) }
              value={ price } />
        </View>
        <Text style={ styles.title }>우선순위</Text>
        <View style={ styles.radioContainer }>
          {
            prioritySet.map((item) => {
              return (
                <RadioBtn key={ item.priority } item={ item } checker={ [ checked, setChecked ] } />
              );
            })
          }
        </View>
      </ScrollView>
      <View style={ styles.btnContainer }>
        {
          isEdit
              ? <TouchableOpacity
                      style={ styles.deleteBtn }
                      onPress={ () => {
                        Alert.alert('', '정말 삭제하겠습니까?', [
                          {
                            text: 'OK',
                            onPress: () => deleteWork(workData, navigation, dispatch)
                          },
                          {
                            text: 'Cancel'
                          }
                        ]);
                      } }>
                  <Text style={ styles.btnTitle }>삭제</Text>
                </TouchableOpacity>
              : null
        }
        <TouchableOpacity
            style={ styles.completeBtn }
            onPress={ () => {
              const data = {
                id: workData.id,
                title: title,
                checked: workData.checked,
                image: currentImage,
                priority: checked,
                price: price,
                circle_id: circleData.circle_id,
              }
              onComplete(data, navigation, isEdit, dispatch);
            } }>
          <Text style={ styles.btnTitle }>완료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

async function selectImage(setCurrentImage) {
  const result = await launchImageLibrary();
  if (result.didCancel) {
    console.log('launchImage was canceled');
    return;
  }
  const fileUri = result.assets[0].uri;
  setCurrentImage({ src: fileUri, isDefault: false });
}

function RadioBtn({ item, checker }) {
  const [ checked, setChecked ] = checker;
  const styleObj = {
    width: PRIORITY_COLOR_SQUARE_WIDTH_AND_SIZE,
    height: PRIORITY_COLOR_SQUARE_WIDTH_AND_SIZE,
    backgroundColor: item.color,
  }
  return (
    <View style={ styles.radioItem }>
      <RadioButton
            value={ item.title }
            status={ checked == item.priority ? 'checked' : 'unchecked' }
            onPress={ () => setChecked(item.priority) } />
      <View style={ styleObj } />
      <Text style={ styles.radioBtnLabel }>{ item.title }</Text>
    </View>
  )
}

async function deleteWork(workData, navigation, dispatch) {
  const currentBudget = await onDeleteWorkRequest(workData);
  dispatch(setCurrentBudget(currentBudget));
  navigation.goBack();
}

function onComplete(data, navigation, isEdit, dispatch) {
  completeAddingWork(data, isEdit, dispatch)
      .then((result) => navigation.goBack());
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  workImageSelectBtnContainer: {
    margin: 10,
    padding: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  workImageSelectBtn: {
    padding: 10,
    borderColor: `${ MAIN_GRAY_COLOR }`,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workImageSelectBtnTitle: {
    color: `${ SUB_GRAY_COLOR }`,
  },
  workImage: {
    width: 100,
    height: 100,
  },
  textInputContainer: {
    padding: 20,
    marginRight: 50,
    gap: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: `${ SUB_GRAY_COLOR }`,
    color: `${ SUB_GRAY_COLOR }`,
    padding: 13,
    borderRadius: 5,
  },
  title: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 20,
    marginLeft: 10,
    marginTop: 15,
  },
  radioConatiner: {
    marginTop: 10,
  },
  radioBtnLabel: {
    color: `${ SUB_GRAY_COLOR }`,
    marginLeft: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    gap: 30,
  },
  completeBtn: {
    backgroundColor: `${ MAIN_BLUE_COLOR }`,
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  btnTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
  deleteBtn: {
    backgroundColor: `${ MAIN_RED_COLOR }`,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 100,
  },
});

export default AddWorkScreen;