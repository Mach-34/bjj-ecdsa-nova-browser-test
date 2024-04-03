/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_panic_hook(): void;
/**
*
* * Get the public parameters file for the folding operation
* *
* * @return - the stringified public_params.json file
* 
* @returns {Promise<string>}
*/
export function get_pp_file(): Promise<string>;
/**
*
* * Get the spartan proving key file for compression and zk
* *
* * @return - the stringified pk.json file
* 
* @returns {Promise<string>}
*/
export function get_pk_file(): Promise<string>;
/**
*
* * Get the spartan verification key file for verifying compressed spartan zk proof
* *
* * @return - the stringified vk.json file
* 
* @returns {Promise<string>}
*/
export function get_vk_file(): Promise<string>;
/**
* Verify a proof 
* @param {string} params_string
* @param {string} proof_string
* @param {number} num_steps
* @returns {Promise<Array<any>>}
*/
export function verify_proof(params_string: string, proof_string: string, num_steps: number): Promise<Array<any>>;
/**
* Generates a new proof 
* @param {string} r1cs_url
* @param {string} wasm_url
* @param {string} params_string
* @param {string} membership_string
* @returns {Promise<string>}
*/
export function generate_proof(r1cs_url: string, wasm_url: string, params_string: string, membership_string: string): Promise<string>;
/**
*
* * Compute the next step of a proof
* *
* * @param params_string - the stringified public parameters file
* * @param proof_string - the stringified proof file
* * @param membership_string - the stringified membership inputs
* * @param zi_primary - the step_out of previous proof and step_in for this proof
* * @return - the stringified proof file
* 
* @param {string} r1cs_url
* @param {string} wasm_url
* @param {string} params_string
* @param {string} proof_string
* @param {string} membership_string
* @param {Array<any>} zi_primary
* @returns {Promise<string>}
*/
export function continue_proof(r1cs_url: string, wasm_url: string, params_string: string, proof_string: string, membership_string: string, zi_primary: Array<any>): Promise<string>;
/**
* @param {string} params_string
* @param {string} proving_key_string
* @param {string} proof_string
* @returns {Promise<string>}
*/
export function compress_to_spartan(params_string: string, proving_key_string: string, proof_string: string): Promise<string>;
/**
* @param {string} verifier_key_string
* @param {string} proof_string
* @param {number} iterations
* @returns {Promise<Array<any>>}
*/
export function verify_spartan(verifier_key_string: string, proof_string: string, iterations: number): Promise<Array<any>>;
/**
* Handler for `console.log` invocations.
*
* If a test is currently running it takes the `args` array and stringifies
* it and appends it to the current output of the test. Otherwise it passes
* the arguments to the original `console.log` function, psased as
* `original`.
* @param {Array<any>} args
*/
export function __wbgtest_console_log(args: Array<any>): void;
/**
* Handler for `console.debug` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_debug(args: Array<any>): void;
/**
* Handler for `console.info` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_info(args: Array<any>): void;
/**
* Handler for `console.warn` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_warn(args: Array<any>): void;
/**
* Handler for `console.error` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_error(args: Array<any>): void;
/**
* @param {string} path
* @returns {Promise<Uint8Array>}
*/
export function read_file(path: string): Promise<Uint8Array>;
/**
* @param {string} input_json_string
* @param {string} wasm_file
* @returns {Promise<Uint8Array>}
*/
export function generate_witness_browser(input_json_string: string, wasm_file: string): Promise<Uint8Array>;
/**
* @param {number} num_threads
* @returns {Promise<any>}
*/
export function initThreadPool(num_threads: number): Promise<any>;
/**
* @param {number} receiver
*/
export function wbg_rayon_start_worker(receiver: number): void;
/**
* Runtime test harness support instantiated in JS.
*
* The node.js entry script instantiates a `Context` here which is used to
* drive test execution.
*/
export class WasmBindgenTestContext {
  free(): void;
/**
* Creates a new context ready to run tests.
*
* A `Context` is the main structure through which test execution is
* coordinated, and this will collect output and results for all executed
* tests.
*/
  constructor();
/**
* Inform this context about runtime arguments passed to the test
* harness.
* @param {any[]} args
*/
  args(args: any[]): void;
/**
* Executes a list of tests, returning a promise representing their
* eventual completion.
*
* This is the main entry point for executing tests. All the tests passed
* in are the JS `Function` object that was plucked off the
* `WebAssembly.Instance` exports list.
*
* The promise returned resolves to either `true` if all tests passed or
* `false` if at least one test failed.
* @param {any[]} tests
* @returns {Promise<any>}
*/
  run(tests: any[]): Promise<any>;
}
/**
*/
export class wbg_rayon_PoolBuilder {
  free(): void;
/**
* @returns {number}
*/
  numThreads(): number;
/**
* @returns {number}
*/
  receiver(): number;
/**
*/
  build(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly get_pp_file: () => number;
  readonly get_pk_file: () => number;
  readonly get_vk_file: () => number;
  readonly verify_proof: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly generate_proof: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly continue_proof: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
  readonly compress_to_spartan: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly verify_spartan: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly __wbgt_fold_3_test_0: (a: number) => void;
  readonly init_panic_hook: () => void;
  readonly __wbg_wasmbindgentestcontext_free: (a: number) => void;
  readonly wasmbindgentestcontext_new: () => number;
  readonly wasmbindgentestcontext_args: (a: number, b: number, c: number) => void;
  readonly wasmbindgentestcontext_run: (a: number, b: number, c: number) => number;
  readonly __wbgtest_console_log: (a: number) => void;
  readonly __wbgtest_console_debug: (a: number) => void;
  readonly __wbgtest_console_info: (a: number) => void;
  readonly __wbgtest_console_warn: (a: number) => void;
  readonly __wbgtest_console_error: (a: number) => void;
  readonly __wbg_wbg_rayon_poolbuilder_free: (a: number) => void;
  readonly wbg_rayon_poolbuilder_numThreads: (a: number) => number;
  readonly wbg_rayon_poolbuilder_receiver: (a: number) => number;
  readonly wbg_rayon_poolbuilder_build: (a: number) => void;
  readonly initThreadPool: (a: number) => number;
  readonly wbg_rayon_start_worker: (a: number) => void;
  readonly read_file: (a: number, b: number) => number;
  readonly generate_witness_browser: (a: number, b: number, c: number, d: number) => number;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h7349eef91e40c952: (a: number, b: number, c: number) => void;
  readonly wasm_bindgen__convert__closures__invoke0_mut__h8932db997fb4011f: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly wasm_bindgen__convert__closures__invoke3_mut__h2980d311b0172268: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h2f24ac3ce8b9065a: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_thread_destroy: (a?: number, b?: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
