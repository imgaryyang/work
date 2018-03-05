import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Tabs, Card, Row, Col, notification } from 'antd';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

import styles from './DrugDispense.less';

const TabPane = Tabs.TabPane;

class DrugFormulationItemList extends Component {

  constructor(props) {
    super(props);

    this.dispense = this.dispense.bind(this);
    this.print = this.print.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'drugDispense/load',
    });
  }

  dispense() {
    if (this.props.drugDispense.formulation.recipeId != null) {
      this.props.dispatch({
        type: 'drugDispense/dispense',
        recipeId: this.props.drugDispense.formulation.recipeId,
      });
    } else {
      notification.error({
        message: '提示',
        description: '请选中后再发药！',
      });
    }
  }

  /* print(type, regId) {
    console.log(type, regId);
    this.props.dispatch({
      type: 'print/getPrintInfo',
      payload: { code: type, bizId: regId },
    });
  }*/
  print(type, formulationSumItems) {
    for (let i = 0; i < formulationSumItems.length; i++) {
      if (formulationSumItems[i].order.usage != null || formulationSumItems[i].order.freqDesc != null) {
        const item = {};
        item.itemName = formulationSumItems[i].itemName;
        item.usage = this.props.utils.dicts.dis('USAGE', formulationSumItems[i].order.usage);
        item.freqDesc = formulationSumItems[i].order.freqDesc;
        // formulationSumItems[i].order.usage = this.props.utils.dicts.dis('USAGE', formulationSumItems[i].order.usage);
        this.props.dispatch({
          type: 'print/getPrint',
          payload: { code: type, printData: item },
        });
      }
    }
  }
  doPrint(formulationSumItems) {
    if (formulationSumItems.order.usage != null || formulationSumItems.order.freqDesc != null) {
      const item = {};
      item.itemName = formulationSumItems.itemName;
      item.usage = this.props.utils.dicts.dis('USAGE', formulationSumItems.order.usage);
      item.freqDesc = formulationSumItems.order.freqDesc;
      this.props.dispatch({
        type: 'print/getPrint',
        payload: { code: '116', printData: item },
      });
    } else {
      notification.info({
        message: '提示',
        description: '医生未填写用法，请参考药品说明书服用！',
      });
    }
  }

  render() {
    const { drugDispense, utils, base } = this.props;
    const { invoice, formulation, formulationItems } = drugDispense;
    const { wsHeight } = base;

    const formulationSumColumns = [
      /* {title:'医院id', dataIndex :'hosId', key:'hosId', },*/
      { title: '药品名称（规格）',
        dataIndex: 'itemName',
        key: 'itemName1',
        width: 122,
        render: (value, record) => {
          return `${value} (${record.specs || '-'})`;
        },
      },
      { title: '数量（单位）',
        dataIndex: 'packQty',
        key: 'packQty',
        width: 93,
        render: (text, record) => {
          return `${record.packQty}${record.packUnit}`;
        },
      },
      { title: '单价',
        dataIndex: 'salePrice',
        key: 'salePrice1',
        width: 93,
        className: 'text-align-right',
        render: (text) => {
          return text.formatMoney(4);
        },
      },
      { title: '总金额',
        dataIndex: 'totCost',
        key: 'totCost1',
        width: 93,
        className: 'text-align-right',
        render: (text) => {
          return text.formatMoney();
        },
      },
      { title: '用量',
        dataIndex: 'order.doseOnce',
        key: 'doseOnce1',
        width: 93,
        render: (value, record) => {
          return `${(value || '')} ${record.order ? (record.order.doseUnit || '') : ''}`;
        },
      },
      { title: '频次', dataIndex: 'order.freqDesc', key: 'freq1', width: 93 },
      { title: '用法',
        dataIndex: 'order.usage',
        key: 'usage',
        width: 93,
        render: (text) => {
          return utils.dicts.dis('USAGE', text);
        },
      },
      { title: '操作',
        dataIndex: 'order.usage',
        key: 'print',
        width: 93,
        render: (text, record) => {
          return <Button onClick={this.doPrint.bind(this, record)} ><Icon type="printer" />打印</Button>;
        },
      },
    ];

    const formulationColumns = [
      { title: '药品名称（规格）',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 122,
        render: (value, record) => {
          return `${value} (${record.specs || '-'})`;
        },
      },
      { title: '数量（单位）',
        dataIndex: 'qty',
        key: 'qty',
        width: 93,
        render: (text, record) => {
          return `${record.packQty} ${record.packUnit}`;
        },
      },
      { title: '单价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: 93,
        className: 'text-align-right',
        render: (text) => {
          return text.formatMoney(4);
        },
      },
      { title: '总金额',
        dataIndex: 'totCost',
        key: 'totCost1',
        width: 93,
        className: 'text-align-right',
        render: (text) => {
          return text.formatMoney();
        },
      },
      { title: '用量',
        dataIndex: 'order.doseOnce',
        key: 'doseOnce',
        width: 93,
        render: (value, record) => {
          return `${(value || '')} ${record.order ? (record.order.doseUnit || '') : ''}`;
        },
      },
      { title: '频次', dataIndex: 'order.freqDesc', key: 'freq', width: 93 },
      { title: '用法',
        dataIndex: 'order.usage',
        key: 'usage',
        width: 93,
        render: (text) => {
          return utils.dicts.dis('USAGE', text);
        },
      },
      { title: '开方医生',
        dataIndex: '12',
        key: 'seeDocName',
        width: 93,
        render: () => {
          return `${invoice[12]}`;
        },
      },
    ];

    const formulationSumItems = [];
    const idx = {};
    if (formulation.recipeId && formulationItems[formulation.recipeId]) {
      for (let i = 0; i < formulationItems[formulation.recipeId].length; i++) {
        const item = formulationItems[formulation.recipeId][i];
        if (!idx[item.itemCode]) { // 如果项目不存在
          idx[item.itemCode] = formulationSumItems.length;
          formulationSumItems.push({
            itemCode: item.itemCode,
            itemName: item.itemName,
            specs: item.specs,
            packQty: item.packQty,
            packUnit: item.packUnit,
            qty: 0,
            days: 0,
            salePrice: item.salePrice,
            totCost: 0,
            order: item.order,
          });
        }
        const sumItem = formulationSumItems[idx[item.itemCode]];
        formulationSumItems[idx[item.itemCode]] = {
          ...sumItem,
          qty: sumItem.qty + item.qty,
          days: sumItem.days + item.days,
          totCost: sumItem.totCost + item.totCost,
        };
      }
    }

    const button = (
      <div>
        <Button
          type="primary"
          onClick={this.dispense}
          style={{ width: '120px', marginRight: '10px' }}
          icon="to-top"
        >发药</Button>
        {/* <Button
          onClick={() => this.print('116', formulationSumItems)}
          style={{ width: '120px' }}
          icon="printer"
        >打印</Button>*/}
      </div>
    );

    const listAreaHeight = wsHeight - 3 - 10 - 5 - 37 - 17 - 127;

    return (
      <div style={{ padding: '3px' }} >
        <Card style={{ marginBottom: '5px' }} className={styles.baseInfo} >
          {/*
            0 - invoiceNo
            1 - applyState
            2 - patientId
            3 - patientName
            4 - patientGender
            5 - patientBirthday
            6 - chargeOper
            7 - chargeTime
            8 - drugDept
            9 - seeDocId
            10 - regTime
            11 - feeType
            12 - seeDocName
            13 - regId
          */}
          <Row>
            {/* <Col span={3} style={{ textAlign: 'right' }} >条形码：</Col>
            <Col span={3} >{baseInfo.barcode}</Col>*/}
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >患者姓名：</Col>
            <Col span={4} >{invoice.length > 0 ? invoice[3] : ''}</Col>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >患者性别：</Col>
            <Col span={4} >{invoice.length > 0 ? utils.dicts.dis('SEX', invoice[4]) : ''}</Col>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >出生日期：</Col>
            <Col span={4} >{invoice.length > 0 ? moment(invoice[5]).format('YYYY-MM-DD') : ''}</Col>
          </Row>
          <Row>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >开方医生：</Col>
            <Col span={4} >{invoice.length > 0 ? invoice[12] : ''}</Col>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >是否医保：</Col>
            <Col span={4} >{invoice.length > 0 ? utils.dicts.dis('FEE_TYPE', invoice[11]) : ''}</Col>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >挂号时间：</Col>
            <Col span={4} >{invoice.length > 0 ? moment(invoice[10]).format('YYYY-MM-DD HH:mm') : ''}</Col>
          </Row>
          <Row>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >付款标志：</Col>
            <Col span={4} >{invoice.length > 0 ? utils.dicts.dis('APPLY_STATE', invoice[1]) : ''}</Col>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >收费员：</Col>
            <Col span={4} >{invoice.length > 0 ? invoice[6] && invoice[6].name : ''}</Col>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >收款时间：</Col>
            <Col span={4} >{invoice.length > 0 ? moment(invoice[7]).format('YYYY-MM-DD HH:mm') : ''}</Col>
          </Row>
          <Row>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >发药科室：</Col>
            <Col span={20} >{invoice.length > 0 ? invoice[8].deptName : ''}</Col>
          </Row>
        </Card>
        <Tabs defaultActiveKey="1" tabBarExtraContent={button} >
          <TabPane tab="处方" key="1" className={styles.tabPane} >
            <Card style={{ height: `${listAreaHeight}px` }} >
              <CommonTable
                rowKey={record => `SUMROW${record.itemCode}`}
                rowSelection={false}
                data={formulationSumItems}
                columns={formulationSumColumns}
                onRowClick={this.onRowClick}
                pagination={false}
                bordered
              />
            </Card>
          </TabPane>
          <TabPane tab="处方明细" key="2" className={styles.tabPane} >
            <Card style={{ height: `${listAreaHeight}px` }} >
              <CommonTable
                rowKey={record => `ITEMROW${record.id}`}
                rowSelection={false}
                data={formulation.recipeId && formulationItems[formulation.recipeId] ? formulationItems[formulation.recipeId] : []}
                columns={formulationColumns}
                onRowClick={this.onRowClick}
                pagination={false}
                bordered
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default connect(
  ({ drugDispense, utils, cache, base }) => ({ drugDispense, utils, cache, base }),
)(DrugFormulationItemList);

