import StackRootContainer from "./navcontainer/StackRootContainer";
import { Provider, useDispatch } from 'react-redux';
import store, { setIsPriceVisible } from './data/store';
import { useEffect, useState } from "react";
import { db, init } from "./db";
import { IS_PRICE_VISIBLE, METADATA_TABLE } from "./data/metadata";



function App() {
  const [ root, setRoot ] = useState(<></>);
  useEffect(() => {
    init().then((result) => {
      setRoot(<Provider store={ store }><StackRootContainer /></Provider>);
    });
  }, [ ]);
  
  return (
    root
  )
}

export default App;