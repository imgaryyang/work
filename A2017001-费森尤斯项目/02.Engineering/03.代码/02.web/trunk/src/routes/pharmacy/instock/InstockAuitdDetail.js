import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Row, Col } from 'antd';

import EditTable from '../../../components/editTable/EditTable';

import styles from './InstockAuited.less';

class InstockAuitdDetail extends Component {

  constructor(props) {
    super(props);
    this.onCommit = this.onCommit.bind(this);
  }

  componentWillMount() {
  }

  onCommit() {
    this.props.dispatch({
      type: 'instockAuitd/saveApply',
      appState: '4',
    });
  }

  render() {
    const { buyDetail } = this.props.instockAuitd;
    const { depts, deptsIdx } = this.props.utils || {};
    const { data, page, createOper, appBill } = buyDetail;

    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 250,
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.specs || '-'})`}<br />
              {`生产厂商：${record.drugInfo ? (record.drugInfo.companyInfo.companyName || '-') : '-'}`}<br />
            </div>
          );
        },
      },
      /* { title: '药品名称', dataIndex: 'tradeName', key: 'tradeName' },
      { title: '规格', dataIndex: 'specs', key: 'specs' },
      { title: '生产厂家', dataIndex: 'producer', key: 'producer' },*/
      { title: '零售价', dataIndex: 'salePrice', key: 'salePrice', width: 85, className: 'text-align-right text-no-wrap', render: text => text.formatMoney(4) },
      { title: '最小单位', dataIndex: 'minUnit', key: 'minUnit', width: 65, className: 'text-no-wrap' },
      { title: '申请数量', dataIndex: 'appNum', key: 'appNum', width: 80, className: 'text-align-right text-no-wrap', render: (text, record) => {
          return text+record.drugInfo.packUnit;
      },},
//      { title: '申请单位', dataIndex: 'drugInfo.packUnit', key: 'drugInfo.packUnit', width: 65, className: 'text-no-wrap' },
      { title: '申请金额', dataIndex: 'buyCost', key: 'buyCost', width: 100, className: 'text-align-right text-no-wrap', render: text => text.formatMoney() },
    ];

    let total = 0;
    let deptId = '';
    if (data && data.length > 0) {
      for (const i of data) {
        i.buyCost = i.salePrice * i.appNum;
        total += i.buyCost;
        deptId = i.deptId;
      }
    }

    const { wsHeight } = this.props.base;
    const bottomHeight = wsHeight - 43 - 6 - 5;

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row type="flex" justify="space-between" align="middle" >
            <Col span={5}>
              <div >请领科室：{depts.disDeptName(deptsIdx, deptId)}</div>
            </Col>
            <Col span={5}>
              <div >请领人：{createOper}</div>
            </Col>
            <Col span={6}>
              <div >单据号：{appBill}</div>
            </Col>
            <Col span={5}>
              <div >请领总金额：{total}</div>
            </Col>
            <Col span={3} style={{ textAlign: 'right' }} >
              <Button type="primary" size="large" onClick={() => this.onCommit()} icon="download" >入库</Button>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <Col>
            <EditTable
              ref="commonTable"
              data={data}
              page={page}
              columns={columns}
              bordered
              rowSelection={false}
              scroll={{ y: (bottomHeight - 10 - 33) }}
            />
          </Col>
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ base, instockAuitd, utils }) => ({ base, instockAuitd, utils }),
)(InstockAuitdDetail);

