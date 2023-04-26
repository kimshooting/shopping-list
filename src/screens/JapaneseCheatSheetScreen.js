import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { japaneseKorean } from "../data/japaneseCheatSheetDefaultData";
import { CYAN_COLOR, GRAPE_COLOR, MAIN_GRAY_COLOR, SUB_GRAY_COLOR } from "../data/constants";

function JapaneseCheatSheetScreen({ navigation }) {
  return (
    <SafeAreaView style={ styles.container }>
      <FlatList
          data={ japaneseKorean }
          renderItem={ ({ item }) => <ListItem data={ item } /> }
          keyExtractor={ (itemData) => itemData.jap } />
    </SafeAreaView>
  );
}

function ListItem({ data }) {
  const japVisible = data.jap != '';
  const pronounceVisible = data.pronounce != '';
  const korVisible = data.kor != '';
  const descriptionVisible = data.description != '';
  return (
    <View style={ styles.itemContainer }>
      { japVisible ? <Text style={ styles.textJap }>{ data.jap }</Text> : null }
      { pronounceVisible ? <Text style={ styles.textPronounce }>{ data.pronounce }</Text> : null }
      { korVisible ? <Text style={ styles.textKor }>{ data.kor }</Text> : null }
      { descriptionVisible ? <Text style={ styles.textDescription }>{ data.description }</Text> : null }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    borderColor: `${ SUB_GRAY_COLOR }`,
    borderTopWidth: 1,
    padding: 10,
    gap: 10,
  },
  textJap: {
    color: `${ MAIN_GRAY_COLOR }`,
  },
  textPronounce: {
    color: `${ CYAN_COLOR }`,
  },
  textKor: {
    color: `${ GRAPE_COLOR }`,
  },
  textDescription: {
    color: `${ SUB_GRAY_COLOR }`,
  },
});

export default JapaneseCheatSheetScreen;