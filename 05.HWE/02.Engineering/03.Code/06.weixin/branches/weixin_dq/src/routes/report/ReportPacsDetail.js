import React from 'react';
import { connect } from 'dva';
import Icon from '../../components/FAIcon';
import styles from './ReportPacsDetail.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import { Toast } from 'antd-mobile/lib/index';
import commonStyles from '../../utils/common.less';
import FAIcon from '../../components/FAIcon';

class ReportPacsDetail extends React.Component {

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    const { rowData } = this.props.report;

    dispatch({
      type: 'base/save',
      payload: {
        title: '特检详情',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div
              onClick={this.refresh}
              className={commonStyles.navBtnContainer}
            >
              <FAIcon type="refresh" className={commonStyles.navBtnIcon} />
              <div className={commonStyles.navBtnText}>刷新</div>
            </div>
          </div>
        ),
      },
    });
  }

  refresh() {
    const rowData = this.props.report.rowData;
    const query = { barCode: rowData.barcode, };
    this.props.dispatch({
      type: 'report/loadPacsDetail',
      payload: query,
    });
  }

  render() {
    const { rowData, isLoading } = this.props.report;
    // console.log("rowData======",rowData);
    if (isLoading) { return <ActivityIndicatorView />; }
    return (
      <div className={styles['allContainer']}>
        {rowData.length === 0 ? (<div style={{ padding: 30, textAlign: 'center', color: '#999999' }}>暂无特检结果信息</div>) : null}
        <div className={styles['title']}>检查项目：{rowData.name}</div>
        <div className={styles['content']}>检查类型：{rowData.type}</div>
        <div className={styles['content']}>检查时间：{rowData.checkTime}</div>
        <div className={styles['content']}>检查部位：{rowData.part}</div>
        <div className={styles['separator']} />
        <div className={styles['title']}>检查所见</div>
        <div className={styles['content']}>{rowData.see}</div>
        <div className={styles['separator']} />
        <div className={styles['title']}>诊断结果</div>
        <div className={styles['content']}>{rowData.result}</div>
        <div styles={{ height: 40 }} />
      </div>
    );
  }
}
ReportPacsDetail.propTypes = {
};
export default connect(({ report, base }) => ({ report, base }))(ReportPacsDetail);

