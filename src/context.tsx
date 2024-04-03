import {
    Dispatch,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { NovaWasm } from './wasmInterface';

export type NovaContextType = {
    wasm: any | null,
    params: String | null
    pk: String | null,
    vk: String | null,
    downloaded: boolean,
    setParams: (Dispatch<SetStateAction<String | null>>)
}

const NovaContext = createContext<NovaContextType>({
    wasm: null,
    params: null,
    pk: null,
    vk: null,
    downloaded: false,
    setParams: () => { }
});

const bucketUrl = "https://bjj-ecdsa-nova.us-southeast-1.linodeobjects.com";
const paramsUrl = `${bucketUrl}/bjj-ecdsa-nova-params-gzip-chunk`;
const pkUrl = `${bucketUrl}/pk`;
const vkUrl = `${bucketUrl}/vk`;


export const NovaProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
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
    const getChunkedFile = async (bucketFolderUrl: string, artifactType: String): Promise<string> => {
        // track start time for download
        const start = new Date().getTime();

        // build requests
        let requests = [];
        let data: Map<Number, Blob> = new Map();
        for (let i = 0; i < 10; i++) {
            let req = async () => {
                let full_url = `${bucketFolderUrl}/${artifactType}_${i}.json`;
                let res = await fetch(full_url, { headers: { "Content-Type": "application/x-binary" } }).then(async res => await res.blob());
                data.set(i, res)
            }
            requests.push(req());
        }

        // await all requests
        await Promise.all(requests);

        // build into one blob
        let chunks = [];
        for (let i = 0; i < 10; i++) {
            chunks.push(data.get(i)!);
        }
        let compressed = new Blob(chunks);

        // decompress blob
        let ds = new DecompressionStream("gzip");
        let reader = compressed.stream().pipeThrough(ds).getReader();
        let done = false;
        let fileStr = "";
        while (!done) {
            let decompressed = await reader.read();
            done = decompressed.done;
            fileStr += new TextDecoder().decode(decompressed.value);
        }

        // track time to download
        let runTime = new Date().getTime() - start;
        console.log(`Downloaded ${artifactType} in ${runTime} milliseconds`);
        return fileStr;
    }

    useEffect(() => {
        // get all files
        (async () => {
            // import wasm
            let wasm = await import('babyjubjub-ecdsa-nova');
            await wasm.default();
            setWasm(wasm);

            // download params
            let params = await getChunkedFile(paramsUrl, "params");
            setParams(params);

            // download spartan proving key
            let pk = await getChunkedFile(pkUrl, "pk");
            setPk(pk);

            // download spartan verification key
            let vk = await getChunkedFile(vkUrl, "vk");
            setVk(vk);

            // set downloaded
            setDownloaded(true);
        })();

    }, []);

    return (
        <NovaContext.Provider
            value={{
                wasm,
                params,
                pk,
                vk,
                downloaded,
                setParams
            }}
        >
            {children}
        </NovaContext.Provider>
    );
}


export const useNova = (): NovaContextType => useContext(NovaContext);