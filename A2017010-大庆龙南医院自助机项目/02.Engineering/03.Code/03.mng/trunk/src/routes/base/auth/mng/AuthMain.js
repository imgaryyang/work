import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col,} from 'antd';
import RoleList from './AuthRoleList';
import UserList from './AuthUserList';
import MenuTree from './AuthMenuTree';
const TabPane = Tabs.TabPane;

class AuthMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const { spin } = this.props.mngAuth;
		return(
			<Spin spinning={spin} >
				<Row>
					<Col span={6} > <RoleList /></Col>
					<Col span={18} >
						<Tabs type="card" defaultActiveKey="menu">
						<TabPane tab={"用户"} key={"machine"} >
							<UserList />
						</TabPane>
						<TabPane tab={"管理菜单"} key={"menu"} >
							<MenuTree />
						</TabPane>
					</Tabs>	
					</Col>
				</Row>
			</Spin>
		)
	}
}
export default  connect(({mngAuth})=>({mngAuth}))(AuthMain);

