import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Modal, Spin } from 'antd';

import styles from './Login.less';

class LoginDept extends Component {

  constructor(props) {
    super(props);
    this.onSelected = this.onSelected.bind(this);
  }

  state = {
    deptId: null,
    deptCode: null,
    deptName: null,
  };

  componentWillMount() {
    // 已登录用户通过“切换登录科室”按钮触发的操作
    if (this.props.base.changeLoginDept) {
      // 重新载入登录科室
      this.props.dispatch({
        type: 'base/loadUserDepts',
      });
    }
  }

  componentWillReceiveProps(nextPtops) {
    // console.log('nextPtops.base.userDepts:', nextPtops.base.userDepts);
    // 如果当前登录人只有一个登录科室，则默认登录，不显示选择登录科室界面
    if (nextPtops.base.userDepts !== this.props.base.userDepts
      && nextPtops.base.userDepts.length === 1) {
      this.onSelected(nextPtops.base.userDepts[0]);
    }
    // 已登录用户通过“切换登录科室”按钮触发的操作
    if (this.props.base.changeLoginDept !== nextPtops.base.changeLoginDept && nextPtops.base.changeLoginDept) {
      // 重新载入登录科室
      this.props.dispatch({
        type: 'base/loadUserDepts',
      });
    }
    // console.log(nextPtops.base.toHome);
    if (this.props.base.toHome !== nextPtops.base.toHome && nextPtops.base.toHome) {
      this.props.dispatch(routerRedux.push('/homepage'));
    }
  }

  onSelected(dept) {
    this.setState({
      deptId: dept.deptId,
      deptCode: dept.deptCode,
      deptName: dept.deptName,
    }, () => {
      this.props.dispatch({
        type: 'base/chooseLoginDept',
        payload: {
          loginDept: { ...this.state },
        },
      });
    });
  }

  render() {
    const { loginDeptSpin, visible, userDepts } = this.props.base;

    return (
      <Modal
        width={400}
        title={<div className={styles.selectDeptTitle} >选择登录科室</div>}
        visible={visible}
        footer={null}
        closable={false}
        maskClosable={false}
        style={{ padding: '0px' }}
        wrapClassName={styles.verticalCenterModal}
      >
        <Spin spinning={loginDeptSpin}>
          <div style={{ maxHeight: '306px', overflow: 'auto' }} >
            {userDepts && userDepts.length > 0 ? userDepts.map(
              (dept, idx) => {
                const line = idx === (userDepts.length - 1) ? null : (
                  <div className={styles.selectDeptSepLine} />
                );
                const selectedStyle = this.state.deptId === dept.deptId ? { color: '#108ee9' } : {};
                return (
                  <div key={`${dept.id}_${idx}`} onClick={() => this.onSelected(dept)} style={selectedStyle} className={styles.selectDeptRow} >
                    {dept.deptName}
                    {line}
                  </div>
                );
              },
            ) : null}
          </div>
        </Spin>
      </Modal >
    );
  }
}

export default connect(({ base, utils }) => ({ base, utils }))(LoginDept);

