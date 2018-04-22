"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Template from './MenuTemplate.jsx';
/**
 * 
 */
class Page extends Component {
	constructor (props) {
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.selectMenu = this.selectMenu.bind(this);
		this.state = {
		}
	}
	onBack(){
	  if(this.props.onBack)this.props.onBack();
	}
	onHome(){
		if(this.props.onHome)this.props.onHome(); 
		else baseUtil.goHome('menuHome'); 
	}
	selectMenu(menu){
		if(this.props.onSelect)this.props.onSelect(menu);
	}
	render () { 
		const { menu } = this.props;
		const { name,alias } = menu;
		
		return (
		  <NavContainer title={name||alias} onBack={this.onBack} onHome={this.onHome} >
		  	<Template menu={menu} onSelect={this.selectMenu}/>
		  </NavContainer>
	    );
	}
}

module.exports = Page;