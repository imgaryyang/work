import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { ListView, Flex, Button, PullToRefresh, WhiteSpace } from 'antd-mobile';
import moment from 'moment';
import style from './PaymentMain.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import { filterMoney } from '../../utils/Filters';
import baseStyles from '../../utils/base.less';

class ConsumeRecordList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '就诊卡扣款记录查询',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }
  componentDidMount() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadData(currProfile);
    }
  }
  refresh() {
    const { currProfile } = this.props.base;
    // 列表
    this.loadData(currProfile);
  }

  loadData(profile) {
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    const query = { proNo: profile.no, hosNo: profile.hosNo, startDate, endDate };
    this.props.dispatch({
      type: 'paymentRecord/loadConsumeRecords',
      payload: query,
    });
  }
  render() {
    const { consumeRecordsData, dataSource, preStore, height, isLoading, refreshing } = this.props.paymentRecord;
    const { currProfile } = this.props.base;
    // console.log('tab111====render=====preStore===', preStore.balance);
    const balance = preStore.balance ? filterMoney(preStore.balance) : filterMoney(0);
    if (isLoading) { return <ActivityIndicatorView />; }
    if (!currProfile.id) {
      return (
        <div className={baseStyles.emptyViewContainer}>
          <div className={baseStyles.emptyView}>请先选择就诊人！
            <Button
              type="ghost"
              inline
              style={{ marginTop: 10, width: 200 }}
              onClick={() => this.props.dispatch(routerRedux.push({ pathname: 'choosePatient' }))}
            >选择就诊人
            </Button>
          </div>
        </div>
      );
    }

    if (consumeRecordsData.length === 0) {
      return (
        <div className={baseStyles.emptyViewContainer}>
          <Flex direction="row" align="start" className={style['firstLine']} style={{ height: 40 }}>
            <div className={style['title']} >可用余额:</div>
            <div className={style['content']}>{balance}</div>
          </Flex>
          <div className={baseStyles.emptyView} style={{ marginTop: 0 }}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的缴费信息！`}</div>
        </div>
      );
    }

    const row = (rowData, idx) => {
      // console.log('rowData=====', rowData);
      // let type = '';
      // if (rowData.type === '1') {
      //   type = '挂号';
      // } else if (rowData.type === '2') {
      //   type = '门诊收费';
      // } else if (rowData.type === '3') {
      //   type = '体检收费';
      // } else if (rowData.type === '4') {
      //   type = '医院授权透支冲账';
      // } else {
      //   type = '其他';
      // }
      // if (rowData.type === '1') {
      //   type = '药品';
      // } else if (rowData.type === '2') {
      //   type = '诊疗';
      // } else {
      //   type = '其他';
      // }
      return (
        <div key={idx} className={style['rowContainer']} >
          <Flex direction="column" align="start" className={style['rowLeft']} >
            <div className={style['recipeTime']}>{rowData.chargeTime ? moment(rowData.chargeTime).format('YYYY-MM-DD HH:mm') : '暂无日期' }</div>
            <WhiteSpace size="md" />
            <div className={style['name']}>{rowData.name}</div>
          </Flex>
          <Flex direction="column" align="end" className={style['rowRight']} >
            <div className={style['cost']}>{filterMoney(rowData.realAmount)}</div>
          </Flex>
        </div>
      );
    };
    const separator = () => {
      return (<div className={style['separator']} />);
    };
    // console.log(this.props.paymentRecord.data);

    return (
      <div className={style['tabPane']}>
        {/*<Flex direction="row" align="start" className={style['firstLine']} style={{ height: 40 }}>*/}
          {/*<div className={style['title']} >可用余额:</div>*/}
          {/*<div className={style['content']}>{balance}</div>*/}
        {/*</Flex>*/}
        <ListView
          ref={(el) => { this.lv = el; }}
          dataSource={dataSource.cloneWithRows(consumeRecordsData)}
          renderSeparator={separator}
          renderRow={row}
          style={{
            height,
            overflow: 'auto',
          }}
          pageSize={10}
          onScroll={() => { console.log('scroll'); }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
          // 下拉刷新
          pullToRefresh={<PullToRefresh
            refreshing={refreshing}
            onRefresh={this.refresh}
            style={{
              borderBottomWidth: 0,
            }}
          />}
        />
      </div>
    );
  }
}

ConsumeRecordList.propTypes = {
};
export default connect(({ paymentRecord, base }) => ({ paymentRecord, base }))(ConsumeRecordList);

