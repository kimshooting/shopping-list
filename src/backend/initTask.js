import { BUDGET_CRITERION, CIRCLE_IMAGE_DIRECTORY, CIRCLE_PARTICIPATE_TABLE, IS_PRICE_VISIBLE, IS_WORK_TITLE_VISIBLE, METADATA_TABLE, PRIORITY_TABLE, REGISTERED_TABLE, WORK_IMAGE_DIRECTORY, WORK_TABLE } from '../data/constants';
import { getInfoAsync, makeDirectoryAsync } from 'expo-file-system';
import { executeDBUnit } from './db';


export async function initTask() {
  console.log('init app');

  const query1 = `
  CREATE TABLE IF NOT EXISTS ${METADATA_TABLE} (
    key VARCHAR(255) PRIMARY KEY NOT NULL,
    value TEXT
  );`;
  await executeDBUnit(query1, (tx, result) => console.log('success: created table'), (err) => console.error(err));

  console.log('here');
  const query2 = `
  CREATE TABLE IF NOT EXISTS ${CIRCLE_PARTICIPATE_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    space VARCHAR(10) NOT NULL,
    penname VARCHAR(15) DEFAULT '',
    circle_name VARCHAR(15) NOT NULL
  );`;
  await executeDBUnit(query2, (tx, result) => console.log('success: created table'), (err) => console.error(err));

  const query3 = `
  CREATE TABLE IF NOT EXISTS ${PRIORITY_TABLE} (
    priority INTEGER PRIMARY KEY NOT NULL,
    title TEXT,
    color VARCHAR(10)
  );`;
  await executeDBUnit(query3, (tx, result) => console.log('success: created table'), (err) => console.error(err));


  const query4 = `
  CREATE TABLE IF NOT EXISTS ${REGISTERED_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    circle_image_path VARCHAR(255),
    circle_id INTEGER UNIQUE NOT NULL,
    priority INTEGER NOT NULL,
    CONSTRAINT fk_circle FOREIGN KEY (circle_id)
    REFERENCES ${CIRCLE_PARTICIPATE_TABLE} (id),
    CONSTRAINT fk_priority FOREIGN KEY (priority)
    REFERENCES ${PRIORITY_TABLE} (priority)
  );`;
  await executeDBUnit(query4, (tx, result) => console.log('success: created table'), (err) => console.error(err));

  const query5 = `
  CREATE TABLE IF NOT EXISTS ${WORK_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    checked INTEGER NOT NULL,
    image_path TEXT DEFAULT '',
    priority INTEGER NOT NULL,
    price INTEGER,
    circle_id VARCHAR(10) NOT NULL,
    CONSTRAINT fk_circle_id FOREIGN KEY (circle_id)
    REFERENCES ${CIRCLE_PARTICIPATE_TABLE} (id),
    CONSTRAINT fk_priority FOREIGN KEY (priority)
    REFERENCES ${PRIORITY_TABLE} (priority)
  );`;
  await executeDBUnit(query5, (tx, result) => console.log('success: created table'), (err) => console.error(err));

  const query6 = `
    SELECT * FROM ${PRIORITY_TABLE};
  `;
  const query7 = `
  INSERT INTO ${PRIORITY_TABLE} (priority, title, color) VALUES
    (1, '가장 중요', '#e03131'),
    (2, '중요', '#ffa94d'),
    (3, '덜 중요', '#1c7ed6'),
    (4, '중요할지도', '#37b24d'),
    (5, '계륵', '#868e96');
  `;
  await executeDBUnit(query6, async (tx, result) => {
    console.log('success: created table');
    if (result.rows.length == 0) {
      await executeDBUnit(query7, (tx, result) => console.log('success: inserted into priority'), (err) => console.error(err));
    }
  }, (err) => console.error(err));

  getInfoAsync(CIRCLE_IMAGE_DIRECTORY)
    .then((result) => {
      if (!result.exists) {
        makeDirectoryAsync(CIRCLE_IMAGE_DIRECTORY, { intermediates: true });
      }
    });

  getInfoAsync(WORK_IMAGE_DIRECTORY)
    .then((result) => {
      if (!result.exists) {
        makeDirectoryAsync(WORK_IMAGE_DIRECTORY, { intermediates: true })
          .then((result) => console.log('work image succeeded'));
      }
    });

  const query8 = `
    SELECT key, value FROM ${METADATA_TABLE}
    WHERE key = '${BUDGET_CRITERION}';
  `;
  const query9 = `
    INSERT INTO ${METADATA_TABLE} VALUES
      ('${BUDGET_CRITERION}', '1,2,3,4,5');
  `;
  await executeDBUnit(query8, async (tx, result) => {
    const len = result.rows.length;
    if (len == 0) {
      executeDBUnit(query9, (tx, result) => console.log('budget criterion: inserted'),
        (err) => console.error(err));
    }
  }, (err) => console.error(err));

  await executeDBUnit(`
    SELECT key, value FROM ${ METADATA_TABLE }
    WHERE key = '${ IS_PRICE_VISIBLE }';
  `, (tx, result) => {
    const len = result.rows.length;
    if (len == 0) {
      executeDBUnit(`
        INSERT INTO ${ METADATA_TABLE } (key, value) VALUES
          ('${ IS_PRICE_VISIBLE }', '1');
      `, (tx, result) => console.log('is_price_visible: inserted'), (err) => console.err(err));
    }
  }, (err) => console.error(err));

  await executeDBUnit(`
    SELECT key, value FROM ${ METADATA_TABLE }
    WHERE key = '${ IS_WORK_TITLE_VISIBLE }';
  `, (tx, result) => {
    const len = result.rows.length;
    if (len == 0) {
      executeDBUnit(`
        INSERT INTO ${ METADATA_TABLE } (key, value) VALUES
          ('${ IS_WORK_TITLE_VISIBLE }', '1');
      `, (tx, result) => console.log('is_work_title_visible: inserted'), (err) => console.err(err));
    }
  }, (err) => console.error(err));
  return null;
}
