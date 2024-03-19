# Swisstronik Ethers.js Example Usage


This repo is created to showcase the usage of [Swisstronik's Ethers.js fork](https://github.com/SigmaGmbH/ethers.js) to interact with the network. 


The library itself is created for the most popular Ethers.js version, v5.7.2.

It is entirely drop-in replacement, preserving all regular Ethers functionality and adds special encryption / decryption code only for Swisstronik network.
That means you can use it directly with your existing applications.


In order to start using Swisstronik Ethers.js:

1. Replace dependency in your `package.json`:

    `"ethers": "^5.7.0"` // or other version before ethers v6
    
    to 
       
    `"@swisstronik/ethers": "^572.0.1"`


2. Replace imports in your code:

    `import { ethers, providers, Wallet } from "ethers";`
    
    to 

    `import { ethers, providers, Wallet } from "@swisstronik/ethers";`


After that you should be ready to use your code as normal with Swisstronik network.

