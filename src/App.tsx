import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NovaProvider, useNova } from './context';
import { useState, useEffect } from 'react';

const r1csUrl = "https://bjj-ecdsa-nova.us-southeast-1.linodeobjects.com/artifacts/folded.r1cs";
const wasmUrl = "https://bjj-ecdsa-nova.us-southeast-1.linodeobjects.com/artifacts/folded.wasm";

function App() {
  return (
    <div className="App">
      <NovaProvider>
        <div>
          <DataDownloadComponent />
        </div>
      </NovaProvider>
    </div>
  );
}

export default App;

let exampleMembershipInput = JSON.stringify({
  "s": "1556192236082850800011477753789706164136184180458744644984084897070345066570",
  "root": "1799182282238172949735919814155076722550339245418717182904975644657694908682",
  "tx": "11796026433945242671642728009981778919257130899633207712788256867701213124641",
  "ty": "14123514812924309349601388555201142092835117152213858542018278815110993732603",
  "ux": "0",
  "uy": "1",
  "pathIndices": [0, 1, 0, 0, 0, 0, 0, 0],
  "siblings": [
    "19588054228312086345868691355666543386017663516009792796758663539234820257351",
    "17039564632945388764306088555981902867518200276453168439618972583980589320757",
    "7423237065226347324353380772367382631490014989348495481811164164159255474657",
    "11286972368698509976183087595462810875513684078608517520839298933882497716792",
    "3607627140608796879659380071776844901612302623152076817094415224584923813162",
    "19712377064642672829441595136074946683621277828620209496774504837737984048981",
    "20775607673010627194014556968476266066927294572720319469184847051418138353016",
    "3396914609616007258851405644437304192397291162432396347162513310381425243293"
  ],
  "sigNullifierRandomness": "0",
  "pubKeyNullifierRandomness": "0"
});

const DataDownloadComponent = () => {
  const { params, pk, vk, downloaded, setParams, wasm } = useNova();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [numFolded, setNumFolded] = useState(0);
  const [proofResult, setProofResult] = useState<string | null>(null);
  const [compressed, setCompressed] = useState<string | null>(null);
  const [zI, setZI] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [bench, setBench] = useState(0);


  const handleGenerateProof = async () => {
    setIsLoading(true);
    if (wasm && wasm.generate_proof) {
      // start timer
      let start = new Date().getTime();

      // Call the generate_proof function with dummy data
      let res = await wasm.generate_proof(r1csUrl, wasmUrl, params, exampleMembershipInput)
      setProofResult(res);
      setNumFolded(numFolded + 1);

      // mark time to generate proof
      let proveTime = new Date().getTime() - start;
      console.log(`Generated first fold proof in ${proveTime} milliseconds`);

      // verify the proof
      let verification = await wasm.verify_proof(params, res, 1);
      setZI(verification);

      // mark time to verify proof
      let verifyTime = new Date().getTime() - proveTime;
      let totalTime = new Date().getTime() - start;
      console.log(`Verified first fold proof in ${verifyTime} milliseconds`);
      console.log(`Total time for first fold: ${totalTime} milliseconds`);
      setBench(totalTime);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.error('WASM functions not available or generate_proof function is missing.');
    }
  };

  const handleContinueProof = async () => {
    setIsLoading(true);
    if (wasm && wasm.continue_proof) {
      // start timer
      let start = new Date().getTime();

      // set iteration
      const iteration = numFolded + 1;
      // Call the generate_proof function with dummy data
      let res = await wasm.continue_proof(r1csUrl, wasmUrl, params, proofResult, exampleMembershipInput, zI);
      setProofResult(res);
      setNumFolded(iteration);

      // mark time to generate proof
      let proveTime = new Date().getTime() - start;
      console.log(`Generated fold #${iteration} proof in ${proveTime} milliseconds`);

      // verify the proof
      let verification = await wasm.verify_proof(params, res, iteration);
      setZI(verification);

      // mark time to verify proof
      let verifyTime = new Date().getTime() - proveTime;
      let totalTime = new Date().getTime() - start;
      console.log(`Verified fold #${iteration} proof in ${verifyTime} milliseconds`);
      console.log(`Total time for fold #${iteration}: ${totalTime} milliseconds`);
      setIsLoading(false);
      setBench(totalTime);
    } else {
      setIsLoading(false);
      console.error('WASM functions not available or generate_proof function is missing.');
    }
  }

  const handleCompressToSpartan = async () => {
    setIsLoading(true);
    if (wasm && wasm.compress_to_spartan) {

      // start timer
      let start = new Date().getTime();

      // Call the generate_proof function with dummy data
      let res = await wasm.compress_to_spartan(params, pk, proofResult);
      setCompressed(res);

      // mark time to compress
      let runTime = new Date().getTime() - start;
      console.log(`Compressed ${numFolded} folds to Spartan in ${runTime} milliseconds`);
      setIsLoading(false);
      setBench(runTime);
    } else {
      setIsLoading(false);
      console.error('WASM functions not available or generate_proof function is missing.');
    }
  }

  const handleVerifySpartan = async () => {
    setIsLoading(true);
    if (wasm && wasm.verify_spartan) {
      // start timer
      let start = new Date().getTime();

      // Call the generate_proof function with dummy data
      let res = await wasm.verify_spartan(vk, compressed, numFolded);
      console.log("Res: ", res);
      // mark time to compress
      let runTime = new Date().getTime() - start;
      console.log(`Compressed ${numFolded} folds to Spartan in ${runTime} milliseconds`);
      setBench(runTime);

      setIsLoading(false);
    } else {
      console.error('WASM functions not available or generate_proof function is missing.');
      setIsLoading(false);
    }
  }


  useEffect(() => {
    if (!params) {
      // Simulate data download and setting
      setParams("x"); // Assuming setParams is a function that updates the context
      setIsDownloaded(true);
    }
  }, [params, setParams]);

  return (
    <div>
      <div className="spinner-container">

        {isLoading || !downloaded ? (
          <div className="spinner"></div>
        ) : (
          <>
            {isDownloaded && !compressed && (
              <>
                {numFolded === 0 ? (
                  <button onClick={handleGenerateProof}>Generate first proof</button>
                ) : (
                  <>
                    <button onClick={handleGenerateProof}>Generate {numFolded + 1}th proof</button>
                    {numFolded > 1 && <button onClick={handleCompressToSpartan}>Compress to Spartan</button>}
                    <p>Time for last operation: {bench}ms</p>
                  </>
                )}
              </>
            )}
            {compressed && (
              <div>
                <p>Compressed Proof</p>
                <button onClick={handleVerifySpartan}>Verify Compressed</button>
                <p>Time for last operation: {bench}ms</p>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};
