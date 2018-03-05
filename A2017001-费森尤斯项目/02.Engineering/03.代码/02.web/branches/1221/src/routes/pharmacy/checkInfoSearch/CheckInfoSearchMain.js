import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout, Card } from 'antd';
import styles from './CheckInfo.less';
import CheckInfoList from './CheckInfoList';
import CheckInfoDetail from './CheckInfoDetail';
import DetailSearchBar from './DetailSearchBar';

const { Sider, Content } = Layout;

class CheckInfoSearchMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['CHECK_STATE'],
    });
  }

  render() {
    const { spin } = this.props.checkInfoSearch;
    const { wsHeight } = this.props.base;
    const leftHeight = wsHeight - (3 * 2);
    return (
      <Spin spinning={spin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={350} >
            <CheckInfoList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }} >
            <Card className={styles.leftCard} style={{ height: leftHeight }} >
              <DetailSearchBar />
              <CheckInfoDetail />
            </Card>
          </Content>
        </Layout>
      </Spin>
    );
  }
}
export default connect(
  ({ checkInfoSearch, base }) => ({ checkInfoSearch, base }),
)(CheckInfoSearchMain);

