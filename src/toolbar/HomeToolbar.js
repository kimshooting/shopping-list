import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { BUDGET_CRITERION, CURRENT_ORDER, CYAN_COLOR, MAIN_BLUE_COLOR, MAIN_GRAY_COLOR, NO_SUCH_KEY, ORDER_BY_CIRCLE_NAME, ORDER_BY_PENNAME, ORDER_BY_PRIORITY, ORDER_BY_SPACE, SEARCH_KEYWORD, SUB_BLUE_COLOR, SUB_GRAY_COLOR } from '../data/constants';
import { setCurrentBudget, setCurrentOrderMode } from '../data/store';
import { useDispatch, useSelector } from 'react-redux';
import { calculateCurrentBudget, getBudgetCrioterion, getPrioritySet } from '../backend/function/function';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { getMetadata, insertMetadata, updateMetadata } from '../backend/controller/metadataController';

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
  const [ budgetCriterionVisible, setBudgetCriterionVisible ] = useState(false);
  const dispatch = useDispatch();

  const [ selectedOrder, setSelectedOrder ] = useState(-1);
  const [ searchMode, setSearchMode ] = useState(MODES.by_circle);
  const currentBudget = useSelector((state) => state.currentBudget);
  const [ prioritySet, setPrioritySet ] = useState({ });

  useEffect(() => {
    calculateCurrentBudget()
        .then((result) => dispatch(setCurrentBudget(result)))
        .catch((err) => {
          console.log(err);
          dispatch(setCurrentBudget(0));
        });
    getPrioritySet()
        .then((ps) => {
          getBudgetCrioterion()
              .then((bc) => {
                data = { };
                for (let i = 0; i < ps.length; i++) {
                  data[ps[i].priority] = {
                    title: ps[i].title,
                    color: ps[i].color,
                    isChecked: bc.includes(ps[i].priority)
                  };
                }
                setPrioritySet(data);
              });
        });
  }, [ ]);
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
      <Modal
        animationType='fade'
        transparent={true}
        visible={budgetCriterionVisible}
        onRequestClose={() => {
          setBudgetCriterionVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={ styles.modalText }>예산 선정 시 포함할 범주</Text>
            <View style={ styles.checkboxContainer }>
              {
                Object.keys(prioritySet).map((idx) => {
                  return (
                    <BouncyCheckbox
                        key={ idx }
                        size={ 25 }
                        fillColor={ prioritySet[idx].color }
                        unfillColor='#FFF'
                        isChecked={ prioritySet[idx].isChecked }
                        onPress={ (isChecked) => {
                          const newSet = JSON.parse(JSON.stringify(prioritySet));
                          newSet[idx].isChecked = isChecked;
                          setPrioritySet(newSet);
                        } } />
                  );
                })
              }
            </View>
            <Pressable
                style={ [styles.button, styles.buttonClose] }
                onPress={() => {
                  applyBudgetCriterion(prioritySet, dispatch);
                  setBudgetCriterionVisible(false);
                }}>
              <Text style={styles.textStyle}>설정</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={ styles.barContainer }>
        <TouchableOpacity
            style={ styles.openBtn }
            onPress={ () => setSearchModalVisible(true) }>
          <Text style={ styles.openBtnTitle }>검색</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={ styles.openBtn }
            onPress={ () => setOrderModalVisible(true) }>
          <Text style={ styles.openBtnTitle }>정렬 기준</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={ styles.budgetContainer }
            onPress={ () => setBudgetCriterionVisible(true) }>
          <Text style={ [ styles.budgetLable ] }>예산</Text>
          <Text style={ styles.budgetText }>{ currentBudget }</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function onListItemPress(setSelectedOrder, to) {
  setSelectedOrder(to);
}

async function onOrderButtonPress(to, dispatch) {
  getMetadata(CURRENT_ORDER)
      .then((result) => {
        if (result.responseCode == NO_SUCH_KEY) {
          insertMetadata(CURRENT_ORDER, to)
              .then((result) => dispatch(setCurrentOrderMode(Math.random())));
        } else {
          updateMetadata(CURRENT_ORDER, to)
              .then((result) => dispatch(setCurrentOrderMode(Math.random())));
        }
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
    sql += `'%'`;
  } else {
    sql += `'%${ searchText }%'`;
  }
  getMetadata(SEARCH_KEYWORD)
      .then((result) => {
        if (result.responseCode == NO_SUCH_KEY) {
          insertMetadata(SEARCH_KEYWORD, sql)
              .then((result) => dispatch(setCurrentOrderMode(Math.random())));
        } else {
          updateMetadata(SEARCH_KEYWORD, sql)
              .then((result) => dispatch(setCurrentOrderMode(Math.random())));
        }
      });
}

function applyBudgetCriterion(prioritySet, dispatch) {
  const val1 = prioritySet[1].isChecked ? '1' : '';
  const val2 = prioritySet[2].isChecked ? '2' : '';
  const val3 = prioritySet[3].isChecked ? '3' : '';
  const val4 = prioritySet[4].isChecked ? '4' : '';
  const val5 = prioritySet[5].isChecked ? '5' : '';
  const value = `${ val1 },${ val2 },${ val3 },${ val4 },${ val5 }`;
  updateMetadata(BUDGET_CRITERION, value)
      .then((result) => calculateCurrentBudget().then((result) => dispatch(setCurrentBudget(result))));
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
    backgroundColor: `${ MAIN_BLUE_COLOR }`,
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
    textAlign: 'center',
    marginBottom: 12,
    color: `${ MAIN_GRAY_COLOR }`,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 15,
    gap: 30,
  },
  openBtn: {
    backgroundColor: `${ SUB_BLUE_COLOR }`,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBtnTitle: {
    color: '#fff',
    fontSize: 18,
  },
  budgetContainer: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${ SUB_GRAY_COLOR }`,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  budgetLable: {
    color: `${ SUB_GRAY_COLOR }`,
    fontSize: 14,
    textAlign: 'center',
  },
  budgetText: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeToolbar;