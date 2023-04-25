import { DATA_IS_EMPTY, NO_SUCH_KEY, ORDER_BY_CIRCLE_NAME, ORDER_BY_PENNAME, ORDER_BY_PRIORITY, ORDER_BY_SPACE, SEARCH_KEYWORD } from "../../data/constants";
import { getMetadataAsDAO } from "../dao/metadataDAO";
import { deleteRegisteredCircleDataByCircleIdAsDAO, getRegisteredCircleDataAsDAO, getRegisteredCircleDataJoiningAllCircleDataAsDAO, insertRegisteredCircleDataAsDAO, truncateRegisteredCircleAsDAO, updateRegisteredCircleDataByIdAsDAO } from "../dao/registeredCircleDAO";

export async function getRegisteredCircleDataAsService(orderMode) {
  const searchKeyword = await getMetadataAsDAO(SEARCH_KEYWORD);
  const whereStatement = searchKeyword.responseCode == NO_SUCH_KEY
      ? '' : searchKeyword.response;

  let orderBySql = '';
  switch (parseInt(orderMode)) {
    case ORDER_BY_PRIORITY:
      orderBySql = 'ORDER BY pr.priority ASC;';
      break;
    case ORDER_BY_CIRCLE_NAME:
      orderBySql = 'ORDER BY p.circle_name ASC, pr.priority ASC';
      break;
    case ORDER_BY_PENNAME:
      orderBySql = 'ORDER BY p.penname ASC, pr.priority ASC';
      break;
    case ORDER_BY_SPACE:
      orderBySql = 'ORDER BY p.id ASC';
      break;
    default:
      orderBySql = '';
  }

  const result = await getRegisteredCircleDataAsDAO(whereStatement, orderBySql);
  return result;
}

export async function getRegisteredCircleDataJoiningAllCircleDataAsService() {
  const result = await getRegisteredCircleDataJoiningAllCircleDataAsDAO();
  return result;
}

export async function insertRegisteredCircleDataAsService(data)  {
  if (data.length == 0) {
    return {
      responseCode: DATA_IS_EMPTY,
      response: 'In registeredCircleService -> insertRegisteredCircleDataAsService: provided data is empty'
    }
  }
  const values = [ ];
  for (let d of data) {
    d.circle_image_path = d.circle_image_path.replaceAll('\'', '\'\'').replaceAll('"', '""');
    const value = `('${ d.circle_image_path }', ${ d.circle_id }, ${ d.priority })`;
    values.push(value);
  }
  const valuesSql = values.join(',');
  const result = await insertRegisteredCircleDataAsDAO(valuesSql);
  return result;
}

export async function updateRegisteredCircleDataByIdAsService(to, ids) {
  const set = [ ];
  for (i of to) {
    set.push(`${ i.column } = ${ i.value }`);
  }
  const target = set.join(',');
  const idsStr = ids.join(',');
  const result = await updateRegisteredCircleDataByIdAsDAO(target, idsStr);
  return result;
}

export async function deleteRegisteredCircleDataByCircleIdAsService(circleId) {
  const result = await deleteRegisteredCircleDataByCircleIdAsDAO(circleId);
  console.log('delete circle');
  return result;
}

export async function truncateRegisteredCircleAsService() {
  const result = await truncateRegisteredCircleAsDAO();
  return result;
}