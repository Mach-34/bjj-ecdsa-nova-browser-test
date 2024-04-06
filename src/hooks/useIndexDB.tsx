import { IDBPDatabase, openDB } from 'idb';
import { useEffect, useState } from 'react';

const useIndexDB = (dbName: string, storeName: string) => {
  const [db, setDb] = useState<IDBPDatabase | null>(null);

  const add = async (key: number | string, data: any) => {
    if (!db) return;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.add(data, key);
  };

  // Checks to see whether
  const checkStorageCapacity = () => {};

  // Check to see how many items exist in the store
  const itemCount = async (): Promise<number> => {
    if (!db) return -1;
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return await store.count();
  };

  const getItems = async () => {
    if (!db) return [];
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const data = await store.getAll();
    return data;
  };

  useEffect(() => {
    (async () => {
      // Create new db
      const res = await openDB(dbName, 1, {
        upgrade(db) {
          // Create new store
          db.createObjectStore(storeName);
        },
      });
      setDb(res);
    })();
  }, [dbName, storeName]);

  return { add, dbInitialized: !!db, getItems, itemCount };
};

export default useIndexDB;
