import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { NovaWasm } from './wasmInterface';
import useIndexDB from './hooks/useIndexDB';

type ArtifactType = 'params' | 'pk' | 'vk';

export type NovaContextType = {
  wasm: any | null;
  params: String | null;
  pk: String | null;
  vk: String | null;
  downloaded: boolean;
  setParams: Dispatch<SetStateAction<String | null>>;
};

const NovaContext = createContext<NovaContextType>({
  wasm: null,
  params: null,
  pk: null,
  vk: null,
  downloaded: false,
  setParams: () => {},
});

const bucketUrl = 'https://bjj-ecdsa-nova.us-southeast-1.linodeobjects.com';
const paramsUrl = `${bucketUrl}/bjj-ecdsa-nova-params-gzip-chunk`;
const pkUrl = `${bucketUrl}/pk`;
const vkUrl = `${bucketUrl}/vk`;

export const NovaProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { addItem, dbInitialized, getItems, itemCount } = useIndexDB(
    'bbj',
    'params'
  );
  const [wasm, setWasm] = useState<any | null>(null);
  const [params, setParams] = useState<String | null>(null);
  const [pk, setPk] = useState<String | null>(null);
  const [vk, setVk] = useState<String | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  /**
   * Gets chunked gzipped files, reassembles and decompresses
   *
   * @param bucketFolderUrl - url of the bucket folder
   * @param type - the type of file to download (for label and uri)
   */
  const getChunkedFile = async (
    bucketFolderUrl: string,
    artifactType: ArtifactType
  ): Promise<string> => {
    // track start time for download
    const start = new Date().getTime();

    // TODO: Need to fully consider browser limitations to enforce this
    const minStorage = 40 * 1000000; // 40 megabytes
    const { quota, usage } = await navigator.storage.estimate();
    // Note: quota may be undefined and if so the limit is a machine's disk space
    const hasAvailableSpace = quota ? quota - (usage ?? 0) > minStorage : true;

    // Check if artifact type is params
    const isParams = artifactType === 'params';

    // If artifact type is params then check how many are stored to determine how many to fetch
    const startIndex = isParams ? await itemCount() : 0;

    let data: Map<Number, Blob> = new Map();

    // Fetch params in sequence and store in index db

    if (isParams && hasAvailableSpace && startIndex !== 10) {
      console.log(`${startIndex} out of 10 param chunks stored`);
      for (let i = startIndex; i < 10; i++) {
        let full_url = `${bucketFolderUrl}/${artifactType}_${i}.json`;
        let res = await fetch(full_url, {
          headers: { 'Content-Type': 'application/x-binary' },
        });
        const blob = await res.blob();
        // Store blob in indexdb
        await addItem(i, blob);
        console.log(`Chunk ${i + 1} of 10 stored`);
        data.set(i, blob);
      }
    } else if (!isParams || !hasAvailableSpace) {
      // build requests
      let requests = [];
      for (let i = 0; i < 10; i++) {
        let req = async () => {
          let full_url = `${bucketFolderUrl}/${artifactType}_${i}.json`;
          let res = await fetch(full_url, {
            headers: { 'Content-Type': 'application/x-binary' },
          }).then(async (res) => await res.blob());
          data.set(i, res);
        };
        requests.push(req());
      }
      // await all requests
      await Promise.all(requests);
    }

    // build into one blob
    let chunks = [];

    if (isParams && hasAvailableSpace) {
      // Load in stored chunks
      const stored = await getItems();
      chunks.push(...stored);
    } else {
      for (let i = 0; i < 10; i++) {
        chunks.push(data.get(i)!);
      }
    }

    let compressed = new Blob(chunks);

    // decompress blob
    let ds = new DecompressionStream('gzip');
    let reader = compressed.stream().pipeThrough(ds).getReader();
    let done = false;
    let fileStr = '';
    while (!done) {
      let decompressed = await reader.read();
      done = decompressed.done;
      fileStr += new TextDecoder().decode(decompressed.value);
    }

    // track time to download
    let runTime = new Date().getTime() - start;
    console.log(`Downloaded ${artifactType} in ${runTime} milliseconds`);
    return fileStr;
  };

  useEffect(() => {
    if (!dbInitialized) return;
    // get all files
    (async () => {
      // import wasm
      let wasm = await import('babyjubjub-ecdsa-nova');
      await wasm.default();
      setWasm(wasm);

      // download params
      let params = await getChunkedFile(paramsUrl, 'params');
      setParams(params);

      // download spartan proving key
      let pk = await getChunkedFile(pkUrl, 'pk');
      setPk(pk);

      // download spartan verification key
      let vk = await getChunkedFile(vkUrl, 'vk');
      setVk(vk);

      // set downloaded
      setDownloaded(true);
    })();
  }, [dbInitialized]);

  return (
    <NovaContext.Provider
      value={{
        wasm,
        params,
        pk,
        vk,
        downloaded,
        setParams,
      }}
    >
      {children}
    </NovaContext.Provider>
  );
};

export const useNova = (): NovaContextType => useContext(NovaContext);
