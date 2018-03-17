import React from 'react';
// import { withRouter } from 'react-router';
import { Route, Prompt, routerRedux } from 'dva/router';
import { connect } from 'dva';
import { TabBar, Modal } from 'antd-mobile';
import classnames from 'classnames';

import styles from './TabNavLayout.less';
import commonStyles from '../utils/common.less';

import Config from '../Config';
import Global from '../Global';

import HFCSingle from '../routes/hospital/HospitalFuncCenter.single';
import Me from '../routes/me/Me';

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

const controls = [
  '/',
  '/home',
  '/loginZFB',
  '/loginWeChat',
  '/stack/appoint/departments',
  '/stack/appoint/schedule',
  '/stack/appoint/source',
  '/stack/news',
  '/stack/newsDetail',
  '/stack/me/profile',
  '/stack/patientMain/profiles',
  '/stack/patientMain/patient',
  '/stack/feedBack',
  '/stack/aboutUs',
  '/stack/contactUs',
  '/stack/appoint/records',
  '/stack/payment/inputMoney',
];

class TabNavLayout extends React.Component {
  constructor(props) {
    super(props);
    Global.setConfig(Config);
    const { dispatch } = this.props;
    dispatch({
      type: 'base/setScreen',
      payload: {
        width: screenWidth,
        height: screenHeight,
      },
    });
    dispatch({
      type: 'home/save',
      payload: { selectedTab: 'hfc' },
    });

    this.pressTab = this.pressTab.bind(this);
    this.toBind = this.toBind.bind(this);
  }
  componentDidMount() {
    // console.log('>>>withRouter:', withRouter);
    routerRedux.replace(0);
  }
  pressTab(tab) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/save',
      payload: { selectedTab: tab },
    });
  }

  toBind(location) {
    const { profiles } = this.props.base;
    let flag = profiles.length === 0;
    if (controls.indexOf(location.pathname) >= 0) {
      flag = false;
    }
    if (flag) {
      Modal.alert('提示', '暂无档案信息，是否前去绑定？', [
        { text: '取消', onPress: () => this.props.dispatch(routerRedux.goBack()) },
        { text: '确认', onPress: () => this.props.dispatch(routerRedux.push('/patientMain/addPatient')) },
      ]);
    }
  }

  render() {
    const { match } = this.props;
    const { selectedTab } = this.props.home;
    return (
      <div className={styles['container']}>
        <Prompt message={this.toBind} />
        <TabBar unselectedTintColor="#888888" tintColor="#fe4d3d" >
          <TabBar.Item
            title="医院"
            key="hfc"
            icon={<div
              className={classnames(commonStyles.hosp, commonStyles.icon, styles.tabIcon)}
            />}
            selectedIcon={<div
              className={classnames(commonStyles.hospActive, commonStyles.icon, styles.tabIcon)}
            />}
            selected={selectedTab === 'hfc'}
            onPress={() => this.pressTab('hfc')}
          >
            {/* <Route path={`${match.url}/hfc`} component={HFCSingle} />*/}
            <HFCSingle />
          </TabBar.Item>
          <TabBar.Item
            title="我的"
            key="me"
            icon={<div
              className={classnames(commonStyles.me, commonStyles.icon, styles.tabIcon)}
            />}
            selectedIcon={<div
              className={classnames(commonStyles.meActive, commonStyles.icon, styles.tabIcon)}
            />}
            selected={selectedTab === 'me'}
            onPress={() => this.pressTab('me')}
          >
            {/* <Route path={`${match.url}/hfc`} component={Me} />*/}
            <Me />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

TabNavLayout.propTypes = {
};

export default connect(({ home, user, base }) => ({ home, user, base }))(TabNavLayout);
