import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setSelectedCircle } from '../data/store';
import { getAllCircleData, searchCircle } from '../backend/controller/allCircleController';

function CircleSelectScreen({ navigation }) {
  const [ searchText, setSearchText ] = useState('');
  const dispatch = useDispatch();

  const [ list, setList ] = useState([ ]);

  useEffect(() => {
    getAllCircleData()
        .then((result) => setList(result.response));
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
            onPress={ () => searchCircle(searchText, selectedFile.id)
                .then((result) => setList(result.response)) } />
      </View>
      <FlatList
          // style={ styles.circleList }
          data={ list }
          renderItem={ ({ item }) => <Item data={ item } onPress={ () => onItemPress(list, setList, item, selectedFile, setSelectedFile) } /> }
          contentContainerStyle={ { flexGrow: 0, } }  />
      <Button
          title='선택완료'
          onPress={ () => onSelectComplete(dispatch, navigation, selectedFile) }
          disabled={ selectedFile.id == -1 } />
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
  circleList: {
    flex: 1,
  },
  searchButton: {
  },
});

export default CircleSelectScreen;