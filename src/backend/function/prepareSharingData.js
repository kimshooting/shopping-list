import { copyAsync, deleteAsync, makeDirectoryAsync, writeAsStringAsync } from "expo-file-system";
import { DEFAULT_IMAGE, EXPORT_CIRCLE_DATA_FILENAME, EXPORT_CIRCLE_IMAGES_DIR, EXPORT_DATA_ROOT_DIR, EXPORT_ENTRY_FILENAME, EXPORT_IMAGE_FILES_DIR, EXPORT_TARGET_ARCHIVE, EXPORT_WORK_DATA_FILENAME, EXPORT_WORK_IMAGES_DIR } from "../../data/constants";
import { getRegisteredCircleDataJoiningAllCircleData } from "../controller/registeredCircleController";
import { getWorkData } from "../controller/workDataController";
import { zip } from "react-native-zip-archive";

export async function prepareSharingData() {
  await basicTask();
  console.log('basicTask');
  await makeEntryMetadataFile();
  console.log('makeEntry');
  await processCircleData();
  console.log('here3');
  await processWorkData();
  console.log('here4');
  await compress();
  console.log('here5');
}

async function basicTask() {
  await deleteAsync(EXPORT_DATA_ROOT_DIR, { idempotent: true });
  await deleteAsync(EXPORT_TARGET_ARCHIVE, { idempotent: true });
  await makeDirectories();
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
  await writeAsStringAsync(EXPORT_DATA_ROOT_DIR + EXPORT_ENTRY_FILENAME, content).then((result) => console.log('in makeEntry'));
}

async function processCircleData() {
  const data = await getRegisteredCircleDataJoiningAllCircleData();
  await process(data.response, true);
}

async function processWorkData() {
  const data = await getWorkData('', [ 1, 2, 3, 4, 5 ], -1, false, -1, true);
  await process(data.response, false);
}

async function process(data, isCircleProcess) {
  for (let i = 0; i < data.length; i++) {
    delete data[i].id;
    delete data[i].circle_id;
    const imagePath = isCircleProcess ? data[i].circle_image_path : data[i].image_path;
    console.log('imagePath', imagePath);
    const imageFilename = imagePath.split('/').pop();
    const targetFolder = isCircleProcess ? EXPORT_CIRCLE_IMAGES_DIR : EXPORT_WORK_IMAGES_DIR;
    if (imagePath != DEFAULT_IMAGE) {
      await copyAsync({
        from: imagePath,
        to: targetFolder + imageFilename
      }).then((result) => console.log('copy:', imageFilename));
    }
    let toStore = '';
    if (imagePath != DEFAULT_IMAGE) {
      toStore = isCircleProcess ? `image/circle/${ imageFilename }` : `image/work/${ imageFilename }`;
    } else {
      toStore = 'NO_IMAGE';
    }
    if (isCircleProcess) {
      data[i].circle_image_path = toStore;
    } else {
      data[i].image_path = toStore;
    }
  }
  const textObj = JSON.stringify(data, null, 4);
  const filepath = isCircleProcess ? EXPORT_DATA_ROOT_DIR + EXPORT_CIRCLE_DATA_FILENAME : EXPORT_DATA_ROOT_DIR + EXPORT_WORK_DATA_FILENAME;
  await writeAsStringAsync(filepath, textObj).then((result) => console.log('in Process'));
}

async function compress() {
  await zip(EXPORT_DATA_ROOT_DIR, EXPORT_TARGET_ARCHIVE);
}