import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Row, Col, Card } from 'antd';
import EditTable from '../../../components/editTable/EditTable';
import { testInt } from '../../../utils/validation';
import styles from './ProcurePlanAuitd.less';

class ProcurePlanDetail extends Component {
  constructor(props) {
    super(props);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onCommitBack = this.onCommitBack.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
  }
  // 打印
  handlePrint() {
    const { query } = this.props.procureAuitdSearch.buyDetail;
    Modal.confirm({
      content: '确定要打印审批单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'print/getPrintInfo',
          payload: { code: '114', bizId: query.buyBill },
        });
      },
    });
  }
  componentWillMount() {
  }

  onConfirm(record) {
    // 查询历史采购信息
    this.props.dispatch({
      type: 'matProcureAuitd/loadBuyHis',
      record,
    });
  }

  onCommit(id) {
    this.props.dispatch({
      type: 'matProcureAuitd/saveBuy',
      payload: { buyState: '2', id },
    });
  }

  onCommitBack(id) {
    this.props.dispatch({
      type: 'matProcureAuitd/backBuy',
      payload: { buyState: '3', id },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'matProcureAuitd/loadBuyDetail',
      payload: { page },
    });
  }

  refreshTable() {
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    const { buyDetail } = this.props.matProcureAuitd;
    buyDetail.data = newData;
    this.props.dispatch({
      type: 'matProcureAuitd/setState',
      payload: {
        buyDetail,
      },
    });
  }

  render() {
    const { matProcureAuitd, base, utils } = this.props;
    const { buyDetail, record: rd } = matProcureAuitd;
    const { wsHeight } = base;
    const topHeight = ((wsHeight - 3 - 10 - 42) * 2) / 4;

    const { data, page } = buyDetail;
    const {
      deptId, createOper, buyBill,
    } = data && data.length > 0 ? data[0].matBuyBill : {};
    const { depts, deptsIdx } = utils || {};
    let totAmount = 0;
    for (const item of data) {
      item.auitdNum = item.auitdNum ? item.auitdNum : item.buyNum;
      totAmount += item.buyPrice * item.auitdNum;
    }

    const columns = [
      {
        title: '物资信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: '270px',
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.matInfo ? (record.matInfo.materialSpecs ? record.matInfo.materialSpecs : '-') : '-'})`}<br />
              {`生产厂商：${record.producer ? record.producer.companyName : ''}`}<br />
            </div>
          );
        },
      },
      // { title: '规格', dataIndex: 'materialSpec', key: 'materialSpec', width: '40px', className: 'text-align-center' },
      {
        title: '计划购入价',
        dataIndex: 'buyPrice',
        key: 'buyPrice',
        width: '90px',
        className: 'text-align-right',
        render: text => (text.formatMoney(4)),
      },
      {
        title: '计划数量', dataIndex: 'buyNum', key: 'buyNum', width: '70px', className: 'text-align-right', render: (text, record) => (record.buyUnit === null ? record.buyNum : `${record.buyNum}${record.buyUnit}`),
      },
      {
        title: '本科库存',
        dataIndex: 'deptSum',
        key: 'deptSum',
        width: '80px',
        render: (text, record) => ((record.deptSum ? record.deptSum : 0) + (record.matInfo ? record.matInfo.materialUnit : '')),
      },
      {
        title: '本院库存',
        dataIndex: 'totalSum',
        key: 'totalSum',
        width: '80px',
        render: (text, record) => ((record.totalSum ? record.totalSum : 0) + (record.matInfo ? record.matInfo.materialUnit : '')
        ),
      },
      {
        title: '审核数量',
        dataIndex: 'auitdNum',
        key: 'auitdNum',
        width: '100px',
        editorConfig: { verfy: (v) => { return testInt(v); } },
        editable: true,
        addonAfter: (text, record) => {
          return record.buyUnit;
        },
        className: 'text-align-center',
        render: (text, record) => (record.auitdNum ? record.auitdNum : record.buyNum),
      },
      /* { title: '单位', dataIndex: 'buyUnit', key: 'buyUnit', width: '20px', className: 'text-align-right' },*/
      {
        title: '审核金额',
        dataIndex: 'auitdPrice',
        key: 'auitdPrice',
        width: '80px',
        className: 'text-align-right text-no-wrap',
        render: (text, record) => (((record.auitdNum ? record.auitdNum : record.buyNum) * record.buyPrice).formatMoney(2) : 0.0000),
      },
    ];

    return (
      <div>
        <div style={{ padding: '3px', paddingBottom: '5px' }} >
          <Card className={styles.infoCard} >
            <Row type="flex" justify="space-between" align="middle">
              <Col span="4">
                <div >计划科室：{depts.disDeptName(deptsIdx, deptId)}</div>
              </Col>
              <Col span="4">
                <div >计划人：{createOper}</div>
              </Col>
              <Col span="5">
                <div >单据号：{buyBill}</div>
              </Col>
              <Col span="5">
                <div >计划总金额：{totAmount.formatMoney(2)}</div>
              </Col>
              <Col span="3" style={{ textAlign: 'right' }} >
                <Button type="primary" size="large" onClick={() => this.onCommit(rd.id)} icon="check" >同意</Button>
              </Col>
              <Col span="3" style={{ textAlign: 'right' }} >
                <Button type="primary" size="large" onClick={() => this.onCommitBack(rd.id)} icon="close" >退回</Button>
              </Col>
              <Col span={3} style={{ paddingRight: '3px' }} >
                <Button type="primary" size="large" onClick={() => this.handlePrint()} style={{ width: '100%' }} icon="search" >打印</Button>
              </Col>

            </Row>
          </Card>
        </div>
        <div style={{ padding: '3px' }} >
          <Card className={styles.topCard} style={{ height: `${topHeight}px`, overflow: 'auto' }} >
            <EditTable
              data={data}
              page={page}
              pagination={false}
              columns={columns}
              bordered
              rowSelection={false}
              size="middle"
              scroll={{ y: (topHeight - 50) }}
              ref="commonTable"
              onRowClick={(record, index) => this.onConfirm(record, index)}
              onPageChange={this.onPageChange.bind(this)}
              onChange={this.refreshTable.bind(this)}
            />
          </Card>
        </div>
      </div>
    );
  }
}
export default connect(({ matProcureAuitd, base, utils }) => ({ matProcureAuitd, base, utils }))(ProcurePlanDetail);
