import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { NavBar, List, Flex, WhiteSpace, Modal } from 'antd-mobile';
import styles from './Patient.less';

const { Item } = List;

class Patient extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'user/list',
    });
  }
  addPatient() {
    this.props.dispatch(routerRedux.push('/patientMain/addPatient'));
  }
  showProfile(patient) {
    this.props.dispatch({
      type: 'base/save',
      payload: {
        currPatient: patient,
      },
    });
    this.props.dispatch(routerRedux.push({ pathname: '/patientMain/profiles', state: patient }));
  }
  showDelBut() {
    const { showDelBut } = this.props.user;
    this.props.dispatch({
      type: 'user/save',
      payload: {
        showDelBut: !showDelBut,
      },
    });
  }
  callback(item) {
    console.log('callback', item);
  }
  confirm(patient) {
    Modal.alert('提示', '确定删除该就诊人吗？', [
      { text: '取消', onPress: () => console.log('取消') },
      { text: '确认', onPress: () => this.delete(patient) },
    ]);
  }
  delete(patient) {
    console.log('delete', patient);
    const { id } = patient;
    this.props.dispatch({
      type: 'user/remove',
      payload: id,
    });
  }
  render() {
    const { userPatients, showDelBut } = this.props.user;
    const show = showDelBut ? '' : 'none';
    const list = userPatients && userPatients.length > 0 ? (
      <List>
        {
          userPatients.map((patient, index) => (
            <Flex key={index}>
              <Flex
                style={{ flex: 1, display: show }}
              >
                <span style={{ color: 'red', marginLeft: '10px' }} onClick={() => this.confirm(patient)}>删除</span>
              </Flex>
              <Flex
                style={{ flex: 6 }}
              >
                <Item key={index} className={styles['placeholder']} arrow="horizontal" onClick={() => this.showProfile(patient)}>
                  <span>姓名：{patient.name}</span>
                  <WhiteSpace size="xs" />
                  <span>身份证号：{patient.idNo}</span>
                </Item>
              </Flex>
            </Flex>
          ))
        }
      </List>
    ) : (
      <div>
        <WhiteSpace size="xl" />
        <div style={{ textAlign: 'center' }}>暂无就诊人信息</div>
      </div>
    );
    return (
      <div>
        <NavBar
          mode="light"
          // icon={<Icon type="left" />}
          leftContent="选择"
          onLeftClick={() => this.showDelBut()}
          rightContent={
            <div key="0" type="search" style={{ marginRight: '10px' }} onClick={() => this.addPatient()} >
              添加
            </div>
          }
        >常用就诊人
        </NavBar>
        {list}
      </div>
    );
  }
}

Patient.propTypes = {
};

export default connect(({ home, user, base }) => ({ home, user, base }))(Patient);
