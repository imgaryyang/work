import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout, Card } from 'antd';
import styles from './Output.less';
import OutputList from './OutputList';
import OutputDetail from './OutputDetail';
import DetailSearchBar from './DetailSearchBar';

const { Sider, Content } = Layout;

class OutputSearchMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['OUTPUT_STATE'],
    });
  }

  render() {
    const { spin } = this.props.outputDetailInfo;
    const { wsHeight } = this.props.base;
    const leftHeight = wsHeight - (3 * 2);
    return (
      <Spin spinning={spin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={350} >
            <OutputList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }} >
            <Card className={styles.leftCard} style={{ height: leftHeight }} >
              <DetailSearchBar />
              <OutputDetail />
            </Card>
          </Content>
        </Layout>
      </Spin>
    );
  }
}
export default connect(
  ({ outputDetailInfo, base }) => ({ outputDetailInfo, base }),
)(OutputSearchMain);

