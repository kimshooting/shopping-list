import StackRootContainer from "./navcontainer/StackRootContainer";
import { Provider } from 'react-redux';
import store from './data/store';
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { init } from "./db";

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