import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Layout, Tabs, Icon, Menu, Modal } from 'antd';
import styles from './CommonLayout.less';

import baseIcon from '../../assets/image/icons/base.png';
import cardIcon from '../../assets/image/icons/card.png';
import chargeIcon from '../../assets/image/icons/charge.png';
import dispensaryIcon from '../../assets/image/icons/dispensary.png';
import financeIcon from '../../assets/image/icons/finance.png';
import hrpIcon from '../../assets/image/icons/hrp.png';
import materialIcon from '../../assets/image/icons/material.png';
import odwsIcon from '../../assets/image/icons/odws.png';
import onwsIcon from '../../assets/image/icons/onws.png';
import operationIcon from '../../assets/image/icons/operation.png';
import pharmacyIcon from '../../assets/image/icons/pharmacy.png';
import registerIcon from '../../assets/image/icons/register.png';

// import logoImg from '../../assets/image/logo.png';

const { SubMenu, Item } = Menu;
const { Header, Content } = Layout;
const { TabPane } = Tabs;

/* global document*/
const docHeight = document.documentElement.clientHeight;
const tabHeight = docHeight - 135;

function getMatchMenu(path, menuList) {
  for (const menu of menuList) {
    if (menu.pathname === path) return menu;
    // if (menu.pathname.indexOf(path) !== -1) return menu;
  }
  return null;
}

class CommonLayout extends Component {
  constructor(props) {
    super(props);
    this.clickMenu = this.clickMenu.bind(this);
    this.clickModule = this.clickModule.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.onEditTab = this.onEditTab.bind(this);
    this.init = this.init.bind(this);
    this.logout = this.logout.bind(this);
  }

  state = { menu: {}, menus: [], module: {}, children: [] }; // 非正规用法，需求比较坑

  componentWillMount() {
    /* this.props.dispatch({
      type: 'utils/initDepts',
    });*/
    const { menuList } = this.props.base;
    if (!menuList || menuList.length <= 0) {
      this.props.dispatch({
        type: 'base/loadMenus',
      });
    } else {
      this.init(this.props);
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'base/setState',
      payload: {
        wsHeight: docHeight - 66 - (20 * 2) - 32 - (15 * 2),
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { menuList } = nextProps.base;
    const { pathname } = nextProps.location;
    if (menuList !== this.props.base.menuList ||
      pathname !== this.props.location.pathname) {
      this.init(nextProps);
    }
  }

  componentDidUpdate() {
    const { menu, menus } = this.state;
    if (!menus || menus.length <= 0) return;
    if (!menu) {
      let first = menus[0];
      if (!first) return;
      if (first.children && first.children.length > 0) {
        first = first.children[0];
      }
      if (first) this.props.dispatch(routerRedux.push(first.pathname));
    }
  }

  onEditTab(key, action) {
    if (action === 'remove') {
      const tabs = this.state.children || [];
      const newTabs = [];
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        if (tab.menu.id === key && i !== 0) {
          continue;
        }
        newTabs.push(tab);
      }
      this.setState({ children: newTabs }, () => {
        const menu = this.state.menu;
        if (menu.id === key) { // 当前tab被删除
          const nextTab = tabs[0];
          if (nextTab && nextTab.menu) this.props.dispatch(routerRedux.push(nextTab.menu.pathname));
        }
      });
    }
  }

  onTabClick(key) {
    const tabs = this.state.children || [];
    for (const tab of tabs) {
      if (tab.menu.id === key) {
        this.props.dispatch(routerRedux.push(tab.menu.pathname));
      }
    }
  }

  icons = {
    base: baseIcon,
    card: cardIcon,
    charge: chargeIcon,
    dispensary: dispensaryIcon,
    finance: financeIcon,
    hrp: hrpIcon,
    material: materialIcon,
    odws: odwsIcon,
    onws: onwsIcon,
    operation: operationIcon,
    pharmacy: pharmacyIcon,
    register: registerIcon,
  };

  init(props) {
    const { base, route, location, children } = props;
    const modulePath = route.path;
    const currentPath = location.pathname;
    const menuList = base.menuList;
    // console.log('modulePath in CommonLayout:', modulePath);
    const module = getMatchMenu(modulePath, menuList);
    const menu = getMatchMenu(currentPath, menuList);
    const menus = base.menuTree;
    // console.log(module, menu, menus);

    if (!menu) return;

    const tabs = this.state.children;
    let hasTab = false;
    for (const tab of tabs) {
      if (tab.menu.id === menu.id) {
        hasTab = true;
      }
    }
    if (!hasTab) {
      if (this.maxTab === tabs.length) {
        Modal.confirm({
          title: '标签页',
          content: (<span>您最多可以打开{this.maxTab}个标签页!<br />如果您希望继续打开新的功能，请关闭不需要的标签页.</span>),
          okText: '我知道了',
          cancelText: '关闭',
          maskClosable: true,
        });
        const old = this.state.menu;
        if (old) this.props.dispatch(routerRedux.push(old.pathname));
        return;
      }
      // const tabHeight = document.documentElement.clientHeight - 135;
      tabs.push({ cmp: children, menu });
    }
    this.setState({ menu, module, menus, children: tabs });
    // this.setState(children:tabs);
  }

  maxTab = 5;

  clickMenu({ key, item }) {
    if (key === 'logout') {
      this.logout();
      return;
    } else if (key === 'changePwd') {
      this.changePwd();
      return;
    }

    const { path } = item.props;
    if (path) this.props.dispatch(routerRedux.push(path));
  }

  clickModule({ key, item }) {
    if (key === 'logout') {
      this.logout();
      return;
    } else if (key === 'changePwd') {
      this.changePwd();
      return;
    }
    const { path } = item.props;
    this.setState({ children: [] }, () => {
      if (path) this.props.dispatch(routerRedux.push(path));
    });
  }

  logout() {
    this.props.dispatch({
      type: 'base/logout',
    });
  }

  changePwd() {
  }

  render() {
    const { menuTree, user } = this.props.base;
    // console.log('menuTree in CommonLayout:', menuTree);
    const { menu, module } = this.state;
    const menus = this.state.menus || [];
    // console.log('menus in CommonLayout:', menus)
    // const title = menu ? menu.name : '功能';
    // const tabHeight = document.documentElement.clientHeight - 135;

    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div className={styles.logo} />
          <Menu mode="horizontal" onClick={this.clickMenu} selectedKeys={menu ? [menu.id] : []}>
            {
              menus.map((item) => {
                const children = item.children || [];
                if (children.length <= 0) {
                  return (<Item key={item.id} path={item.pathname} ><span style={{ fontSize: '16px' }} >{item.name}</span></Item>);
                } else {
                  return (
                    <SubMenu key={item.id} path={item.pathname} title={<span style={{ fontSize: '16px' }} >{item.name}</span>} >
                      {
                        children.map((sub) => {
                          return (<Item key={sub.id} path={sub.pathname} ><span style={{ fontSize: '14px' }} >{sub.name}</span></Item>);
                        })
                      }
                    </SubMenu>
                  );
                }
              })
            }
          </Menu>

          <div className={styles.right} >
            <Menu mode="horizontal" onClick={this.clickModule} >
              <SubMenu title={<span className={styles.itemSpan} ><Icon type="user" />{user.name}</span>} >
                {/* <Item key="changePwd" ><span style={{ fontSize: '14px' }} ><Icon type="unlock" />修改密码</span></Item>*/}
                <Item key="logout" ><span style={{ fontSize: '14px' }} ><Icon type="rollback" />退出</span></Item>
              </SubMenu>
            </Menu>
          </div>

        </Header>

        <Content className={styles.content} >
          <div className={styles.workspace} >
            <Tabs hideAdd className={styles.tabs} type="editable-card" onEdit={this.onEditTab} onTabClick={this.onTabClick} activeKey={menu ? menu.id : '0'} animated={false} >
              {
              this.state.children.map((tab,index) => {
                const m = tab.menu;
                const closable = (index > 0);
                return (
                  <TabPane
                    className={styles.tab}
                    style={{ height: tabHeight }}
                    closable={closable}
                    tab={m.name}
                    key={m.id}
                  >
                    {tab.cmp}
                  </TabPane>
                );
              })
            }
            </Tabs>
          </div>
        </Content>
      </Layout>
    );
  }
}
export default connect(({ base }) => ({ base }))(CommonLayout);

