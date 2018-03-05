import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Icon, Tooltip, notification } from 'antd';

import EditTable from '../../../components/editTable/EditTable';
import OutStockForm from './OutStockForm';
import { testInt } from '../../../utils/validation';
import styles from './DirectOut.less';

class OutstockDetail extends Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
  }

  onDelete(index) {
    this.props.dispatch({
      type: 'hrpOutputStock/deletOutStockDetail',
      index,
    });
  }

  onCommit() {
    this.props.dispatch({
      type: 'hrpOutputStock/saveOutStockInfo',
    });
  }

  refreshTable(value, index, key) {
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    //
    //    const reg = /^-?([1-9][0-9]*)?$/;
    //    if (!reg.test(value)) {
    //      Modal.error({ content: '出库数量请输入数字！' });
    //      return;
    //    }
    //
    if (value > newData[index].storeSum) {
      notification.info({
        message: '提示',
        description: '出库数量不能大于库存量！',
      });
      return;
    }
    this.props.dispatch({
      type: 'hrpOutputStock/setState',
      payload: {
        dataOutStock: newData,
      },
    });
  }

  render() {
    const { hrpOutputStock, base } = this.props;
    const { wsHeight } = base;
    const { dataOutStock, page } = hrpOutputStock;
    const columns = [{
      title: '资产信息',
      dataIndex: 'instrmInfo.commonName',
      key: 'instrmInfo.commonName',
      width: 190,
      render: (text, record) => {
        return (<div > { `${text}(${record.instrmSpecs || '-'})` } <br />
          厂商： { record.instrmInfo.companyInfo.companyName ? (record.instrmInfo.companyInfo.companyName || '-') : '-' }
        </div>
        );
      },
    }, {
      title: '资产编码',
      dataIndex: 'instrmCode',
      key: 'instrmCode',
      width: 60,
      render: (text, record) => {
        return (<div > { text } <br /> { record.userCode } </div>);
      },
    }, {
      title: '库存',
      dataIndex: 'storeSum',
      key: 'storeSum',
      width: 65,
      render: (text, record) => {
        return (<div style={{ textAlign: 'right' }} > { text } { record.materialInfo ? record.materialInfo.materialUnit : '' } </div>);
      },
    }, {
      title: '出库数量',
      dataIndex: 'outSum',
      key: 'outSum',
      width: 80,
      editable: true,
      editorConfig: { verfy: (v) => {
        return testInt(v);
      } },
      addonAfter: (text, record) => {
        return record.materialInfo ? record.materialInfo.materialUnit : '';
      },
      className: 'text-align-right text-no-wrap',
    }, {
      title: '单价',
      dataIndex: 'buyPrice',
      key: 'buyPrice',
      width: 75,
      className: 'text-align-right',
      render: text => (text !== null ? text.formatMoney(4) : 0.00),
    }, {
      title: '出库金额',
      dataIndex: 'buyCost',
      key: 'buyCost',
      width: 75,
      className: 'text-align-right text-no-wrap',
      render: (text, record) => {
        const amount = record.outSum * record.buyPrice;
        return (amount ? amount.formatMoney() : 0.00);
      },
    }, {
      title: '操作',
      key: 'action',
      width: 48,
      className: 'text-align-center text-no-wrap',
      render: (text, record, index) => (<Tooltip
        placement="top"
        title="删除"
      >
        <Icon
          type="delete"
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={this.onDelete.bind(this, index)}
        />
      </Tooltip>
      ),
    }];

    const rightCardHeight = wsHeight - (3 * 2);

    return (<div style={{ padding: '3px' }} >
      <Card
        className={styles.bottomCard}
        style={{ height: rightCardHeight }}
      >
        <OutStockForm />
        <EditTable
          data={dataOutStock}
          pagination={false}
          columns={columns}
          bordered
          rowSelection={false}
          page={page}
          ref="commonTable"
          onChange={this.refreshTable.bind(this)}
          scroll={{ y: (rightCardHeight - 38 - 34) }}
        />
      </Card>
    </div>
    );
  }
}

export default connect(({ hrpOutputStock, base }) => ({ hrpOutputStock, base }))(OutstockDetail);
