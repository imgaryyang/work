'use strict'

/**
 * Reflux Action of Auth
 */

import Reflux from 'reflux';

var AuthAction = Reflux.createActions(
	['needLogin', 'clearNeedLogin', 'clearInterceptedRoute', 'continuePush', 'clearContinuePush']
);

module.exports = AuthAction;
