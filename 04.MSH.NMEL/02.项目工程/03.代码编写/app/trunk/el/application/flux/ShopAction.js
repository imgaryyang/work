'use strict'

/**
 * Reflux Action of Shop
 */

import Reflux from 'reflux';

var ShopAction = Reflux.createActions(
	['onShoppingCartNumAdd', 'onShoppingCartNumReset']
);

module.exports = ShopAction;
