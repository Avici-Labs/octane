import { PublicKey } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    ENV_SECRET_KEYPAIR,
    cors,
    rateLimit,
} from '../../src';
import axios from 'axios';

// Endpoint to pay for transactions with an SPL token transfer
export default async function (request: NextApiRequest, response: NextApiResponse) {
    await cors(request, response);
    await rateLimit(request, response);

    // Deserialize a base58 wire-encoded transaction from the request
    const serialized = request.body?.transaction;
    
    try {
       
        const data = (await axios.get(`http://ec2-54-237-38-153.compute-1.amazonaws.com:3000/api/v2/octane/sign?transaction=${serialized}`)).data

        // Respond with the confirmed transaction signature
        response.status(200).send({ status: 'ok', data: data.data });
    } catch (error) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        response.status(400).send({ status: 'error', message });
    }
}
