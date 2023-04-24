import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import MainContainer from "./MainContainer";
import FileSearchScreen from "../screens/FileSearchScreen";
import CircleRegisterScreen from "../screens/CircleRegisterScreen";
import CircleSelectScreen from "../screens/CircleSelectScreen";
import CircleEditScreen from "../screens/CircleEditScreen";
import AddWorkScreen from "../screens/AddWorkScreen";
import LoadingForFetchingSharedDataScreen from "../screens/LoadingForFetchingSharedDataScreen";
import LoadingForCleanWholeDataScreen from "../screens/LoadingForCleanWholeDataScreen";
import LoadingForExportingDataScreen from "../screens/LoadingForExportingDataScreen";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { db } from "../db";
import { IS_PRICE_VISIBLE, IS_WORK_TITLE_VISIBLE, METADATA_TABLE } from "../data/metadata";
import { setIsPriceVisible, setIsWorkTitleVisible } from "../data/store";

const Stack = createNativeStackNavigator();

function StackRootContainer() {
  const dispatch = useDispatch();
  const [ initialized, setInitialized ] = useState(false);

  useEffect(()=> {
    initRedux(dispatch).then((result) => {
      setInitialized(true);
    });
  }, [ ]);
  return (
    initialized ?
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='MainContainer'component={ MainContainer }
            options={ { headerShown: false, } } />
        <Stack.Screen name='FileSearch' component={ FileSearchScreen } />
        <Stack.Screen name='CircleRegister' component={ CircleRegisterScreen } />
        <Stack.Screen name='CircleSelect' component={ CircleSelectScreen } />
        <Stack.Screen name='CircleEdit' component={ CircleEditScreen } />
        <Stack.Screen name='AddWork' component={ AddWorkScreen } />
        <Stack.Screen name='LoadingForFetchingSharedData'
            component={ LoadingForFetchingSharedDataScreen }
            options={ { headerShown: false } } />
        <Stack.Screen name='LoadingForCleanWholeData'
            component={ LoadingForCleanWholeDataScreen }
            options={ { headerShown: false } } />
        <Stack.Screen name='LoadingForExportingData'
            component={ LoadingForExportingDataScreen }
            options={ { headerShown: false } } />
      </Stack.Navigator>
    </NavigationContainer>
    : null
  );
}

async function initRedux(dispatch) {
  await aboutIsPriceVisible(dispatch);
  await aboutIsWorkTitleVisible(dispatch);
}

function aboutIsPriceVisible(dispatch) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`
        SELECT key, value FROM ${ METADATA_TABLE }
        WHERE key = '${ IS_PRICE_VISIBLE }';
      `, [ ], (tx, result) => {
        const setTo = result.rows.item(0).value == '1';
        console.log('isPriceVisible: ', setTo);
        dispatch(setIsPriceVisible(setTo));
        resolve();
      }, (err) => reject(err));
    });
  });
}

function aboutIsWorkTitleVisible(dispatch) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      
      tx.executeSql(`
        SELECT key, value FROM ${ METADATA_TABLE }
        WHERE key = '${ IS_WORK_TITLE_VISIBLE }';
      `, [ ], (tx, result) => {
        const setTo = result.rows.item(0).value == '1';
        console.log('isWorkTitleVisible: ', setTo);
        dispatch(setIsWorkTitleVisible(setTo));
        resolve();
      }, (err) => reject(err));
    });
  });
}

export default StackRootContainer;