import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_IMAGE, MAIN_BLUE_COLOR, MAIN_GRAY_COLOR, MAIN_RED_COLOR, PRIORITY_COLOR_SQUARE_WIDTH_AND_SIZE, SUB_GRAY_COLOR } from '../data/constants';
import { RadioButton } from 'react-native-paper';
import { getPrioritySet } from '../backend/function/function';
import { getWorkData } from '../backend/controller/workDataController';
import { onDeleteCircle, updateRegisteredCircleDataById } from '../backend/controller/registeredCircleController';

function CircleEditScreen({ route, navigation }) {
  const dataFromPrevious = route.params.data;

  const [ prioritySet, setPrioritySet ] = useState([ ]);
  const [ checked, setChecked ] = useState(dataFromPrevious.priority);
  const [ workList, setWorkList ] = useState([ ]);

  const init = async () => {
    const prioritySet = await getPrioritySet();
    const workQueryResult = await getWorkData('', [ 1, 2, 3, 4, 5 ],
        -1, true, dataFromPrevious.circle_id, false);
    setPrioritySet(prioritySet);
    setWorkList(workQueryResult.response);
  }

  useEffect(() => {
    init();
  }, [ ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      init();
    });
    return unsubscribe;
  }, [ navigation ]);

  return (
    <SafeAreaView style={ styles.container }>
      <View style={ styles.infoConatiner }>
        <View style={ styles.circleInfoContainer }>
          <View style={ styles.circleInfoUnit }>
            <Text style={ styles.label }>서클 위치</Text>
            <Text style={ styles.text }>{ dataFromPrevious.space }</Text>
          </View>
          <View style={ styles.circleInfoUnit }>
            <Text style={ styles.label }>펜네임</Text>
            <Text style={ styles.text }>{ dataFromPrevious.penname }</Text>
          </View>
          <View style={ styles.circleInfoUnit }>
            <Text style={ styles.label }>서클명</Text>
            <Text style={ styles.text }>{ dataFromPrevious.circle_name }</Text>
          </View>
        </View>
        <View style={ styles.radioContainer }>
          <Text style={ styles.title }>우선순위 선택</Text>
          {
            prioritySet.map((item) => {
              return (
                <RadioBtn key={ item.priority } item={ item } checker={ [ checked, setChecked ] }
                    current={ dataFromPrevious } />
              );
            })
          }
        </View>
      </View>
      <TouchableOpacity
          style={ styles.deleteCircleBtn }
          onPress={() => onDelete(navigation, dataFromPrevious.circle_id, workList, setWorkList) }>
        <Text style={ styles.btnTitle }>서클 삭제</Text>
      </TouchableOpacity>
    
      <View style={ styles.workContainer }>
        <TouchableOpacity
            style={ styles.addWorkBtn }
            onPress={ () => {
              toAddWork(navigation, dataFromPrevious);
            } }>
          <Text style={ styles.btnTitle }>작품 추가</Text>
        </TouchableOpacity>
        <FlatList
            data={ workList }
            renderItem={ ({ item }) => <WorkItem circleData={ dataFromPrevious } workData={ item } colorSet={ prioritySet } navigation={ navigation } /> }
            keyExtractor={ (item) => item.id }
            contentContainerStyle={ styles.workList } />
      </View>
    </SafeAreaView>
  );
}

function toAddWork(navigation, dataFromPrevious) {
  const workData = {
    title: '',
    price: '',
    checked: 0,
    priority: dataFromPrevious.priority,
    image_path: DEFAULT_IMAGE,
  }
  navigation.navigate('AddWork', { circleData: dataFromPrevious, isEdit: false, workData: workData });
}

function onDelete(navigation, circleId, workList) {
  const deleteCircle = async () => {
    onDeleteCircle(circleId, workList)
        .then((result) => {
          console.log('delete complete');
          navigation.goBack();
        });
  }
  Alert.alert('', '정말 삭제하겠습니까?', [
    {
      text: 'OK',
      onPress: () => deleteCircle()
    },
    {
      text: 'Cancel'
    }
  ]);
}

function RadioBtn({ item, checker, current }) {
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
            onPress={ async () => {
              const to = [
                {
                  column: 'priority',
                  value: item.priority
                }
              ];
              const ids = [ current.id ];
              updateRegisteredCircleDataById(to, ids);
              setChecked(item.priority);
            } } />
      <View style={ styleObj } />
      <Text style={ styles.radioButtonLabel }>{ item.title }</Text>
    </View>
  )
}

function WorkItem({ circleData, workData, colorSet, navigation }) {
  const imageSrc = workData.image_path == DEFAULT_IMAGE
      ? require('../../public/null-image.png')
      : { uri: workData.image_path };
  return (
    <TouchableOpacity style={ styles.workItem }
        onPress={ () => editWork(circleData, workData, navigation) }>
      <Image
          style={ [ styles.workImage, { borderColor: colorSet[workData.priority - 1].color } ] }
          source={ imageSrc }
          resizeMode='contain' />
      <View style={ styles.workInfo }>
        <Text style={ styles.workTitle }>{ workData.title }</Text>
        <Text style={ styles.workPrice }>{ workData.price }</Text>
      </View>
    </TouchableOpacity>
  );
}

function editWork(circleData, workData, navigation) {
  navigation.navigate('AddWork', { circleData: circleData, isEdit: true, workData: workData });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoConatiner: {
    flexDirection: 'row',
    gap: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  circleInfoContainer: {
    margin: 10,
    gap: 3,
    marginBottom: 20,
  },
  circleInfoUnit: {
    
  },
  text: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 20,
  },
  label: {
    color: `${ SUB_GRAY_COLOR }`,
    fontSize: 14,
  },
  title: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 16,
    marginLeft: 13,
  },
  radioContainer: {
    flexDirection: 'column',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  radioButtonLabel: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 14,
  },
  deleteCircleBtn: {
    backgroundColor: `${ MAIN_RED_COLOR }`,
    marginHorizontal: 50,
    padding: 15,
    paddingHorizontal: 35,
    borderRadius: 100,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: `${ SUB_GRAY_COLOR }`,
    paddingTop: 30,
    marginTop: 30,
  },
  addWorkBtn: {
    backgroundColor: `${ MAIN_BLUE_COLOR }`,
    marginHorizontal: 50,
    marginBottom: 20,
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
  workList: {
    gap: 15,
  },
  workItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  workImage: {
    width: 100,
    height: 100,
    borderWidth: 3,
  },
  workInfo: {
    marginTop: 10,
    marginLeft: 10,
  },
  workTitle: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 18,
  },
  workPrice: {
    color: `${ SUB_GRAY_COLOR }`,
    fontSize: 14,
  },
});

export default CircleEditScreen;