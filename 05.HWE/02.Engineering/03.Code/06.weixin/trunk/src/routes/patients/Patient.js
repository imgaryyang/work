import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { NavBar, List, Flex, WhiteSpace } from 'antd-mobile';
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
        <List>
          {
            userPatients.map((patient, index) => (
              <Flex key={index}>
                <Flex
                  style={{ flex: 1, display: show }}
                >
                  <span style={{ color: 'red', marginLeft: '10px' }} onClick={() => this.delete(patient)}>删除</span>
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
      </div>
    );
  }
}

Patient.propTypes = {
};

export default connect(({ home, user, base }) => ({ home, user, base }))(Patient);
