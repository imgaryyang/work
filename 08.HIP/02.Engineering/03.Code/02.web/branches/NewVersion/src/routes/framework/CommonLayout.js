import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Layout, Tabs, Icon, Menu, Modal, Button } from 'antd';
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
import idwsIcon from '../../assets/image/icons/idws.png';
import inwsIcon from '../../assets/image/icons/inws.png';
import aimsIcon from '../../assets/image/icons/aims.png';

import logoImg from '../../assets/image/logo.png';

import LoginDept from './LoginDept';
import ChangePwd from './ChangePwd';

const { SubMenu, Item } = Menu;
const { Header, Content } = Layout;
const { TabPane } = Tabs;

/* global document */
const docHeight = document.documentElement.clientHeight;
const headerHeight = document.documentElement.clientHeight < 700 ? 66 : 66;
const tabHeight = docHeight - 69 - headerHeight;

function getMatchMenu(path, menuList) {
  for (const menu of menuList) {
    if (menu.pathname === path) return menu;
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
    this.changeLoginDept = this.changeLoginDept.bind(this);
  }

  state = { menu: {}, menus: [], module: {}, children: [] }; // 非正规用法，需求比较坑

  componentWillMount() {
    // 缓存科室信息
    // 正式版放到首页调用
    this.props.dispatch({
      type: 'utils/initDepts',
    });

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
        docHeight,
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
        if (!(tab.menu.id === key && i !== 0)) {
          newTabs.push(tab);
        }
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
    idws: idwsIcon,
    inws: inwsIcon,
    aims: aimsIcon,
  };

  init(props) {
    const { base, route, location, children, routes } = props;
    const modulePath = route.path;
    const currentPath = location.pathname;
    const menuList = base.menuList;

    const module = getMatchMenu(modulePath, menuList);
    const menu = getMatchMenu(currentPath, menuList);
    const menus = (module && module.children) ? module.children : [];
    let homeRoute = null;
    if (routes && routes.length > 0) {
      for (const r of routes) {
        if (r.path === '/')homeRoute = r;
      }
    }

    if (!menu) return;

    const tabs = this.state.children || [];

    let hasTab = false;
    let hasHome = false;
    for (const tab of tabs) {
      if (tab.menu.id === menu.id) {
        hasTab = true;
      }
      if (tab.menu.id === module.id) {
        hasHome = true;
      }
    }
    if (!hasHome && homeRoute) {
      if (menu.id !== module.id) {
        this.props.dispatch(routerRedux.push({
          pathname: module.pathname,
          state: { dispatch: menu.pathname },
        }));
        return;
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
      tabs.push({ cmp: children, menu });
    }
    this.setState({ menu, module, menus, children: tabs }, () => {
      if (location.state && location.state.dispatch) {
        this.props.dispatch(routerRedux.push(location.state.dispatch));
      }
    });
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
    // console.log(key, item, this.state.module);
    if (key === 'logout') {
      this.logout();
      return;
    } else if (key === 'changePwd') {
      this.changePwd();
      return;
    }
    if (key.indexOf(this.state.module.id) !== -1) return;
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
    this.props.dispatch({
      type: 'base/setState',
      payload: {
        changeVisible: true,
      },
    });
  }

  changeLoginDept() {
    this.props.dispatch({
      type: 'base/setState',
      payload: {
        visible: true,
        changeLoginDept: true,
      },
    });
  }

  render() {
    const { menuTree, user, userDepts } = this.props.base;
    const { menu, module } = this.state;
    const menus = this.state.menus || [];
    // const title = menu ? menu.name : '功能';
    // const tabHeight = document.documentElement.clientHeight - 135;
    console.log('userDepts.length:', userDepts.length);
    const changeLoginDeptBtn = userDepts.length === 1 ? null : (
      <Button onClick={this.changeLoginDept} size="small" >切换登录科室</Button>
    );
    return (
      <Layout className={styles.layout} >
        <Header className={styles.header} style={{ height: `${headerHeight}px` }} >
          <div className={styles.logo} style={{ height: `${headerHeight}px` }} >
            <img src={logoImg} alt="" />
          </div>
          <Menu mode="horizontal" onClick={this.clickMenu} selectedKeys={menu ? [menu.id] : []} style={{ height: `${headerHeight + 1}px` }} >
            {
              menus.map((item) => {
                const children = item.children || [];
                if (children.length <= 0) {
                  return (
                    <Item
                      key={item.id}
                      path={item.pathname}
                      style={{ height: `${headerHeight}px` }}
                    >
                      <span style={{ fontSize: '16px' }} >{item.name}</span>
                    </Item>
                  );
                } else {
                  return (
                    <SubMenu
                      key={item.id}
                      path={item.pathname}
                      title={<span style={{ fontSize: '16px' }} >{item.name}</span>}
                      style={{ height: `${headerHeight}px` }}
                    >
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
            <Menu mode="horizontal" onClick={this.clickModule} style={{ height: `${headerHeight}px` }} >
              <SubMenu
                title={
                  <span className={`${styles.itemSpan} ${styles.sysItem}`} >
                    <img src={module ? this.icons[module.icon] : ''} alt="" className={styles.icon} />&nbsp;&nbsp;{module ? module.name : ''}
                  </span>
                }
                style={{ height: `${headerHeight}px` }}
              >
                {
                  menuTree.map((sys, index) => {
                    // 模块无子菜单时不显示此模块
                    if (sys.children.length === 0) return null;
                    // if (sys.id === menu.id) return null;
                    return (
                      <Item key={sys.id} path={sys.pathname} >
                        <span className={styles.itemSpan} >
                          <img src={this.icons[sys.icon]} alt="" className={styles.icon} />&nbsp;&nbsp;{sys.name}
                        </span>
                      </Item>
                    );
                  })
                }
              </SubMenu>
            </Menu>
            <Menu mode="horizontal" onClick={this.clickModule} style={{ height: `${headerHeight}px` }} >
              <SubMenu
                title={<span className={styles.itemSpan} ><Icon type="user" />{user.name}</span>}
                style={{ height: `${headerHeight}px` }}
              >
                <Item key="changePwd" ><span style={{ fontSize: '14px' }} ><Icon type="unlock" />修改密码</span></Item>
                <Item key="logout" ><span style={{ fontSize: '14px' }} ><Icon type="rollback" />退出</span></Item>
              </SubMenu>
            </Menu>
          </div>

        </Header>

        <Content className={styles.content} >
          <div className={styles.loginDept} >
            当前登录为：{user.loginDepartment ? user.loginDepartment.deptName : ''}&nbsp;&nbsp;
            { changeLoginDeptBtn }
          </div>
          <div className={styles.workspace} >
            <Tabs hideAdd className={styles.tabs} type="editable-card" onEdit={this.onEditTab} onTabClick={this.onTabClick} activeKey={menu ? menu.id : '0'} animated={false} >
              {
              this.state.children.map((tab, index) => {
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
        {/* 选择登录科室界面 */}
        <LoginDept />
        {/* 修改密码界面 */}
        <ChangePwd />
      </Layout>
    );
  }
}
export default connect(({ base }) => ({ base }))(CommonLayout);

