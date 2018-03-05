import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { floor } from 'lodash';

import CommonTable from '../../../components/CommonTable';
import OutStockForm from './OutStockForm';

import styles from './StockOutCheck.less';

class OutstockDetail extends React.Component {
//  constructor(props) {
//     super(props);
// }
  state = {
    x: -1,
    record: {},
  }
  onPageChange(pageRightNew) {
    const { queryRight } = this.props.outStockCheck;
    this.props.dispatch({
      type: 'outStockCheck/addOutStockDetail',
      payload: { pageRightNew, queryRight },
    });
  }
  render() {
    const { dataOutStock, pageRight } = this.props.outStockCheck;
    // const rowIndex = this.state.x;

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
      { title: '出库数量',
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

    const { wsHeight } = this.props.base;
    const rightCardHeight = wsHeight - (3 * 2);

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.bottomCard} style={{ height: rightCardHeight }} >
          <OutStockForm />
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
  ({ base, outStockCheck }) => ({ base, outStockCheck }),
)(OutstockDetail);
