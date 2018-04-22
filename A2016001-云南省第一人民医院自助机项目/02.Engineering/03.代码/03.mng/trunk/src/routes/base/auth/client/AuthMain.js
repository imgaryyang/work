import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col,} from 'antd';
import RoleList from './AuthRoleList';
import MachineList from './AuthMachineList';
import MenuTree from './AuthMenuTree';
const TabPane = Tabs.TabPane;

class AuthMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const { spin } = this.props.clientAuth;
		return(
			<Spin spinning={spin} >
				<Row>
					<Col span={5} > <RoleList /></Col>
					<Col span={19} >
						<Tabs type="card" defaultActiveKey="menu">
						<TabPane tab={"自助机器"} key={"machine"} >
							<MachineList />
						</TabPane>
						<TabPane tab={"自助机菜单"} key={"menu"} >
							<MenuTree />
						</TabPane>
					</Tabs>	
					</Col>
				</Row>
			</Spin>
		)
	}
}
export default  connect(({clientAuth})=>({clientAuth}))(AuthMain);

