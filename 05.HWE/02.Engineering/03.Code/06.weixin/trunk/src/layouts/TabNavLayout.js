import React from 'react';
// import { withRouter } from 'react-router';
// import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { TabBar, Toast } from 'antd-mobile';
import classnames from 'classnames';

import styles from './TabNavLayout.less';
import commonStyles from '../utils/common.less';

import Config from '../Config';
import Global from '../Global';

import HFCSingle from '../routes/hospital/HospitalFuncCenter.single';
import Me from '../routes/me/Me';

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

// const controls = [
//   '/',
//   '/home',
//   '/loginBySMS',
//   '/stack/appoint/departments',
//   '/stack/appoint/schedule',
//   '/stack/appoint/source',
//   '/stack/news',
//   '/stack/newsDetail',
//   '/stack/profile',
//   '/stack/archives',
//   '/stack/patient',
//   '/stack/feedBack',
//   '/stack/aboutUs',
//   '/stack/contactUs',
//   '/stack/appoint/records',
//   '/stack/payment/inputMoney',
//   '/stack/inpatientBillQuery',
//   '/stack/inpatientDaily',
// ];

class TabNavLayout extends React.Component {
  constructor(props) {
    super(props);
    Global.setConfig(Config);
    const { dispatch } = this.props;
    dispatch({
      type: 'base/setState',
      payload: {
        currHospital: Global.Config.hospital,
      },
    });
    dispatch({
      type: 'base/setScreen',
      payload: {
        width: screenWidth,
        height: screenHeight,
      },
    });
    // TODO: 重载用户信息，测试用，正式环境需要删除
    if (!this.props.base.user.id) {
      dispatch({
        type: 'base/reloadUserInfo',
        callback: msg => (msg.id ? Toast.info('重新载入用户信息成功！', 2, null, false) : Toast.info(msg, 2, null, false)),
      });
    }

    this.pressTab = this.pressTab.bind(this);
    // this.toBind = this.toBind.bind(this);
  }

  componentDidMount() {
    // console.log('>>>withRouter:', withRouter);
    // routerRedux.replace(0);
    this.props.dispatch({
      type: 'base/setState',
      payload: {
        route: '',
      },
    });
  }

  pressTab(tab) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/save',
      payload: { selectedTab: tab },
    });
  }

  // toBind(location) {
  //   const { profiles } = this.props.base;
  //   let flag = profiles.length === 0;
  //   if (controls.indexOf(location.pathname) >= 0) {
  //     flag = false;
  //   }
  //   if (flag) {
  //     Modal.alert('提示', '暂无档案信息，是否前去绑定？', [
  //       { text: '取消', onPress: () => this.props.dispatch(routerRedux.goBack()) },
  //       { text: '确认', onPress: () => this.props.dispatch(routerRedux.push('/patientMain/addPatient')) },
  //     ]);
  //   }
  // }

  render() {
    // const { match } = this.props;
    const { selectedTab } = this.props.home;
    return (
      <div className={styles['container']}>
        {/* <Prompt message={this.toBind} />*/}
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
