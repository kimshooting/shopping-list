import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { db } from '../App';
import { CURRENT_ORDER, METADATA_TABLE, ORDER_BY_CIRCLE_NAME, ORDER_BY_PENNAME, ORDER_BY_PRIORITY, ORDER_BY_SPACE } from '../data/metadata';
import { setCurrentOrderMode } from '../data/store';
import { useDispatch } from 'react-redux';

function HomeToolbar() {
  const [ searchText, setSearchText ] = useState('');
  const [ modalVisible, setModalVisible ] = useState(false);
  const dispatch = useDispatch();

  const [ selectedOrder, setSelectedOrder ] = useState(-1);

  return (
    <View style={ styles.container }>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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
                  setModalVisible(!modalVisible);
                }}>
              <Text style={styles.textStyle}>정렬</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Button
          title='검색'
          onPress={ () => Alert.alert('asdf', 'asdf') } />
      <TextInput style={ styles.searchText }
          onChangeText={ (e) => setSearchText(e) } />
      <Button
          title='정렬 기준'
          onPress={ () => setModalVisible(true) }  />
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