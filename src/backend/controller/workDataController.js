import { moveAsync } from "expo-file-system";
import { deleteWorkDataByCircleIdAsService, deleteWorkDataByIdAsService, getPriceSumAsService, getWorkDataAsService, getWorkDataWithPriorityAsService, insertWorkDataAsService, truncateWorkDataAsService, updateWorkDataAsService } from "../service/workDataService";
import { calculateCurrentBudget, getBudgetCrioterion, onCompleteAddingWorkFileTask } from "../function/function";
import { setCurrentBudget } from "../../data/store";

export async function getWorkData(title = '', priority = [ 1, 2, 3, 4, 5 ],
    checked = -1, order = false, circleId = -1, getCircleInfo = false) {
  return await getWorkDataAsService(title, priority, checked, order, circleId, getCircleInfo);
}

export async function getWorkDataWithPriority(title = '', priority = [ 1, 2, 3, 4, 5 ],
    checked = -1, order = false, circleId = -1, getCircleInfo = false) {
  return await getWorkDataWithPriorityAsService(title, priority, checked, order, circleId, getCircleInfo);
}

/**
 * Execute insert on the database.
 * @param {Array} data an array of objects. Each object should
 *    contain data of each of columns in work table.
 * @returns response
 */
export async function insertWorkData(data) {
  return await insertWorkDataAsService(data);
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
export async function updateWorkData(to, ids) {
  return await updateWorkDataAsService(to, ids);
}

export async function deleteWorkDataById(id) {
  return await deleteWorkDataByIdAsService(id);
}

export async function deleteWorkDataByCircleId(circleId) {
  return await deleteWorkDataByCircleIdAsService(circleId);
}

export async function truncateWorkData() {
  return await truncateWorkDataAsService();
}

export async function getPriceSum(priority = [ 1, 2, 3, 4, 5 ], checked = 0) {
  const result = await getPriceSumAsService(priority, checked);
  return result;
}

export async function completeAddingWork(data, isEdit, dispatch) {
  await onCompleteAddingWorkFileTask(data);

  if (isEdit) {
    console.log('update');
    const updateData = [
      {
        column: 'title',
        value: data.title
      },
      {
        column: 'checked',
        value: data.checked
      },
      {
        column: 'image_path',
        value: data.image.src
      },
      {
        column: 'priority',
        value: data.priority
      },
      {
        column: 'price',
        value: data.price
      }
    ];
    await updateWorkDataAsService(updateData, [ data.id ]);
  } else {
    console.log('insert');
    const updateData = [
      {
        title: data.title,
        checked: data.checked,
        image_path: data.image.src,
        priority: data.priority,
        price: data.price,
        circle_id: data.circle_id
      }
    ];
    await insertWorkDataAsService(updateData);
  }
  calculateCurrentBudget().then((result) => dispatch(setCurrentBudget(result)));
}

export async function onDeleteWorkRequest(workData) {
  await deleteWorkDataById(workData.id);
  const currentBudget = await calculateCurrentBudget();
  return currentBudget;
}