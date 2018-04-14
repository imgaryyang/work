import { Toast } from 'antd-mobile';
import { connect } from 'dva';
import React from 'react';
import SignHasCardRecords from './SignHasCardRecords';
import { action } from '../../utils/common';
import less from './SignRecord.less';

class SignMain extends React.Component {
  constructor(props) {
    super(props);

    this.onRefresh = this.onRefresh.bind(this);
    this.sign = this.sign.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(action('base/save', {
      title: '来源签到',
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
      this.onRefresh(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { hasCardRecords: [], isLoading: true }));
  }

  onRefresh(payload) {
    const { dispatch, base: { currProfile: { no: proNo, mobile, idNo } } } = payload || this.props;
    dispatch(action('appoint/save', { isLoading: true }));
    if (proNo) {
      dispatch(action('appoint/forReservedList', { proNo, mobile, idNo }));
    } else {
      Toast.info('无就诊人信息', 3);
    }
    dispatch(action('appoint/save', { isLoading: false }));
  }

  sign(item) {
    Toast.loading('正在签到', 0);
    this.props.dispatch(action('appoint/forSign', item))
      .then((success) => {
        if (success) Toast.success('签到成功', 1, this.onRefresh);
      })
      .catch(e => Toast.fail(String(e), 3));
  }

  render() {
    return (
      <div className={less.scrolly}>
        <SignHasCardRecords sign={this.sign} />
      </div>
    );
  }
}

export default connect(({ appoint, base }) => ({ appoint, base }))(SignMain);
