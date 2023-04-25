import { getMetadataAsService, insertMetadataAsService, updateMetadataAsService } from "../service/metadataService";

export async function getMetadata(key, ifNoSuchKey = '', insertNewIfNoSuchKey = false) {
  return await getMetadataAsService(key, ifNoSuchKey, insertNewIfNoSuchKey);
}

export async function insertMetadata(key, value) {
  return await insertMetadataAsService(key, value);
}

export async function updateMetadata(key, to) {
  console.log(key, to);
  return await updateMetadataAsService(key, to);
}