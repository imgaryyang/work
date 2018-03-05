'use strict';

import { Component } from 'react';
const NavList = require('../../components/NavList.jsx');
import {Row,Col } from 'antd';

class Elh extends Component {
	constructor (props) {
		super(props);
		this.state={
			menu:this.props.route.menu
		}
	}
	
	render () {
		return ( 	
			<div className='wrapper'>
				<NavList menus={this.state.menu.children||[]}/>
				<Row><Col span={24}>
					<div className="main" style={{minHeight:'550px'}}>{this.props.children}</div>
				</Col></Row>
			</div>
		);
	}
}
module.exports = Elh;
