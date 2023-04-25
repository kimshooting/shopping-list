import { CIRCLE_PARTICIPATE_TABLE, DATA_IS_EMPTY, OK, PRIORITY_TABLE, WORK_TABLE } from "../../data/constants";
import { deleteWorkDataByCircleIdAsDAO, deleteWorkDataByIdAsDAO, getPriceSumAsDAO, getWorkDataAsDAO, insertWorkDataAsDAO, truncateWorkDataAsDAO, updateWorkDataAsDAO } from "../dao/workDataDAO";
import { removeEmptyStringFromArray } from "../function/function";

export async function getWorkDataAsService(title, priority, checked, order, circleId, joinCircle) {
  const sqlTitle = title == '' ? '' : `w.title = ${ title }`;
  const sqlChecked = checked == -1
      ? ''
      : checked == 0
          ? 'checked = 0'
          : 'checked = 1';
  const sqlOrder = order ? 'ORDER BY w.checked ASC, w.priority ASC' : '';
  const sqlCircleId = circleId == -1 ? '' : `w.circle_id = ${ circleId }`;
  const sqlPriority = priority.length > 0
      ? `w.priority IN (${ priority.join(',') })`
      : 'w.priority IN (-1)';
  const sqlJoinCircle = joinCircle
      ? `INNER JOIN ${ CIRCLE_PARTICIPATE_TABLE } AS p ON w.circle_id = p.id`
      : '';
  const circleSelect = joinCircle
      ? ', p.penname, p.circle_name, p.space'
      : '';

  const tmp = `${ sqlChecked }QTEEEEQTE${ sqlTitle }QTEEEEQTE${ sqlCircleId }QTEEEEQTE${ sqlPriority }`;
  const conditions = tmp.split('QTEEEEQTE');
  let i = -1;
  removeEmptyStringFromArray(conditions);
  let whereStatement = conditions.join(' AND ');
  whereStatement = 'WHERE ' + whereStatement;

  const sql = `
    SELECT w.id, w.title, w.checked, w.image_path,
           w.priority, w.price, w.circle_id${ circleSelect }
    FROM ${ WORK_TABLE } AS w
    ${ sqlJoinCircle }
    ${ whereStatement }
    ${ sqlOrder };
  `;

  const result = await getWorkDataAsDAO(sql);
  return result;
}

export async function getWorkDataWithPriorityAsService(title, priority, checked, order, circleId, joinCircle) {
  const sqlTitle = title == '' ? '' : `w.title = ${ title }`;
  const sqlChecked = checked == -1
      ? ''
      : checked == 0
          ? 'checked = 0'
          : 'checked = 1';
  const sqlOrder = order ? 'ORDER BY w.checked ASC, w.priority ASC' : '';
  const sqlCircleId = circleId == -1 ? '' : `w.circle_id = ${ circleId }`;
  const sqlPriority = priority.length > 0
      ? `w.priority IN (${ priority.join(',') })`
      : 'w.priority IN (-1)';
  const sqlJoinCircle = joinCircle
      ? `INNER JOIN ${ CIRCLE_PARTICIPATE_TABLE } AS p ON w.circle_id = p.id`
      : '';
  const circleSelect = joinCircle
      ? ', p.penname, p.circle_name, p.space'
      : '';

  const tmp = `${ sqlChecked }QTEEEEQTE${ sqlTitle }QTEEEEQTE${ sqlCircleId }QTEEEEQTE${ sqlPriority }`;
  const conditions = tmp.split('QTEEEEQTE');
  let i = -1;
  removeEmptyStringFromArray(conditions);
  let whereStatement = conditions.join(' AND ');
  whereStatement = 'WHERE ' + whereStatement;

  const sql = `
    SELECT w.id, w.title, w.checked, w.image_path,
           w.priority, w.price, w.circle_id,
           pr.color${ circleSelect }
    FROM ${ WORK_TABLE } AS w
    ${ sqlJoinCircle }
    INNER JOIN ${ PRIORITY_TABLE } AS pr ON w.priority = pr.priority
    ${ whereStatement }
    ${ sqlOrder };
  `;

  const result = await getWorkDataAsDAO(sql);
  return result;
}

export async function insertWorkDataAsService(data) {
  if (data.length == 0) {
    return {
      responseCode: DATA_IS_EMPTY,
      response: 'In workDataService -> insertWorkDataAsService: provided data is empty'
    };
  }
  const values = [ ];
  for (let d of data) {
    d.title = d.title.replaceAll('\'', '\'\'').replaceAll('"', '""');
    d.image_path = d.image_path.replaceAll('\'', '\'\'').replaceAll('"', '""');
    const value = `('${ d.title }', ${ d.checked }, '${ d.image_path }', ${ d.priority }, ${ d.price }, ${ d.circle_id })`;
    values.push(value);
  }
  const valuesSql = values.join(',');
  const result = await insertWorkDataAsDAO(valuesSql);
  return result;
}

export async function updateWorkDataAsService(to, ids) {
  const set = [ ];
  for (i of to) {
    if (isNaN(i.value)) {
      i.value = i.value.replaceAll(`'`, `''`).replaceAll(`"`, `""`);
      set.push(`${ i.column } = '${ i.value }'`);
    } else {
      set.push(`${ i.column } = ${ i.value }`);
    }
  }
  const target = set.join(',');
  const idsStr = ids.join(',');
  const result = await updateWorkDataAsDAO(target, idsStr);
  return result;
}

export async function deleteWorkDataByIdAsService(id) {
  const result = await deleteWorkDataByIdAsDAO(id);
  return result;
}

export async function deleteWorkDataByCircleIdAsService(circleId) {
  const result = await deleteWorkDataByCircleIdAsDAO(circleId);
  console.log('delete work');
  return result;
}

export async function truncateWorkDataAsService() {
  const result = await truncateWorkDataAsDAO();
  return result;
}

export async function getPriceSumAsService(priority, checked) {
  if (priority.length == 0) {
    return { responseCode: OK, response: 0 };
  }
  const prioritySql = priority.join(',');
  const checkedSql = checked == -1
      ? ''
      : ` AND checked = ${ checked }`;
  const whereExpression = `priority IN (${ prioritySql })${checkedSql};`;
  const result = await getPriceSumAsDAO(whereExpression);
  return result;
}