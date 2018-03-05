import React from 'react';
import { connect } from 'dva';
import { floor } from 'lodash';
import CommonTable from '../../../components/CommonTable';
import OutStockForm from './OutStockForm';
// import styles from './OutputInfo.less';

class OutstockDetail extends React.Component {
  onPageChange(pageNew) {
    const { detailQuery } = this.props.outputDetailInfo;
    this.props.dispatch({
      type: 'outputDetailInfo/loadOutStockDetail',
      payload: { pageNew, detailQuery },
    });
  }

  render() {
    const { outputDetailInfo, base } = this.props;
    const { wsHeight } = base;
    // const leftHeight = wsHeight - (90);
    const { detailData, detailPage, totalSum, pageSum } = outputDetailInfo;
    const { dicts } = this.props.utils;

    const columns = [
      {
        title: '药品分类',
        dataIndex: 'drugType',
        width: '80px',
        key: 'drugType',
        render: (value) => {
          return dicts.dis('DRUG_TYPE', value);
        },
      },
      { title: '药品名称', dataIndex: 'tradeName', key: 'tradeName', width: '200px', className: 'text-align-left' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: '90px', className: 'text-align-left' },
      { title: '进价', dataIndex: 'buyPrice', key: 'buyPrice', width: '80px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '售价', dataIndex: 'salePrice', key: 'salePrice', width: '80px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '零售金额',
        dataIndex: 'saleCost',
        key: 'saleCost',
        width: '100px',
        className: 'text-align-right',
        render: text => (text.formatMoney(2)) },
      { title: '出库数量',
        dataIndex: 'outSum',
        key: 'outSum',
        width: '100px',
        className: 'text-align-right',
        render: (text, record) => (`${floor((record.outSum ? record.outSum : 0) / record.drugInfo.packQty)} ${record.drugInfo.packUnit} ${
          record.outSum % record.drugInfo.packQty === 0 ? '' : `${record.outSum % record.drugInfo.packQty} ${record.drugInfo.miniUnit}`}`),
      },
      { title: '批号', dataIndex: 'approvalNo', key: 'approvalNo', width: '80px', className: 'text-align-right' },
      { title: '生产商/供货商',
        dataIndex: 'producer',
        key: 'producer',
        width: '260px',
        className: 'text-align-left',
        // render: (text, record) => (record.producerInfo ? record.producerInfo.companyName : ''),
        render: (text, record) => {
          return (
            <div>
              {`(生产)${record.producerInfo ? (record.producerInfo.companyName || '-') : ''}`}<br />
              {`(供应)${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      /* { title: '供应商',
        dataIndex: 'company',
        key: 'company',
        width: '100px',
        className: 'text-align-left',
        render: (text, record) => (record.companyInfo ? record.companyInfo.companyName : ''),
      },*/
      { title: '出库时间',
        dataIndex: 'outTime',
        key: 'outTime',
        width: '90px',
        className: 'text-align-left',
      },
      { title: '操作者', dataIndex: 'outOper', key: 'outOper', width: '70px' },
    ];

    return (
      <div style={{ position: 'relative' }} >
        <OutStockForm />
        <CommonTable
          data={detailData}
          pagination
          columns={columns}
          bordered
          rowSelection={false}
          page={detailPage}
          onPageChange={this.onPageChange.bind(this)}
          scroll={{ y: (wsHeight - 32 - 51 - 22 - 23) }}
          size="middle"
          className="compact-table"
        />
        <div style={{ position: 'absolute', left: '10px', bottom: '15px' }} >
          <font style={{ fontSize: '14px' }} >
            {`金额总计：${totalSum[0] ? totalSum[0].formatMoney() : 0.00} 元，本页小计：${pageSum ? pageSum.formatMoney() : 0.00} 元`}
          </font>
        </div>
      </div>
    );
  }
}
export default connect(({ outputDetailInfo, base, utils }) => ({ outputDetailInfo, base, utils }))(OutstockDetail);
