import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Tree, Row, Col, Button, Affix } from 'antd';

const TreeNode = Tree.TreeNode;

class MenuTree extends React.Component {

	constructor(props) {
	    super(props);
	    this.onCheck = this.onCheck.bind(this);
	    this.renderMenuNode = this.renderMenuNode.bind(this);
	    this.forReset = this.forReset.bind(this);
	    this.forSave = this.forSave.bind(this);
	    this.getCheckedKey = this.getCheckedKey.bind(this);
	}
	selectedKeys = [];
	
	componentWillMount(props){
		this.props.dispatch({
			type : 'clientAuth/loadMenus',
		});
//		if(this.props.clientAuth.roleId != null){
//			this.props.dispatch({
//				type : 'clientAuth/loadMenuKeys',
//			});
//		}
	}
	componentWillReceiveProps(props){
		if(props.clientAuth.roleId == this.props.clientAuth.roleId)return;
		this.props.dispatch({
			type : 'clientAuth/loadMenuKeys',
		});
	}
	onCheck(selectedKeys,{halfCheckedKeys}){//console.info(arguments,halfChecked);
		console.info(arguments,halfCheckedKeys);
		if(halfCheckedKeys){
			for(var harfkey of halfCheckedKeys )selectedKeys.push(harfkey);
		}
		var menu = {...this.props.clientAuth.menu, selectedKeys:selectedKeys};
		this.props.dispatch({
			type : 'clientAuth/setState',
			payload : { menu: menu}
		});
	}
	forSave(){
		this.props.dispatch({
			type : 'clientAuth/assignMenu',
		});
	}
	forReset(){
		this.props.dispatch({
			type : 'clientAuth/loadMenuKeys',
		});
	}
//	onCheck({checked, halfChecked}){
//		var selectedKeys = [];
//		console.info(arguments);
//		//const children = node.props.children;
//		for(var harfkey of halfChecked )selectedKeys.push(harfkey);
//		for(var key of checked )selectedKeys.push(key);
//		
//		var menu = {...this.props.clientAuth.menu, selectedKeys:selectedKeys};
//		this.props.dispatch({
//			type : 'clientAuth/setState',
//			payload : { menu: menu}
//		});
//	}
//	getCheckedKey(){
//		let { data,selectedKeys } = this.props.clientAuth.menu;
//		selectedKeys =selectedKeys ||[];
//		const halfs = [],halfMap={},temp = {};
//		for(var key of selectedKeys){
//			temp[key]=true;
//		}
//		for(var key of selectedKeys){
//			var menu = data[key];
//			if(menu && menu.parent){
//				if(halfMap[menu.parent])continue;
//				var children = data[menu.parent].children||[];
//				var haveAll =true;
//				for(var child of children){
//					if(!temp[child.id])haveAll=false;
//				}
//				if(!haveAll){
//					halfs.push(menu.parent);
//					halfMap[menu.parent]=true;
//				}
//			}
//		}console.info('halfs ',halfs);
//		var tempKeys = Object.keys(temp);
//		for(var key of tempKeys){
//			console.info('  key ',key );
//			if(halfMap[key]){
//				delete temp[key];
//				console.info('delete key ',key );
//			}
//		}
//		var checked = Object.keys(temp);
//		return { checked: checked, halfChecked: halfs};//this.setState({halfs,checked});
//		
//	}
	hasInChildren(parent,map){
		if(parent && parent.children ){
			for(var child of parent.children){
				if(map[child.id])return true;
				if(child && child.children ){
					if(this.hasInChildren(child,map))return true;
				}
			}
		}
		return false;
	}
	getCheckedKey(){
		console.info('this.props.clientAuth.menu ',this.props.clientAuth.menu);
		const { data,selectedKeys } = this.props.clientAuth.menu;
		const temp = {};
		for(var key of selectedKeys){
			temp[key]=true;
		}
		for(var key of selectedKeys){
			var menu = data[key];
			if(this.hasInChildren(menu,temp))delete temp[key]
		}
		return Object.keys(temp);
	}
	render(){//checkStrictly
		const { menu } = this.props.clientAuth;
		const { data,tree } = menu ;
		const checkedKeys = this.getCheckedKey();
		return (
			<div style = {{paddingLeft: '10px'}} >
			<Row>
			  <Col span={4}> 
			    <Button type="primary" style={{marginRight:'4px'}} onClick={ this.forSave}>保存</Button>
			    <Button type="primary" style={{marginRight:'4px'}} onClick={ this.forReset}>重置</Button>
			  </Col>
			</Row>
			<Tree checkable checkedKeys={checkedKeys} onCheck={this.onCheck} >
			{
				this.renderMenuNode(tree)
			}
	        </Tree>
			</div> 
		);	
	}
	renderMenuNode(menus){
		const disable = this.props.clientAuth.roleId?false:true;
		var nodes = [];
		for(var menu of menus){
			nodes.push(
				<TreeNode disableCheckbox={disable} title={`${menu.alias}(${menu.name})`} key={menu.id}>
				{
					(menu.children && menu.children.length > 0) ? this.renderMenuNode(menu.children):null
				}
				</TreeNode>
			);
		}
		return nodes;
	}
}
export default connect(({clientAuth})=>({clientAuth}))(MenuTree);
