import SQLite from 'react-native-sqlite-storage';
import { CIRCLE_IMAGE_DIRECTORY, CIRCLE_PARTICIPATE_TABLE, METADATA_TABLE, PRIORITY_TABLE, REGISTERED_TABLE, SHARED_DATA_ROOT_DIRECTORY, WORK_IMAGE_DIRECTORY, WORK_TABLE } from './data/metadata';
import StackRootContainer from "./navcontainer/StackRootContainer";
import { Provider } from 'react-redux';
import store from './data/store';
import { getInfoAsync, makeDirectoryAsync } from 'expo-file-system';

export const db = SQLite.openDatabase({name: 'my.db', location: 'default'}, () => initApp(), (err) => console.error(err));

export async function initApp() {
  console.log('succeeeded');
  await db.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ METADATA_TABLE } (
          key VARCHAR(255) PRIMARY KEY NOT NULL,
          value TEXT
        );`, [ ], (tx, results) => { console.log('success: created tables') },
        (err) => {
          console.error(err);
        });
  });

  await db.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ CIRCLE_PARTICIPATE_TABLE } (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          space VARCHAR(10) NOT NULL,
          penname VARCHAR(15) DEFAULT '',
          circle_name VARCHAR(15) NOT NULL
        );`, [ ], (tx, results) => console.log('success: create table'),
        (err) => console.error(err));
  });

  await db.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ PRIORITY_TABLE } (
          priority INTEGER PRIMARY KEY NOT NULL,
          title TEXT,
          color VARCHAR(10)
        );`, [ ], (tx, results) => console.log('success: create table'),
        (err) => console.error(err));
  });

  await db.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ REGISTERED_TABLE } (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          circle_image_path VARCHAR(255),
          circle_id INTEGER UNIQUE NOT NULL,
          priority INTEGER NOT NULL,
          CONSTRAINT fk_circle FOREIGN KEY (circle_id)
          REFERENCES ${ CIRCLE_PARTICIPATE_TABLE } (id),
          CONSTRAINT fk_priority FOREIGN KEY (priority)
          REFERENCES ${ PRIORITY_TABLE } (priority)
        );`, [ ], (tx, results) => console.log('success: create table'),
        (err) => console.error(err));
  });

  await db.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ WORK_TABLE } (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        checked INTEGER NOT NULL,
        image_path TEXT DEFAULT '',
        priority INTEGER NOT NULL,
        price INTEGER,
        circle_id VARCHAR(10) NOT NULL,
        CONSTRAINT fk_circle_id FOREIGN KEY (circle_id)
        REFERENCES ${ CIRCLE_PARTICIPATE_TABLE } (id),
        CONSTRAINT fk_priority FOREIGN KEY (priority)
        REFERENCES ${ PRIORITY_TABLE } (priority)
      );`, [ ], (tx, results) => console.log('success: create table'),
      (err) => console.error(err));
  });

  // await db.transaction((tx) => {
  //   tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ WORK_REGISTERED_TABLE } (
  //         work_id INTEGER NOT NULL,
  //         circle_id INTEGER NOT NULL,
  //         PRIMARY KEY (work_id, circle_id),
  //         CONSTRAINT fk_work_id FOREIGN KEY (work_id)
  //         REFERENCES ${ WORK_TABLE } (id),
  //         CONSTRAINT fk_circle_id FOREIGN KEY (circle_id)
  //         REFERENCES ${ REGISTERED_TABLE } (id)
  //       );`, [ ], (tx, results) => console.log('success: create table'),
  //       (err) => console.error(err));
  // });

  await db.transaction((tx) => {
    tx.executeSql(`
      SELECT * FROM ${ PRIORITY_TABLE };
    `, [ ], (tx, result) => {
      if (result.rows.length == 0) {
        tx.executeSql(`
          INSERT INTO ${ PRIORITY_TABLE } (priority, title, color) VALUES
            (1, '가장 중요', '#e03131'),
            (2, '중요', '#ffa94d'),
            (3, '덜 중요', '#1c7ed6'),
            (4, '중요할지도', '#37b24d'),
            (5, '계륵', '#868e96');
        `, [ ], (tx, result) => console.log('success: inserted into priority'),
        (err) => console.error(err));
      }
    }, (err) => {
      console.error(err);
    });
  });
  getInfoAsync(CIRCLE_IMAGE_DIRECTORY)
    .then((result) => {
      if (!result.exists) {
        makeDirectoryAsync(CIRCLE_IMAGE_DIRECTORY, { intermediates: true });
      }
    });

  getInfoAsync(WORK_IMAGE_DIRECTORY)
    .then((result) => {
      if (!result.exists) {
        makeDirectoryAsync(WORK_IMAGE_DIRECTORY, { intermediates: true })
            .then((result) => console.log('work image succeeded'));
      }
    });
}

function App() {
  return (
    <Provider store={ store }>
      <StackRootContainer />
    </Provider>
  )
}

export default App;