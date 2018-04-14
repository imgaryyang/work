import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { ListView, Flex, Button } from 'antd-mobile';
import moment from 'moment';
import style from './PaymentMain.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import commonStyles from '../../utils/common.less';
import { filterMoney } from '../../utils/Filters';

class PreRecordsList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '消费记录',
        hideNavBarBottomLine: true,
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

  // componentWillReceiveProps(props) {
  // if (props.base.currProfile !== this.props.base.currProfile) {
  //   this.loadCheckList(props.base.currProfile);
  // }
  // }

  loadData(profile) {
    // console.log('tab222==',profile.no);
    const query = { proNo: profile.no, hosNo: profile.hosNo };
    // console.info('query', query);
    this.props.dispatch({
      type: 'paymentRecord/loadPreRecords',
      payload: query,
    });
  }
  render() {
    const { preRecordsData, preStore, dataSource, height, isLoading } = this.props.paymentRecord;
    const { currProfile } = this.props.base;
    // console.log('tab222====render=====preStore===', preStore.balance);
    const balance = preStore.balance ? filterMoney(preStore.balance) : filterMoney(0);

    if (isLoading) { return <ActivityIndicatorView />; }
    if (!currProfile.id) {
      return (
        <div className={commonStyles.emptyViewContainer}>
          <div className={commonStyles.emptyView}>请先选择就诊人！
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

    if (preRecordsData.length === 0) {
      return (
        <div className={commonStyles.emptyViewContainer}>
          <Flex direction="row" align="start" className={style['firstLine']} style={{ height: 40 }}>
            <div className={style['title']} >可用余额:</div>
            <div className={style['content']}>{ balance }</div>
          </Flex>
          <div className={commonStyles.emptyView} style={{ marginTop: 0 }}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的缴费信息！`}</div>
        </div>
      );
    }
    const row = (rowData, idx) => {
      // console.log('rowData=====', rowData);
      let tradeChannel = '';
      if (rowData.tradeChannel === 'C') {
        tradeChannel = '现金';
      } else if (rowData.tradeChannel === 'Z') {
        tradeChannel = '支付宝';
      } else if (rowData.tradeChannel === 'W') {
        tradeChannel = '微信';
      } else if (rowData.tradeChannel === 'B') {
        tradeChannel = '银行';
      } else {
        tradeChannel = '其他';
      }
      return (
        <div key={idx} className={style['rowContainer']} >
          <Flex direction="column" align="start" className={style['rowLeft']} style={{ height: 40 }}>
            <div className={style['recipeTime']}>{rowData.tradeTime ? moment(rowData.tradeTime).format('YYYY-MM-DD hh:mm') : '暂无日期' }</div>
            <div className={style['name']}>{tradeChannel}</div>
          </Flex>
          <Flex direction="column" align="end" className={style['rowRight']} >
            <div className={style['cost']}>{filterMoney(rowData.amt)}</div>
          </Flex>
        </div>
      );
    };

    const separator = () => {
      return (<div className={style['separator']} />);
    };
    // console.log(this.props.paymentRecord.rowData);

    return (
      <div className={style['tabPane']}>
        <Flex direction="row" align="start" className={style['firstLine']} >
          <div className={style['title']} >可用余额:</div>
          <div className={style['content']}>{ balance }</div>
        </Flex>
        <ListView
          ref={(el) => { this.lv = el; }}
          dataSource={dataSource.cloneWithRows(preRecordsData)}
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
        />
      </div>
    );
  }
}

PreRecordsList.propTypes = {
};
export default connect(({ paymentRecord, base }) => ({ paymentRecord, base }))(PreRecordsList);