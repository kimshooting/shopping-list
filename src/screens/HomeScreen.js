import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CIRCLE_PARTICIPATE_TABLE, CURRENT_ORDER, DEFAULT_IMAGE, METADATA_TABLE, ORDER_BY_CIRCLE_NAME, ORDER_BY_PENNAME, ORDER_BY_PRIORITY, ORDER_BY_SPACE, PRIORITY_TABLE, REGISTERED_TABLE, SEARCH_KEYWORD, WORK_TABLE } from "../data/metadata";
import { db } from "../App";
import { useEffect, useState } from "react";
import HomeToolbar from "../toolbar/HomeToolbar";
import { useSelector } from "react-redux";

function HomeScreen({ navigation }) {
  const [ registeredCircleList, setRegisteredCircleList ] = useState([ ]);
  const currentOrderMode = useSelector((state) => state.currentOrderMode);

  const doDBTask = async () => {
    const selectRecords = async (orderMode) => {
      let orderBySql = '';
      switch (parseInt(orderMode)) {
        case ORDER_BY_PRIORITY:
          orderBySql = 'ORDER BY pr.priority ASC;';
          break;
        case ORDER_BY_CIRCLE_NAME:
          orderBySql = 'ORDER BY p.circle_name ASC, pr.priority ASC';
          break;
        case ORDER_BY_PENNAME:
          orderBySql = 'ORDER BY p.penname ASC, pr.priority ASC';
          break;
        case ORDER_BY_SPACE:
          orderBySql = 'ORDER BY p.id ASC';
          break;
        default:
          orderBySql = '';
      }

      let whereStatement = '';
      await db.transaction((tx) => {
        tx.executeSql(`
          SELECT key, value FROM ${ METADATA_TABLE } WHERE key = '${ SEARCH_KEYWORD }';
        `, [ ], (tx, result) => {
          const len = result.rows.length;
          if (len != 0) {
            whereStatement = result.rows.item(0).value;
          }
        });
      });

      await db.transaction((tx) => {
        tx.executeSql(`
          SELECT r.id, r.circle_image_path, p.id AS circle_id, p.space, p.penname, p.circle_name,
                 pr.priority, pr.title, pr.color
          FROM ${ REGISTERED_TABLE } AS r
          INNER JOIN ${ CIRCLE_PARTICIPATE_TABLE } AS p ON r.circle_id = p.id
          INNER JOIN ${ PRIORITY_TABLE } AS pr ON r.priority = pr.priority
          ${ whereStatement }
          ${ orderBySql };
        `, [ ], (tx, result) => {
          const len = result.rows.length;
          const data = [ ];
          for (let i = 0; i < len; i++) {
            data.push(result.rows.item(i));
          }
          setRegisteredCircleList(data);
        }, (err) => {
          console.log(err);
          navigation('Home');
        });
      });
    }

    await db.transaction((tx) => {
      tx.executeSql(`
        SELECT * FROM ${ METADATA_TABLE }
        WHERE key = '${ CURRENT_ORDER }';
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        if (len == 0) {
          tx.executeSql(`
            INSERT INTO ${ METADATA_TABLE } (key, value) VALUES
              ('${ CURRENT_ORDER }', ${ ORDER_BY_PRIORITY });
          `);
          selectRecords(ORDER_BY_PRIORITY);
        } else {
          selectRecords(result.rows.item(0).value);
        }
      }, (err) => {
        console.log(err);
        navigation('Home');
      });
    });
  };

  useEffect(() => {
    doDBTask();
  }, [ currentOrderMode ]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      console.log('refresh');
      doDBTask();
    });
    return focusHandler;
  }, [ navigation ]);

  return (
    <SafeAreaView style={ styles.container }>
      <HomeToolbar />
      <FlatList
          data={ registeredCircleList }
          renderItem={ ({ item }) => <ListItem data={ item } navigation={ navigation }/> }
          keyExtractor={ (item) => item.space } />
    </SafeAreaView>
  );
}

function ListItem({ data, navigation }) {
  const defaultImage = data.circle_image_path == DEFAULT_IMAGE;
  const priorityColorBox = {
    width: 25,
    height: 25,
    backgroundColor: data.color,
  }

  const [ workDataList, setWorkDataList ] = useState([ ]);
  const doDBTask = () => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT w.id, w.title, w.checked, w.image_path,
               w.priority, w.price, w.circle_id, pr.color
        FROM ${ WORK_TABLE } AS w
        INNER JOIN ${ PRIORITY_TABLE } AS pr ON w.priority = pr.priority
        WHERE w.circle_id = ${ data.circle_id }
        ORDER BY w.checked ASC, w.priority ASC;
      `, [ ], (tx, result) => {
        const len = result.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          data.push(result.rows.item(i));
        }
        setWorkDataList(data);
      }, (err) => console.error(err));
    });
  }

  useEffect(() => {
    doDBTask();
  }, [ ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => doDBTask());
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
          renderItem={ ({ item }) => <WorkListItem data={ item } onPressFunc={ doDBTask } /> }
          keyExtractor={ (item) => item.id }
          horizontal />
    </View>
  );
}

function WorkListItem({ data, onPressFunc }) {
  const imageSrc = data.image_path == DEFAULT_IMAGE ? require('../../public/null-image.png') : { uri: data.image_path };
  const imageStyle = {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: data.color,
  };

  const [ isDefaultImageMode, setIsDefaultImageMode ] = useState(data.checked == '0');
  return (
    <TouchableOpacity
        onPress={ () =>  {
          onPressImage(data, isDefaultImageMode, setIsDefaultImageMode);
          onPressFunc();
        } }>
      { isDefaultImageMode ?
            <Image
                style={ imageStyle }
                source={ imageSrc }
                resizeMode='contain' />
          : <CheckedImage
                style={ imageStyle }
                source={ imageSrc } /> }
    </TouchableOpacity>
  );
}

function onPressImage(data, isDefaultImageMode, setIsDefaultImageMode) {
  setIsDefaultImageMode(!isDefaultImageMode);
  db.transaction((tx) => {
    tx.executeSql(`
      UPDATE ${ WORK_TABLE } SET checked = ${ isDefaultImageMode ? 1 : 0 }
      WHERE id = ${ data.id };
    `, [ ], (tx, result) => { }, (err) => console.error(err));
  });
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