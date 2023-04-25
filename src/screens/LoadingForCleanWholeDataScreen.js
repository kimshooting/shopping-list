import { BackHandler, Text, View } from 'react-native';
import { init } from '../backend/db';
import { cleanWholeData } from '../backend/function/cleanWholeData';

function LoadingForCleanWholeDataScreen({ navigation }) {
  process(navigation);
  return (
    <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text style={ { color: '#000' } }>삭제 중</Text>
    </View>
  );
}

function process(navigation) {
  cleanWholeData()
      .then((result) => {
        console.log(result);
        init().then((result) => {
          navigation.goBack();
          BackHandler.exitApp();
        });
      });
}

export default LoadingForCleanWholeDataScreen;