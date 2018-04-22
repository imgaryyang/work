import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col,} from 'antd';
import RoleList from './AuthRoleList';
import UserList from './AuthUserList';
import MngMenuTree from './AuthMngMenuTree';
import ClientMenuTree from './AuthClientMenuTree';
const TabPane = Tabs.TabPane;

class AuthMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const { spin } = this.props.auth;
		return(
			<Spin spinning={spin} >
				<Row>
					<Col span={6} > <RoleList /></Col>
					<Col span={18} >
						<Tabs type="card" defaultActiveKey="menu">
						<TabPane tab={"用户"} key={"user"} >
							<UserList />
						</TabPane>
						<TabPane tab={"自助机菜单"} key={"clientMenu"} >
							<ClientMenuTree />
						</TabPane>
						<TabPane tab={"管理菜单"} key={"mngMenu"} >
							<MngMenuTree />
						</TabPane>
						<TabPane tab={"资源"} key={"resource"} >
						</TabPane>
					</Tabs>	
					</Col>
				</Row>
			</Spin>
		)
	}
}
export default  connect(({auth})=>({auth}))(AuthMain);

