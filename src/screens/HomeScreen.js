import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DEFAULT_IMAGE } from "../data/constants";
import { useEffect, useState } from "react";
import HomeToolbar from "../toolbar/HomeToolbar";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentBudget } from "../data/store";
import { getRegisteredCircleData } from "../backend/controller/registeredCircleController";
import { getBudgetCrioterion } from "../backend/function/function";
import { getWorkData, getWorkDataWithPriority, updateWorkData } from "../backend/controller/workDataController";

function HomeScreen({ navigation }) {
  const [ registeredCircleList, setRegisteredCircleList ] = useState([ ]);
  const currentOrderMode = useSelector((state) => state.currentOrderMode);

  useEffect(() => {
    getRegisteredCircleData()
        .then((result) => {
          setRegisteredCircleList(result.response);
         });
  }, [ currentOrderMode ]);

  const [ budgetCriterion, setBudgetCriterion ] = useState([ ]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      console.log('refresh');
      getRegisteredCircleData()
          .then((result) => {
            setRegisteredCircleList(result.response);
          });
    });
    return focusHandler;
  }, [ navigation ]);

  const currentBudget = useSelector((state) => state.currentBudget);
  useEffect(() => {
    getBudgetCrioterion()
        .then((result) => {
          setBudgetCriterion(result);
        });
  }, [ currentBudget ]);

  return (
    <SafeAreaView style={ styles.container }>
      <HomeToolbar />
      <FlatList
          data={ registeredCircleList }
          renderItem={ ({ item }) => <ListItem data={ item } navigation={ navigation } budgetCriterion={ budgetCriterion } /> }
          keyExtractor={ (item) => item.space } />
    </SafeAreaView>
  );
}

function ListItem({ data, navigation, budgetCriterion }) {
  const defaultImage = data.circle_image_path == DEFAULT_IMAGE;
  const priorityColorBox = {
    width: 25,
    height: 25,
    backgroundColor: data.color,
  }

  const [ workDataList, setWorkDataList ] = useState([ ]);

  const baseWork = () => {
    getWorkDataWithPriority(title = '', priority = [ 1, 2, 3, 4, 5 ], checked = -1,
        order = true, circleId = data.circle_id, getCircleInfo = false)
        .then((result) => {
          setWorkDataList(result.response);
        });
  }

  useEffect(() => {
    baseWork();
  }, [ ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => baseWork());
    return unsubscribe;
  }, [ navigation ]);
  
  return (
    <View style={ styles.itemContainer }>
      <TouchableOpacity style={ styles.circleBrief }
          onPress={ () => navigation.navigate('CircleEdit', { data: data }) }>
        <Image
            style={ styles.circleImage }
            source={ defaultImage ? require('../../public/null-image.png') : { uri: data.circle_image_path } }
            resizeMode='contain' />
        <View>
          <View style={ priorityColorBox } />
          <Text style={ styles.text }>{ data.space }</Text>
          <Text style={ styles.text }>{ data.circle_name }</Text>
          <Text style={ styles.text }>{ data.penname }</Text>
        </View>
      </TouchableOpacity>
      <FlatList
          data={ workDataList }
          renderItem={ ({ item }) => <WorkListItem data={ item } baseWork={ baseWork } budgetCriterion={ budgetCriterion } navigation={ navigation } /> }
          keyExtractor={ (item) => item.id }
          horizontal />
    </View>
  );
}

function WorkListItem({ data, baseWork, budgetCriterion, navigation }) {
  const dispatch = useDispatch();
  const imageSrc = data.image_path == DEFAULT_IMAGE ? require('../../public/null-image.png') : { uri: data.image_path };
  const imageStyle = {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: data.color,
  };

  const [ isDefaultImageMode, setIsDefaultImageMode ] = useState(data.checked == 0);

  const currentBudget = useSelector((state) => state.currentBudget);
  const isPriceVisible = useSelector((state) => state.isPriceVisible);
  const isWorkTitleVisible = useSelector((state) => state.isWorkTitleVisible);

  const budgetTask = () => {
    if (budgetCriterion.includes(data.priority)) {
      const pmBudget = data.checked == 1 ? data.price : -data.price;
      dispatch(setCurrentBudget(currentBudget + pmBudget));
    } else {
      dispatch(setCurrentBudget(currentBudget));
    }
  }
  return (
    <TouchableOpacity
        onPress={ () =>  {
          onPressImage(data, isDefaultImageMode, setIsDefaultImageMode);
          baseWork();
          budgetTask();
        } }>
      { isDefaultImageMode ?
            <Image
                style={ imageStyle }
                source={ imageSrc }
                resizeMode='contain' />
          : <CheckedImage
                style={ imageStyle }
                source={ imageSrc } /> }
      { isWorkTitleVisible ? <Text style={ styles.text }>{ data.title }</Text> : null }
      { isPriceVisible ? <Text style={ styles.text }>{ data.price }</Text> : null }
    </TouchableOpacity>
  );
}

function onPressImage(data, isDefaultImageMode, setIsDefaultImageMode) {
  setIsDefaultImageMode(!isDefaultImageMode);
  const to = [
    {
      column: 'checked',
      value: isDefaultImageMode ? 1 : 0
    }
  ];
  const ids = [ data.id ];
  updateWorkData(to, ids);
}

function CheckedImage({ style, source }) {
  return (
    <View
        style={ styles.checkedImageContainer }>
      <Image
          style={ [ style, { opacity: 0.3 } ] }
          source={ source }
          resizeMode='contain' />
      <Image
          style={ styles.check }
          source={ require('../../public/check.png') } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circleImage: {
    width: 100,
    height: 100,
  },
  text: {
    color: '#000',
  },
  itemContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
  },
  circleBrief: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
  },
  workListContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkedImageContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
});

export default HomeScreen;