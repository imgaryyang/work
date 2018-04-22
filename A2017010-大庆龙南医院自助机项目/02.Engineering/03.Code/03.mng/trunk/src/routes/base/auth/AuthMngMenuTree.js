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
			type : 'auth/loadMngMenus',
		});
//		if(this.props.auth.roleId != null){
//			this.props.dispatch({
//				type : 'auth/loadMenuKeys',
//			});
//		}
	}
	componentWillReceiveProps(props){
		if(props.auth.roleId == this.props.auth.roleId)return;
		this.props.dispatch({
			type : 'auth/loadMngMenuKeys',
		});
	}
	onCheck(selectedKeys,{halfCheckedKeys}){//console.info(arguments,halfChecked);
		console.info(arguments,halfCheckedKeys);
		if(halfCheckedKeys){
			for(var harfkey of halfCheckedKeys )selectedKeys.push(harfkey);
		}
		var mngMenu = {...this.props.auth.mngMenu, selectedKeys:selectedKeys};
		this.props.dispatch({
			type : 'auth/setState',
			payload : { mngMenu: mngMenu}
		});
	}
	forSave(){
		this.props.dispatch({
			type : 'auth/assignMngMenu',
		});
	}
	forReset(){
		this.props.dispatch({
			type : 'auth/loadMngMenuKeys',
		});
	}
//	onCheck({checked, halfChecked}){
//		var selectedKeys = [];
//		console.info(arguments);
//		//const children = node.props.children;
//		for(var harfkey of halfChecked )selectedKeys.push(harfkey);
//		for(var key of checked )selectedKeys.push(key);
//		
//		var mngMenu = {...this.props.auth.mngMenu, selectedKeys:selectedKeys};
//		this.props.dispatch({
//			type : 'auth/setState',
//			payload : { mngMenu: mngMenu}
//		});
//	}
//	getCheckedKey(){
//		let { data,selectedKeys } = this.props.auth.mngMenu;
//		selectedKeys =selectedKeys ||[];
//		const halfs = [],halfMap={},temp = {};
//		for(var key of selectedKeys){
//			temp[key]=true;
//		}
//		for(var key of selectedKeys){
//			var mngMenu = data[key];
//			if(mngMenu && mngMenu.parent){
//				if(halfMap[mngMenu.parent])continue;
//				var children = data[mngMenu.parent].children||[];
//				var haveAll =true;
//				for(var child of children){
//					if(!temp[child.id])haveAll=false;
//				}
//				if(!haveAll){
//					halfs.push(mngMenu.parent);
//					halfMap[mngMenu.parent]=true;
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
		const { data,selectedKeys } = this.props.auth.mngMenu;
		const temp = {};
		for(var key of selectedKeys){
			temp[key]=true;
		}
		for(var key of selectedKeys){
			var mngMenu = data[key];
			if(this.hasInChildren(mngMenu,temp))delete temp[key]
		}
		return Object.keys(temp);
	}
	render(){//checkStrictly
		const { mngMenu } = this.props.auth;
		const { data,tree } = mngMenu ;
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
	renderMenuNode(mngMenus){
		const disable = this.props.auth.roleId?false:true;
		var nodes = [];
		for(var mngMenu of mngMenus){
			nodes.push(
				<TreeNode disableCheckbox={disable} title={`${mngMenu.alias}(${mngMenu.name})`} key={mngMenu.id}>
				{
					(mngMenu.children && mngMenu.children.length > 0) ? this.renderMenuNode(mngMenu.children):null
				}
				</TreeNode>
			);
		}
		return nodes;
	}
}
export default connect(({auth})=>({auth}))(MenuTree);
///<Affix target={() => this}></Affix>