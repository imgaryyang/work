import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout, Card } from 'antd';
import styles from './ChargePkg.less';
// import AsyncChargePkgTree from '../../../components/AsyncChargePkgTree';
import ChargePkgGroupList from './ChargePkgGroupList';
import ChargePkgEdit from './ChargePkgEdit';
import ChargePkgItemInput from './ChargePkgItemInput';
import ChargePkgItemList from './ChargePkgItemList';

const { Sider, Content } = Layout;

class ChargePkgMain extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    // 载入需要的数据字典
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['GROUP_TYPE', 'BUSI_CLASS', 'SHARE_LEVEL', 'USAGE'],
    });
  }

  onSelect(record) {
    console.log(record);
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: { groupRecord: record },
    });
    this.props.dispatch({
      type: 'chargePkg/loadItems',
      comboId: record.id,
    });
  }

  render() {
    const { base, chargePkg } = this.props;
    const { spin, groupRecord, itemRecord } = chargePkg;

    const { wsHeight } = base;
    // feeCode === ‘100’ 时选择的是收费项，否则选择的是药品
    const bottomCardHeight = groupRecord.drugFlag !== '3' ?
      (wsHeight - 146 - 10 - 6) :
      (wsHeight - 104 - 10 - 6);

    /* const title = `${groupRecord.comboName ? groupRecord.comboName : ''} - 组套明细`;*/

    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <Layout className={styles.mainLayout} style={{ overflow: 'visible' }} >
          <Sider width={300} >
            <Card style={{ height: `${wsHeight - 5}px` }} className={styles.tmpCard} >
              <ChargePkgGroupList />
            </Card>
          </Sider>
          <Content style={{ position: 'relative' }} >
            <Card className={styles.inputCard} >
              <ChargePkgItemInput />
            </Card>
            <Card style={{ height: `${bottomCardHeight}px` }} className={styles.listCard} >
              <ChargePkgItemList />
            </Card>
            <div className={styles.optFlagContainer} >
              <span className={itemRecord.id ? '' : styles.selectedOpt} >新增</span>
              <span className={itemRecord.id ? styles.selectedOpt : ''}>修改</span>
            </div>
          </Content>
        </Layout>
        <ChargePkgEdit />
      </Spin>
    );
  }
}
export default connect(
  ({ base, chargePkg }) => ({ base, chargePkg }),
)(ChargePkgMain);
