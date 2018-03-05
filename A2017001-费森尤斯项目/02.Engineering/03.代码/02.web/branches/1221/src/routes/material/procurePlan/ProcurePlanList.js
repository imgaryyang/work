import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Button, Tooltip, Icon, Modal } from 'antd';

import EditTable from '../../../components/editTable/EditTable';
import ShadowDiv from '../../../components/ShadowDiv';
import { testInt, testAmt } from '../../../utils/validation';

import styles from './ProcurePlan.less';

class ProcurePlanList extends Component {

  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
    this.onSaveBuy = this.onSaveBuy.bind(this);
    this.onCommitBuy = this.onCommitBuy.bind(this);
    this.onNew = this.onNew.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'materialProcurePlan/loadBuy',
    });
  }

  onDelete(record) {
//    console.info('onDelete', record);
    this.props.dispatch({
      type: 'materialProcurePlan/deleteBuyDetail',
      record,
    });
  }

  onSaveBuy() {
    this.props.dispatch({
      type: 'materialProcurePlan/saveBuy',
      buyState: '0',
    });
  }

  onCommitBuy() {
    this.props.dispatch({
      type: 'materialProcurePlan/saveBuy',
      buyState: '1',
    });
  }

  onNew() {
    this.props.dispatch({
      type: 'materialProcurePlan/deleteBuy',
    });
  }

  refreshTable(value, index, key) {
    const { buy } = this.props.materialProcurePlan;
    this.props.dispatch({
      type: 'materialProcurePlan/setState',
      payload: {
        buy,
      },
    });
  }

  render() {
    const { materialProcurePlan, base, utils } = this.props;
    const { id: deptId } = base.user.loginDepartment;
    const { buy } = materialProcurePlan || {};
    const buyDetail = buy.buyDetail || [];
//    console.info('buy', deptId, buy);
    const columns = [
      { title: '物资信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 280,
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.materialSpecs || '-'})`}<br />
              {`生产厂商：${record.producer ? (record.producer.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      { title: '计划购入价',
        dataIndex: 'buyPrice',
        key: 'buyPrice',
        width: 80,
        className: 'text-align-center',
        editable: true,
        editorConfig: { verfy: (v) => { return testAmt(v); } },
        render: (text, record) => {
          return record.buyPrice != null ? record.buyPrice.formatMoney(4) : '0.0000';
        },
      },
      { title: '计划数量',
        dataIndex: 'buyNum',
        key: 'buyNum',
        width: 85,
        className: 'text-align-center',
        editable: true,
        editorConfig: { verfy: (v) => { return testInt(v); } },
        addonAfter: (text, record) => {
          return record.buyUnit;
        },
      },
      { title: '计划金额',
        dataIndex: 'buyCost',
        key: 'buyCost',
        className: 'text-align-right',
        width: 85,
        render: (text, record) => (record.buyNum * record.buyPrice !== 0 ? (record.buyNum * record.buyPrice).formatMoney(2) : 0.00),
      },
      { title: '本科库存',
        dataIndex: 'storeDept',
        key: 'storeDept',
        width: 80,
        className: 'text-align-right',
        render: (text, record) => {
          const unit = record.buyUnit === null ? '' : record.buyUnit;
          return text.formatMoney(0) + unit;
        },
      },
      { title: '全院库存',
        dataIndex: 'storeSum',
        key: 'storeSum',
        width: 80,
        className: 'text-align-right',
        render: (text, record) => {
          const unit = record.buyUnit === null ? '' : record.buyUnit;
          return text.formatMoney(0) + unit;
        },
      },
      { title: '操作',
        key: 'action',
        width: 50,
        className: 'text-align-center',
        render: (text, record) => (
          <Tooltip placement="top" title={'删除'}>
            <Icon type="delete" style={{ cursor: 'pointer', color: 'red' }} onClick={this.onDelete.bind(this, record)} />
          </Tooltip>
        ),
      },
    ];

    const { depts, deptsIdx } = utils || {};
    const dept = depts.disDeptName(deptsIdx, deptId);
    const user = base.user.name;
    let totAmount = 0;
    for (const i of buyDetail) {
      totAmount += i.buyPrice * i.buyNum || 0;
    }

    const { wsHeight } = base;
    const bottomHeight = wsHeight - 39 - 6 - 5;
//    console.info('start-render');
    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row >
            <Col span={6} >
              <div>计划科室：{dept}</div>
            </Col>
            <Col span={6} >
              <div>计划人：{user}</div>
            </Col>
            <Col span={6} >
              <div>单据号：{buy.buyBill}</div>
            </Col>
            <Col span={6} >
              <div>计划金额：{totAmount.formatMoney(2)}</div>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <ShadowDiv showTopShadow={false} style={{ height: `${bottomHeight - 52}px` }} >
            <EditTable
              data={buyDetail} page={buy.page} pagination={false} columns={columns} size="middle"
              rowSelection={false} bordered ref="commonTable"
              onChange={this.refreshTable.bind(this)}
              scroll={{ y: (wsHeight - 52 - 33 - 53) }}
            />
          </ShadowDiv>
          <div style={{ textAlign: 'right', paddingTop: '5px' }} >
            <Button size="large" onClick={() => this.onNew()} style={{ marginRight: '10px' }} icon="plus" >新建</Button>
            <Button size="large" onClick={() => this.onSaveBuy()} style={{ marginRight: '10px' }} icon="cloud-upload-o" >暂存</Button>
            <Button type="primary" size="large" onClick={() => this.onCommitBuy()} icon="save" >提交</Button>
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(({ materialProcurePlan, base, utils }) => ({ materialProcurePlan, base, utils }))(ProcurePlanList);
