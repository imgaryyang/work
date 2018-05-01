import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import { ListView, PullToRefresh, Toast } from 'antd-mobile';
import style from './ReportMain.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import baseStyles from '../../utils/base.less';


class ReportMain extends React.Component {
  constructor(props) {
    super(props);
    this.loadCheckList = this.loadCheckList.bind(this);
    this.goback = this.goback.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '报告查询',
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
      this.loadCheckList(currProfile);
    }
  }

  // componentWillReceiveProps(props) {
  //   // console.log('currProfile====', props.base.currProfile);
  //   if (props.base.currProfile !== this.props.base.currProfile) {
  //     this.loadCheckList(props.base.currProfile);
  //   }
  // }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'report/setState',
      payload: { data: [] },
    });
  }

  loadCheckList(item) {
    // console.log('loadCheckList====', item);
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(365, 'days').format('YYYY-MM-DD');
    const query = { proNo: item.no, hosNo: this.props.base.currHospital.no, startDate, endDate };
    this.props.dispatch({
      type: 'report/loadReport',
      payload: query,
    });
  }
  goback() {
    this.props.dispatch(routerRedux.goBack());
  }
  refresh() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadCheckList(currProfile);
    }
  }
  showDetail(data) {
    // console.log('showDetail====', data);
    if (data.testType === '0001') {
      // const query = { testId: data.barcode };
      const { testDetail } = data;
      this.props.dispatch({
        type: 'report/setState',
        payload: {
          rowData: data,
          detail: testDetail,
        },
      });
      // this.props.dispatch({
      //   type: 'report/loadReportDetail',
      //   payload: query,
      // });
      this.props.dispatch(routerRedux.push({
        pathname: 'reportDetail',
      }));
    } else if (data.testType === '0002') {
      if (data.detailUrl.indexOf('http') === -1) {
        Toast.info('未找到对应的已报告检查信息', 1);
        return;
      }
      this.props.dispatch({
        type: 'report/setState',
        payload: { rowData: data },
      });
      // 调用pacs系统提供的链接
      this.props.dispatch(routerRedux.push({
        pathname: 'reportPacsLink',
        state: data,
      }));
    }
  }

  render() {
    const { data, dataSource, height, isLoading, refreshing } = this.props.report;
    const { currProfile } = this.props.base;
    if (isLoading) { return <ActivityIndicatorView />; }
    if (!currProfile.id) {
      return (
        <div className={baseStyles.emptyViewContainer}>
          <div className={baseStyles.emptyView}>请先选择就诊人！</div>
        </div>
      );
    }
    const result = dataSource.cloneWithRowsAndSections(data).sectionIdentities;
    if (result.length === 0) {
      return (
        <div className={baseStyles.emptyViewContainer}>
          <div className={baseStyles.emptyView}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的检查、特检信息！`}</div>
        </div>
      );
    }
    const row = (rowData) => {
      const rowLogo = rowData.pkgName === '特检' ? (<div className={style['rowLogoRed']}> {rowData.pkgName}</div>) : (<div className={style['rowLogo']}> {rowData.pkgName}</div>);
      return (
        <div className={style['rowContainer']} onClick={this.showDetail.bind(this, rowData)}>
          {rowLogo}
          <div className={style['rowContent']} >
            <div className={style['reportDate']}>{rowData.reportTime ? rowData.reportTime : '暂无日期'}</div>
            <div className={style['reportName']}>{rowData.itemName ? rowData.itemName : '暂无项目名称'}</div>
          </div>
        </div>
      );
    };
    // const separator = () => {
    //   return (<div className={style['separatorLine']} />);
    // };
    const sectionHeader = (sectionData, sectionId) => {
      const checkDate = sectionId;
      // const weekday = `周${'日一二三四五六'.charAt(moment(checkDate, 'YYYY-MM-DD').day())}`;
      const size = sectionData.length;
      return (
        <div className={style['section']}>
          {checkDate} {/*&thinsp;{weekday} */}&thinsp;{size}个报告
        </div>
      );
    };
    return (
      <div className={style['container']}>
        <ListView
          ref={(el) => { this.lv = el; }}
          dataSource={dataSource.cloneWithRowsAndSections(data)}
          renderSectionHeader={sectionHeader}
          renderRow={row}
          style={{
            height,
          }}
          pageSize={10}
          // onScroll={() => { console.log('scroll'); }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
          // 下拉刷新
          pullToRefresh={
            <PullToRefresh
              refreshing={refreshing}
              onRefresh={this.refresh}
              style={{
                borderBottomWidth: 0,
              }}
            />
          }
        />
      </div>
    );
  }
}
// scrollRenderAheadDistance={500}
ReportMain.propTypes = {
};
export default connect(({ report, base }) => ({ report, base }))(ReportMain);
