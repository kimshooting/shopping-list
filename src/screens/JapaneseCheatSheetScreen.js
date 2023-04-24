import { SafeAreaView, StyleSheet } from "react-native";
import JapaneseCheatSheetToolbar from "../toolbar/JapaneseCheatSheetToolbar";

function JapaneseCheatSheetScreen({ navigation }) {
  return (
    <SafeAreaView style={ styles.container }>
      <JapaneseCheatSheetToolbar navigation={ navigation } />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default JapaneseCheatSheetScreen;