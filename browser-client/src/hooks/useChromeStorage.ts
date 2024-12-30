import { useEffect, useState } from "react";

// Generic type that maps each key to a generic `any`
type StorageShape<K extends string> = {
  [P in K]: any; 
};

export function useChromeStorage<K extends string>(
  isChromeExtension: boolean,
  keys: K[],
  defaultValues?: Partial<StorageShape<K>> // Partial = not all defaults must be supplied
) {
  const [storageData, setStorageData] = useState<StorageShape<K>>(() => {
    // Initialize from defaults
    const initialData = {} as StorageShape<K>;
    for (const key of keys) {
      (initialData as any)[key] = defaultValues?.[key] ?? null;
    }
    return initialData;
  });

  useEffect(() => {
    if (!isChromeExtension) {
      // If not in Chrome extension, just set defaults
      setStorageData(() => {
        const data = {} as StorageShape<K>;
        for (const key of keys) {
          (data as any)[key] = defaultValues?.[key] ?? null;
        }
        return data;
      });
      return;
    }

    chrome.storage.local.get(keys, (result) => {
      const updatedData = {} as StorageShape<K>;
      for (const key of keys) {
        (updatedData as any)[key] = result[key] ?? defaultValues?.[key] ?? null;
      }
      setStorageData(updatedData);
    });
  }, [isChromeExtension, keys, defaultValues]);

  return storageData;
}
