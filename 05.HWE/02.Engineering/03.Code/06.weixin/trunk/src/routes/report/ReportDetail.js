import React from 'react';
import { connect } from 'dva';
import { ListView, PullToRefresh } from 'antd-mobile';
import style from './ReportDetail.less';
import up from '../../assets/images/up.png';
import down from '../../assets/images/down.png';
import Config from '../../Config';
import commonStyles from '../../utils/common.less';
import { routerRedux } from 'dva/router';

class ReportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '检查详情',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }

  refresh() {
    const data = this.props.report.rowData;
    const query = { testId: data.barcode };
    // console.log('refresh====', query);
    this.props.dispatch({
      type: 'report/loadReportDetail',
      payload: query,
    });
  }
  render() {
    const { detail, dataSource, height, rowData, refreshing } = this.props.report;
    const currProfile = this.props.base.currProfile;
    let itemDesc = '';
    if (rowData.itemName === '血常规') {
      itemDesc = Config.LISDesc['bloodRT'];
    } else if (rowData.itemName === '肝功能检查') {
      itemDesc = Config.LISDesc['liverFunction'];
    } else if (rowData.itemName === '尿常规') {
      itemDesc = Config.LISDesc['UrineRT'];
    }
    if (detail.length === 0) {
      return (
        <div className={commonStyles.emptyViewContainer}>
          <div className={commonStyles.emptyView}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的检查明细信息！`}</div>
        </div>
      );
    }
    const row = (rowData) => {
      // console.log('rowData====', rowData);
      const color = rowData.flag === '0' ? 'black' : rowData.flag === '1' ? 'red' : '#6CD809';
      return (<div className={style['rowContainer']}>
        <div className={style['co1']}>
          <div className={style['co1Name']}>{rowData.subject}</div>
          <div className={style['co1Refer']}>参考值:{rowData.reference}</div>
        </div>
        <div className={color === 'black' ? style['co2Black'] : color === 'red' ? style['co2Red'] : style['co2Green']}>{rowData.result}</div>
        <div className={color === 'black' ? style['co2Black'] : color === 'red' ? style['co2Red'] : style['co2Green']} >
          {rowData.flag === '0' ? '正常' : rowData.flag === '1' ? (<img alt="" src={up} className={style['icon']} />) :
            (<img alt="" src={down} className={style['icon']} />)}
        </div>
      </div>);
    };
    const separator = () => {
      return (<div className={style['separator']} />);
    };
    return (
      <div className={style['allContainer']}>
        <div className={style['RTDescContainer']}>
          <div className={style['RTName']}>{rowData.itemName}</div>
          <div className={style['RTDesc']}>{itemDesc}</div>
        </div>
        <div className={style['separator1']} />
        <div className={style['headerContainer']}>
          <div className={style['headerName']}>项目</div>
          <div className={style['headerResult']}>结果</div>
          <div className={style['headerState']}>状态</div>
        </div>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource.cloneWithRows(detail)}
          renderSeparator={separator}
          renderRow={row}
          style={{
            height,
          overflow: 'auto',
        }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={10}
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
        <div style={{ height: 40 }} />
      </div>
    );
  }
}
ReportDetail.propTypes = {
};
export default connect(({ report, base }) => ({ report, base }))(ReportDetail);
