import { StorageAccessFramework, documentDirectory, readAsStringAsync } from "expo-file-system";
import { SHARED_DATA_ENTRY_FILENAME } from "../../data/constants";
import { insertRegisteredCircleData, truncateRegisteredCircle } from "../controller/registeredCircleController";
import { getAllCircleDataBySpace } from "../controller/allCircleController";
import { insertWorkData, truncateWorkData } from "../controller/workDataController";

export async function fetchSharedData(dir) {
  const rootDirectory = documentDirectory + dir.split('%2F').pop() + '/';
  await copyFiles(dir);
  const metadata = JSON.parse(await processManagementFile(rootDirectory));
  const circleData = JSON.parse(await processData(rootDirectory, metadata.circle_data_file));
  const workData = JSON.parse(await processData(rootDirectory, metadata.work_data_file));
  for (let data of circleData) {
    data.circle_image_path = rootDirectory + data.circle_image_path;
    const r = await getAllCircleDataBySpace(data.space);
    data.circle_id = r.response[0].id;
  }
  for (let data of workData) {
    data.image_path = rootDirectory + data.image_path;
    const r = await getAllCircleDataBySpace(data.space);
    console.log('r', r);
    data.circle_id = r.response[0].id;
  }
  return await dbTask(circleData, workData);
}

async function copyFiles(dir) {
  await StorageAccessFramework.copyAsync({
    from: dir,
    to: documentDirectory
  });
}

async function processManagementFile(rootDirectory) {
  return await readAsStringAsync(rootDirectory + SHARED_DATA_ENTRY_FILENAME);
}

async function processData(rootDirectory, filename) {
  return await readAsStringAsync(`${ rootDirectory }${ filename }`);
}

async function dbTask(circleData, workData) {
  processCircleData(circleData);
  processWorkData(workData);
}

async function processCircleData(circleData) {
  await truncateRegisteredCircle();
  if (circleData.length == 0) {
    return;
  }
  insertRegisteredCircleData(circleData);
}

async function processWorkData(workData) {
  await truncateWorkData();
  if (workData.length == 0) {
    return;
  }
  insertWorkData(workData);
}