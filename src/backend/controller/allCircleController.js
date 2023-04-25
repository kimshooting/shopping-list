import { getAllCircleDataAsService, getAllCircleDataBySpaceAsService, insertAllCircleDataAsService, searchCircleAsService as searchCircleAsService, truncateAllCircleDataAsService } from "../service/allCircleService";

export async function getAllCircleData() {
  return await getAllCircleDataAsService();
}

export async function getAllCircleDataBySpace(space, isStrict) {
  return await getAllCircleDataBySpaceAsService(space, isStrict);
}

/**
 * Execute insert on the database.
 * @param {Array} data an array of objects. Each object should
 *    contain data of each of columns in work table.
 * @returns response
 */
export async function insertAllCircleData(data) {
  return insertAllCircleDataAsService(data);
}

export async function truncateAllCircleData() {
  return await truncateAllCircleDataAsService();
}

export async function searchCircle(searchText, selectedRecordId) {
  return await searchCircleAsService(searchText, selectedRecordId);
}