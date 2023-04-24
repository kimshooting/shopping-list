import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CIRCLE_PARTICIPATE_TABLE } from '../data/metadata';
import { useDispatch } from 'react-redux';
import { setSelectedCircle } from '../data/store';
import { db } from '../backend/db';

function CircleSelectScreen({ navigation }) {
  const [ searchText, setSearchText ] = useState('');
  const dispatch = useDispatch();

  const [ list, setList ] = useState([ ]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT * FROM ${ CIRCLE_PARTICIPATE_TABLE };
      `, [ ], (tx, results) => {
        const len = results.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          const obj = results.rows.item(i);
          obj.selected = false;
          data.push(obj);
        }
        setList(data);
      },
      (err) => console.error(err));
    });
  }, [ ]);

  const selectedFileInitialStateData = {
    id: -1,
    space: '',
    penname: '',
    circle_name: '',
  }
  const [ selectedFile, setSelectedFile ] = useState(selectedFileInitialStateData);

  return (
    <SafeAreaView>
      <View style={ styles.searchBar }>
        <TextInput style={ styles.searchTextInput }
            onChangeText={ e => setSearchText(e) } />
        <Button title='검색' style={ styles.searchButton }
            onPress={ () => search(searchText, setList, selectedFile) } />
      </View>
      <Button
          title='선택완료'
          onPress={ () => onSelectComplete(dispatch, navigation, selectedFile) }
          disabled={ selectedFile.id == -1 } />
      <FlatList
          data={ list }
          renderItem={ ({ item }) => <Item data={ item } onPress={ () => onItemPress(list, setList, item, selectedFile, setSelectedFile) } /> } />
    </SafeAreaView>
  )
}

function Item({ data, onPress }) {
  const itemStyle = data.selected ? styles.selectedItem : styles.item;
  return (
    <TouchableOpacity style={ itemStyle }
        onPress={ onPress }>
      <Text style={ styles.space }>{ data.space }</Text>
      <Text style={ styles.penname }>{ data.penname }</Text>
      <Text style={ styles.circle }>{ data.circle_name }</Text>
    </TouchableOpacity>
  );
}

function search(searchText, setList, selectedFile) {
  const query = `
    SELECT * FROM ${ CIRCLE_PARTICIPATE_TABLE }
    WHERE circle_name LIKE '%${ searchText }%';
  `;
  db.transaction((tx) => {
    tx.executeSql(query, [ ], (tx, results) => {
      const len = results.rows.length;
      const data = [ ];
      for (let i = 0; i < len; i++) {
        const obj = results.rows.item(i);
        obj.selected = obj.id == selectedFile.id ? true : false;
        data.push(obj);
      }
      setList(data);
      for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
      }
    });
  });
}

function onItemPress(list, setList, data, selectedFile, setSelectedFile) {
  const newList = [ ...list ];
  if (selectedFile.id != -1) {
    for (let i = 0 ; i < newList.length; i++) {
      if (newList[i].id == selectedFile.id) {
        newList[i].selected = false;
      }
    }
  }

  const obj = {
    id: data.id,
    space: data.space,
    penname: data.penname,
    circle_name: data.circle_name,
  }

  for (let i = 0 ; i < newList.length; i++) {
    if (newList[i].id == obj.id) {
      newList[i].selected = true;
    }
  }

  setSelectedFile(obj);
  setList(newList);
}

function onSelectComplete(dispatch, navigation, selectedData) {
  dispatch(setSelectedCircle(selectedData));
  navigation.goBack();
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
  },
  searchTextInput: {
    color: '#000',
    borderWidth: 1,
    borderColor: '#000',
    flex: 3,
  },
  searchButton: {
    flex: 1,
  },
  item: {
    borderColor: '#000',
    borderWidth: 1,
  },
  selectedItem: {
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#ced4da',
  },
  circle: {
    color: '#000',
  },
  penname: {
    color: '#000',
  },
  space: {
    color: '#000',
  },
});

export default CircleSelectScreen;