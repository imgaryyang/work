import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { NavBar, WhiteSpace, List, Icon, Flex } from 'antd-mobile';
import styles from './Profiles.less';


const { Item } = List;

class Profiles extends React.Component {
  componentDidMount() {
    this.fetchData();
  }
  getProfiles() {
    this.fetchData();
  }
  fetchData() {
    const query = this.props.location.state;
    const { id } = query;
    this.props.dispatch({
      type: 'user/getProfiles',
      payload: {
        ...query,
        hospitalId: '8a81a7db4dad2271014dad2271e20001',
        patientId: id,
      },
    });
    this.props.dispatch({
      type: 'base/updateProfiles',
    });
  }
  goback() {
    console.log('goback');
    this.props.dispatch(routerRedux.goBack());
  }
  render() {
    const { profiles } = this.props.user;
    const list = profiles && profiles.length > 0 ? (
      <List>
        {
          profiles.map((profile, index) => (
            <Flex key={index} direction="row">
              <Flex
                style={{
                  flex: 4,
                }}
              >
                <Item className={styles['placeholder']} style={{ fontSize: '10px' }} >
                  <span>姓名：{profile.name}</span>
                  <WhiteSpace size="xs" />
                  <span>身份证号：{profile.idNo}</span>
                  <WhiteSpace size="xs" />
                  <span>就诊卡号：{profile.no}</span>
                </Item>
              </Flex>
            </Flex>
          ))
        }
      </List>
    ) : (
      <div>
        <WhiteSpace size="xl" />
        <div style={{ textAlign: 'center' }}>暂无卡号信息</div>
      </div>
    );
    return (
      <div>
        <WhiteSpace />
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.goback()}
          rightContent={
            <div key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.getProfiles()} >
              查询
            </div>
          }
        >就诊卡
        </NavBar>
        {list}
      </div>
    );
  }
}

Profiles.propTypes = {
};

export default connect(({ home, user, base }) => ({ home, user, base }))(Profiles);
