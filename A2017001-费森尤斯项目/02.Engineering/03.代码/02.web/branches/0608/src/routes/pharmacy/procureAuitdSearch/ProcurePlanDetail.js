import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import EditTable from '../../../components/editTable/EditTable';
import styles from './ProcurePlanAuitd.less';

class ProcurePlanDetail extends Component {

  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
    /* this.onConfirm = this.onConfirm.bind(this);
    this.onCommit = this.onCommit.bind(this);*/
    // this.refreshTable = this.refreshTable.bind(this);
  }

  componentWillMount() {
  }

  /* onConfirm(record) {
  // 查询历史采购信息
    this.props.dispatch({
      type: 'procureAuitdSearch/loadBuyHis',
      record,
    });
  }

  onCommit(id) {
    this.props.dispatch({
      type: 'procureAuitdSearch/saveBuy',
      payload: { buyState: '2', id },
    });
  }*/

  onPageChange(page) {
    this.props.dispatch({
      type: 'procureAuitdSearch/loadBuyDetail',
      payload: { page },
    });
  }

  /* refreshTable() {
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    const { buyDetail } = this.props.procureAuitdSearch;
    buyDetail.data = newData;
    this.props.dispatch({
      type: 'procureAuitdSearch/setState',
      payload: {
        buyDetail,
      },
    });
  }*/

  render() {
    const { procureAuitdSearch, base, utils } = this.props;
    const { buyDetail } = procureAuitdSearch;
    const { wsHeight } = base;

    const { data, page } = buyDetail;
    const { deptId, createOper, buyBill } = data && data.length > 0 ? data[0].phaBuyBill : {};
    const { depts, deptsIdx } = utils || {};
    let totAmount = 0;
    for (const item of data) {
      item.auitdNum = item.auitdNum ? item.auitdNum : item.buyNum;
      totAmount += item.buyPrice * item.auitdNum;
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
              {`生产厂商：${record.producer ? (record.producer.companyName || '-') : '-'}`}<br />
            </div>
          );
        },
      },
      /* { title: '药品名称', dataIndex: 'tradeName', key: 'tradeName', width: '50px', className: 'text-align-center' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: '40px', className: 'text-align-center' },*/
      { title: '计划购入价',
        dataIndex: 'buyPrice',
        key: 'buyPrice',
        width: 80,
        className: 'text-align-right',
        render: text => (text.formatMoney(4)) },
      { title: '计划数量', dataIndex: 'buyNum', key: 'buyNum', width: 60, className: 'text-align-right' },
      { title: '审核数量',
        dataIndex: 'auitdNum',
        key: 'auitdNum',
        width: 60,
        editable: false,
        className: 'text-align-right',
        render: (text, record) => (record.auitdNum ? record.auitdNum : record.buyNum) },
      { title: '单位', dataIndex: 'buyUnit', key: 'buyUnit', width: 55, className: 'text-align-right text-no-wrap' },
      { title: '审核金额',
        dataIndex: 'auitdPrice',
        key: 'auitdPrice',
        width: 80,
        className: 'text-align-right',
        render: (text, record) => (((record.auitdNum ? record.auitdNum : record.buyNum) * record.buyPrice).formatMoney(2) : 0.00) },
      /* { title: '生产厂商',
        dataIndex: 'producer',
        key: 'producer',
        width: '50px',
        className: 'text-align-center',
        render: (text, record) => (record.producer ? record.producer.companyName : '') },*/
    ];

    const bottomHeight = wsHeight - 40 - 6 - 5;

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row type="flex" justify="space-between" align="middle" >
            <Col span="5">
              <div >计划科室：{depts.disDeptName(deptsIdx, deptId)}</div>
            </Col>
            <Col span="5">
              <div >计划人：{createOper}</div>
            </Col>
            <Col span="6">
              <div >单据号：{buyBill}</div>
            </Col>
            <Col span="6">
              <div >计划总金额：{totAmount.formatMoney(2)}</div>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <EditTable
            data={data}
            page={page}
            pagination={false}
            columns={columns}
            bordered
            rowSelection={false}
            size="middle"
            ref="commonTable"
            onPageChange={this.onPageChange}
            scroll={{ y: (bottomHeight - 10 - 33) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ procureAuitdSearch, base, utils }) => ({ procureAuitdSearch, base, utils }),
)(ProcurePlanDetail);
