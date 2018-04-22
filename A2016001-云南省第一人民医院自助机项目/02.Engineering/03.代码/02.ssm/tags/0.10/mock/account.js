'use strict';

var acct = {
  AccountId: 'EDFJ-S8U7-QW23-RT4U',
  Balance: 65.80,
  State: 1,
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