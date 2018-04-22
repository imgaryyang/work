"use strict";
require('./MenuBlock.css');
import { Component, PropTypes } from 'react';
import icons from './Icons.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
class Page extends Component {
	constructor (props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	componentWillMount () {
	}
	handleClick(){
		var menu = this.props.menu||{};
		if(this.props.onSelect)this.props.onSelect(menu);
	}
	render () { 
		var menu = this.props.menu||{};
		/**
		if(menu.code == 'checkRecords'
			|| menu.code == 'bloodcheck' || menu.code == 'pay'  )  {
			menu.color = '#BFBFBF'
		}
		*/	
		var blockStyle = {
			backgroundImage: 'url(' + icons[menu.icon]['src'] + ')',
			backgroundSize: '11.5rem auto',
			backgroundColor: menu.color,
			height:  '11.5rem',
		};
		return (
			<div className = 'menu_block' onClick = {this.handleClick} style = {blockStyle} >
				<div className ='menu_label' style = {{paddingTop:  '8rem'}} >
				{menu.alias}
				</div>
			</div>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;



