/**
 * 门急诊医生站
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import moment from 'moment';
import ReceptionMain from './reception/ReceptionMain';
import TreatMain from './OdwsTreatMain';

import styles from './Odws.less';

/**
 * 判断日期是否当天
 */
function isToday(date) {
  return moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
}

const TabPane = Tabs.TabPane;

class OdwsMain extends Component {

  constructor() {
    super();
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['REG_LEVEL', 'REG_STATE', 'FEE_TYPE', 'SEX', 'BOOLEAN', 'USAGE',
        'CARD_FLAG', 'CARD_TYPE', 'GROUP_TYPE', 'ORDER_STATE', 'INFECTIOUS_DISEASE', 'MEDICAL_RECORDS_TYPE'],
    });

    this.props.dispatch({
      type: 'odws/setState',
      payload: { odwsWsHeight: this.props.base.wsHeight - 37 - 17 - 6 },
    });
  }

  onTabClick(key) {
    this.props.dispatch({
      type: 'odws/setState',
      payload: {
        currTabKey: key,
      },
    });
  }

  render() {
    const { odws, utils, odwsOrder } = this.props;
    const { currentReg, currTabKey } = odws;
    const { totalAmt } = odwsOrder;

    const tabText = currentReg.id && currentReg.regState === '30' && isToday(currentReg.regTime) ? '正在就诊' : '正在查看';

    // 组合当前就诊人信息
    const cost = currentReg.id && currentReg.regState === '30' && isToday(currentReg.regTime) ? ` | 本次就诊费用：${totalAmt.formatMoney()} 元` : '';
    // console.log('currentReg:', currentReg);
    
    /*const infectiousDisease = (
    		<div style={{color:'red'}}>
    		{(currentReg.patient.infectiousDisease ? '(传染病：' + utils.dicts.dis('INFECTIOUS_DISEASE', currentReg.patient.infectiousDisease) + ')' : '')}
    		</div>
    		); */
    
    const patientInfo = (
      <div className={styles.patientInfoContainer} >
        {currentReg && currentReg.id ? (
          `${tabText}：${currentReg.patient.name
          } ${
            utils.dicts.dis('SEX', currentReg.patient.sex)
          } ${
            currentReg.patient.birthday==null?" ":moment().diff(moment(currentReg.patient.birthday), 'years')
          }岁 ${
            utils.dicts.dis('FEE_TYPE', currentReg.feeType) 
          }结算${cost}`
        ) : ''}
        <font style={{color: '#f04134'}}> {currentReg && currentReg.id ? (currentReg.patient.infectiousDisease ? '| ' + utils.dicts.dis('INFECTIOUS_DISEASE', currentReg.patient.infectiousDisease) : '') : ''}</font>
      </div>
    );

    const disabled = !(typeof currentReg !== 'undefined' && typeof currentReg.id !== 'undefined');

    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }} >
        <Tabs
          activeKey={currTabKey}
          onTabClick={this.onTabClick}
          animated={false}
          tabBarExtraContent={patientInfo}
        >
          <TabPane tab="接诊列表" key="1" className={styles.tabPane} >
            <ReceptionMain />
          </TabPane>
          <TabPane tab={tabText} key="2" className={styles.tabPane} disabled={disabled} >
            <TreatMain />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(
  ({ odws, odwsOrder, base, utils }) => ({ odws, odwsOrder, base, utils }),
)(OdwsMain);

