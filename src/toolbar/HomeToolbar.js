import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { db } from '../App';
import { CURRENT_ORDER, METADATA_TABLE, ORDER_BY_CIRCLE_NAME, ORDER_BY_PENNAME, ORDER_BY_PRIORITY, ORDER_BY_SPACE, SEARCH_KEYWORD } from '../data/metadata';
import { setCurrentBudget, setCurrentOrderMode } from '../data/store';
import { useDispatch, useSelector } from 'react-redux';
import { calculateCurrentBudget } from '../function/function';

const MODES = {
  by_circle: {
    key: 60,
    title: '서클명'
  },
  by_penname: {
    key: 120,
    title: '펜네임'
  },
  by_space: {
    key: 180,
    title: '서클위치'
  }
}

function HomeToolbar() {
  const [ searchText, setSearchText ] = useState('');
  const [ searchModalVisible, setSearchModalVisible ] = useState(false);
  const [ orderModalVisible, setOrderModalVisible ] = useState(false);
  const dispatch = useDispatch();

  const [ selectedOrder, setSelectedOrder ] = useState(-1);
  const [ searchMode, setSearchMode ] = useState(MODES.by_circle);
  const currentBudget = useSelector((state) => state.currentBudget);
  useEffect(() => {
    calculateCurrentBudget()
        .then((result) => dispatch(setCurrentBudget(result)))
        .catch((err) => {
          console.log(err);
          dispatch(setCurrentBudget(0));
        });
  }, [ ]);

  useEffect(() => {

  }, [ currentBudget ]);

  return (
    <View style={ styles.container }>
      <Modal
        animationType='fade'
        transparent={true}
        visible={orderModalVisible}
        onRequestClose={() => {
          setOrderModalVisible(!orderModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={ selectedOrder == ORDER_BY_PRIORITY ? styles.selected : null }
                onPress={ () => onListItemPress(setSelectedOrder, ORDER_BY_PRIORITY) }>
              <Text style={ styles.modalText }>중요도순</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ selectedOrder == ORDER_BY_CIRCLE_NAME ? styles.selected : null }
                onPress={ () => onListItemPress(setSelectedOrder, ORDER_BY_CIRCLE_NAME) }>
              <Text style={ styles.modalText }>서클명순</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ selectedOrder == ORDER_BY_PENNAME ? styles.selected : null }
                onPress={ () => onListItemPress(setSelectedOrder, ORDER_BY_PENNAME) }>
              <Text style={ styles.modalText }>펜네임순</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ selectedOrder == ORDER_BY_SPACE ? styles.selected : null }
                onPress={ () => onListItemPress(setSelectedOrder, ORDER_BY_SPACE) }>
              <Text style={ styles.modalText }>서클위치순</Text>
            </TouchableOpacity>
            <Pressable
                style={ [styles.button, styles.buttonClose] }
                onPress={() => {
                  onOrderButtonPress(selectedOrder, dispatch);
                  setOrderModalVisible(!orderModalVisible);
                }}>
              <Text style={styles.textStyle}>정렬</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='fade'
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={() => {
          setSearchModalVisible(!searchModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={ () => {
                  Alert.alert('', '', [
                    {
                      text: MODES.by_circle.title,
                      onPress: () => setSearchMode(MODES.by_circle)
                    },
                    {
                      text: MODES.by_penname.title,
                      onPress: () => setSearchMode(MODES.by_penname)
                    },
                    {
                      text: MODES.by_space.title,
                      onPress: () => setSearchMode(MODES.by_space)
                    }
                  ]);
                } }>
              <Text style={ styles.modalText }>{ searchMode.title }(으)로 검색</Text>
            </TouchableOpacity>
            <TextInput style={ [ styles.modalText, { width: 150 } ] }
                onChangeText={ (txt) => setSearchText(txt) }
                value={ searchText } />
            <Pressable
                style={ [styles.button, styles.buttonClose] }
                onPress={() => {
                  onSearchButtonPress(searchMode, searchText, dispatch);
                  setSearchModalVisible(false);
                }}>
              <Text style={styles.textStyle}>검색</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Button
          title='검색'
          onPress={ () => setSearchModalVisible(true) } />
      <Button
          title='정렬 기준'
          onPress={ () => setOrderModalVisible(true) }  />
      <Text style={ styles.modalText }>{ currentBudget }</Text>
    </View>
  );
}

function onListItemPress(setSelectedOrder, to) {
  setSelectedOrder(to);
}

async function onOrderButtonPress(to, dispatch) {
  await db.transaction((tx) => {
    tx.executeSql(`
      SELECT key, value FROM ${ METADATA_TABLE } 
      WHERE key = '${ CURRENT_ORDER }';
    `, [ ], async (tx, result) => {
      if (result.rows.length == 0) {
        console.log('INSERT');
        await tx.executeSql(`
          INSERT INTO ${ METADATA_TABLE } VALUES
            ('${ CURRENT_ORDER }', ${ to });
        `);
      } else {
        console.log('UPDATE');
        await tx.executeSql(`
          UPDATE ${ METADATA_TABLE } SET value = '${ to }' WHERE key = '${ CURRENT_ORDER }';
        `);
      }
      console.log('dispatch');
      dispatch(setCurrentOrderMode(Math.random()));
    });
  });
}

function onSearchButtonPress(searchMode, searchText, dispatch) {
  let sql = 'WHERE ';
  switch (searchMode.key) {
    case MODES.by_circle.key:
      sql += 'p.circle_name LIKE ';
      break;
    case MODES.by_penname.key:
      sql += 'p.penname LIKE ';
      break;
    case MODES.by_space.key:
      sql += 'p.space LIKE ';
      break;
  }
  if (searchText == '') {
    sql += `''%''`;
  } else {
    sql += `''%${ searchText }%''`;
  }
  db.transaction((tx) => {
    tx.executeSql(`
      SELECT key, value FROM ${ METADATA_TABLE }
      WHERE key = '${ SEARCH_KEYWORD }';
    `, [ ], (tx, result) => {
      if (result.rows.length == 0) {
        tx.executeSql(`
          INSERT INTO ${ METADATA_TABLE } VALUES
              ('${ SEARCH_KEYWORD }', '${ sql }');
        `, [ ], (tx, result) => dispatch(setCurrentOrderMode(Math.random())),
        (err) => console.error(err));
      } else {
        tx.executeSql(`
          UPDATE ${ METADATA_TABLE } SET value = '${ sql }'
          WHERE key = '${ SEARCH_KEYWORD }';
        `, [ ], (tx, result) => dispatch(setCurrentOrderMode(Math.random())),
        (err) => console.error(err));
      }
    });
  });
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: '#ced4da',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
});

export default HomeToolbar;