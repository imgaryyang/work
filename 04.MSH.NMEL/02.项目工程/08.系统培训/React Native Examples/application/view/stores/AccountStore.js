var Reflux = require('reflux');
var AccountAction = require('../actions/AccountAction');
var UtilsMixin = require('../lib/UtilsMixin');
var Global = require('../../Global');

var ASSESTLIST = "account/getAcctInfo";

var ACCOUNTS = {};

var AccountStore = Reflux.createStore({

  mixins: [UtilsMixin],
  init: function() {
    // Here we listen to actions and register callbacks
    this.listenTo(AccountAction.createAccount, this.onCreate);
    this.listenTo(AccountAction.updateAccount, this.onUpdate);
  },

  // 传入新账户的信息 object
  onCreate: function(account) {
    console.log('onCreate------------------------');
    if (account.type == '0') { //电子账户
      ACCOUNTS.elecAcct = account;
      ACCOUNTS.balance += account.balance;
    } else if (account.type == '1') { //储蓄卡
      if (account.bankName == Global.bank.name) { //本行卡
        ACCOUNTS.debitCardNum = ACCOUNTS.debitCardNum + 1;
        ACCOUNTS.accts.push(account);
        ACCOUNTS.balance += account.balance;
      } else { //他行卡
        ACCOUNTS.debitCardNumOther = ACCOUNTS.debitCardNumOther + 1;
        ACCOUNTS.acctsOther.push(account);
      }
    } else { //信用卡
      if (account.bankName == Global.bank.name) {
        ACCOUNTS.creditCardNum = ACCOUNTS.creditCardNum + 1;
        ACCOUNTS.acctsCredit.push(account);
      } else {
        ACCOUNTS.creditCardNumOther = ACCOUNTS.creditCardNumOther + 1;
        ACCOUNTS.acctsOtherCredit.push(account);
      }
    }
    this.trigger(ACCOUNTS);
  },
  //当账户信息发生变化时
  onUpdate: function(account) {
    console.log('onUpdate------------------------');
    console.log(account);
    if (account.type == '0') { //电子账户
      ACCOUNTS.balance = ACCOUNTS.balance + account.balance - ACCOUNTS.elecAcct.balance;
      ACCOUNTS.elecAcct = account;
    } else if (account.type == '1') { //储蓄卡
      if (account.bankName == Global.bank.name) { //本行卡
        for (let i = 0; i < ACCOUNTS.accts.length; i++) {
          if (ACCOUNTS.accts[i].id == account.id) {
            ACCOUNTS.balance = ACCOUNTS.balance + account.balance - ACCOUNTS.accts[i].balance;
            console.log(account.balance);
            console.log(ACCOUNTS.accts[i].balance);
            console.log(ACCOUNTS.balance);

            ACCOUNTS.accts.splice(i, 1, account);
            break;
          }
        }
      } else { //他行卡
        for (let i = 0; i < ACCOUNTS.acctsOther.length; i++) {
          if (ACCOUNTS.acctsOther[i].id == account.id) {
            ACCOUNTS.acctsOther.splice(i, 1, account);
          }
        }
      }
    } else { //信用卡
      if (account.bankName == Global.bank.name) {
        for (let i = 0; i < ACCOUNTS.acctsCredit.length; i++) {
          if (ACCOUNTS.acctsCredit[i].id == account.id) {
            ACCOUNTS.acctsCredit.splice(i, 1, account);
          }
        }
      } else {
        for (let i = 0; i < ACCOUNTS.acctsOtherCredit.length; i++) {
          if (ACCOUNTS.acctsOtherCredit[i].id == account.id) {
            ACCOUNTS.acctsOtherCredit.splice(i, 1, account);
          }
        }
      }
    }
    this.trigger(ACCOUNTS);
  },
  getAccounts: async function() {
    console.log('getAccounts------------------------------------');
    ACCOUNTS.debitCardNum = 0; //本行储蓄卡
    ACCOUNTS.creditCardNum = 0; //本行信用卡
    ACCOUNTS.debitCardNumOther = 0; //他行储蓄卡
    ACCOUNTS.creditCardNumOther = 0; //他行信用卡
    ACCOUNTS.balance = 0; //总资产
    ACCOUNTS.accts = []; //本行储蓄卡
    ACCOUNTS.acctsOther = []; //他行储蓄卡
    ACCOUNTS.acctsCredit = []; //本行信用卡
    ACCOUNTS.acctsOtherCredit = []; //他行信用卡
    ACCOUNTS.elecAcct = {}; //电子账户
    try {
      let responseData = await this.request(Global.host + ASSESTLIST, {});
      console.log('aaaaaaaaaaaaaaaaaaa');
      var data = responseData.body;
      for (var i = 0; i < data.length; i++) {
        if (data[i].type == '0') { //电子账户
          ACCOUNTS.elecAcct = data[i];
          ACCOUNTS.balance += data[i].balance;
        } else if (data[i].type == '1') { //储蓄卡
          if (data[i].bankName == Global.bank.name) { //本行卡
            ACCOUNTS.debitCardNum = ACCOUNTS.debitCardNum + 1;
            ACCOUNTS.accts.push(data[i]);
            ACCOUNTS.balance += data[i].balance;
          } else { //他行卡
            ACCOUNTS.debitCardNumOther = ACCOUNTS.debitCardNumOther + 1;
            ACCOUNTS.acctsOther.push(data[i]);
          }
        } else { //信用卡
          if (data[i].bankName == Global.bank.name) {
            ACCOUNTS.creditCardNum = ACCOUNTS.creditCardNum + 1;
            ACCOUNTS.acctsCredit.push(data[i]);
          } else {
            ACCOUNTS.creditCardNumOther = ACCOUNTS.creditCardNumOther + 1;
            ACCOUNTS.acctsOtherCredit.push(data[i]);
          }
        }
      }
      return ACCOUNTS;
    } catch (e) {
      this.requestCatch(e);
    }
  },

  //getter for finding a single account by id
  /*getAccount: function(id) {
    for (var i = 0; i < ACCOUNTS.length; i++) {
      if (ACCOUNTS[i]._id === id) {
        return ACCOUNTS[i];
      }
    }
  }*/
});
module.exports = AccountStore; //Finally, export the Store