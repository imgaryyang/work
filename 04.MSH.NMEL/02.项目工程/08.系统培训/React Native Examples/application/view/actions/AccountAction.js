var Reflux = require('reflux');
// var React = require('react-native');


var AccountAction = Reflux.createActions(
	['createAccount','updateAccount']
);

module.exports = AccountAction;