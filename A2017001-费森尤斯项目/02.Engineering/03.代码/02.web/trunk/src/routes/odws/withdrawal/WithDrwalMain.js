
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ShadowDiv from '../../../components/ShadowDiv';

import WithDrwalList from './WithDrwalList';
import WithDrwalDetail from './WithDrwalDetail';
import Editor from './WithDrwalEditor';

import styles from './WithDrwal.less';

const { Sider, Content } = Layout;

class WithDrwalMain extends Component {

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['REG_LEVEL', 'FEE_CODE', 'GROUP_TYPE'],
    });
    this.props.dispatch({
      type: 'odws/setState',
      payload: { odwsWsHeight: this.props.base.wsHeight - 37 - 17 - 6 },
    });
  }

  render() {
    const { odwsHistory, odwsWsHeight, visitRecord } = this.props;
    const { spin, visible } = visitRecord;
    const visitingData = {
      odwsHistory,
      page:this.props.odwsHistory.page,
      odwsWsHeight,
    };
    const VisitingDetail = {
      odwsHistory,
      odwsWsHeight,
    };
    const editorProps = {
      visible,
    };
    return (
      <Spin spinning={spin} style={{ width: '100%', height: this.props.odwsWsHeight+`px` }} >
        <Layout className={styles.mainLayout} >
          <Sider width={350} >
            <WithDrwalList {...visitingData} />
          </Sider>
          <Content >
            <ShadowDiv >
              <WithDrwalDetail {...VisitingDetail}/>
              <Editor {...editorProps} />
            </ShadowDiv>
          </Content>
        </Layout>
      </Spin>
    );
  }
}
export default connect(
  ({ odws, odwsHistory, base, visitRecord }) => ({ odws, odwsHistory, base, visitRecord }),
)(WithDrwalMain);

