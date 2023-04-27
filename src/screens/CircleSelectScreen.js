import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, setPickedCircle, setSelectedCircle } from '../data/store';
import { getAllCircleData, searchCircle } from '../backend/controller/allCircleController';
import { MAIN_BLUE_COLOR, MAIN_GRAY_COLOR } from '../data/constants';

function CircleSelectScreen({ navigation }) {
  const [ searchText, setSearchText ] = useState('');
  const dispatch = useDispatch();

  const [ list, setList ] = useState([ ]);
  // console.log(JSON.stringify(list, null, 4));

  useEffect(() => {
    dispatch(setCurrentPage(0));
    getAllCircleData()
        .then((result) => setList(result.response));
  }, [ ]);

  const currentPage = useSelector((state) => state.currentPage);
  const [ pages, setPages ] = useState([ [ ] ]);
  const [ pageIndexes, setPageIndexes ] = useState([ ]);
  const PAGE_CONTENT_LENGTH = 20;
  useEffect(() => {
    dispatch(setCurrentPage(0));
    let buffer = [ ];
    const pageData = [ ];
    for (let i = 1; i <= list.length; i++) {
      buffer.push(list[i - 1]);
      if (i % PAGE_CONTENT_LENGTH == 0) {
        pageData.push(buffer);
        buffer = [ ];
      }
    }
    if (buffer.length > 0) {
      pageData.push(buffer);
    }
    const pIdx = [ ];
    for (let i = 0; i < pageData.length; i++) {
      pIdx.push(i);
    }
    if (pageData.length == 0) {
      setPages([ [ ] ]);
    } else {
      setPages(pageData);
    }
    setPageIndexes(pIdx);
  }, [ list ]);

  const pickedCircle = useSelector((state) => state.pickedCircle);

  return (
    <SafeAreaView style={ { flex: 1, } }>
      <View style={ styles.searchBar }>
        <TextInput style={ styles.searchTextInput }
            onChangeText={ e => setSearchText(e) } />
        <Button title='검색' style={ styles.searchButton }
            onPress={ () => searchCircle(searchText, pickedCircle.id)
                .then((result) => setList(result.response)) } />
      </View>
      <View style={ { height: 50, alignSelf: 'flex-start' } }>
        <FlatList
            data={ pageIndexes }
            renderItem={ ({item}) => <Page pageIndex={ item } /> }
            keyExtractor={ (item) => item }
            contentContainerStyle={ styles.pageContainer }
            horizontal />
      </View>
      <Button
          title='선택완료'
          onPress={ () => onSelectComplete(dispatch, navigation, pickedCircle) }
          disabled={ pickedCircle.id == -1 } />
      <CircleList style={ { flex: 1, } } data={ pages[currentPage] } />
    </SafeAreaView>
  )
}

function CircleList({ data }) {
  const [ pageData, setPageData ] = useState(data);
  useEffect(() => {
    setPageData(data);
  }, [ data ]);
  const pickedCircle = useSelector((state) => state.pickedCircle);
  const dispatch = useDispatch();
  return (
    <ScrollView>
      {
        pageData.map((item) => {
          return <Item key={ item.space } data={ item } onPress={ () => onItemPress(pageData, item, pickedCircle, dispatch) } />;
        })
      }
    </ScrollView>
  );
}

function onItemPress(pageData, data, pickedCircle, dispatch) {
  const newList = [ ...pageData ];
  if (pickedCircle.id != -1) {
    for (let i = 0 ; i < newList.length; i++) {
      if (newList[i].id == pickedCircle.id) {
        newList[i].selected = false;
      }
    }
  }

  const obj = {
    id: data.id,
    space: data.space,
    penname: data.penname,
    circle_name: data.circle_name,
  }

  for (let i = 0 ; i < newList.length; i++) {
    if (newList[i].id == obj.id) {
      newList[i].selected = true;
    }
  }

  dispatch(setPickedCircle(obj));
}

function Item({ data, onPress }) {
  const itemStyle = data.selected ? styles.selectedItem : styles.item;
  return (
    <TouchableOpacity style={ [ itemStyle, { paddingHorizontal: 10, paddingVertical: 5 } ] }
        onPress={ onPress }>
      <Text style={ styles.space }>{ data.space }</Text>
      <Text style={ styles.penname }>{ data.penname }</Text>
      <Text style={ styles.circle }>{ data.circle_name }</Text>
    </TouchableOpacity>
  );
}

function Page({ pageIndex }) {
  const currentPage = useSelector((state) => state.currentPage);
  const isCurrentPage = pageIndex == currentPage;
  const pageNumberSquareStyleObj = isCurrentPage
      ? [ styles.pageNumberSquare, { backgroundColor: `${ MAIN_BLUE_COLOR }` } ]
      : styles.pageNumberSquare;
  const pageNumberStyleObj = isCurrentPage
      ? [ styles.pageNumber, { color: '#fff', fontWeight: '600' } ]
      : styles.pageNumber;
  const pageNumber = pageIndex + 1;
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
        style={ pageNumberSquareStyleObj }
        onPress={ () => {
          dispatch(setCurrentPage(pageIndex));
        } }>
      <Text style={ pageNumberStyleObj }>{ pageNumber }</Text>
    </TouchableOpacity>
  );
}

function onSelectComplete(dispatch, navigation, selectedData) {
  dispatch(setSelectedCircle(selectedData));
  dispatch(setPickedCircle({
    id: -1,
    space: '',
    penname: '',
    circle_name: '',
  }));
  navigation.goBack();
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
  },
  searchTextInput: {
    color: '#000',
    borderWidth: 1,
    borderColor: '#000',
    flex: 3,
  },
  item: {
    borderColor: '#000',
    borderWidth: 1,
  },
  selectedItem: {
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#ced4da',
  },
  pageContainer: {
    gap: 10,
    alignItems: 'center',
  },
  pageNumberSquare: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: `${ MAIN_GRAY_COLOR }`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumber: {
    color: `${ MAIN_GRAY_COLOR }`,
    fontSize: 14,
  },
  circle: {
    color: '#000',
  },
  penname: {
    color: '#000',
  },
  space: {
    color: '#000',
  },
  circleList: {
    flex: 1,
  },
  searchButton: {
  },
});

export default CircleSelectScreen;