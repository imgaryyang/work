import React from 'react';
import { connect } from 'dva';
import { Card, NavBar } from 'antd-mobile';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import styles from './InpatientBillQuery.less';
import ProfileList from '../patients/ProfileList';

class InpatientBillQuery extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.loadInpatientBill = this.loadInpatientBill.bind(this);
  }
  componentWillMount() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadInpatientBill(currProfile);
    }
  }
  callback(item) {
    const selectProfile = item;
    this.loadInpatientBill(selectProfile);
  }
  loadInpatientBill(profile) {
    // 根据病人编号查询住院信息
    const query = { proNo: profile.no, hosNo: profile.hosNo };
    console.info(query);
    this.props.dispatch({
      type: 'inpatientBill/findInpatientBill',
      payload: query,
    });
  }
  render() {
    const { data, isLoading } = this.props.inpatientBill;
    const { currProfile } = this.props.base;
    const genderText = { 1: '男', 2: '女', 3: '不详' };
    const status = { 0: '已出院', 1: '正在住院' };
    if (isLoading) { return <ActivityIndicatorView />; }
    if (Object.keys(currProfile).length === 0) {
      return (
        <div>
          <NavBar
            mode="light"
          >住院单查询
          </NavBar>
          <ProfileList callback={this.callback} />
        </div>
      );
    }
    return (
      <div>
        <NavBar
          mode="light"
        >住院单查询
        </NavBar>
        <ProfileList callback={this.callback} />
        <Card>
          <Card.Body>
            <div className={styles['info_list']}>
              <span className={styles['color_text']}>姓名：</span>
              <span>{data.proName === undefined ? '未知' : data.proName }</span>
            </div>
          </Card.Body>
          <Card.Body>
            <div className={styles['info_list']}>
              <span className={styles['color_text']}>性别：</span>
              <span>{data.gender === undefined ? '暂无' : genderText[data.gender] }</span>
            </div>
          </Card.Body>
          <Card.Body>
            <div className={styles['info_list']}>
              <span className={styles['color_text']}>床位号：</span>
              <span>{data.bedNo === undefined ? '暂无' : data.bedNo }</span>
            </div>
          </Card.Body>
          <Card.Body>
            <div className={styles['info_list']}>
              <span className={styles['color_text']}>病区名称：</span>
              <span>{data.areaName === undefined ? '暂无' : data.areaName }</span>
            </div>
          </Card.Body>
          <Card.Body>
            <div className={styles['info_list']}>
              <span className={styles['color_text']}>专科名称：</span>
              <span>{data.depName === undefined ? '暂无' : data.depName }</span>
            </div>
          </Card.Body>
          <Card.Body>
            <div className={styles['info_list']}>
              <span className={styles['color_text']}>医生名称：</span>
              <span>{data.docName === undefined ? '暂无' : data.docName }</span>
            </div>
          </Card.Body>
          <Card.Body>
            <div className={styles['info_list']}>
              <span className={styles['color_text']}>当前状态：</span>
              <span className={styles['color_red']}>{data.status === undefined ? '暂无' : status[data.status] }</span>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

InpatientBillQuery.propTypes = {
};

export default connect(({ user, base, inpatientBill }) => ({ user, base, inpatientBill }))(InpatientBillQuery);
