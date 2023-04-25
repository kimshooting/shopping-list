import { copyAsync, deleteAsync } from "expo-file-system";
import { CIRCLE_IMAGE_DIRECTORY, CURRENT_ORDER, DEFAULT_IMAGE, ORDER_BY_PRIORITY } from "../../data/constants";
import { deleteRegisteredCircleDataByCircleIdAsService, getRegisteredCircleDataAsService, getRegisteredCircleDataJoiningAllCircleDataAsService, insertRegisteredCircleDataAsService, truncateRegisteredCircleAsService, updateRegisteredCircleDataByIdAsService } from "../service/registeredCircleService";
import { getMetadata } from "./metadataController";
import { deleteWorkDataByCircleId } from "./workDataController";

export async function getRegisteredCircleData() {
  const orderMode = await getMetadata(CURRENT_ORDER, ORDER_BY_PRIORITY, true);
  const result = await getRegisteredCircleDataAsService(orderMode.response);
  return result;
}

export async function getRegisteredCircleDataJoiningAllCircleData() {
  return await getRegisteredCircleDataJoiningAllCircleDataAsService();
}

/**
 * Execute insert on the database.
 * @param {Array} data an array of objects. Each object should
 *    contain data of each of columns in registered table.
 * @returns response
 */
export async function insertRegisteredCircleData(data) {
  return await insertRegisteredCircleDataAsService(data);
}

/**
 * Execute update on the database.
 * @param {Array} to should be an array of objects.
 *    Each object should have two key-value pair:
 *    [
 *      {
 *        column: The column to update
 *        value: The value which is updated to
 *      }
 *    ...
 *    ]
 * @param {Array} ids of rows to update.
 *    This must be an array of integers, each of which indicates
 *    the id to be updated.
 * @returns response
 */
export async function updateRegisteredCircleDataById(to, ids) {
  return await updateRegisteredCircleDataByIdAsService(to, ids);
}

export async function deleteRegisteredCircleDataByCircleId(circleId) {
  return await deleteRegisteredCircleDataByCircleIdAsService(circleId);
}

export async function truncateRegisteredCircle() {
  return await truncateRegisteredCircleAsService();
}

export async function registerCircle(selectedCircle, circleImage, circlePriority) {
  let imagePath = '';
  if (circleImage.isDefault) {
    imagePath = DEFAULT_IMAGE;
  } else {
    const filename = circleImage.src.split('/').pop();
    imagePath = CIRCLE_IMAGE_DIRECTORY + filename;
    await copyAsync({
      from: circleImage.src,
      to: imagePath
    });
  }
  const data = [
    {
      circle_image_path: imagePath,
      circle_id: selectedCircle.id,
      priority: circlePriority
    }
  ];
  return await insertRegisteredCircleData(data);
}

export async function onDeleteCircle(circleId, workList) {
  for (work of workList) {
    deleteAsync(work.image_path, { idempotent: true });
  }
  await deleteWorkDataByCircleId(circleId);
  await deleteRegisteredCircleDataByCircleId(circleId);
  return null;
}