import { NO_SUCH_KEY } from "../../data/constants";
import { getMetadataAsDAO, insertMetadataAsDAO, updateMetadataAsDAO } from "../dao/metadataDAO";

export async function getMetadataAsService(key, ifNoSuchKey, insertNewIfNoSuchKey) {
  let result = null;
  try {
    result = await getMetadataAsDAO(key);
    if (result.responseCode == NO_SUCH_KEY) {
      if (insertNewIfNoSuchKey) {
        await insertMetadataAsService(key, ifNoSuchKey); // TODO I have to decide whether await is here or not
      }
      result.response = ifNoSuchKey;
    }
  } catch (error) {
    throw new Error(error);
  }
  return result;
}

export async function insertMetadataAsService(key, value) {
  let result = null;
  try {
    const val = value.toString().replaceAll('\'', '\'\'').replaceAll('"', '""');
    result = await insertMetadataAsDAO(key, val);
  } catch (err) {
    throw new Error(err);
  }
  return result;
}

export async function updateMetadataAsService(key, to) {
  let result = null;
  try {
    const toVal = to.toString().replaceAll('\'', '\'\'').replaceAll('"', '""');
    result = await updateMetadataAsDAO(key, toVal);
  } catch (err) {
    throw new Error(err);
  }
  return result;
}