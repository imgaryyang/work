import { Flex, Button, Modal, WhiteSpace, Text, Toast } from 'antd-mobile';
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import classnames from 'classnames';
import Icon from '../../components/FAIcon';
import styles from './PayDoctorAdvice.less';
import { filterMoney, filterTextBreak } from '../../utils/Filters';
import commonStyles from '../../utils/common.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';


class PayDoctorAdvice extends React.Component {
  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.onChange = this.onChange.bind(this);
    this.prePay = this.prePay.bind(this);
    this.loadData = this.loadData.bind(this);
    this.renderBottomBar = this.renderBottomBar.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }
  state = {
    selectedItems: [],
  }
  componentWillMount() {
    const { currProfile } = this.props.base;
    if (currProfile.no !== undefined) {
      this.loadData();
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '自费缴费',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }
  // componentWillReceiveProps(props) {
  //   if (props.base.currProfile !== this.props.base.currProfile) {
  //     this.loadData();
  //   }
  // }
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
    Toast.loading('正在处理...');
    this.props.dispatch({
      type: 'paymentRecord/prePay',
      payload: { groupNos: selectedItems },
    }).then(() => {
      // const { prePayData } = this.props.paymentRecord;
      this.props.dispatch(routerRedux.push({
        pathname: 'PaymentRecordPrePay',
      }));
      Toast.hide();
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
    this.props.dispatch({
      type: 'paymentRecord/findUnpaidChargeList',
      payload: { query },
    });
  }
  renderBottomBar() {
    const { data } = this.props.paymentRecord;
    console.log('renderBottomBar:', data.length);
    if (data.length < 1) {
      return null;
    }
    return (
      <div className={classnames(styles.toolBar, styles.bottomBar)}>
        <Button type="primary" onClick={this.prePay} disabled={this.props.base.currProfile.type !== '1'}>自费结算</Button>
      </div>
    );
  }
  render() {
    const convertedData = [];
    const { data, isLoading } = this.props.paymentRecord;
    const { selectedItems } = this.state;
    const { currProfile } = this.props.base;
    let content = {};
    if (currProfile.type !== '1') {
      content = (<div className={commonStyles.emptyView}><Text>暂未开通非自费用户在线缴费服务</Text></div>);
    } else {
      if (isLoading) { return <ActivityIndicatorView />; }
      if (data.length > 0) {
        let lastGroupNo = '';
        let currentRecordItem = null;
        for (let idx = 0; idx < data.length; idx += 1) {
          // 新建处方项目
          if (lastGroupNo === '' || lastGroupNo !== data[idx].groupNo) {
            currentRecordItem = {};
            currentRecordItem.groupNo = data[idx].groupNo;
            currentRecordItem.items = [];
            convertedData.push(currentRecordItem);
            lastGroupNo = data[idx].groupNo;
          }
          const item = {};
          item.name = data[idx].name;
          item.num = data[idx].num;
          item.price = data[idx].price;
          item.cost = data[idx].cost;
          currentRecordItem.items.push(item);
        }
        content = (
          <div>
            <div style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '15px' }} >
              <Flex className={styles.header}>
                <Flex style={{ width: '15px', paddingBottom: '7px', align: 'start' }} />
                <Flex.Item style={{flex: 5, textAlign: 'left'}}>
                  项目
                </Flex.Item>
                <Flex.Item style={{flex: 2, textAlign: 'right'}}>
                  数量
                </Flex.Item>
                <Flex.Item style={{flex: 2, textAlign: 'right'}}>
                  单价
                </Flex.Item>
                <Flex.Item style={{flex: 2, textAlign: 'right'}}>
                  总价
                </Flex.Item>
              </Flex>
            </div>
            {convertedData.map(recordItem => (
              <div
                className={styles.itemContainer}
                key={recordItem.groupNo}
                onClick={this.onChange.bind(this, recordItem.groupNo)} >
                <Flex style={{ flexDirection: 'column', flex: 1 }}>
                  {
                    recordItem.items.map((detailItem, detailItemIndex) => (
                      <Flex key={detailItemIndex} className={styles.detailContent}>
                        <Flex.Item style={{ width: '15px' }}>&nbsp;
                          {
                            (detailItemIndex === 0) ? (<Icon
                              type={selectedItems.indexOf(recordItem.groupNo) > -1 ? 'check-square-o' : 'square-o'}
                              className={styles.icon}
                            />) : null
                          }
                        </Flex.Item>
                        <Flex.Item style={{ flex: 5, textAlign: 'left', fontWeight: 'bold' }}>
                          {detailItem.name}
                        </Flex.Item>
                        <Flex.Item style={{flex: 2, textAlign: 'right'}}>
                          {detailItem.num}
                        </Flex.Item>
                        <Flex.Item style={{flex: 2, textAlign: 'right'}}>
                          {filterMoney(detailItem.price)}
                        </Flex.Item>
                        <Flex.Item style={{flex: 2, textAlign: 'right'}}>
                          {filterMoney(detailItem.cost)}
                        </Flex.Item>
                      </Flex>
                    ))
                  }
                </Flex>
              </div>
              ))
            }
          </div>
        );
      } else {
        const emptyText = `暂无${currProfile.name}（卡号：${currProfile.no}）\n的待缴费信息！`;
        content = (<div className={commonStyles.emptyView}>{filterTextBreak(emptyText)}</div>);
      }
    }
    return (
      <div className={styles.container}>
        <div className={styles.listContainer}>
          { content }
          <WhiteSpace size="lg" />
          { this.renderBottomBar() }
        </div>
      </div>
    );
  }
}

export default connect(({ user, base, paymentRecord, payment }) => ({ user, base, paymentRecord, payment }))(PayDoctorAdvice);
