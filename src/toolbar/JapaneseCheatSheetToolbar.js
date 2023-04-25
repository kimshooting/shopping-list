import { Button, StyleSheet, View } from "react-native";

function JapaneseCheatSheetToolbar({ navigation }) {
  return (
    <View style={ styles.container }>
      <Button
          title='추가'
          onPress={ () => console.log('add') } />
      <Button
          title='검색'
          onPress={ () => console.log('search') } />
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