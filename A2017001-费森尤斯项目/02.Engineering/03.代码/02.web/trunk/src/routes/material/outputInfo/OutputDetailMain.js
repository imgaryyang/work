import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout, Card } from 'antd';
import styles from './Output.less';
import OutputList from './OutputList';
import OutputDetail from './OutputDetail';
import DetailSearchBar from './DetailSearchBar';

const { Sider, Content } = Layout;

class OutputDetailMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['OUTPUT_STATE'],
    });
  }

  render() {
    const { spin } = this.props.outputdetail;
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
  ({ outputdetail, base }) => ({ outputdetail, base }),
)(OutputDetailMain);

