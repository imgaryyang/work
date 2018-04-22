import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Menu, Icon, Row, Col } from 'antd';
import CommonTable from '../../../../components/CommonTable'
const MenuItemGroup = Menu.ItemGroup;
class RoleList extends React.Component {

	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type:'operatorAuth/loadRoles'
		});
	}
	handleClick({item,key}){
		this.props.dispatch({
			type:'operatorAuth/setState',
			payload:{roleId:key}
		});
	}
	render(){
		var { roles }   = this.props.operatorAuth;
		return (
			<div>
			<Menu mode="inline" style={{ width: '90%',minHeight:450 }}  onClick={this.handleClick} >
				<MenuItemGroup key="role" title="角色">
				{
					roles.map(function(role,index){
						return <Menu.Item key={role.id}>{role.name}</Menu.Item>;
					})
				}
				</MenuItemGroup>
			</Menu>
			</div> 
		);	
	}
}
export default connect(({operatorAuth})=>({operatorAuth}))(RoleList);

