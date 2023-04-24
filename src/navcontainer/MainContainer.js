import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import JapaneseCheatSheetScreen from '../screens/JapaneseCheatSheetScreen';

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <Tab.Navigator screenOptions={ { headerShown: true } }>
      <Tab.Screen name='Home' component={ HomeScreen }
          options={ { headerShown: false, } } />
      <Tab.Screen name='JapaneseCheatSheet' component={ JapaneseCheatSheetScreen }
          options={ {headerShown: false } } />
      <Tab.Screen name='Settings' component={ SettingsScreen } />
    </Tab.Navigator>
  );
}

export default MainContainer;