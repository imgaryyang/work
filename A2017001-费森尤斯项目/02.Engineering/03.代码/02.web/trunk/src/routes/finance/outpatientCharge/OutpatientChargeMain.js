import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, notification, Card, Tabs } from 'antd';
import SearchBarTop from './SearchBarTop';
import SearchBarFoot from './SearchBarFoot';
import List from './OutpatientChargeList';
import PatientList from './PatientList';
import PricCharge from './PricChargeMain';

const TabPane = Tabs.TabPane;
class OutpatientChargeMain extends Component {

  state = {
    tab: '',
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['UNIT',
        'DRUG_TYPE',
        'PRICE_CASE',
        'DRUG_QUALITY',
        'COMPANY_TYPE',
        'DOSAGE',
        'USAGE',
        'MI_GRADE',
        'DEPT_TYPE',
        'REG_LEVEL',
        'SEX',
      ],
    });

    this.props.dispatch({
      type: 'utils/initDepts',
      payload: ['004', '005'],
    });
    this.props.dispatch({
      type: 'outpatientCharge/getCurrentInvoice',
      invoiceType: { invoiceType: '2' },
    });

    this.props.dispatch({
      type: 'outpatientCharge/loadItemTemplate',
    });

    this.props.dispatch({
      type: 'outpatientCharge/getRecipeId',
    });
  }
  changetab(e) {
    if (this.state.tab) {
      this.props.dispatch({
        type: 'outpatientCharge/setState',
        payload: { tabName: e },
      });
    } else {
      notification.info({ message: '提示信息：', description: '请先填写病人信息，再进行划价！' });
    }
  }
  render() {
    const { dispatch } = this.props;
    const { data, page, spin, itemData, itemInfo, recipeList, totCost, invoiceUse, pdata, record, userInfo, tmpItem, itemCost, tabName, isCheckBox } = this.props.outpatientCharge;
    const { dicts, depts } = this.props.utils;
    const { wsHeight } = this.props.base;
    if (userInfo && userInfo.regId) {
      this.state.tab = true;
    } else {
      this.state.tab = false;
    }

    const searchBarProps = {
      userInfo,
      invoiceUse,
      data,
      isCheckBox,
      dispatch,
      totCost,
      recipeList,
      onAdd() {
        if (userInfo && userInfo.regId) {
          dispatch({
            type: 'outpatientCharge/setState',
            payload: { tabName: 'pricCharge' },
          });
        } else {
          notification.info({ message: '提示信息：', description: '请先填写病人信息，再进行划价！' });
        }
      },
      onSubCharge() {
        if (invoiceUse) {
          if (data && data.length > 0) {
            dispatch({
              type: 'outpatientCharge/submitCharge',
              subData: data,
            });
          } else {
            notification.error({ message: '提示信息：', description: '您目前没有需要结账的数据！' });
          }
        } else {
          notification.error({ message: '提示信息：', description: '没有可用发票号，请检查！' });
        }
      },
    };

    const listProps = {
      data,
      dicts,
      dispatch,
    };
    const patientListProps = {
      pdata,
      page,
      dicts,
      depts,
      dispatch,
    };

    const pricChargeProps = {
      userInfo,
      dicts,
      depts,
      itemData,
      tmpItem,
      itemInfo,
      record,
      itemCost,
      dispatch: this.props.dispatch,
      subItem() {
        if (itemData && itemData.length > 0) {
          dispatch({
            type: 'outpatientCharge/subItem',
            subData: itemData,
          });
        } else {
          notification.info({ message: '提示信息：', description: '您目前没有需要保存的数据！' });
        }
      },
    };
    const leftCardHeight = wsHeight - 6 - 53;

    /* let high = wsHeight - 184 - 30 - 80 - (5 * 5);
    if (!(recipeList && recipeList.length > 0)) {
      high += 83;
    }*/
    const height = leftCardHeight - 135 - 43;

    return (
      <Spin spinning={spin}>
        <Row>
          {/* <Tabs onChange={this.changetab.bind(this)} activeKey={tabName === '' ? 'outpatient' : tabName} className="compact-tab" >
            <TabPane tab={'门诊收费'} key={'outpatient'} >
            */}
          <Col span={6} style={{ padding: '3px', paddingRight: '5px' }}>
            <Card style={{ height: `${leftCardHeight}px` }} className="card-padding-5" >
              <PatientList innerHeight={leftCardHeight - 5} {...patientListProps} />
            </Card>
          </Col>
          <Col span={18} style={{ padding: '3px', paddingLeft: '5px' }} >
            <Card className="card-padding-5" >
              <SearchBarTop {...searchBarProps} />
            </Card>
            <Card style={{ marginTop: '10px', height: `${height}px` }} className="card-padding-5" >
              <List innerHeight={height - 6} {...listProps} />
            </Card>
            <SearchBarFoot {...searchBarProps} />
          </Col>
          {/* </TabPane>
        <TabPane tab={'划价'} key={'pricCharge'} >
          <PricCharge {...pricChargeProps} />
        </TabPane>
      </Tabs>*/}
        </Row>
      </Spin>
    );
  }
}

export default connect(
  ({ outpatientCharge, utils, base }) => ({ outpatientCharge, utils, base }),
)(OutpatientChargeMain);
