import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { japaneseKorean } from "../data/japaneseCheatSheetDefaultData";

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
    borderColor: '#000',
    borderTopWidth: 2,
  },
  textJap: {
    color: '#495057',
  },
  textPronounce: {
    color: '#1098ad',
  },
  textKor: {
    color: '#9c36b5',
  },
  textDescription: {
    color: '#868e96',
  },
});

export default JapaneseCheatSheetScreen;