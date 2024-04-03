export interface NovaWasm {
    generate_proof(params_string: string, membership_string: string): Promise<string>;
    continue_proof(params_string: string, proof_string: string, membership_string: string, zi_primary: Array<any>): Promise<string>;
    verify_proof(params_string: string, proof_string: string, num_steps: number): Promise<Array<any>>;
    compress_to_spartan(params_string: string, proving_key_string: string, proof_string: string): Promise<string>;
    verify_spartan(verifier_key_string: string, proof_string: string, iterations: number): Promise<Array<any>>;
}