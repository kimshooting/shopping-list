import { documentDirectory } from "expo-file-system";

export const METADATA_TABLE = 'metadata';

export const DIRECTORY_URI_FOR_FETCH_CIRCLE_DATA = 'directoryUriForFetchCircleData';
export const DIRECTORY_URI_FOR_FETCH_SHARED_DATA = 'directory_uri_for_fetch_shared_data';

export const CURRENT_ORDER = 'current_order';

export const ORDER_BY_PRIORITY = 10;
export const ORDER_BY_CIRCLE_NAME = 20;
export const ORDER_BY_PENNAME = 30;
export const ORDER_BY_SPACE = 40;

export const REGISTERED_TABLE = 'registered';

export const CIRCLE_PARTICIPATE_TABLE = 'circle_participate';

export const WORK_TABLE = 'work';

export const PRIORITY_TABLE = 'priority';

export const WORK_REGISTERED_TABLE = 'work_registered';

export const CIRCLE_IMAGE_DIRECTORY = documentDirectory + 'circle_image_dir/';

export const WORK_IMAGE_DIRECTORY = documentDirectory + 'work_image_dir/';

export const DEFAULT_IMAGE = 'default_circle_image';

export const DEFAULT_WORK_TITLE = 'Not specified';

export const FETCH_CIRCLE_DATA = 101;
export const FETCH_SHARED_DATA = 201;

export const SHARED_DATA_MANAGEMENT_FILENAME = 'shared_data.json';

export const SEARCH_KEYWORD = 'search_keyword';

export const EXPORT_DATA_ROOT_DIR = documentDirectory + 'to_export/';
export const EXPORT_ENTRY_FILENAME = 'shared_data.json';
export const EXPORT_CIRCLE_DATA_FILENAME = 'circle_data.json';
export const EXPORT_WORK_DATA_FILENAME = 'work_data.json';
export const EXPORT_IMAGE_FILES_DIR = documentDirectory + 'to_export/image/';
export const EXPORT_CIRCLE_IMAGES_DIR = documentDirectory + 'to_export/image/circle/';
export const EXPORT_WORK_IMAGES_DIR = documentDirectory + 'to_export/image/work/';
export const EXPORT_TARGET_ARCHIVE = documentDirectory + 'shared_data.zip';