import { Tabs, Badge, Toast } from 'antd-mobile';
import { connect } from 'dva';
import React from 'react';
import AppointHasCardRecords from './AppointHasCardRecords';
import AppointNoCardRecords from './AppointNoCardRecords';
import { action } from '../../utils/common';

const tabs = [
  { title: <Badge>有卡预约</Badge> },
  { title: <Badge>无卡预约</Badge> },
];

class AppointRecordsMain extends React.Component {
  constructor(props) {
    super(props);

    this.onRefresh = this.onRefresh.bind(this);
    this.cancelAppoint = this.cancelAppoint.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(action('base/save', {
      title: '我的预约',
      allowSwitchPatient: true,
      hideNavBarBottomLine: true,
      showCurrHospitalAndPatient: true,
      headerRight: null,
    }));
    this.onRefresh();
  }

  componentWillReceiveProps(nextProps) {
    const { currProfile, user } = this.props.base;
    const { currProfile: nextProfile, user: nextUser } = nextProps.base;

    if (currProfile !== nextProfile || user !== nextUser) {
      // const { currProfile: { no: proNo, mobile, idNo }, user: { id: terminalUser } } = nextProps.base;
      // this.onRefresh({ proNo, mobile, idNo, terminalUser });
      this.onRefresh(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { hasCardRecords: [], noCardRecords: [], isLoading: true }));
  }

  onRefresh(payload) {
    const { dispatch, base: { currProfile: { no: proNo, mobile, idNo }, user: { id: terminalUser } } } = payload || this.props;
    dispatch(action('appoint/save', { isLoading: true }));
    if (proNo && terminalUser) {
      dispatch(action('appoint/forAppointRecords', { proNo, mobile, idNo, terminalUser }));
    } else if (!proNo && terminalUser) {
      dispatch(action('appoint/forReservedNoCardList', { terminalUser }));
    } else if (proNo && !terminalUser) {
      dispatch(action('appoint/forReservedList', { proNo, mobile, idNo }));
    } else {
      Toast.info('无就诊人信息和用户信息', 3);
    }
    dispatch(action('appoint/save', { isLoading: false }));
  }

  cancelAppoint(item) {
    Toast.loading('正在取消', 0);
    this.props.dispatch(action('appoint/forCancel', item))
      .then((success) => {
        if (success) Toast.success('取消成功', 1, this.onRefresh);
      })
      .catch(e => Toast.fail(String(e), 3));
  }

  render() {
    return (
      <Tabs tabs={tabs}>
        <AppointHasCardRecords cancelAppoint={this.cancelAppoint} />
        <AppointNoCardRecords cancelAppoint={this.cancelAppoint} />
      </Tabs>
    );
  }
}

export default connect(({ appoint, base }) => ({ appoint, base }))(AppointRecordsMain);
