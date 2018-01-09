# Bloqtoken smart contract

## Introduction

This repository contains the Bloqtoken smart contracts. It makes use of the Truffle development environment and relies on Zeppelin for the base contracts.
Two smart contracts are provided, an advanced ERC20 token, that is pausable and requires recipients of tokens to be whitelisted.
The whitelist, with tier support, is managed by the other contract that is provided.

## Legal

The BloqToken smart contract was developed with legal considerations in mind. Tokens that are qualified as securities by the (local) regulator,
cannot be held by anonymous token holders. Also the issuer of the security token will be responsible for the token contract at all times, which
requires extra priviliges compared to utility ERC20 tokens. One of those is the function added that allows the owner of the token to
burn and reissue tokens in case a token holder looses it's private key, to keep the token holder administration consistent with the
administration of the underlying security.


## Installation

* npm install -g truffle
* cd [your_project_folder]
* npm install
* ganache-cli --m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
* truffle migrate

Make sure that if you use a common mnemonic such as the above to start ganache-cli there are many others that work with the same keypairs,
which is  risky if you deploy to public (test) networks)
   
In an other console start the webserver:
* npm run dev

Initiate Metamask with the mnemonic: "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
And visit your local webserver to experiment with transfering tokens and whitelisting addresses.
