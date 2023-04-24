import { Text, View } from "react-native";
import { copyAsync, deleteAsync, documentDirectory, getInfoAsync, makeDirectoryAsync, readAsStringAsync, readDirectoryAsync, writeAsStringAsync } from "expo-file-system";
import { CIRCLE_PARTICIPATE_TABLE, EXPORT_CIRCLE_DATA_FILENAME, EXPORT_CIRCLE_IMAGES_DIR, EXPORT_DATA_ROOT_DIR, EXPORT_ENTRY_FILENAME, EXPORT_IMAGE_FILES_DIR, EXPORT_TARGET_ARCHIVE, EXPORT_WORK_DATA_FILENAME, EXPORT_WORK_IMAGES_DIR, REGISTERED_TABLE, WORK_TABLE } from "../data/metadata";
import { useEffect, useState } from "react";
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';
import * as Sharing from 'expo-sharing';
import { db } from "../backend/db";

function LoadingForExportingDataScreen({ navigation }) {
  // readDirectoryAsync(documentDirectory).then((result) => console.log(result));
  // readAsStringAsync(documentDirectory + 'to_export/work_data.json').then((result) => console.log(result));
  // getInfoAsync(EXPORT_TARGET_ARCHIVE).then((result) => console.log(result));
  execute(navigation);

  // const [ a, b ] = useState(false);
  // const circleData = [ ];
  // const workData = [ ];

  // async

  // useEffect(() => {
  //   console.log('hello');
  //   b(true);
  // }, [ ]);
  // useEffect(() => {
  //   if (a == true) {
  //     console.log('goodbye');
  //   }
  // }, [ a ]);
  return(
    <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text style={ { color: '#000' } }>기다리십시오</Text>
    </View>
  )
}

async function execute(navigation) {
  await deleteAsync(EXPORT_DATA_ROOT_DIR, { idempotent: true });
  await deleteAsync(EXPORT_TARGET_ARCHIVE, { idempotent: true });
  await makeDirectories();
  await makeEntryMetadataFile();
  await processData(`
      SELECT p.circle_name, p.penname, p.space, r.circle_image_path, r.priority FROM ${ REGISTERED_TABLE } AS r
      INNER JOIN ${ CIRCLE_PARTICIPATE_TABLE } AS p ON r.circle_id = p.id;
    `, true);
  await processData(`
      SELECT p.circle_name, p.penname, p.space, w.title, w.checked, w.image_path, w.priority, w.price
      FROM ${ WORK_TABLE } AS w
      INNER JOIN ${ CIRCLE_PARTICIPATE_TABLE } AS p ON w.circle_id = p.id;
    `, false);
  compress(navigation);
}

async function makeDirectories() {
  await makeDirectoryAsync(EXPORT_DATA_ROOT_DIR);
  await makeDirectoryAsync(EXPORT_IMAGE_FILES_DIR);
  await makeDirectoryAsync(EXPORT_CIRCLE_IMAGES_DIR);
  await makeDirectoryAsync(EXPORT_WORK_IMAGES_DIR);
}

async function makeEntryMetadataFile() {
  const content = '{\n'
      + `    "circle_data_file": "${ EXPORT_CIRCLE_DATA_FILENAME }",\n`
      + `    "work_data_file": "${ EXPORT_WORK_DATA_FILENAME }"\n`
      + '}';
  await writeAsStringAsync(EXPORT_DATA_ROOT_DIR + EXPORT_ENTRY_FILENAME, content).then((result) => console.log('2'));
}

async function processData(sql, isCircleProcess) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(sql, [ ], async (tx, result) => {
        const len = result.rows.length;
        const data = [ ];
        for (let i = 0; i < len; i++) {
          data.push(result.rows.item(i));
        }
        await process(data, isCircleProcess);;
        resolve();
      });
    });;
  });
}

async function process(data, isCircleProcess) {
  for (record of data) {
    const imagePath = isCircleProcess ? record.circle_image_path : record.image_path;
    const imageFilename = imagePath.split('/').pop();
    const targetFolder = isCircleProcess ? EXPORT_CIRCLE_IMAGES_DIR : EXPORT_WORK_IMAGES_DIR;
    await copyAsync({
      from: imagePath,
      to: targetFolder + imageFilename
    }).then((result) => console.log('4'));
    const toStore = isCircleProcess ? `image/circle/${ imageFilename }` : `image/work/${ imageFilename }`;
    if (isCircleProcess) {
      record.circle_image_path = toStore;
    } else {
      record.image_path = toStore;
    }
  }
  const textObj = JSON.stringify(data, null, 4);
  const filepath = isCircleProcess ? EXPORT_DATA_ROOT_DIR + EXPORT_CIRCLE_DATA_FILENAME : EXPORT_DATA_ROOT_DIR + EXPORT_WORK_DATA_FILENAME;
  await writeAsStringAsync(filepath, textObj).catch((err) => console.error(err));
}

function compress(navigation) {
  zip(EXPORT_DATA_ROOT_DIR, EXPORT_TARGET_ARCHIVE).then((result) => {
    console.log('5');
    Sharing.isAvailableAsync().then((result) => {
      console.log(result);
      if (result == true) {
        Sharing.shareAsync(EXPORT_TARGET_ARCHIVE).then((result) => {
          navigation.goBack();
        });
      }
    });
  });
}

export default LoadingForExportingDataScreen;