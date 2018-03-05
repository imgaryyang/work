'use strict';
import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import createHistory from 'history/createBrowserHistory';
//import createHistory from 'history/createHashHistory';
import AppointMain from './appoint/AppointMain.jsx';

const history = createHistory();

class AppRoutes extends Component {

	constructor(props) {
		super(props);
	}
	render() {
		var result = (
			<Router history={history}>
				<Route path="/" component={AppointMain} />
			</Router>
		);
		return result;
	}
}
module.exports = AppRoutes;