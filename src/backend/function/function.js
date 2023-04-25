import { moveAsync } from "expo-file-system";
import { BUDGET_CRITERION, DEFAULT_IMAGE, DEFAULT_WORK_TITLE, WORK_IMAGE_DIRECTORY } from "../../data/constants";
import { getMetadata } from "../controller/metadataController";
import { getPriceSum } from "../controller/workDataController";
import { getPrioritySetAsDAO } from "../dao/prioritySetDAO";

export async function calculateCurrentBudget() {
  const criterionArray = await getBudgetCrioterion();
  const result = await getPriceSum(criterionArray);
  console.log('aa', result);
  return result.response;
}

export async function getBudgetCrioterion() {
  const queryResult = await getMetadata(BUDGET_CRITERION, '1,2,3,4,5', true);
  const value = queryResult.response;
  console.log(value);
  const criterionArray = value.split(/,+/);
  removeEmptyStringFromArray(criterionArray);
  for (let i = 0; i < criterionArray.length; i++) {
    criterionArray[i] = parseInt(criterionArray[i]);
  }
  return criterionArray;
}

export function removeEmptyStringFromArray(array) {
  let i = -1;
  while ((i = array.indexOf('')) >= 0) {
    array.splice(i, 1);
  }
}

export async function getPrioritySet() {
  const result = await getPrioritySetAsDAO();
  return result.response;
}

export async function onCompleteAddingWorkFileTask(data) {
  if (data.title == '') {
    data.title = DEFAULT_WORK_TITLE;
  }
  data.title = data.title.replaceAll(`'`, `''`);
  if (data.price == '') {
    data.price = '0';
  }
  if (data.image.isDefault) {
    data.image.src = DEFAULT_IMAGE;
  } else {
    const filename = data.image.src.split('/').pop();
    const imagePath = WORK_IMAGE_DIRECTORY + filename;
    await moveAsync({
          from: data.image.src,
          to: imagePath
        }).then((result) => console.log(result))
        .catch((err) => console.error(err));
    data.image.src = imagePath;
  }
}