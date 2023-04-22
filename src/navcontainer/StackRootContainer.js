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

const Stack = createNativeStackNavigator();

function StackRootContainer() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackRootContainer;