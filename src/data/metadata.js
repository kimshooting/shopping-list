import { documentDirectory } from "expo-file-system";

// Table names
export const METADATA_TABLE = 'metadata';
export const REGISTERED_TABLE = 'registered';
export const CIRCLE_PARTICIPATE_TABLE = 'circle_participate';
export const WORK_TABLE = 'work';
export const PRIORITY_TABLE = 'priority';
export const WORK_REGISTERED_TABLE = 'work_registered';

// Key of metadata (Column names of metadata table)
export const DIRECTORY_URI_FOR_FETCH_CIRCLE_DATA = 'directoryUriForFetchCircleData';
export const DIRECTORY_URI_FOR_FETCH_SHARED_DATA = 'directory_uri_for_fetch_shared_data';
export const BUDGET_CRITERION = 'budget_criterion';
export const CURRENT_ORDER = 'current_order';
export const SEARCH_KEYWORD = 'search_keyword';

// Order of circles
export const ORDER_BY_PRIORITY = 10;
export const ORDER_BY_CIRCLE_NAME = 20;
export const ORDER_BY_PENNAME = 30;
export const ORDER_BY_SPACE = 40;

// Image storage path
export const CIRCLE_IMAGE_DIRECTORY = documentDirectory + 'circle_image_dir/';
export const WORK_IMAGE_DIRECTORY = documentDirectory + 'work_image_dir/';

// Default value of image_path in database
export const DEFAULT_IMAGE = 'default_circle_image';

// Default value of title
export const DEFAULT_WORK_TITLE = 'Not specified';

// Entry 
export const SHARED_DATA_ENTRY_FILENAME = 'shared_data.json';

// Filenames of sharing data
export const EXPORT_DATA_ROOT_DIR = documentDirectory + 'to_export/';
export const EXPORT_ENTRY_FILENAME = 'shared_data.json';
export const EXPORT_CIRCLE_DATA_FILENAME = 'circle_data.json';
export const EXPORT_WORK_DATA_FILENAME = 'work_data.json';
export const EXPORT_IMAGE_FILES_DIR = documentDirectory + 'to_export/image/';
export const EXPORT_CIRCLE_IMAGES_DIR = documentDirectory + 'to_export/image/circle/';
export const EXPORT_WORK_IMAGES_DIR = documentDirectory + 'to_export/image/work/';
export const EXPORT_TARGET_ARCHIVE = documentDirectory + 'shared_data.zip';