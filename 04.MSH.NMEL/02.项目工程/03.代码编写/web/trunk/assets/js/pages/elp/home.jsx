'use strict';

import { Component } from 'react';
const NavList = require('../../components/NavList.jsx');


class Elp extends Component {
	constructor (props) {
		super(props);
		this.state={
				menu:this.props.route.menu
		}
	}
	
	render () {
		return ( 	
			<div className='wrapper base-wrapper'>
				<NavList menus={this.state.menu.children||[]}/>
				<div className="main" style={{minHeight:'550px'}}>{this.props.children}</div>
			</div>
		);
	}
}
module.exports = Elp;
//