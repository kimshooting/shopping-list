import { SafeAreaView, StyleSheet } from "react-native";
import FootTrafficToolbar from "../toolbar/FootTrafficToolbar";

function FootTrafficScreen() {
  return (
    <SafeAreaView style={ styles.container }>
      <FootTrafficToolbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default FootTrafficScreen;