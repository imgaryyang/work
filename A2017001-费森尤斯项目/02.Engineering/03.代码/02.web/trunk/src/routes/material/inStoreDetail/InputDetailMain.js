import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout, Card } from 'antd';
import styles from './InStore.less';
import InStoreList from './InputList';
import InStoreDetail from './InputDetail';
import DetailSearchBar from './InputDetailSearchBar';

const { Sider, Content } = Layout;

class InputSearchMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['INPUT_STATE'],
    });
  }

  render() {
    const { isSpin } = this.props.instoredetail;
    const { wsHeight } = this.props.base;
    const leftHeight = wsHeight - (3 * 2);
    return (
      <Spin spinning={isSpin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={350} >
            <InStoreList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }} >
            <Card className={styles.leftCard} style={{ height: leftHeight }} >
              <DetailSearchBar />
              <InStoreDetail />
            </Card>
          </Content>
        </Layout>
      </Spin>
    );
  }
}
export default connect(
  ({ instoredetail, base }) => ({ instoredetail, base }),
)(InputSearchMain);

