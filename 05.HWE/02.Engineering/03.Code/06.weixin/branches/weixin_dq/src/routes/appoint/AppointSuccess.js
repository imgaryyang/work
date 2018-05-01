import React from 'react';
import { Button, Icon, Flex } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import less from './AppointSuccess.less';
import { action } from '../../utils/common';
import baseStyles from '../../utils/base.less';

class AppointSuccess extends React.Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.gotoRecords = this.gotoRecords.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(action('base/save', {
      title: '预约成功',
      allowSwitchPatient: false,
      hideNavBarBottomLine: false,
      showCurrHospitalAndPatient: true,
      headerRight: null,
    }));
    this.props.dispatch(action('appoint/save', {
      cond: {},
      selectSchedule: {},
      selectAppointSource: {},
    }));
  }

  goBack() {
    this.props.dispatch(routerRedux.go(-4));
  }

  gotoRecords() {
    // this.props.dispatch(routerRedux.go(-3));
    // this.props.dispatch(routerRedux.push());
    this.props.dispatch(routerRedux.push({ pathname: 'records' }));
  }

  render() {
    const { type } = this.props.location.payload || {};
    return (
      <Flex align="center" direction="column" className={less.container}>
        <Icon type="check-circle" className={less.icon} />
        <div className={less.title}>操作成功</div>
        <div className={less.content}>
          {
            type === '1' ? '无卡预约成功，请就诊当天使用医院自助机完成自助办卡并签到，' : '您已预约成功，'
          }
          可到 <span onClick={this.gotoRecords}>我的预约</span> 中查看您的预约信息！
        </div>
        <Button className={less.button} onClick={this.goBack}><span className={baseStyles.font15}>确定返回</span></Button>
      </Flex>
    );
  }
}

export default connect(appoint => (appoint))(AppointSuccess);
