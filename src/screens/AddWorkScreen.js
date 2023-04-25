import { useEffect, useState } from 'react';
import { Alert, Button, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import { DEFAULT_IMAGE } from '../data/constants';
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
      <View>
        <TouchableOpacity
            onPress={ () => selectImage(setCurrentImage) }>
          <Image
              style={ styles.image }
              source={ currentImage.isDefault ? currentImage.src : { uri: currentImage.src } }
              resizeMode='contain' />
        </TouchableOpacity>
        <TextInput style={ styles.textInput } placeholder='타이틀'
            placeholderTextColor='#868e96'
            onChangeText={ (e) => setTitle(e) }
            value={ title } />
        <TextInput style={ styles.textInput }
            placeholder='가격' placeholderTextColor='#868e96'
            inputMode='numeric'
            onChangeText={ (n) => setPrice(n) }
            value={ price } />
        <Text style={ styles.text }>우선순위</Text>
        <View style={ styles.radioContainer }>
          {
            prioritySet.map((item) => {
              return (
                <RadioBtn key={ item.priority } item={ item } checker={ [ checked, setChecked ] } />
              );
            })
          }
        </View>
      </View>
      <View>
        {
          isEdit
              ? <Button
                    color='red'      
                    title='삭제'
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
                    } } />
              : null
        }
        <Button
            title='완료'
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
            } } />
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
    width: 25,
    height: 25,
    backgroundColor: item.color,
  }
  return (
    <View style={ styles.radioItem }>
      <RadioButton
            value={ item.title }
            status={ checked == item.priority ? 'checked' : 'unchecked' }
            onPress={ () => setChecked(item.priority) } />
      <View style={ styleObj } />
      <Text style={ styles.text }>{ item.title }</Text>
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
  image: {
    width: 100,
    height: 100,
  },
  text: {
    color: '#000',
  },
  label: {
    color: '#000',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
  },
  radioConatiner: {
    flexDirection: 'column',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default AddWorkScreen;