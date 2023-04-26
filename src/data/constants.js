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
export const IS_PRICE_VISIBLE = 'is_price_visible';
export const IS_WORK_TITLE_VISIBLE = 'is_work_title_visible';

// Order of circles
export const ORDER_BY_PRIORITY = 10;
export const ORDER_BY_CIRCLE_NAME = 20;
export const ORDER_BY_PENNAME = 30;
export const ORDER_BY_SPACE = 40;

// Image storage path
export const CIRCLE_IMAGE_DIRECTORY = documentDirectory + 'circle_image_dir/';
export const WORK_IMAGE_DIRECTORY = documentDirectory + 'work_image_dir/';

export const JAPANESE_CHEAT_SHEET_FILE_PATH = documentDirectory + 'japanese_cheat_sheet.json';

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

// Response code
export const OK = 200;
export const NO_SUCH_KEY = 534;
export const DATA_IS_EMPTY = 562;

// Color pallete (Style design)
export const MAIN_RED_COLOR = '#e03131';
export const MAIN_GRAY_COLOR = '#495057';
export const SUB_GRAY_COLOR = '#868e96';
export const MAIN_BLUE_COLOR = '#1971c2';
export const SUB_BLUE_COLOR = '#74c0fc';
export const CYAN_COLOR = '#1098ad';
export const GRAPE_COLOR = '#9c36b5';
export const PRIORITY_COLOR_SQUARE_WIDTH_AND_SIZE = 20;