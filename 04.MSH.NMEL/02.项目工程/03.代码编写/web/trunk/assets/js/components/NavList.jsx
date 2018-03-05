"use strict";

import { Component, PropTypes } from 'react';
import classnames from 'classnames';


import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class NavList extends Component {
	
	constructor (props) {
		super(props);
		this.state = {
			current: '1',
			openKeys: [],
		};
	}
	
	pathChange (path) { 
		if (!this.context.router.isActive(path)) {
			this.context.router.push( {
				pathname: path,
			});
		}
	}
	handleClick(e) {
		this.setState({
			current: e.key,
			openKeys: e.keyPath.slice(1),
		});
		this.pathChange (e.key);
	}
	onToggle(info) {
		this.setState({
			openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
		});
	}
	componentWillMount () {
		this.beforeRender();
	}
	beforeRender(){
		const scope =this;
		let openKeys=[], current = '1';
		this.props.menus.map(function (subMenu,nindex) {
			subMenu.isActive=false;
			subMenu.children.map(function (item,nindex) {
				if(scope.context.router.isActive(item.path)){
					openKeys.push(subMenu.path);
					current = item.path;
				}
			}) 
		})
		//if(openKeys.length == 0 &&this.props.menus.length>0 )openKeys=[this.props.menus[0].path];
		this.setState({openKeys:openKeys,current:current});
	}
	parentClick(menu,opt){
		let e = opt.domEvent;
		console.info(e);
		e.stopPropagation();
		e.nativeEvent.preventDefault();
		return false;
	}
	render() { 
		var scope =this;let style32={paddingLeft: '32px'};
		return (
			<div className="nav">
				<Menu onClick={this.handleClick.bind(this)} style={{ width: 199,backgroundColor:'#eef4f6'  }}
					openKeys={this.state.openKeys} onOpen={this.onToggle.bind(this)}
					onClose={this.onToggle.bind(this)} selectedKeys={[this.state.current]}
					mode="inline" className="nav-innner">
				{
		      		this.props.menus.map(function (subMenu,nindex) {
		      			let menus=[],disabled=subMenu.url?false:true;
		      			if(subMenu.children.length>0){
		      				menus.push(<Menu.Item key={subMenu.path}  disabled={disabled}><span><Icon type="mail" /><span>{subMenu.name}</span></span></Menu.Item>);
		      				subMenu.children.map(function (item,nindex) {
		      					menus.push(<Menu.Item key={item.path}><span style={{paddingLeft: '24px'}} ><Icon type="mail" /><span>{item.name}</span></span></Menu.Item>);
							})
		      			}else{
		      				menus.push(<Menu.Item key={subMenu.path}><span><Icon type="mail" /><span>{subMenu.name}</span></span></Menu.Item>);
		      			}
		      			return menus;
		    		})
				}
				</Menu>
			</div>
		);
	}
}

NavList.propTypes = {
  onToggle: PropTypes.func
};

NavList.contextTypes = {
 // history: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

module.exports = NavList;


//<SubMenu key={subMenu.path} onTitleClick={scope.parentClick.bind(scope,subMenu)} >
//
//</SubMenu>