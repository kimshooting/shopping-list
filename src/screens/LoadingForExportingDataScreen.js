import { Text, View } from "react-native";
import { EXPORT_TARGET_ARCHIVE } from "../data/constants";
import * as Sharing from 'expo-sharing';
import { prepareSharingData } from "../backend/function/prepareSharingData";

function LoadingForExportingDataScreen({ navigation }) {
  execute(navigation);
  return(
    <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text style={ { color: '#000' } }>기다리십시오</Text>
    </View>
  )
}

async function execute(navigation) {
  prepareSharingData()
      .then((result) => {
        Sharing.isAvailableAsync().then((result) => {
          console.log(result);
          if (result == true) {
            Sharing.shareAsync(EXPORT_TARGET_ARCHIVE).then((result) => {
              navigation.goBack();
            });
          }
        });
      });
}

export default LoadingForExportingDataScreen;