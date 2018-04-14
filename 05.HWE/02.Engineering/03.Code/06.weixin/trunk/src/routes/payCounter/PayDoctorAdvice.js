import { Flex, Button, Modal, WhiteSpace } from 'antd-mobile';
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import classnames from 'classnames';
import Icon from '../../components/FAIcon';
import styles from './PayDoctorAdvice.less';
import { filterMoney, filterTextBreak } from '../../utils/Filters';
import commonStyles from '../../utils/common.less';

class PayDoctorAdvice extends React.Component {
  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.onChange = this.onChange.bind(this);
    this.prePay = this.prePay.bind(this);
    this.loadData = this.loadData.bind(this);
    this.renderBottomBar = this.renderBottomBar.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }
  state = {
    selectedItems: [],
  }
  componentWillMount() {
    const { currProfile } = this.props.base;
    if (currProfile.no !== undefined && currProfile.type === '1') {
      this.loadData();
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '充值缴费',
        hideNavBarBottomLine: true,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }
  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.loadData();
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        hideNavBarBottomLine: false,
      },
    });
  }
  onChange = (value) => {
    const { selectedItems } = this.state;
    const index = selectedItems.indexOf(value);
    // 记录选择的项目，如果有这个值，就从数据中删除;没有，就加进来
    if (index > -1) {
      selectedItems.splice(index, 1);
    } else {
      selectedItems.push(value);
    }
    this.setState({ selectedItems });
  }

  prePay = () => {
    const { selectedItems } = this.state;
    if (selectedItems.length < 1) {
      Modal.alert('提示', '请选择待缴费项目', [
        { text: '确认' },
      ]);
      return;
    }
    this.props.dispatch({
      type: 'paymentRecord/prePay',
      payload: { recipeNos: selectedItems },
    }).then(() => {
      const { prePayData } = this.props.paymentRecord;
      this.props.dispatch(routerRedux.push({
        pathname: 'PaymentRecordPrePay',
      }));
    });
  }
  loadData() {
    const { currProfile: profile } = this.props.base;
    const query = {};
    query.hosNo = profile.hosNo;
    query.hosName = profile.hosName;
    query.proNo = profile.no;
    query.proName = profile.name;
    query.cardNo = profile.cardNo;
    query.cardType = profile.cardType;
    // const query = { proNo: 'P0000000000170', hosNo: 'H31AAAA001' };
    this.props.dispatch({
      type: 'paymentRecord/findUnpaidChargeList',
      payload: { query },
    });
  }
  renderBottomBar() {
    const { data } = this.props.paymentRecord;
    if (data.length < 1) {
      return null;
    }
    return (
      <div className={classnames(styles.toolBar, styles.bottomBar)}>
        <Button type="primary" onClick={this.prePay} disabled={this.props.base.currProfile.no === undefined}>自费结算</Button>
      </div>
    );
  }
  render() {
    const convertedData = [];
    const { data } = this.props.paymentRecord;
    const { selectedItems } = this.state;
    const { currProfile } = this.props.base;
    let content = {};
    if (data.length > 0) {
      let lastRecordNo = '';
      let currentRecordItem = null;
      for (let idx = 0; idx < data.length; idx += 1) {
        // 新建处方项目
        if (lastRecordNo === '' || lastRecordNo !== data[idx].recordNo) {
          currentRecordItem = {};
          currentRecordItem.recordNo = data[idx].recordNo;
          currentRecordItem.items = [];
          convertedData.push(currentRecordItem);
          lastRecordNo = data[idx].recordNo;
        }
        const item = {};
        item.name = data[idx].name;
        item.num = data[idx].num;
        item.price = data[idx].price;
        item.cost = data[idx].cost;
        currentRecordItem.items.push(item);
      }
      content = convertedData.map(recordItem => (
        <div className={styles.itemContainer} key={recordItem.recordNo} onClick={this.onChange.bind(this, recordItem.recordNo)}>
          <Flex className={styles['title']}>
            <Flex.Item>
              处方{recordItem.recordNo}
            </Flex.Item>
            <Flex.Item style={{ textAlign: 'right' }}>
              <Icon type={selectedItems.indexOf(recordItem.recordNo) > -1 ? 'check-square-o' : 'square-o'} className={styles.icon} />
            </Flex.Item>
          </Flex>
          <Flex className={styles.header}>
            <Flex.Item style={{ flex: 5, textAlign: 'left' }}>
              项目
            </Flex.Item>
            <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
              数量
            </Flex.Item>
            <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
              单价
            </Flex.Item>
            <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
              总价
            </Flex.Item>
          </Flex>
          {
            recordItem.items.map((detailItem, detailItemIndex) => (
              <Flex key={detailItemIndex} className={styles['detailContent']}>
                <Flex.Item style={{ flex: 5, textAlign: 'left', fontWeight: 'bold' }}>
                  {detailItem.name}
                </Flex.Item>
                <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
                  {detailItem.num}
                </Flex.Item>
                <Flex.Item style={{ flex: 2, textAlign: 'right' }} >
                  {filterMoney(detailItem.price)}
                </Flex.Item>
                <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
                  {filterMoney(detailItem.cost)}
                </Flex.Item>
              </Flex>
            ))
          }
        </div>
      ));
    } else {
      const emptyText = `暂无${currProfile.name}（卡号：${currProfile.no}）\n的待缴费信息！`;
      content = (<div className={commonStyles.emptyView}>{filterTextBreak(emptyText)}</div>);
    }
    return (
      <div className={styles.container}>
        {/* { this.renderToolBar() } */}
        <div className={styles.listContainer}>
          { content }
          <WhiteSpace size="lg" />
        </div>
        { this.renderBottomBar() }
      </div>
    );
  }
}

export default connect(({ user, base, paymentRecord, payment }) => ({ user, base, paymentRecord, payment }))(PayDoctorAdvice);
