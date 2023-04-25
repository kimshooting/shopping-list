import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { calculateCurrentBudget } from '../backend/function/function';
import { setCurrentBudget } from '../data/store';
import { fetchSharedData } from '../backend/function/fetchSharedData';

function LoadingForFetchingSharedDataScreen({ route, navigation }) {
  const dir = route.params.dir;
  const dispatch = useDispatch();
  
  // readDirectoryAsync(documentDirectory + 'shared_data_dir/image').then((result) => console.log(result));
  // procedure(dir, navigation, useDispatch());
  fetchSharedData(dir)
      .then((result) => {
        calculateCurrentBudget().then((result) => {
          dispatch(setCurrentBudget(result));
          navigation.goBack();
        });
      });
  return(
    <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text style={ { color: '#000' } }>데이터 가져오는 중</Text>
    </View>
  )
}

export default LoadingForFetchingSharedDataScreen;