import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { ListView, Flex, Toast } from 'antd-mobile';

import style from './RecordDetail.less';
import { colors } from '../../utils/common';
import baseStyles from '../../utils/base.less';
import FAIcon from '../../components/FAIcon';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';

class RecordDetail extends React.Component {
  constructor(props) {
    super(props);
    this.showDetail = this.showDetail.bind(this);
    this.goback = this.goback.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '诊疗详情',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div
              onClick={this.refresh}
              className={baseStyles.navBtnContainer}
            >
              <FAIcon type="refresh" className={baseStyles.navBtnIcon} />
              <div className={baseStyles.navBtnText}>刷新</div>
            </div>
          </div>
        ),
      },
    });
  }

  goback() {
    this.props.dispatch(routerRedux.goBack());
  }
  refresh() {
    const query = this.props.record.rowData;
    this.props.dispatch({
      type: 'record/loadRecordDetail',
      payload: query,
    });
  }
  showDetail(data) {
    // console.log('showDetail====', data);
    if (data.testType === '0001') {
      const { testDetail } = data;
      // const query = { testId: data.barcode };
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
      // console.log('pac', data);
      if (data.detailUrl.indexOf('http') === -1) {
        Toast.info('未找到对应的已报告检查信息', 1);
        return;
      }
      this.props.dispatch({
        type: 'report/setState',
        payload: { rowData: data },
      });
      this.props.dispatch(routerRedux.push({
        pathname: 'reportPacsLink',
        state: data,
      }));
    }
  }
  render() {
    const { diagnoseDataSource, diagnoses, drugDataSource, drugs, testDataSource, tests, isLoading, rowData } = this.props.record;
    if (isLoading) { return <ActivityIndicatorView />; }
    const diagnoses_length = diagnoses && diagnoses.length ? diagnoses.length : 1;
    const drugs_length = drugs && drugs.length ? drugs.length : 1;
    const tests_length = tests && tests.length ? tests.length : 1;
    const diagnosesLength = diagnoses_length * 110;
    const drugLength = drugs_length * 71;
    const testLength = tests_length * 57;
    // console.log('diagnoseRowData', diagnoses);
    const diagRow = (diagnoseRowData, idx) => {
      // const borderTop = idx !== 0 ? { borderTop: `1px solid ${colors.LINE}` } : {};
      const borderBottom = idx !== diagnoses.length - 1 ? { borderBottom: `1px solid ${colors.LINE}` } : {};
      return (
        <div key={idx} style={{ ...borderBottom, borderTopWidth: 0 }}>
          <div className={style['separator5']} />
          <Flex direction="column" align="start" className={style['diagRowContainer']}>
            <Flex direction="row" align="start" className={style['diagRow']}>
              <div className={style['diagRowTitle']} >诊&thinsp;&thinsp;&thinsp;&thinsp;断:</div>
              <div className={style['diagRowContent']}> {diagnoseRowData.diseaseName}</div>
            </Flex>
            <Flex direction="row" align="start" className={style['diagRow']}>
              <div className={style['diagRowTitle']} >时&thinsp;&thinsp;&thinsp;&thinsp;间:</div>
              <div className={style['diagRowContent']}> {diagnoseRowData.diseaseTime}</div>
            </Flex>
            <Flex direction="row" align="start" className={style['diagRow']}>
              <div className={style['diagRowTitle']} >医&thinsp;&thinsp;&thinsp;&thinsp;生:</div>
              <div className={style['diagRowContent']}> {rowData.docName ? rowData.docName : ''}</div>
            </Flex>
            <Flex direction="row" align="start" className={style['diagRow']}>
              <div className={style['diagRowTitle']} >科&thinsp;&thinsp;&thinsp;&thinsp;室:</div>
              <div className={style['diagRowContent']}> {rowData.depName ? rowData.depName : ''}</div>
            </Flex>
            {/* <Flex direction="row" align="start" className={style['diagRow']}>
              <div className={style['diagRowTitle']} >主要诊断:</div>
              <div className={style['diagRowContent']}> {diagnoseRowData.diseaseName}</div>
            </Flex>*/}
            {/* <Flex direction="row" align="start" className={style['diagRow']}>
              <div className={style['diagRowTitle']} >病&thinsp;&thinsp;&thinsp;&thinsp;史:</div>
              <div className={style['diagRowContent']}> {diagnoseRowData.diseaseType ? '无' : '无'}</div>
            </Flex>*/}
          </Flex>
          <div className={style['separator5']} />
        </div>
      );
    };
    const drugRow = (drugRowData, idx) => {
      // const borderTop = idx !== 0 ? { borderTop: `1px solid ${colors.LINE}` } : {};
      const borderBottom = idx !== drugs.length - 1 ? { borderBottom: `1px solid ${colors.LINE}` } : {};
      // console.log('drugRowData====', drugRowData);
      return (
        <div key={idx} style={{ ...borderBottom, borderTopWidth: 0 }}>
          <div className={style['separator5']} />
          <Flex direction="column" align="start" className={style['drugRowContainer']}>
            <Flex direction="row" align="start" className={style['diagRow']}>
              <div className={style['drugName']} > {drugRowData.name}</div>
              <div className={style['drugBarcode']} > {drugRowData.barcode}</div>
            </Flex>
            <Flex direction="row" align="start" className={style['diagRow']}>
              {/* <div className={style['drugTitle']} >剂量：</div>*/}
              {/* <div className={style['drugDesc']} >{drugRowData.dose}</div>*/}
              <div className={style['drugTitle']}> 频率：</div>
              <div className={style['drugDesc']}> {drugRowData.frequency}</div>
              <div className={style['drugTitle']}> 用法：</div>
              <div className={style['drugDesc']}> {drugRowData.way}</div>
            </Flex>
            <Flex direction="row" align="start" className={style['diagRow']}>
              <div className={style['drugTitle']} >备注:</div>
              <div className={style['drugDesc']}> {drugRowData.specialWay ? drugRowData.specialWay : '暂无'}</div>
            </Flex>
          </Flex>
          <div className={style['separator5']} />
        </div>
      );
    };
    const testRow = (testRowData, idx) => {
      // const borderTop = idx !== 0 ? { borderTop: `1px solid ${colors.LINE}` } : {};
      const borderBottom = idx !== tests.length - 1 ? { borderBottom: `1px solid ${colors.LINE}` } : {};
      const rowLogo = testRowData.pkgName === '特检' ? (<div className={style['rowLogoRed']}> {testRowData.pkgName}</div>) : (<div className={style['rowLogo']}> {testRowData.pkgName}</div>);
      return (
        <div key={idx} style={{ ...borderBottom, borderTopWidth: 0 }} onClick={this.showDetail.bind(this, testRowData)} >
          <div className={style['separator5']} />
          <Flex direction="row" align="start" className={style['testRowContainer']}>
            <Flex direction="column" align="start" className={style['testRowLogo']}>
              {rowLogo}
            </Flex>
            <Flex direction="column" align="start" className={style['testContent']}>
              <div className={style['reportDate']}>{testRowData.reportTime}</div>
              <div className={style['reportName']}>{testRowData.itemName}</div>
            </Flex>
          </Flex>
          <div className={style['separator5']} />
        </div>
      );
    };

    // <div className={style2['testRowContainer']} onClick={this.showDetail.bind(this, testRowData)} style={{ ...borderBottom }}>
    // {rowLogo}
    // <div className={style2['rowContent']} >
    //   <div className={style2['reportDate']}>{testRowData.reportTime}</div>
    //   <div className={style2['reportName']}>{testRowData.itemName}</div>
    // </div>
    // </div>
    return (
      <div className={style['allContainer']}>
        <div className={style['listTitle']}>诊断详情</div>
        {diagnoses.length === 0 ? (<div style={{ padding: 10, textAlign: 'center', color: '#999999' }}>暂无符合查询条件的诊断信息</div>) : null}
        <ListView
          ref={(el) => { this.lv = el; }}
          dataSource={diagnoseDataSource.cloneWithRows(diagnoses)}
          // renderSeparator={separator}
          renderRow={diagRow}
          style={{
            height: diagnosesLength,
            overflow: 'auto',
          }}
          pageSize={10}
          // onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <div className={style['separator']} />
        <div className={style['listTitle']}>药物医嘱</div>
        {drugs.length === 0 ? (<div style={{ padding: 10, textAlign: 'center', color: '#999999' }}>暂无符合查询条件的药品信息</div>) : null}
        <ListView
          ref={(el) => { this.drugLv = el; }}
          dataSource={drugDataSource.cloneWithRows(drugs)}
          renderRow={drugRow}
          style={{
            height: drugLength,
            overflow: 'auto',
          }}
          pageSize={4}
          // onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <div className={style['separator']} />
        <div className={style['listTitle']}>化验医嘱</div>
        {tests.length === 0 ? (<div style={{ padding: 10, textAlign: 'center', color: '#999999' }}>暂无符合查询条件的化验信息</div>) : null}
        <ListView
          ref={(el) => { this.testLv = el; }}
          dataSource={testDataSource.cloneWithRows(tests)}
          // renderSeparator={separatorLine}
          renderRow={testRow}
          style={{
            height: testLength,
            overflow: 'auto',
          }}
          pageSize={4}
          // onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <div style={{ height: 40 }} />
      </div>
    );
  }
}
RecordDetail.propTypes = {
};
export default connect(({ base, report, record }) => ({ base, report, record }))(RecordDetail);

