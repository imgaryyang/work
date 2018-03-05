import React, { Component } from 'react';
import { Button, Modal, Popconfirm } from 'antd';
import CommonTable from '../../../components/CommonTable';

const confirm = Modal.confirm;
class OperBalanceList extends Component {

  onSearch(values) {
    this.props.dispatch({
      type: 'operBalance/load',
      payload: { values },
    });
  }
  onUpdate(record) {
    this.props.dispatch({
      type: 'operBalance/update',
      id: record.id,
    });
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'operBalance/load',
      payload: { page },
    });
  }

  render() {
    const { page, data, wsHeight } = this.props;
    const opearations = (record) => {
      return record.ischeck ?
         (
           <div>
             <Popconfirm placement="left" title={'您确定要取消收款么?'} cancelText={'否'} okText={'是'} onConfirm={this.onUpdate.bind(this, record)}>
               <Button type="danger">
                  取消收款
              </Button>
             </Popconfirm>
           </div>
        ) :
        (
          <div>
            <Popconfirm placement="left" title={'您确定要收款么?'} cancelText={'否'} okText={'是'} onConfirm={this.onUpdate.bind(this, record)}>
              <Button type="danger">
                 收款
             </Button>
            </Popconfirm>
          </div>
       );
    };

    const columns = [
      {
        title: '收款员',
        dataIndex: 'invoiceOper',
        width: '10%',
        key: 'invoiceOper',
      }, {
        title: '结账号',
        dataIndex: 'balanceId',
        width: '10%',
        key: 'balanceId',
      }, {
        title: '结账日期',
        dataIndex: 'balanceTime',
        width: '15%',
        key: 'balanceTime',
      }, {
        title: '开始日期',
        dataIndex: 'startTime',
        width: '15%',
        key: 'startTime',
      }, {
        title: '结束日期',
        dataIndex: 'endTime',
        width: '15%',
        key: 'endTime',
      }, {
        title: '发票张数',
        dataIndex: 'plusCount',
        className: 'text-align-right text-no-wrap',
        width: '5%',
        key: 'plusCount',
      }, {
        title: '退费张数',
        dataIndex: 'minusCount',
        className: 'text-align-right text-no-wrap',
        width: '5%',
        key: 'minusCount',
      }, {
        title: '发票总额',
        dataIndex: 'plusTot',
        className: 'text-align-right text-no-wrap',
        width: '5%',
        render: text => (text || 0.00).formatMoney(2),
        key: 'plusTot',
      }, {
        title: '退费总额',
        dataIndex: 'minusTot',
        className: 'text-align-right text-no-wrap',
        width: '5%',
        render: text => (text || 0.00).formatMoney(2),
        key: 'minusTot',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          opearations(record)
        ),
      },
    ];
    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          rowSelection={false}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          bordered
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default OperBalanceList;
