import React from 'react';
import { connect } from 'dva';
import { ListView, Flex } from 'antd-mobile';
import style from './RecordDetail.less';
import style2 from '../report/ReportMain.less';
import up from '../../assets/images/up.png';
import down from '../../assets/images/down.png';
import Config from '../../Config';
import { routerRedux } from 'dva/router';

class RecordDetail extends React.Component {
  constructor(props) {
    super(props);
    this.showDetail = this.showDetail.bind(this);
    this.goback = this.goback.bind(this);
  }
  componentWillUnmount() {
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
    const { diagnoseDataSource, diagnoses, drugDataSource, drugs, testDataSource, tests, height } = this.props.record;
    const diagnosesLength = diagnoses.length * (130 + 15);
    const drugLength = drugs.length * (80 + 15);
    const testLength = tests.length * (55 + 15);
    const diagRow = (diagnoseRowData) => {
      return (<div >
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
            <div className={style['diagRowContent']}> {diagnoseRowData.docName}</div>

          </Flex>
          <Flex direction="row" align="start" className={style['diagRow']}>
            <div className={style['diagRowTitle']} >病&thinsp;&thinsp;&thinsp;&thinsp;史:</div>
            <div className={style['diagRowContent']}> {diagnoseRowData.diseaseType ? '无' : '无'}</div>

          </Flex>
          <Flex direction="row" align="start" className={style['diagRow']}>
            <div className={style['diagRowTitle']} >科&thinsp;&thinsp;&thinsp;&thinsp;室:</div>
            <div className={style['diagRowContent']}> {diagnoseRowData.depName}</div>

          </Flex>
          <Flex direction="row" align="start" className={style['diagRow']}>
            <div className={style['diagRowTitle']} >主要诊断:</div>
            <div className={style['diagRowContent']}> {diagnoseRowData.isCurrent === '1' ? '是' : '否'}</div>
          </Flex>
        </Flex>
      </div>);
    };
    const drugRow = (drugRowData) => {
      // console.log('drugRowData====', drugRowData);
      return (<div className={style['drugRowContainer']}>
        <Flex direction="column" align="start" className={style['drugRowContainer']}>
          <Flex direction="row" align="start" className={style['diagRow']}>
            <div className={style['drugName']} > {drugRowData.name}{drugRowData.form ? ` ( ${drugRowData.form} )` : null}</div>
            <div className={style['drugBarcode']} > {drugRowData.barcode}</div>
          </Flex>
          <Flex direction="row" align="start" className={style['diagRow']}>
            <div className={style['drugTitle']} >计量：</div>
            <div className={style['drugDesc']} >{drugRowData.dose}</div>
            <div className={style['drugTitle']}> 频率：</div>
            <div className={style['drugDesc']}> {drugRowData.frequency}</div>
            <div className={style['drugTitle']}> 用法：</div>
            <div className={style['drugDesc']}> {drugRowData.unit}</div>
          </Flex>
          <Flex direction="row" align="start" className={style['diagRow']}>
            <div className={style['drugTitle']} >备注:</div>
            <div className={style['drugDesc']}> {drugRowData.desc}</div>
          </Flex>
        </Flex>
      </div>);
    };
    const testRow = (testRowData) => {
      // console.log('rowData====', testRowData);
      return (<div className={style2['rowContainer']} onClick={this.showDetail.bind(this, testRowData)}>
        <div className={style2['rowLogo']}> 化验</div>
        <div className={style2['rowContent']} >
          <div className={style2['reportDate']}>{testRowData.reportTime}</div>
          <div className={style2['reportName']}>{testRowData.itemName}</div>
        </div>
      </div>);
    };
    const separator = () => {
      return (<div className={style['separator']} />);
    };
    return (
      <div className={style['allContainer']}>
        <div className={style['listTitle']}>诊断详情</div>
        {diagnoses.length === 0 ? (<div style={{ padding: 30, textAlign: 'center', color: '#999999' }}>暂无符合查询条件的诊断信息</div>) : null}
        <ListView
          ref={el => this.lv = el}
          dataSource={diagnoseDataSource.cloneWithRows(diagnoses)}
          renderSeparator={separator}
          renderRow={diagRow}
          style={{
            height: diagnosesLength,
            overflow: 'auto',
          }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <div className={style['listTitle']}>药物医嘱</div>
        {drugs.length === 0 ? (<div style={{ padding: 30, textAlign: 'center', color: '#999999' }}>暂无符合查询条件的药品信息</div>) : null}
        <ListView
          ref={el => this.lv = el}
          dataSource={drugDataSource.cloneWithRows(drugs)}
          renderSeparator={separator}
          renderRow={drugRow}
          style={{
            height: drugLength,
            overflow: 'auto',
          }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <div className={style['listTitle']}>化验医嘱</div>
        {tests.length === 0 ? (<div style={{ padding: 30, textAlign: 'center', color: '#999999' }}>暂无符合查询条件的化验信息</div>) : null}
        <ListView
          ref={el => this.lv = el}
          dataSource={testDataSource.cloneWithRows(tests)}
          renderSeparator={separator}
          renderRow={testRow}
          style={{
            height: testLength,
            overflow: 'auto',
          }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
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
export default connect(({ report, record }) => ({ report, record }))(RecordDetail);

