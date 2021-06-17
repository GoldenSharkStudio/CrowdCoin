const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

// In here you need to inform a mnemonic phrase of a ethereum wallet
const provider = new HDWalletProvider(
    '',
    'https://rinkeby.infura.io/v3/9680829e333b4dfabf35b90cf7cc4077'
);

const web3 = new Web3(provider);

let crowdCoin;

const deploy = async () => {
    const accounts = await  web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    crowdCoin = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).deploy({
        data: compiledFactory.bytecode
    }).send({
        from: accounts[0],
        gas: '1000000'
    });

    console.log('Contract deployed to', crowdCoin.options.address);
}

deploy();