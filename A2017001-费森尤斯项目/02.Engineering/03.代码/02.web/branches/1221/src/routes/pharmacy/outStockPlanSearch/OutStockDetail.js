import React from 'react';
import { connect } from 'dva';
import { Modal,Card, Row, Col, Button } from 'antd';
import { floor } from 'lodash';

import CommonTable from '../../../components/CommonTable';
import OutStockForm from './OutStockForm';
import baseUtil from '../../../utils/baseUtil';

import styles from './StockOutCheck.less';

class OutstockDetail extends React.Component {
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
    const { queryRight } = this.props.outStockPlan;
    this.props.dispatch({
      type: 'outStockPlan/addOutStockDetail',
      payload: { pageRightNew, queryRight },
    });
  }

     // 导出
  handleExport() {
    const { queryRight, dataOutStock } = this.props.outStockPlan;
    if (dataOutStock && dataOutStock.length > 0) {
      const w = window.open('about:blank');
      const condition = { ...queryRight };
      w.location.href = '/api/hcp/pharmacy/instock/expertToExcel?data=' + JSON.stringify(condition);
    } else {
      baseUtil.alert('无请领计划明细,请选择请领计划！');
    }
  }
    // 打印
  handlePrint() {
	  	const { dataOutStock, pageRight } = this.props.outStockPlan;
	  	const { appBill } = dataOutStock[0];
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
    const { utils } = this.props;
    const { wsHeight } = this.props.base;
    const { dataOutStock, pageRight } = this.props.outStockPlan;
    const rightCardHeight = wsHeight - (3 * 2);

    const { deptId, createOper, appBill } = dataOutStock && dataOutStock.length > 0 ? dataOutStock[0] : {};
    const { depts, deptsIdx } = utils || {};
    let totAmount = 0;
    for (const item of dataOutStock) {
      const buyCost = item.checkNum ? item.checkNum * item.buyPrice : item.buyCost;
      totAmount += buyCost;
    }

    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 250,
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.specs || '-'})`}<br />
              {`生产厂商：${record.drugInfo.companyInfo ? (record.drugInfo.companyInfo.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      /* { title: '商品名称', dataIndex: 'tradeName', key: 'tradeName', width: 60, className: 'text-align-right' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: 50, className: 'text-align-right' },*/
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
      /* { title: '批次', dataIndex: 'batchNo', key: 'batchNo', width: 30, className: 'text-align-right' },*/
      { title: '当前库存',
        dataIndex: 'storeSum',
        key: 'storeSum',
        width: 80,
        render: (text, record) => (floor((record.storeSum ? record.storeSum : 0) / record.drugInfo.packQty) + ' ' + record.drugInfo.packUnit + ' '+
          (record.storeSum %  record.drugInfo.packQty == 0 ? '' : record.storeSum %  record.drugInfo.packQty + ' ' + record.drugInfo.miniUnit))},
      { title: '请领数量',
        dataIndex: 'appNum',
        key: 'appNum',
        width: 80,
        render: (text, record) => (record.appNum + ' ' + record.appUnit),
      },
      { title: '出库金额',
        dataIndex: 'buyCost',
        key: 'buyCost',
        width: 80,
        className: 'text-align-right',
        render: text => (text.formatMoney()),
      },
      /* { title: '生产厂家',
        dataIndex: 'producer',
        key: 'producer',
        width: 70,
        render: (text, record) => (record.drugInfo.companyInfo ? record.drugInfo.companyInfo.companyName : ''),
      },
      { title: '备注', dataIndex: 'comm', key: 'comm', width: 50 },*/
    ];

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row type="flex" justify="space-between" align="middle" >
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
            <Col span={3} style={{ paddingRight: '3px' }} >
              <Button type="primary" size="large" onClick={() => this.handlePrint()} style={{ width: '100%' }} icon="search" >打印</Button>
            </Col>
            <Col span={3} style={{ paddingRight: '3px' }} >
              <Button onClick={this.handleExport} size="large" style={{ width: '100%' }} icon="reload" >导出</Button>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: rightCardHeight-60 }} >
          <CommonTable
            data={dataOutStock}
            pagination
            paginationStyle="normal"
            bordered
            page={pageRight}
            columns={columns}
            onPageChange={this.onPageChange.bind(this)}
            rowSelection={false}
            size="middle"
            scroll={{ y: (rightCardHeight - 150 - 7) }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ base, outStockPlan, utils }) => ({ base, outStockPlan, utils }),
)(OutstockDetail);
