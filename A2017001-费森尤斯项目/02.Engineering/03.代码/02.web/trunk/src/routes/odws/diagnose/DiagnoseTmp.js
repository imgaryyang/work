/**
 * 诊断模板
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Input, Icon, notification } from 'antd';

import styles from './Diagnose.less';

class DiagnoseTmp extends Component {

  constructor(props) {
    super(props);
    this.searchDiagnosis = this.searchDiagnosis.bind(this);
    this.clearSearchCode = this.clearSearchCode.bind(this);
    this.chooseTmp = this.chooseTmp.bind(this);
  }

  state = {
    searchCode: '',
  };

  componentWillMount() {
  }

  chooseTmp(diagnose) {
    const dis = this.props.odwsDiagnose.diagnosis;
    if (dis && dis.length > 0) {
      for (const item of dis) {
        if (item.diseaseId === diagnose[0]) {
          notification.info({
            message: '提示',
            description: '诊断已存在！',
          });
          return;
        }
      }
    }
    this.props.dispatch({
      type: 'odwsDiagnose/saveDiagnose',
      payload: {
        diagnosisCode: diagnose[0],
        diagnosisName: diagnose[1],
        regId: this.props.odws.currentReg.id,
        iscurrent: this.props.odwsDiagnose.diagnosis.length === 0 ? '1' : '0',
        sortNo: this.props.odwsDiagnose.diagnosis.length + 1,
      },
    });
  }

  searchDiagnosis(e) {
    this.setState({ searchCode: e.target.value });
  }

  clearSearchCode() {
    this.setState({ searchCode: '' });
  }

  render() {
    const { odws, odwsDiagnose } = this.props;
    const { odwsWsHeight } = odws;
    const { topDiagnosis } = odwsDiagnose;
    return (
      <Card style={{ height: `${odwsWsHeight - 6}px` }} className={styles.tmpCard} >
        <div className={styles.topDiagnosisTitle} >
          <Input
            placeholder="搜索常用诊断"
            maxLength={10}
            onChange={this.searchDiagnosis}
            value={this.state.searchCode}
            addonAfter={(<div onClick={this.clearSearchCode} ><Icon type="close" /></div>)}
          />
        </div>
        <div style={{ height: `${odwsWsHeight - 6 - 10 - 50}px`, overflow: 'auto' }}>
          {
            topDiagnosis.map((diagnose, idx) => {
              const searchCode = this.state.searchCode;
              if (searchCode === '' || (searchCode !== '' && (diagnose[2].indexOf(searchCode.toUpperCase()) > 0 || diagnose[3].indexOf(searchCode.toUpperCase()) > 0))) {
                return (
                  <div key={`DIAGNOSIS_TMP${idx}`} className={styles.tmpItem} onClick={() => this.chooseTmp(diagnose)} >
                    <font>{diagnose[0]}</font>
                    <span>{diagnose[1]}</span>
                    <li>{diagnose[4]}</li>
                  </div>
                );
              } else {
                return null;
              }
            })
          }
        </div>
      </Card>
    );
  }
}

export default connect(
  ({ odws, odwsDiagnose, base }) => ({ odws, odwsDiagnose, base }),
)(DiagnoseTmp);

