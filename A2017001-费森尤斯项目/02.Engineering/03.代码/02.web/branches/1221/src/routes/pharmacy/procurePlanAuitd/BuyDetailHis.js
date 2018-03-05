import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import styles from './ProcurePlanAuitd.less';

class ProcurePlanDetail extends Component {

  componentWillMount() {
  }

  render() {
    const { base, procureAuitd } = this.props;
    const { buyHis } = procureAuitd;
    const { wsHeight } = base;
    const topHeight = ((wsHeight - 3 - 10 - 42) * 2) / 4;
    const bottomHeight = wsHeight - 3 - 10 - 44 - topHeight - (3 * 2);
    const { data, page } = buyHis;

    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: '280px',
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.specs || '-'})`}<br />
              {`生产厂商：${record.drugInfo.company ? record.drugInfo.companyInfo.companyName : ''}`}<br />
              {`供货商：${record.companyInfo ? record.companyInfo.companyName : ''}`}<br />
            </div>
          );
        },
      },
      // { title: '规格', dataIndex: 'specs', key: 'specs', width: '50px', className: 'text-align-center' },
      { title: '采购日期', dataIndex: 'inTime', key: 'inTime', width: '140px', className: 'text-align-center' },
      { title: '采购数量',
        dataIndex: 'inSum',
        key: 'inSum',
        width: '80px',
        className: 'text-align-right',
        render: (text, record) => (`${(record.inSum / record.drugInfo.packQty).formatMoney(0)} ${record.drugInfo.packUnit}`),
      },
      { title: '购入价', dataIndex: 'buyPrice', key: 'buyPrice', width: '80px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '零售价', dataIndex: 'salePrice', key: 'salePrice', width: '80px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '采购金额', dataIndex: 'buyCost', key: 'buyCost', width: '80px', className: 'text-align-right', render: text => (text.formatMoney(2)) },
      // { title: '供货商', dataIndex: 'company', key: 'company', width: '50px', className: 'text-align-center' },
      /* { title: '生产厂商',
        dataIndex: 'producer',
        key: 'producer',
        width: '50px',
        className: 'text-align-center',
        render: (text, record) => (record.drugInfo.companyInfo ? record.drugInfo.companyInfo.companyName : ''),
      },*/
    ];
    return (
      <div style={{ padding: '3px' }}>
        <Card className={styles.bottomCard} style={{ height: bottomHeight }}>
          <CommonTable
            data={data}
            page={page}
            pagination={false}
            rowSelection={false}
            columns={columns}
            bordered
            size="middle"
            scroll={{ y: (bottomHeight - 39) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(({ procureAuitd, base, utils }) => ({ procureAuitd, base, utils }))(ProcurePlanDetail);
