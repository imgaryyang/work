import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout, Card } from 'antd';
import styles from './MatCheckInfo.less';
import CheckInfoList from './MatCheckInfoList';
import CheckInfoDetail from './MatCheckInfoDetail';
import DetailSearchBar from './MatDetailSearchBar';

const { Sider, Content } = Layout;

class MatCheckInfoSearchMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['CHECK_STATE', 'MATERIAL_TYPE'],
    });
  }

  render() {
    const { spin } = this.props.matCheckInfoSearch;
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
  ({ matCheckInfoSearch, base }) => ({ matCheckInfoSearch, base }),
)(MatCheckInfoSearchMain);

