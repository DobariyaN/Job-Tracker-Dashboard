import { openDB } from 'idb';

const DB_NAME = 'trackline-db';
const DB_VERSION = 1;
const STORE_JOBS = 'jobs';
const STORE_META = 'meta';

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_JOBS)) {
          const store = db.createObjectStore(STORE_JOBS, { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('dateApplied', 'dateApplied');
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllJobs() {
  const db = await getDB();
  return db.getAll(STORE_JOBS);
}

export async function putJob(job) {
  const db = await getDB();
  await db.put(STORE_JOBS, job);
  return job;
}

export async function deleteJob(id) {
  const db = await getDB();
  await db.delete(STORE_JOBS, id);
}

export async function bulkPutJobs(jobs) {
  const db = await getDB();
  const tx = db.transaction(STORE_JOBS, 'readwrite');
  await Promise.all(jobs.map((j) => tx.store.put(j)));
  await tx.done;
}

export async function clearAllJobs() {
  const db = await getDB();
  await db.clear(STORE_JOBS);
}

export async function getMeta(key, fallback = null) {
  const db = await getDB();
  const row = await db.get(STORE_META, key);
  return row ? row.value : fallback;
}

export async function setMeta(key, value) {
  const db = await getDB();
  await db.put(STORE_META, { key, value });
}
