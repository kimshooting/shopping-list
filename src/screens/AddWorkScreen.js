import { useEffect, useState } from 'react';
import { Button, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import { db } from '../App';
import { DEFAULT_IMAGE, DEFAULT_WORK_TITLE, PRIORITY_TABLE, WORK_IMAGE_DIRECTORY, WORK_REGISTERED_TABLE, WORK_TABLE } from '../data/metadata';
import { copyAsync, moveAsync } from 'expo-file-system';
import { calculateCurrentBudget } from '../function/function';
import { useDispatch } from 'react-redux';
import { setCurrentBudget } from '../data/store';

function AddWorkScreen({ route, navigation }) {
  const circleData = route.params.circleData;
  const isEdit = route.params.isEdit;
  const workData = route.params.workData;
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
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT * FROM ${ PRIORITY_TABLE };
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          data.push(result.rows.item(i));
        }
        setPrioritySet(data);
      }, (err) => console.error(err));
    });
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
      <Button
          title='완료'
          onPress={ () => {
            const data = {
              id: workData.id,
              title: title,
              checked: 0,
              image: currentImage,
              priority: checked,
              price: price,
              circle_id: circleData.circle_id,
            }
            onComplete(data, navigation, isEdit, dispatch);
          } } />
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

async function onComplete(data, navigation, isEdit, dispatch) {
  console.log(data);
  if (data.title == '') {
    data.title = DEFAULT_WORK_TITLE;
  }
  data.title = data.title.replace(`'`, `''`);
  if (data.price == '') {
    data.price = '0';
  }
  if (data.image.isDefault) {
    data.image.src = DEFAULT_IMAGE;
  } else {
    const filename = data.image.src.split('/').pop();
    const imagePath = WORK_IMAGE_DIRECTORY + filename;
    await moveAsync({
          from: data.image.src,
          to: imagePath
        }).then((result) => console.log(result))
        .catch((err) => console.error(err));
    data.image.src = imagePath;
  }

  let sql = '';
  if (isEdit) {
    console.log('update');
    sql = `
        UPDATE ${ WORK_TABLE } SET title = '${ data.title }', checked = ${ data.checked }, image_path = '${ data.image.src }',
            priority = ${ data.priority }, price = ${ data.price } WHERE id = ${ data.id };`;
  } else {
    console.log('insert');
    sql = `
        INSERT INTO ${ WORK_TABLE } (title, checked, image_path, priority, price, circle_id) VALUES
          ('${ data.title }', ${ data.checked }, '${ data.image.src }', ${ data.priority }, ${ data.price }, ${ data.circle_id });`
  }

  await db.transaction((tx) => {
    tx.executeSql(sql, [ ], (tx, result) => console.log(result), (err) => console.log(err));
  });

  calculateCurrentBudget().then((result) => dispatch(setCurrentBudget(result)));

  navigation.goBack();
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