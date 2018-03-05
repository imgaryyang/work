import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, notification, Tree, Tooltip, Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import styles from './ProcurePlanAuitd.less';

class ProcurePlanDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    const { base, procureAuitdSearch, utils } = this.props;
    const { buyHis } = procureAuitdSearch;
    const { wsHeight } = base;
    const topHeight = (wsHeight - 3 - 10 - 50) * 2/4;
    const bottomHeight = wsHeight - 3 - 10 - 50 - topHeight - 3*2;
    const { data, page } = buyHis;

    const columns = [
      { title: '药品名称', dataIndex: 'tradeName', key: 'tradeName', width: '50px', className: 'text-align-center' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: '50px', className: 'text-align-center' },
      { title: '采购日期', dataIndex: 'inTime', key: 'inTime', width: '38px', className: 'text-align-center' },
      { title: '采购数量',
        dataIndex: 'inSum',
        key: 'inSum',
        width: '40px',
        className: 'text-align-right',
        render: (text, record) => ((record.inSum / record.drugInfo.packQty).formatMoney(0) + ' ' + record.drugInfo.packUnit),
      },
      { title: '采购金额', dataIndex: 'buyCost', key: 'buyCost', width: '40px', className: 'text-align-right', render: text => (text.formatMoney(2)) },
      { title: '购入价', dataIndex: 'buyPrice', key: 'buyPrice', width: '40px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '零售价', dataIndex: 'salePrice', key: 'salePrice', width: '40px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '供货商', dataIndex: 'company', key: 'company', width: '50px', className: 'text-align-center' },
      { title: '生产厂商',
        dataIndex: 'producer',
        key: 'producer',
        width: '50px',
        className: 'text-align-center',
        render: (text, record) => (record.drugInfo ? record.drugInfo.companyInfo.companyName : ''),
      },
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
            scroll={{ y: (bottomHeight - 10 - 37) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(({ procureAuitdSearch, base, utils }) => ({ procureAuitdSearch, base, utils }))(ProcurePlanDetail);
