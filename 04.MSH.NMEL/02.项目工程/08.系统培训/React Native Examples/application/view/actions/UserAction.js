var Reflux = require('reflux');
// var React = require('react-native');


var UserAction = Reflux.createActions(
	['updateUser','login','logout']
);

module.exports = UserAction;