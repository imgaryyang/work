'use strict';

var Global = require('../Global');
var BankCardRule = require('./lib/BankCardRule');

var ASSESTLIST = "account/getAcctInfo";

let AccountMixin = {
	listAccounts: async function(id) {
		//accounts = {},
		var ACCOUNTS = {};
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

		this.showLoading();
		try {
			let responseData = await this.request(Global.host + ASSESTLIST, {});
			this.hideLoading();
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

	listAccountsFilter: async function(acctNo) {
		// console.log("enter listAccountsFilter***");
		var ACCOUNTS = {};
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
			this.showLoading();
			let responseData = await this.request(Global.host + ASSESTLIST, {
			});
			this.hideLoading();
			var data = responseData.body;
			//console.log(data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].acctNo != acctNo) {
					if (data[i].type == '0') {
						ACCOUNTS.elecAcct = data[i];
						ACCOUNTS.balance = data[i].balance;
					} else if (data[i].type == '1') {
						if (data[i].bankName == Global.bank.name) {
							ACCOUNTS.debitCardNum = ACCOUNTS.debitCardNum + 1;
							ACCOUNTS.accts.push(data[i]);
						} else {
							ACCOUNTS.debitCardNumOther = ACCOUNTS.debitCardNumOther + 1;
							ACCOUNTS.acctsOther.push(data[i]);
						}
					} else {
						if (data[i].bankName == Global.bank.name) {
							ACCOUNTS.creditCardNum = ACCOUNTS.creditCardNum + 1;
							ACCOUNTS.acctsCredit.push(data[i]);
						} else {
							ACCOUNTS.creditCardNumOther = ACCOUNTS.creditCardNumOther + 1;
							ACCOUNTS.acctsOtherCredit.push(data[i]);
						}
					}
				}

			}

			//console.log(ACCOUNTS);
			return ACCOUNTS;
		} catch (e) {
			this.requestCatch(e);
		}

	},
	//查询所有的信用卡
	getCreditCardList: async function() {
		var ACCOUNTS = {};
		ACCOUNTS.creditCardList = []; //本行信用卡
		try {
			this.showLoading();
			let responseData = await this.request(Global.host + ASSESTLIST, {
				/*body: JSON.stringify({
					mobile: mobile,
				})*/
			});
			this.hideLoading();
			var data = responseData.body;
			//console.log(data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].type == '2') {
					ACCOUNTS.creditCardList.push(data[i]);
				}
			}
			//console.log(ACCOUNTS);
			return ACCOUNTS;
		} catch (e) {
			this.requestCatch(e);
		}

	},

	//查询银行卡类别信息
	//return {bankCode:'xxx',bankName:'xxx',bankType:'x',bankTypeName:'xxx'}
	checkBankCardInfo: function(cardNum) {
		//银行卡号前6位
		let bincode = '';
		let tmpInfo = [];
		//返回结果
		let cardInfo = {};
		if (cardNum.length < 6) {
			return null;
		} else {
			bincode = cardNum.substring(0, 6);
			if (BankCardRule.bankCardInfo[bincode + '']) {
				return BankCardRule.bankCardInfo[bincode + ''];
			} else {
				return null;
			}
		}
	},

}
module.exports = AccountMixin;