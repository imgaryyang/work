import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Icon, Tooltip, Modal, notification  } from 'antd';

import EditTable from '../../../components/editTable/EditTable';
import OutStockForm from './OutStockForm';
import { testInt } from '../../../utils/validation';
import styles from './DirectOut.less';

class OutstockDetail extends Component {

  constructor(props) {
    super(props);
//    this.onSearch = this.onSearch.bind(this);
    this.onDelete = this.onDelete.bind(this);
//    this.onSave = this.onSave.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
  }
//
//  onSearch(values) {
//    this.props.dispatch({
//      type: 'instock/loadSearchBar',
//      payload: {
//        query: values,
//      },
//    });
//  }

  onDelete(index) {
    this.props.dispatch({
      type: 'outStock/deletOutStockDetail',
      index,
    });
  }

//  onSave() {
//    this.props.dispatch({
//      type: 'instock/saveApply',
//      appState: '0',
//    });
//  }

  onCommit() {
//    console.info('onCommit');
    this.props.dispatch({
      type: 'outStock/saveOutStockInfo',
    });
  }

  refreshTable(value, index, key) {
    // console.info('refreshTable', value, index, key, typeof parseInt(value), parseInt(value));

    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();

    const reg = /^-?([1-9][0-9]*)?$/;
    if (!reg.test(value)) {
    	notification.error({
    		message: '提示',
    		description: '出库数量请输入数字！',
    	});
    	return;
    }
//    if ( typeof value != "number" ){
//      Modal.error({content: '出库数量请输入数字！'});
//      return;
//    }
    if (value*newData[index].drugInfo.packQty > newData[index].storeSum) {
    	notification.info({
    		message: '提示',
    		description: '出库数量不允许大于库存数量！',
    	});
    	return;
    }
//    console.info('refreshTable', newData);
//    const { dataOutStock } = this.props.outStock;
//    dataOutStock = newData;
    this.props.dispatch({
      type: 'outStock/setState',
      payload: {
        dataOutStock: newData,
      },
    });
  }

  render() {
    const { outStock, base } = this.props;
    const { wsHeight } = base;
    const { dataOutStock, page } = outStock;
    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 190,
        render: (text, record) => {
          return (
            <div> 
              {`${text}(${record.specs || '-'})`}<br />
              {`生产厂商：${record.companyInfo.companyName || '-'}`}
            </div>
          );
        },
      },
      /* { title: '药品名称', dataIndex: 'tradeName', key: 'tradeName', width: '20%' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: '15%' },*/
      { title: '批号/批次',
        dataIndex: 'approvalNo',
        key: 'approvalNo',
        width: 80,
        render: (text, record) => {
          return (
            <div>
              {text}<br />
              {record.batchNo}
            </div>
          );
        },
      },
      /* { title: '批号', dataIndex: 'approvalNo', key: 'approvalNo', width: '5%' },
      {title:'单位', dataIndex :'minUnit',key:'minUnit',width:50},*/
      { title: '库存',
        dataIndex: 'storeSum',
        key: 'storeSum',
        width: 65,
        className: 'text-align-right text-no-wrap',
        render: (text, record) => {
          let storeStr = '';
          let storeSumMin = 0;
          let store = 0;
          if (record.drugInfo && record.drugInfo.packQty > 0) {
	          storeSumMin = record.storeSum % record.drugInfo.packQty;
	          store = record.storeSum / record.drugInfo.packQty;
          }
          if ( record.storeSumMin > 0) {
        	  storeStr = store.formatMoney(0) +
            		   (record.drugInfo?record.drugInfo.packUnit:'') +
            		   storeSumMin.formatMoney(0) +
            		   (record.drugInfo?record.drugInfo.miniUnit:'');
          } else {
        	  storeStr = store.formatMoney(0) +
                       (record.drugInfo?record.drugInfo.packUnit:'');
          }
          return storeStr;
        },
      },
      { title: '出库数量', 
    	dataIndex: 'outSum', 
    	key: 'outSum', 
    	width: 70, 
    	editable: true, 
    	editorConfig: { verfy: (v) => { return testInt(v); } },
    	addonAfter: (text, record) => {
            return record.drugInfo?record.drugInfo.packUnit:'';
        },
    	className: 'text-align-right text-no-wrap' 
      },
      { title: '零售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: 75,
        className: 'text-align-right',
        render: text => (text.formatMoney(4)),
      },
      { title: '出库金额',
        dataIndex: 'saleCose',
        key: 'saleCose',
        width: 75,
        className: 'text-align-right text-no-wrap',
        render: (text, record) => {
          const amount = record.outSum * record.salePrice;
          return (amount ? amount.formatMoney() : '0.00');
        },
      },
      { title: '操作',
        key: 'action',
        width: 48,
        className: 'text-align-center text-no-wrap',
        render: (text, record, index) => (
          <Tooltip placement="top" title={'删除'}>
            <Icon type="delete" style={{ cursor: 'pointer', color: 'red' }} onClick={this.onDelete.bind(this, index)} />
          </Tooltip>
        ),
      },
    ];

    const rightCardHeight = wsHeight - (3 * 2);

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.bottomCard} style={{ height: rightCardHeight }} >
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

export default connect(
  ({ outStock, base }) => ({ outStock, base }),
)(OutstockDetail);
