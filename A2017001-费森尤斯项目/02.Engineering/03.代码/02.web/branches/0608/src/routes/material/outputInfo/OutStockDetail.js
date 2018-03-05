import React from 'react';
import { connect } from 'dva';
import { floor } from 'lodash';
import { Row, Col, Select, Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import OutStockForm from './OutStockForm';
import styles from './OutputInfo.less';

class OutstockDetail extends React.Component {


  onPageChange(pageNew) {
    const { query } = this.props.matOutputDetailInfo;
    this.props.dispatch({
      type: 'matOutputDetailInfo/loadOutputDetail',
      payload: { pageNew, query },
    });
  }

  render() {
    const { matOutputDetailInfo, base } = this.props;
    const { wsHeight } = base;
    const leftHeight = wsHeight - (90);
    const { data, page } = matOutputDetailInfo;
    
    const columns = [
      { title: '物资名称', dataIndex: 'tradeName', key: 'tradeName', width: '100px', className: 'text-align-left' },
      { title: '规格', dataIndex: 'materialSpecs', key: 'materialSpecs', width: '60px', className: 'text-align-left' },
      { title: '进价', dataIndex: 'buyPrice', key: 'buyPrice', width: '60px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '售价', dataIndex: 'salePrice', key: 'salePrice', width: '60px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '零售金额',
        dataIndex: 'saleCost',
        key: 'saleCost',
        width: '60px',
        className: 'text-align-right',
        render: text => (text.formatMoney(2)) },
      { title: '出库数量',
        dataIndex: 'outSum',
        key: 'outSum',
        width: '60px',
        className: 'text-align-right',
        render: (text, record) => (record.outSum ? record.outSum + record.matInfo.materialUnit : 0),
      },
       { title: '批号', dataIndex: 'approvalNo', key: 'approvalNo', width: '60px', className: 'text-align-right' },
      { title: '生产商',
        dataIndex: 'producer',
        key: 'producer',
        width: '100px',
        className: 'text-align-left',
        render: (text, record) => (record.producerInfo ? record.producerInfo.companyName : ''),
      },
      { title: '供应商',
        dataIndex: 'company',
        key: 'company',
        width: '100px',
        className: 'text-align-left',
        render: (text, record) => (record.companyInfo ? record.companyInfo.companyName : ''),
      },
      { title: '出库时间',
        dataIndex: 'outTime',
        key: 'outTime',
        width: '100px',
        className: 'text-align-left',
      },
    ];

    return (
      <div>
        <Row style={{ paddingBottom: 3 }}>
          <Col span={24} >
            <OutStockForm />
          </Col>
        </Row>
        <Card className={styles.bottomCard} style={{ height: leftHeight }}>
          <CommonTable
            data={data}
            pagination
            columns={columns}
            bordered
            rowSelection={false}
            page={page}
            onPageChange={this.onPageChange.bind(this)}
            scroll={{ y: (wsHeight - 180) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(({ matOutputDetailInfo, base }) => ({ matOutputDetailInfo, base }))(OutstockDetail);
