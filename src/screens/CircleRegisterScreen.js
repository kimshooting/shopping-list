import { useEffect, useState } from 'react';
import { Button, Image, SafeAreaView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { CIRCLE_IMAGE_DIRECTORY, DEFAULT_IMAGE, PRIORITY_TABLE, REGISTERED_TABLE } from '../data/metadata';
import { RadioButton } from 'react-native-paper';
import { copyAsync } from 'expo-file-system';
import { db } from '../db';

function CircleRegisterScreen({ navigation }) {
  const selectedCircle = useSelector((state) => state.selectedCircle);

  const defaultImage = { src: require('../../public/null-image.png'), isDefault: true };
  const [ circleImage, setCircleImage ] = useState(defaultImage);

  const [ prioritySet, setPrioritySet ] = useState([ ]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT * FROM ${ PRIORITY_TABLE };
      `, [ ], (tx, results) => {
        const len = results.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          data.push(results.rows.item(i));
        }
        setPrioritySet(data);
      }, (err) => {
        console.error(err);
      });
    });
  }, [ ]);

  const [ checked, setChecked ] = useState(1);

  return (
    <SafeAreaView style={ styles.container }>
      <View>
        <Button
            title='서클 선택'
            onPress={ () => navigation.navigate('CircleSelect') } />
        <Text style={ styles.label }>서클 위치</Text>
        <Text style={ styles.text }>{ Object.keys(selectedCircle).length == 0 ? '없음' : selectedCircle.space }</Text>
        <Text style={ styles.label }>펜네임</Text>
        <Text style={ styles.text }>{ Object.keys(selectedCircle).length == 0 ? '없음' : selectedCircle.penname }</Text>
        <Text style={ styles.label }>서클명</Text>
        <Text style={ styles.text }>{ Object.keys(selectedCircle).length == 0 ? '없음' : selectedCircle.circle_name }</Text>
        <View style={ styles.radioConatiner }>
          {
            prioritySet.map((item) => {
              return (
                <RadioBtn key={ item.priority } item={ item } checker={ [ checked, setChecked ] } />
              );
            })
          }
        </View>
        <Button
            title='서클 이미지 선택'
            onPress={ () => selectImage(setCircleImage) } />
        <Image
            style={ styles.circleImage }
            source={ circleImage.isDefault ? circleImage.src : { uri: circleImage.src } }
            resizeMode='contain' />
      </View>
      <Button
          style={ styles.registerButton }
          title='등록'
          onPress={ () => {
                onRegister(selectedCircle, circleImage, checked);
                navigation.goBack();
              } } />
    </SafeAreaView>
  );
}

async function selectImage(setCircleImage) {
  const result = await launchImageLibrary();
  if (result.didCancel) {
    console.log('launchImage was canceled');
    return null;
  }
  const fileUri = result.assets[0].uri;
  setCircleImage({ src: fileUri, isDefault: false });
}

function onRegister(selectedCircle, circleImage, checkedPriority) {
  if (Object.keys(selectedCircle) == 0) {
    ToastAndroid.show('서클을 선택하시오', ToastAndroid.SHORT);
    return;
  }

  let imagePath = '';
  if (!circleImage.isDefault) {
    const filename = circleImage.src.split('/').pop();
    imagePath = CIRCLE_IMAGE_DIRECTORY + filename;
    copyAsync({
      from: circleImage.src,
      to: imagePath
    }).then((result) => console.log(result)).catch((err) => {
      console.error(err);
    });
  } else {
    imagePath = DEFAULT_IMAGE;
  }

  db.transaction((tx) => {
    tx.executeSql(`
      INSERT INTO ${ REGISTERED_TABLE } (circle_image_path, circle_id, priority) VALUES
        ('${ imagePath }', ${ selectedCircle.id }, ${ checkedPriority });
    `, [ ], (tx, results) => console.log(results), (err) => console.log(err));
  });
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 100
  },
  text: {
    color: '#000',
  },
  label: {
    color: '#000',
  },
  circleImage: {
    width: 100,
    height: 100,
  },
  radioConatiner: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  registerButton: {

  },
});

export default CircleRegisterScreen;