import { Button, StyleSheet, View } from "react-native";

function JapaneseCheatSheetToolbar({ navigation }) {
  return (
    <View style={ styles.container }>
      <Button
          title='동선 설정'
          onPress={ () => navigation.navigate('FootTrafficSetting') } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default JapaneseCheatSheetToolbar;