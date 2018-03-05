import React, { Component } from 'react';
import { connect } from 'dva';
import { floor } from 'lodash';
import { Button, Row, Col, Card } from 'antd';

import CommonTable from '../../../components/CommonTable';

import styles from './OutOrderInstock.less';

class OutOrderDetail extends Component {

  constructor(props) {
    super(props);
    this.onCommit = this.onCommit.bind(this);
//    this.refreshTable = this.refreshTable.bind(this);
  }

  componentWillMount() {
  }

  onCommit() {
    this.props.dispatch({
      type: 'outOrderInstock/save',
    });
  }

//  refreshTable() {
//    const { buyDetail } = this.props.outOrderInstock;
//    const table = this.refs.commonTable;
//    const newData = table.getUpdatedData();
//    this.props.dispatch({
//      type: 'outOrderInstock/setState',
//      payload: {
//        buyDetail: { ...buyDetail, data: newData },
//      },
//    });
//  }

  render() {
    const { outOrderInstock, utils, base } = this.props || {};
    const { outOrderDetail, state } = outOrderInstock;
    const { depts, deptsIdx, dicts } = this.props.utils || {};
    const deptId = this.props.base.user.loginDepartment.id;
    const user = base.user.name;
    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: '25%',
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.specs || '-'})`}<br />
              {`厂商：${record.producerInfo ? (record.producerInfo.companyName || '-') : '-'}`}<br />
              {`供应商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      /* { title: '规格', dataIndex: 'specs', key: 'specs' },*/
      { title: '批号/批次',
        dataIndex: 'approvalNo',
        key: 'approvalNo',
        width: '15%',
        render: (text, record) => {
          return (
            <div>
              {text || '-'}<br />
              {record.batchNo || '-'}
            </div>
          );
        },
      },
      /* { title: '审核数量', dataIndex: 'auitdNum', key: 'auitdNum', width: 65, className: 'text-align-right text-no-wrap' },*/
      { title: '零售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        editable: true,
        width: '10%',
        className: 'text-align-right text-no-wrap',
        render: (text) => {
          return (
            <div>
              {text.formatMoney(4)}
            </div>
          );
        },
      },
      { title: '数量',
        dataIndex: 'outSum',
        key: 'outSum',
        editable: true,
        width: '10%',
        className: 'text-align-right text-no-wrap',
        render: (text, record) => {
          return (record.outSum && record.drugInfo.packQty) ?
              (record.drugInfo ? floor(record.outSum / record.drugInfo.packQty) + (record.drugInfo.packUnit) : floor(record.outSum / record.drugInfo.packQty)) :
              '';
        },
      },
      /* { title: '单位', dataIndex: 'buyUnit', key: 'buyUnit' },*/
      { title: '出库金额',
        dataIndex: 'saleCost',
        key: 'saleCost',
        width: '10%',
        className: 'text-align-right',
        render: (text, record) => {
          return text ? text.formatMoney(2) : 0.00;
        },
      },
      /* { title: '生产厂商', dataIndex: 'producer.companyName', key: 'producer.companyName' },*/
      /* { title: '供货商', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName', width: '25%' },*/
      { title: '状态', dataIndex: 'outputState', key: 'outputState', width: '15%',
       render: (text, record) => {
         return dicts.dis('OUTPUT_STATE', text);
       }
      },
    ];

    let totalAmt = 0;
    if (outOrderDetail && outOrderDetail.length > 0) {
      for (let i of outOrderDetail) {
        totalAmt += i.saleCost;
      }
    }

    const { wsHeight } = this.props.base;
    const bottomHeight = wsHeight - 43 - 6 - 5;
    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row type="flex" justify="space-between" align="middle" >
            <Col span="5">
              <div >入库科室：{depts.disDeptName(deptsIdx, deptId)}</div>
            </Col>
            <Col span="5">
              <div >入库人员：{user}</div>
            </Col>
            <Col span="6">
              <div >合计金额：{totalAmt.formatMoney(2)}</div>
            </Col>
            <Col span="3" style={{ textAlign: 'right' }} >
              <Button type="primary" size="large" onClick={() => this.onCommit()} icon="download" >入库</Button>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <CommonTable
            data={outOrderDetail}
            columns={columns}
            pagination={false}
            bordered
            rowSelection={false}
            scroll={{ y: (bottomHeight - 10 - 33) }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ base, outOrderInstock, utils }) => ({ base, outOrderInstock, utils }),
)(OutOrderDetail);

