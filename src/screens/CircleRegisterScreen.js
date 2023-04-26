import { useEffect, useState } from 'react';
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { RadioButton } from 'react-native-paper';
import { getPrioritySet } from '../backend/function/function';
import { registerCircle } from '../backend/controller/registeredCircleController';
import { MAIN_BLUE_COLOR, MAIN_GRAY_COLOR, PRIORITY_COLOR_SQUARE_WIDTH_AND_SIZE, SUB_BLUE_COLOR, SUB_GRAY_COLOR } from '../data/constants';

function CircleRegisterScreen({ navigation }) {
  const selectedCircle = useSelector((state) => state.selectedCircle);

  const defaultImage = { src: require('../../public/null-image.png'), isDefault: true };
  const [ circleImage, setCircleImage ] = useState(defaultImage);

  const [ prioritySet, setPrioritySet ] = useState([ ]);

  useEffect(() => {
    getPrioritySet().then((result) => setPrioritySet(result));
  }, [ ]);

  const [ checked, setChecked ] = useState(1);

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView style={ { flex: 1, } }>
        <View style={ styles.circleInfoContainer }>
          <View>
            <Text style={ styles.label }>서클 위치</Text>
            <Text style={ styles.text }>{ Object.keys(selectedCircle).length == 0 ? '없음' : selectedCircle.space }</Text>
            <Text style={ styles.label }>펜네임</Text>
            <Text style={ styles.text }>{ Object.keys(selectedCircle).length == 0 ? '없음' : selectedCircle.penname }</Text>
            <Text style={ styles.label }>서클명</Text>
            <Text style={ styles.text }>{ Object.keys(selectedCircle).length == 0 ? '없음' : selectedCircle.circle_name }</Text>
            <TouchableOpacity
                style={ styles.circleSelectBtn }
                onPress={ () => navigation.navigate('CircleSelect') }>
              <Text style={ styles.circleSelectBtnTitle }>서클 선택</Text>
            </TouchableOpacity>
          </View>
          <View style={ styles.imageSelectContainer }>
            <TouchableOpacity onPress={ () => selectImage(setCircleImage) }>
              <Image
                  style={ styles.circleImage }
                  source={ circleImage.isDefault ? circleImage.src : { uri: circleImage.src } }
                  resizeMode='contain' />
            </TouchableOpacity>
            <Text style={ styles.label }>서클 이미지</Text>
          </View>
        </View>
        <View style={ styles.radioConatiner }>
          <Text style={ styles.title }>서클 우선순위 선택</Text>
          {
            prioritySet.map((item) => {
              return (
                <RadioBtn key={ item.priority } item={ item } checker={ [ checked, setChecked ] } />
              );
            })
          }
        </View>
      </ScrollView>
      <TouchableOpacity
          style={ styles.registerButton }
          onPress={ () => onRegister(selectedCircle, circleImage, checked, navigation) }>
        <Text style={ styles.registerButtonTitle }>등록</Text>
      </TouchableOpacity>
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

function onRegister(selectedCircle, circleImage, checkedPriority, navigation) {
  if (Object.keys(selectedCircle) == 0) {
    ToastAndroid.show('서클을 선택하시오', ToastAndroid.SHORT);
    return;
  }

  registerCircle(selectedCircle, circleImage, checkedPriority)
      .then((result) => console.log(result));
  navigation.goBack();
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
      <View style={ styles.radioValue }>
        <View style={ styleObj } />
        <Text style={ styles.radioButtonLabel }>{ item.title }</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  circleInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: `${ MAIN_GRAY_COLOR }`,
  },
  circleSelectBtn: {
    marginTop: 10,
    width: 100,
    padding: 10,
    backgroundColor: `${ MAIN_GRAY_COLOR }`,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 4,
    marginLeft: 10,
  },
  circleSelectBtnTitle: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 20,
    marginLeft: 13,
    marginBottom: 10,
  },
  label: {
    color: `${ SUB_GRAY_COLOR }`,
    fontSize: 14,
  },
  circleImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: `${ MAIN_GRAY_COLOR }`,
    padding: 5,
  },
  radioConatiner: {
    flexDirection: 'column',
    marginTop: 15,
    marginLeft: 15,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  title: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 16,
    marginLeft: 13,
  },
  radioButtonLabel: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 14,
  },
  imageSelectContainer: {
    marginRight: 30,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: `${ MAIN_BLUE_COLOR }`,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 100,
  },
  registerButtonTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
  }
});

export default CircleRegisterScreen;