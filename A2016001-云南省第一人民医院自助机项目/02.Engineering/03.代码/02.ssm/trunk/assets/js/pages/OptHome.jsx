"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from '../utils/baseUtil.jsx';
import logUtil, { log } from '../utils/logUtil.jsx';

import Homepage from './Homepage3.jsx';

class Page extends Homepage {
	constructor(props) {
		super(props);
	}
	getTemplate(){
		const template = "def";
		return template;
	}
	logout(){
		baseUtil.logout();
		baseUtil.goHome();
	}
	loadMenus(){
		log('home-加载运维菜单');
		let fetch = Ajax.get("/api/ssm/base/menu/operator/mylist", null, {catch: 3600});
		fetch.then(res => {
			let menus = res.result||[];
	    	return menus;
		}).then((menus)=>{
			var menuTree = this.menusToTree(menus);
			const template = this.getTemplate();
			var menu = {
				template: template,
				children: menuTree,
			}
			this.setState({ menus: menuTree,menu });
		});
	}
}
Page.propTypes = {
	children: PropTypes.any
}

module.exports = Page;


