import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, Button } from 'antd-mobile';
import classnames from 'classnames';

import ActivityIndicatorView from '../../components/ActivityIndicatorView';

import styles from './InpatientInfo.less';
import commonStyles from '../../utils/common.less';

class InpatientInfo extends React.Component {
  constructor(props) {
    super(props);
    this.loadInpatientBill = this.loadInpatientBill.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '住院单查询',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }

  componentDidMount() {
    this.loadInpatientBill();
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.loadInpatientBill();
    }
  }

  loadInpatientBill() {
    const { currHospital, currProfile } = this.props.base;
    if (!currHospital.id) {
      Toast.info('没有当前医院信息！', 2, null, false);
      return;
    }
    if (!currProfile.id) {
      return;
    }

    // 根据病人编号查询住院信息
    const query = {
      proNo: currProfile.no,
      hosNo: currHospital.hosNo,
    };
    // console.info(query);
    this.props.dispatch({
      type: 'inpatientBill/findInpatientBill',
      payload: query,
    });
  }

  render() {
    // console.log(this.props.base);
    const { data, isLoading } = this.props.inpatientBill;
    const { currProfile } = this.props.base;
    const genderText = { 1: '男', 2: '女', 3: '不详' };
    const status = { 0: '已出院', 1: '正在住院' };
    if (isLoading) { return <ActivityIndicatorView />; }

    if (!currProfile.id) {
      return (
        <div className={styles.container}>
          <div className={commonStyles.emptyView}>请先选择就诊人
            <Button
              type="ghost"
              inline
              style={{ marginTop: 10, width: 200 }}
              onClick={() => this.props.dispatch(routerRedux.push({ pathname: 'choosePatient' }))}
            >选择就诊人
            </Button>
          </div>
        </div>
      );
    }

    if (!data.proName) {
      return (
        <div className={styles.container}>
          <div className={commonStyles.emptyView}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的住院信息！`}</div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.itemContainer}>
            <span className={styles.label}>姓名：</span>
            <span className={styles.value}>{data.proName}</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>性别：</span>
            <span className={styles.value}>{genderText[data.gender] }</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>床位号：</span>
            <span className={styles.value}>{data.bedNo }</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>病区名称：</span>
            <span className={styles.value}>{data.areaName }</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>专科名称：</span>
            <span className={styles.value}>{data.depName }</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>医生名称：</span>
            <span className={styles.value}>{data.docName }</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>当前状态：</span>
            <span className={classnames(styles.value, styles.redText)}>{status[data.status] }</span>
          </div>
        </div>
      </div>
    );
  }
}

InpatientInfo.propTypes = {
};

export default connect(({ user, base, inpatientBill }) => ({ user, base, inpatientBill }))(InpatientInfo);
