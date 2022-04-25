import { Cluster } from "@solana/web3.js";
import axios from "axios";
import { buildProviderMethodUrlV1, PhantomErrorResponse } from "./util";

export interface ConnectParameters {
  // (required): A url used to fetch app metadata (i.e. title, icon) using the same properties found in Displaying Your App.
  app_url: string;
  // (required): A public key used for end-to-end encryption. This will be used to generate a shared secret. For more information on how Phantom handles shared secrets, please review Encryption.
  dapp_encryption_public_key: string;
  // (required): The URI where Phantom should redirect the user upon connection. Please review Specifying Redirects for more details.
  redirect_link: string;
  // (optional): The network that should be used for subsequent interactions. Can be either: mainnet-beta, testnet, or devnet. Defaults to mainnet-beta.
  cluster?: Cluster;
}

export interface ConnectResponse {
  //An encryption public key used by Phantom for the construction of a shared secret between the connecting app and Phantom, encoded in base58.
  phantom_encryption_public_key: string;
  // A nonce used for encrypting the response, encoded in base58.
  nonce: string;
  //An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.
  data: string;
  // content of decrypted `data`-parameter

  decodedData: {
    // base58 encoding of user public key
    public_key: string;

    // session token for subsequent signatures and messages
    // dapps should send this with any other deeplinks after connect
    session: string;
  };
}

export const connectURL = (params: ConnectParameters) => {
  params.cluster = params.cluster || "devnet";

  const connectUrl = buildProviderMethodUrlV1("connect");

  const queryParams = new URLSearchParams();
  queryParams.append("app_url", params.app_url);
  queryParams.append("cluster", params.cluster);
  queryParams.append(
    "dapp_encryption_public_key",
    params.dapp_encryption_public_key
  );
  queryParams.append("redirect_link", params.redirect_link);

  return `${connectUrl}?${queryParams.toString()}`;
};

export function connect(params: ConnectParameters) {
  params.cluster = params.cluster || "devnet";

  const connectUrl = buildProviderMethodUrlV1("connect");

  return axios
    .get<any, ConnectResponse, PhantomErrorResponse>(connectUrl, { params })
    .then((res) => {
      // decode data here
      console.log(res.data);

      return res;
    });
}

export default connect;
