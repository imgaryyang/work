import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, Button } from 'antd-mobile';
import classnames from 'classnames';

import ActivityIndicatorView from '../../components/ActivityIndicatorView';

import styles from './InpatientInfo.less';
import baseStyles from '../../utils/base.less';

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
        allowSwitchPatient: true,
        headerRight: null,
      },
    });
  }

  componentDidMount() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadInpatientBill();
    }
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
    // const genderText = { 1: '男', 2: '女', 3: '不详' };
    const status = { 0: '普通', 1: '挂账', 2: '呆账', 5: '特殊回归', 7: '普通回归', 9: '病区出院' };
    if (isLoading) { return <ActivityIndicatorView />; }

    if (!currProfile.id) {
      return (
        <div className={styles.container}>
          <div className={baseStyles.emptyView}>请先选择就诊人
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

    if (!data || !data.proName) {
      return (
        <div className={styles.container}>
          <div className={baseStyles.emptyView}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的住院信息！`}</div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.itemContainer}>
            <span className={styles.label}>姓名：</span>
            <span className={styles.value}>{data.proName ? data.proName : '暂无'}</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>床位号：</span>
            <span className={styles.value}>{data.bedNo ? data.bedNo : '暂无'}</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>病区名称：</span>
            <span className={styles.value}>{data.areaName ? data.areaName : '暂无'}</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>专科名称：</span>
            <span className={styles.value}>{data.depName ? data.depName : '暂无'}</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>入院时间：</span>
            <span className={styles.value}>{data.inTime ? data.inTime : '暂无'}</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>入院诊断：</span>
            <span className={styles.value}>{data.inDiagnose ? data.inDiagnose : '暂无'}</span>
          </div>
          <div className={styles.itemContainer}>
            <span className={styles.label}>医生名称：</span>
            <span className={styles.value}>{data.docName ? data.docName : '暂无'}</span>
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
