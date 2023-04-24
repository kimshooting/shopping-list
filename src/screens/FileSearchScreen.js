import { readAsStringAsync } from 'expo-file-system';
import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CIRCLE_PARTICIPATE_TABLE } from '../data/metadata';
import { db } from '../backend/db';

function FileSearchScreen({ route, navigation }) {
  const fileList = route.params.data;

  const [ listData, setListData ] = useState(null);

  useEffect(() => {
    const data = [ ];
    for (let i = 0; i < fileList.length; i++) {
      const splitArray = fileList[i].split('%2F');
      const title = splitArray.pop();
      const d = {
        id: i + 1,
        title: title,
        selected: false,
        uri: fileList[i],
      }
      data.push(d);
    }
    setListData(data);
  }, [ ]);

  const selectedFileInitialStateData = {
    idx: -1,
    uri: '',
  }
  const [ selectedFile, setSelectedFile ] = useState(selectedFileInitialStateData);

  return (
    <SafeAreaView
        style={ styles.container }>
      <Header data={ selectedFile.uri } navigation={ navigation } />
      <FlatList
        data={ listData }
        renderItem={ ({ item }) => 
          <TouchableOpacity
              onPress={ () => {
                const cache = [ ...listData ];
                if (selectedFile.idx != -1) {
                  cache[selectedFile.idx].selected = false;
                }
                cache[item.id - 1].selected = true;
                setListData(cache);

                const cache2 = {
                  idx: item.id - 1,
                  uri: item.uri,
                }
                setSelectedFile(cache2);
              } }>
            <Text style={ item.selected ? styles.listSelected : styles.listItem }>{ item.title }</Text>
          </TouchableOpacity> }
          keyExtractor={ (item) => item.id } />
    </SafeAreaView>
  );
}

function Header({ data, navigation }) {
  const uri = data;
  return (
    <Button
        title='Select'
        onPress={ () => { 
          loadData(uri, navigation);
          navigation.goBack();
        } } />
  )
}

function loadData(uri, navigation) {
  readAsStringAsync(uri)
      .then(async (result) => {
        const jsonObj = JSON.parse(result);
        await forCircleData(jsonObj);
        navigation.goBack();
      });
}

async function forCircleData(jsonObj) {
  await db.transaction((tx) => {
    tx.executeSql(`DELETE FROM ${ CIRCLE_PARTICIPATE_TABLE };`, [ ], (tx, results) => console.log('delete success'),
    (err) => console.error(err));
  });
  let sql = `INSERT INTO ${ CIRCLE_PARTICIPATE_TABLE } (space, penname, circle_name) VALUES `
  for (let obj of jsonObj) {
    obj.space = obj.space.replace('\'', '\'\'').replace('"', '""');
    obj.penname = obj.penname.replace('\'', '\'\'').replace('"', '""');
    obj.circlename = obj.circlename.replace('\'', '\'\'').replace('"','""');
    const line = `('${ obj.space }', '${ obj.penname }', '${ obj.circlename }'),`;
    sql += line;
  };
  sql = sql.substring(0, sql.length - 1);
  sql += ';';
  await db.transaction((tx) => {
    tx.executeSql(sql, [ ], (tx, results) => console.log('insert success'),
    (err) => console.error(err));
  });
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'space-between',
  },
  listItem: {
    color: '#000',
    fontSize: 18,
    padding: 12,
  },
  listSelected: {
    color: '#000',
    fontSize: 18,
    padding: 12,
    backgroundColor: '#ced4da',
  }
});

export default FileSearchScreen;