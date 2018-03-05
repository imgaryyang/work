import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import { NavBar, ListView, Icon } from 'antd-mobile';
import ProfileList from '../patients/ProfileList';
import style from './ReportMain.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';

class ReportMain extends React.Component {
  constructor(props) {
    super(props);
    this.loadCheckList = this.loadCheckList.bind(this);
    this.goback = this.goback.bind(this);
  }
  componentWillMount() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadCheckList(currProfile);
    }
  }
  loadCheckList(item) {
    const query = { proNo: item.no, hosNo: this.props.base.currHospital.no };
    this.props.dispatch({
      type: 'report/loadReport',
      payload: query,
    });
  }
  goback() {
    this.props.dispatch(routerRedux.goBack());
  }
  showDetail(data) {
    const query = { testId: data.barcode };
    this.props.dispatch({
      type: 'report/setState',
      payload: { rowData: data },
    });
    this.props.dispatch({
      type: 'report/loadReportDetail',
      payload: query,
    });
    this.props.dispatch(routerRedux.push({
      pathname: 'reportDetail',
    }));
  }

  render() {
    const { data, dataSource, height, isLoading } = this.props.report;
    if (isLoading) { return <ActivityIndicatorView />; }
    const row = (rowData) => {
      return (<div onClick={this.showDetail.bind(this, rowData)}>
        <div className={style['container']}>
          <div className={style['logo']}> 化验</div>
          <div className={style['content']} >
            <div className={style['date']}>{rowData.reportTime}</div>
            <div className={style['name']}>{rowData.itemName}</div>
          </div>
        </div>
      </div>);
    };
    const sectionHeader = (sectionData, sectionId) => {
      const checkDate = sectionId;
      const weekday = `周${'日一二三四五六'.charAt(moment(checkDate, 'YYYY-MM-DD').day())}`;
      const size = sectionData.length;
      return (
        <div className={style['section']}>
          <div style={{ height: 6, backgroundColor: '#F5F5F9' }} />
          <div className={style['header']}>
            {checkDate} &thinsp;{weekday} &thinsp;{size}个报告
          </div>
        </div>
      );
    };

    return (<div>
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => this.goback()}
      > 报告单查询
      </NavBar>
      <div className={style['profile']}><ProfileList callback={this.loadCheckList} /></div>
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource.cloneWithRowsAndSections(data)}
        renderSectionHeader={sectionHeader}
       /* renderFooter={() => (
          <div style={{ padding: 30, textAlign: 'center' }}>
            { isLoading ? '正在加载数据，请稍候...' : '所有数据加载完成' }
          </div>
        )}*/
        renderRow={row}
        style={{
          height,
          overflow: 'auto',
        }}
        pageSize={4}
        onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    </div>
    );
  }
}
ReportMain.propTypes = {
};
export default connect(({ report, base }) => ({ report, base }))(ReportMain);
