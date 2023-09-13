const Web3 = require('web3');;
// Connect to the Ethereum network via Infura
const web3 = new Web3(new Web3.providers.HttpProvider('MATIC RPC URL'));

var contract =new web3.eth.Contract(abi, address);
var batch =new web3.BatchRequest();

const batchExecution = () => {
  try {
      return new Promise((resolve) => {
          batch.add( contract.methods.SomeFunc2(params).call.request(...), callback);
          batch.add( contract.methods.SomeFunc2(params).call.request({from: '0xSomeAddress'}, (err,tx) => {
              waitForReceipt(tx, (receipt) => {
                console.log("Tx", tx);
                console.log("Receipt", receipt);
                const data = {
                  success: receipt?.status
                };
                resolve(data);
              })
          }));
          batch.execute();
      });
  } catch(e) {
      console.log("error");
  }
}

const waitForReceipt = (tx, cb) =>{
  let reciept = web3.eth.getTransactionReciept(tx, function(err, receipt) {
      if(receipt){
          cb(receipt);
      } else {
          window.setTimeout(function () {
           waitForReceipt(tx, cb);
        }, 1000);
      }
  });
}






