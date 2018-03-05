'use strict'

/**
 * Reflux Action of User
 */

import Reflux from 'reflux';

var UserAction = Reflux.createActions(
	['onUpdateBankCards', 'onUpdateUser', 'login', 'logout']
);

module.exports = UserAction;
