import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col,} from 'antd';
import RoleList from './AuthRoleList';
import OperatorList from './AuthOperatorList';
import MenuTree from './AuthMenuTree';
const TabPane = Tabs.TabPane;

class AuthMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const { spin } = this.props.operatorAuth;
		return(
			<Spin spinning={spin} >
				<Row>
					<Col span={5} > <RoleList /></Col>
					<Col span={19} >
						<Tabs type="card" defaultActiveKey="menu">
							<TabPane tab={"运维人员"} key={"opt"} >
								<OperatorList />
							</TabPane>
							<TabPane tab={"运维菜单"} key={"menu"} >
								<MenuTree />
							</TabPane>
						</Tabs>	
					</Col>
				</Row>
			</Spin>
		)
	}
}
export default  connect(({operatorAuth})=>({operatorAuth}))(AuthMain);

