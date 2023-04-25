import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_IMAGE } from '../data/constants';
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
      {/* <Header /> */}
      <Text style={ styles.label }>서클 위치</Text>
      <Text style={ styles.text }>{ dataFromPrevious.space }</Text>
      <Text style={ styles.label }>펜네임</Text>
      <Text style={ styles.text }>{ dataFromPrevious.penname }</Text>
      <Text style={ styles.label }>서클명</Text>
      <Text style={ styles.text }>{ dataFromPrevious.circle_name }</Text>
      <View style={ styles.radioContainer }>
        {
          prioritySet.map((item) => {
            return (
              <RadioBtn key={ item.priority } item={ item } checker={ [ checked, setChecked ] }
                  current={ dataFromPrevious } />
            );
          })
        }
      </View>
      <Button
          color='red'
          title='서클 삭제'
          onPress={() => onDelete(navigation, dataFromPrevious.circle_id, workList, setWorkList) } />
      <Button title='작품 추가' onPress={ () => {
            toAddWork(navigation, dataFromPrevious);
          } } />
      <FlatList
          style={ styles.workContainerList }
          data={ workList }
          renderItem={ ({ item }) => <WorkItem circleData={ dataFromPrevious } workData={ item } colorSet={ prioritySet } navigation={ navigation } /> }
          keyExtractor={ (item) => item.id } />
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
    width: 25,
    height: 25,
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
      <Text style={ styles.text }>{ item.title }</Text>
    </View>
  )
}

function WorkItem({ circleData, workData, colorSet, navigation }) {
  const imageSrc = workData.image_path == DEFAULT_IMAGE
      ? require('../../public/null-image.png')
      : { uri: workData.image_path };
  const styleObj = {
    width: 25,
    height: 25,
    backgroundColor: colorSet[workData.priority - 1].color,
  }
  return (
    <TouchableOpacity style={ styles.workItem }
        onPress={ () => editWork(circleData, workData, navigation) }>
      <Image
          style={ styles.workImage }
          source={ imageSrc }
          resizeMode='contain' />
      <View>
        <View style={ styleObj } />
        <Text style={ styles.text }>{ workData.title }</Text>
        <Text style={ styles.text }>{ workData.price }</Text>
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
  header: {
    flexDirection: 'row',
  },
  text: {
    color: '#000',
  },
  label: {
    color: '#000',
  },
  radioContainer: {
    flexDirection: 'column',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workImage: {
    width: 100,
    height: 100,
  },
  workItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workContainerList: {
    flex: 1,
  },
});

export default CircleEditScreen;