import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Tabs, Card, Row, Col } from 'antd';
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
    this.props.dispatch({
      type: 'drugDispense/dispense',
      recipeId: this.props.drugDispense.formulation.recipeId,
    });
  }

  print() {

  }

  render() {
    const { drugDispense, utils, base } = this.props;
    const { invoice, formulation, formulationItems } = drugDispense;
    const { wsHeight } = base;

    const formulationSumColumns = [
      /* {title:'医院id', dataIndex :'hosId', key:'hosId', },*/
      { title: '药品名称（规格）', dataIndex: 'itemName', key: 'itemName1', width: 122 },
      { title: '数量（单位）',
        dataIndex: 'qty',
        key: 'qty1',
        width: 93,
        render: (text, record) => {
          return `${record.qty} ${record.specs}`;
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
      { title: '用量', dataIndex: 'order.doseOnce', key: 'doseOnce1', width: 93 },
      { title: '频次', dataIndex: 'order.freq', key: 'freq1', width: 93 },
      { title: '用法',
        dataIndex: 'order.usage',
        key: 'usage',
        width: 93,
        render: (text) => {
          return utils.dicts.dis('USAGE', text);
        },
      },
    ];

    const formulationColumns = [
      /* {title:'医院id', dataIndex :'hosId', key:'hosId', },*/
      { title: '药品名称（规格）', dataIndex: 'itemName', key: 'itemName', width: 122 },
      { title: '数量（单位）',
        dataIndex: 'qty',
        key: 'qty',
        width: 93,
        render: (text, record) => {
          return `${record.qty} ${record.specs}`;
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
      { title: '用量', dataIndex: 'order.doseOnce', key: 'doseOnce', width: 93 },
      { title: '频次', dataIndex: 'order.freq', key: 'freq', width: 93 },
      { title: '用法',
        dataIndex: 'order.usage',
        key: 'usage',
        width: 93,
        render: (text) => {
          return utils.dicts.dis('USAGE', text);
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
        <Button
          onClick={this.print}
          style={{ width: '120px' }}
          icon="printer"
        >补打凭证</Button>
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
            <Col span={4} >{invoice.length > 0 ? moment(invoice[10]).format('YYYY-MM-DD hh:mm') : ''}</Col>
          </Row>
          <Row>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >付款标志：</Col>
            <Col span={4} >{invoice.length > 0 ? utils.dicts.dis('APPLY_STATE', invoice[1]) : ''}</Col>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >收费员：</Col>
            <Col span={4} >{invoice.length > 0 ? invoice[6] && invoice[6].name : ''}</Col>
            <Col span={4} style={{ textAlign: 'right', fontWeight: 'bold' }} >收款时间：</Col>
            <Col span={4} >{invoice.length > 0 ? moment(invoice[7]).format('YYYY-MM-DD hh:mm') : ''}</Col>
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

