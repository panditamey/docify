import express from 'express';
import ejs from 'ejs';
import ethers from 'ethers';
import bodyParser from 'body-parser'
import axios from 'axios';
import abiDecoder from 'abi-decoder';
import multer from 'multer';
const app = express()
import * as IPFS from 'ipfs-core'
import Path from 'path'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
let name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname);
    name = file.originalname;
  },
})

const upload = multer({ storage: storage });

let return_pass
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGVFRDJhNzZmQTFmOWU5NDE2Mjc2ZjkyMDY2NjZhNTVFOGQ5YmQ3NjQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjEzNjM1MTI5NjUsIm5hbWUiOiJvbmUifQ.nx1Zwf5ZXm54SuGRorUlMvX4xjTR10He1WrpAPXX094'

var provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f4622dbc953f46f6ab834dda66a6bb08', 'rinkeby');
var address = '0x4166190c6dA395131ed8c988a032b732C464C09D';
var abi = [{ "inputs": [], "name": "getString", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "s", "type": "string" }], "name": "setString", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
var privateKey = 'd5c903d1594b8546603d4d68a5a62059531b125e367e7240b31e0265bea7f737';
var wallet = new ethers.Wallet(privateKey, provider);
var contract = new ethers.Contract(address, abi, wallet);
var result
var hash
var data
var input_hash
var og_input

function doContract(string) {
  var sendPromise = contract.setString('He is Handsome');
  sendPromise.then(function(transaction) {
    // hash = transaction[hash];
    hash = transaction.hash;
    data = transaction.data;

    receipt()

    abiDecoder.addABI(abi);
    const testData = data;
    const decodedData = abiDecoder.decodeMethod(testData);
    var dec = decodedData.params;
    console.log(hash);
    console.log(data);
    console.log(dec[0].value);
    // console.log(transaction);
  });
}



async function work() {
  const storage = new Web3Storage({ token: token })
  const files = await getFilesFromPath(`./images/${name}`)
  const cid = await storage.put(files)
  console.log(`IPFS CID: ${cid}`)
  const filename = name
  console.log(name)
  console.log(`Gateway URL: https://dweb.link/ipfs/${cid}`)
  console.log(`https://ipfs.io/ipfs/${cid}/${filename}`)
  return_pass = `https://ipfs.io/ipfs/${cid}/${filename}`
}




async function receipt(string) {
  const options = {
    method: 'POST',
    url: 'https://eth-rinkeby.alchemyapi.io/v2/zLbkcamDVx-gwJ3wE3Zi-lC-ebIBUBsF',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },

    // 0xdc87808314df3ee6940bcbe637a4e407ac92466c7144dd80e25bc0a6306a6f40
    data: {
      id: 0,
      jsonrpc: '2.0',
      params: [String(string)],
      method: 'eth_getTransactionByHash'
    }
    // data: {
    //   id: 0,
    //   jsonrpc: '2.0',
    //   params: ['0xdc87808314df3ee6940bcbe637a4e407ac92466c7144dd80e25bc0a6306a6f40'],
    //   method: 'eth_getTransactionByHash'
    // }
  };

  axios
    .request(options)
    .then(function(response) {
      abiDecoder.addABI(abi);
      const testData = data;
      const decodedData = abiDecoder.decodeMethod(response.data.result.input);
      var dec = decodedData.params;
      console.log(hash);
      console.log(data);
      console.log(dec[0].value);
      console.log(response.data.result.input);
      og_input = dec[0].value;
    })
    .catch(function(error) {
      console.error(error);
    });
}





app.get('/', (req, res) => {
  // res.send("return_pass")
  // work()
  // res.send('<h1>Upload</h1>  <form method="POST" action="/" enctype="multipart/form-data">     <input type="file" name="image">     <input type="submit">   </form>');

  var __dirname = Path.resolve();

  res.sendFile(__dirname + '/upload.html');
})

app.post('/', upload.single("image"), (req, res) => {
  work()
  var dec
  setTimeout((() => {
    var sendPromise = contract.setString(`Here is your Certificate : ${return_pass}`);
    setTimeout((() => {
      sendPromise.then(function(transaction) {
        // hash = transaction[hash];
        hash = transaction.hash;
        data = transaction.data;

        // receipt()

        abiDecoder.addABI(abi);
        const testData = data;
        const decodedData = abiDecoder.decodeMethod(testData);
        dec = decodedData.params;
        // console.log(hash);
        // console.log(data);
        console.log(dec[0].value);
        // console.log(transaction);
        var etherscanLink = `https://rinkeby.etherscan.io/tx/${hash}`
        console.log(etherscanLink)
        res.send(`<body style="text-align: center;                     margin-top: 45vh"> <h2 style="display: inline-block; text-decoration: none; color: black;"> <a href="${return_pass} " style="text-decoration: none; color: black;">Here is your Certificate : ${return_pass} </a> </h2>  <h2 style="display: inline-block; text-decoration: none; color: black;"> <a href="https://rinkeby.etherscan.io/tx/${hash}" style="text-decoration: none; color: black;">Your Decentralised Contract Link:  https://rinkeby.etherscan.io/tx/${hash} </a></h2> </body>`);
      });
    }), 5000)
    // res.send(return_pass);
  }), 5000)
});


app.get('/verify', (req, res) => {
  var __dirname = Path.resolve();

  res.sendFile(__dirname + '/index.html');
});

app.post('/verify', urlencodedParser, (req, res) => {
  console.log('Got body:', req.body.hash);
  input_hash = req.body.hash;

  setTimeout((() => {
    receipt(input_hash);
    setTimeout((() => {


      // res.send(`< body style = "text-align: center;
      //                   margin-top: 45vh"> 
      // <h2 style="display: inline-block;"> <a href="${og_input}>Here is your Certificate</a></h2> 
      //  <h2 style="display: inline-block;"> Your Decentralised Contract Link: https://rinkeby.etherscan.io/tx/${input_hash}</h2> </body>`);

      res.send(`<body style="text-align: center;
                        margin-top: 45vh"
                        text-decoration: none;> 
      <h2 style="display: inline-block;">${og_input}</h2> 
       <h2 style="display: inline-block; text-decoration: none;"> Your Decentralised Contract Link:  https://rinkeby.etherscan.io/tx/${input_hash} </a></h2> </body>`);
    }), 10000)
    // res.send(og_input);
  }), 10000)
});

app.listen(3000)