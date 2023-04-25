import { DATA_IS_EMPTY } from "../../data/constants";
import { getAllCircleDataAsDAO, getAllCircleDataBySpaceAsDAO, insertAllCircleDataAsDAO, searchCircleAsDAO, truncateAllCircleDataAsDAO } from "../dao/allCircleDAO";

export async function getAllCircleDataAsService() {
  const result = await getAllCircleDataAsDAO();
  return result;
}

export async function getAllCircleDataBySpaceAsService(space, isStrict) {
  const spaceSql = isStrict ? ` = '${ space }'` : ` LIKE '%${ space }%'`;
  const result = await getAllCircleDataBySpaceAsDAO(spaceSql);
  return result;
}

export async function insertAllCircleDataAsService(data) {
  if (data.length == 0) {
    return {
      responseCode: DATA_IS_EMPTY,
      response: 'In allCircleService -> insertAllCircleDataAsService: provided data is empty'
    }
  }
  const values = [ ];
  for (let i = 0; i < data.length; i++) {
    data[i].space = data[i].space.replaceAll('\'', '\'\'').replaceAll('"', '""');
    data[i].penname = data[i].penname.replaceAll('\'', '\'\'').replaceAll('"', '""');
    data[i].circlename = data[i].circlename.replaceAll('\'', '\'\'').replaceAll('"','""');
    const value = `('${ data[i].space }', '${ data[i].penname }', '${ data[i].circlename }')`;
    values.push(value);
  }
  const valuesSql = values.join(',');
  const result = await insertAllCircleDataAsDAO(valuesSql);
  return result;
}

export async function truncateAllCircleDataAsService() {
  const result = await truncateAllCircleDataAsDAO();
  return result;
}

export async function searchCircleAsService(searchText, selectedRecordId) {
  const result = await searchCircleAsDAO(searchText, selectedRecordId);
  return result;
}