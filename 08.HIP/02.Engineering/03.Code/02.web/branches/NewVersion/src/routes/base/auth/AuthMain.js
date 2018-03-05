import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Layout } from 'antd';
import RoleList from './AuthRoleList';
import UserList from './AuthUserList';
import MenuTree from './AuthMenuTree';

const TabPane = Tabs.TabPane;
const { Sider, Content } = Layout;

class AuthMain extends Component {
  componentWillMount() {
    const params = this.props.params;
    this.props.dispatch({
      type: 'auth/setState',
      payload: {
        chanel: params.chanel,
      },
    });
  }
  render() {
    const { spin } = this.props.auth;
    const { wsHeight } = this.props.base;
    const tabHeight = wsHeight - 38 - 15;
    return (
      <Spin spinning={spin} >
        <Layout style={{ overflow: 'visible' }} >
          <Sider width={200} style={{ backgroundColor: '#ffffff' }} >
            <div
              style={{ lineHeight: '35px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRight: '1px solid rgb(233, 233, 233)',
                borderBottom: '1px solid rgb(233, 233, 233)',
                paddingLeft: '20px',
              }}
            >系统角色</div>
            <div style={{ height: `${wsHeight - 39}px`, overflowY: 'auto' }} >
              <RoleList />
            </div>
          </Sider>
          <Content style={{ position: 'relative', backgroundColor: '#ffffff' }} >
            <Tabs defaultActiveKey="menu" className="compact-tab" >
              <TabPane tab={'用户'} key={'user'} >
                <div style={{ height: `${tabHeight}px`, overflowY: 'auto' }} >
                  <UserList tabHeight={tabHeight} />
                </div>
              </TabPane>
              <TabPane tab={'菜单'} key={'menu'} >
                <div style={{ height: `${tabHeight}px`, overflowY: 'auto' }} >
                  <MenuTree tabHeight={tabHeight} />
                </div>
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
        {/* <Row>
          <Col span={6} >
            <div style={{ height: `${wsHeight - 2}px`, overflowY: 'auto' }} >
              <RoleList />
            </div>
          </Col>
          <Col span={18} >
            <Tabs defaultActiveKey="menu">
              <TabPane tab={'用户'} key={'user'} >
                <UserList />
              </TabPane>
              <TabPane tab={'菜单'} key={'menu'} >
                <MenuTree />
              </TabPane>
            </Tabs>
          </Col>
        </Row>*/}
      </Spin>
    );
  }
}
export default connect(
  ({ auth, base }) => ({ auth, base }),
)(AuthMain);

