import { useEffect, useState } from 'react';
import { Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../App';
import { CIRCLE_PARTICIPATE_TABLE, DEFAULT_IMAGE, PRIORITY_TABLE, REGISTERED_TABLE, WORK_REGISTERED_TABLE, WORK_TABLE } from '../data/metadata';
import { RadioButton } from 'react-native-paper';

function CircleEditScreen({ route, navigation }) {
  const dataFromPrevious = route.params.data;

  const [ prioritySet, setPrioritySet ] = useState([ ]);
  const [ checked, setChecked ] = useState(dataFromPrevious.priority);
  const [ workList, setWorkList ] = useState([ ]);

  const dbTask = async () => {
    await db.transaction((tx) => {
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

    await db.transaction((tx) => {
      tx.executeSql(`
        SELECT id, title, checked, image_path,
               priority, price
        FROM ${ WORK_TABLE }
        WHERE circle_id = ${ dataFromPrevious.circle_id }
        ORDER BY priority;
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          data.push(result.rows.item(i));
        }
        setWorkList(data);
      }, (err) => console.error(err));
    });
  };

  useEffect(() => {
    dbTask();
  }, [ ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dbTask();
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
          color='#c92a2a'
          title='서클 삭제'
          onPress={() => console.log('Delete') } />
      <Button title='작품 추가' onPress={ () => navigation.navigate('AddWork', { data: dataFromPrevious }) } />
      <FlatList
          style={ styles.workContainerList }
          data={ workList }
          renderItem={ ({ item }) => <WorkItem data={ item } colorSet={ prioritySet } /> }
          keyExtractor={ (item) => item.id } />
    </SafeAreaView>
  );
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
              db.transaction((tx) => {
                tx.executeSql(`
                  UPDATE ${ REGISTERED_TABLE } SET priority = ${ item.priority }
                  WHERE id = ${ current.id };
                `);
              });
              setChecked(item.priority);
            } } />
      <View style={ styleObj } />
      <Text style={ styles.text }>{ item.title }</Text>
    </View>
  )
}

function WorkItem({data, colorSet}) {
  const imageSrc = data.image_path == DEFAULT_IMAGE
      ? require('../../public/null-image.png')
      : { uri: data.image_path };
  const styleObj = {
    width: 25,
    height: 25,
    backgroundColor: colorSet[data.priority - 1].color,
  }
  return (
    <TouchableOpacity style={ styles.workItem }>
      <Image
          style={ styles.workImage }
          source={ imageSrc }
          resizeMode='contain' />
      <View>
        <View style={ styleObj } />
        <Text style={ styles.text }>{ data.title }</Text>
        <Text style={ styles.text }>{ data.price }</Text>
      </View>
    </TouchableOpacity>
  );
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