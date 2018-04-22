'use strict';

var acct = {
  "accountId": "EDFJ-S8U7-QW23-RT4U", 
  "balance": 65.8, 
  "state": 1
};

module.exports = {

  'GET /api/ssm/client/account/loadAcctInfo': function (req, res) {
  	
    setTimeout(function () {
      res.json({
        success: true,
        result: acct,
      });
    }, 10);
  },
  
};