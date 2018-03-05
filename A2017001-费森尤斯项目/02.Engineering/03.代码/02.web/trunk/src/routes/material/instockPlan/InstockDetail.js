import React from 'react';
import { connect } from 'dva';
import { Modal, Card, Row, Col, Button } from 'antd';
// import { floor } from 'lodash';

import CommonTable from '../../../components/CommonTable';
import baseUtil from '../../../utils/baseUtil';

import styles from './InstockPlan.less';

class instockDetail extends React.Component {
  constructor(props) {
    super(props);
    this.handlePrint = this.handlePrint.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  state = {
    x: -1,
    record: {},
  }

  onPageChange(pageRightNew) {
    const { queryRight } = this.props.instockPlan;
    this.props.dispatch({
      type: 'instockPlan/addOutStockDetail',
      payload: { pageRightNew, queryRight },
    });
  }

  // 导出
  handleExport() {
    const { instockData } = this.props.instockPlan;
    if (instockData && instockData.length > 0) {
      this.props.dispatch({ type: 'instockPlan/exportData' });
    } else {
      baseUtil.alert('无请领计划明细,请选择请领计划！');
    }
  }

  // 打印
  handlePrint() {
    const { instockPubData: { appBill } } = this.props.instockPlan;
    Modal.confirm({
      content: '确定要打印单据吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'print/getPrintInfo',
          payload: { code: '016', bizId: appBill },
        });
      },
    });
  }
  render() {
    const { utils, base: { wsHeight } } = this.props;
    const { instockData, instockPubData, pageRight } = this.props.instockPlan;
    const rightCardHeight = wsHeight - (3 * 2);

    const { deptId, createOper, appBill } = instockPubData;
    const { depts, deptsIdx } = utils;
    console.info(instockPubData);
    let totAmount = 0;
    for (const item of instockData) {
      const saleCost = item.checkNum ? item.checkNum * item.salePrice : item.saleCost;
      totAmount += saleCost;
    }



    const columns = [
      {
        title: '物资信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 250,
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.materialSpec || '-'})`}<br />
              {`生产厂商：${record.matInfo.companyInfo ? (record.matInfo.companyInfo.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      { title: '零售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: 90,
        className: 'text-align-right',
        render: text => (text.formatMoney(4)),
      },
      { title: '批号/批次',
        dataIndex: 'approvalNo',
        key: 'approvalNo',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              {text}<br />
              {record.batchNo}
            </div>
          );
        },
      },
      // { title: '当前库存',
      //   dataIndex: 'storeSum',
      //   key: 'storeSum',
      //   width: 80,
      //   render: (text, record) => {
      //     const { storeSum, matInfo } = record;
      //     return `${floor((storeSum || 0) / matInfo.materialQuantity)} ${matInfo.packUnit} ${storeSum % matInfo.materialQuantity === 0 ? '' : storeSum % matInfo.materialQuantity} ${matInfo.miniUnit}`
      //   },
      // },
      { title: '请领数量',
        dataIndex: 'appNum',
        key: 'appNum',
        width: 80,
        render: (text, record) => `${record.appNum} ${record.appUnit}`,
      },
      { title: '出库金额',
        dataIndex: 'saleCost',
        key: 'saleCost',
        width: 80,
        className: 'text-align-right',
        render: text => (text.formatMoney()),
      },
    ];

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row type="flex" justify="space-between" align="middle">
            <Col span="4">
              <div >请领科室：{depts.disDeptName(deptsIdx, deptId)}</div>
            </Col>
            <Col span="4">
              <div >请领人：{createOper}</div>
            </Col>
            <Col span="5">
              <div >单据号：{appBill}</div>
            </Col>
            <Col span="5">
              <div >总金额：{totAmount.formatMoney(2)}</div>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24} className={styles.actionFormOperating}>
              <Button type="primary" size="large" onClick={this.handlePrint} icon="printer" className={styles.btnLeft}>打印</Button>
              <Button type="primary" size="large" ghost onClick={this.handleExport} icon="export">导出</Button>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: rightCardHeight - 60 }} >
          <CommonTable
            data={instockData}
            page={pageRight}
            columns={columns}
            size="middle"
            bordered
            pagination
            paginationStyle="normal"
            onPageChange={this.onPageChange.bind(this)}
            rowSelection={false}
            scroll={{ y: (rightCardHeight - 150 - 7) }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ base, instockPlan, utils }) => ({ base, instockPlan, utils }),
)(instockDetail);
