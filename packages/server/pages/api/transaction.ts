import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import base58 from 'bs58';
import { signWithTokenFee, core } from '@solana/octane-core';
import {
    ENV_SECRET_KEYPAIR,
    cors,
    rateLimit,
} from '../../src';
import config from '../../../../config.json';

// Endpoint to pay for transactions with an SPL token transfer
export default async function (request: NextApiRequest, response: NextApiResponse) {
    await cors(request, response);
    await rateLimit(request, response);

    // Deserialize a base58 wire-encoded transaction from the request
    const serialized = request.body?.transaction;
    
    try {
        const trx = VersionedTransaction.deserialize(base58.decode(serialized), 'base64');

        trx.sign([ENV_SECRET_KEYPAIR]);


        // Respond with the confirmed transaction signature
        response.status(200).send({ status: 'ok', signature: base58.encode(trx.signatures[0]) });
    } catch (error) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        response.status(400).send({ status: 'error', message });
    }
}
