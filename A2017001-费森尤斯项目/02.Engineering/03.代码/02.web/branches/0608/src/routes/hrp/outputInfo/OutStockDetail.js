import React from 'react';
import { connect } from 'dva';
import { floor } from 'lodash';
import { Row, Col, Select, Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import OutStockForm from './OutStockForm';
import styles from './OutputInfo.less';

class OutstockDetail extends React.Component {


  onPageChange(pageNew) {
    const { query } = this.props.hrpOutputDetailInfo;
    this.props.dispatch({
      type: 'hrpOutputDetailInfo/loadOutputDetail',
      payload: { pageNew, query },
    });
  }

  render() {
    const { hrpOutputDetailInfo, base } = this.props;
    const { wsHeight } = base;
    const leftHeight = wsHeight - (45);
    const { data, page } = hrpOutputDetailInfo;
    
    const columns = [
      { title: '资产编码', dataIndex: 'instrmCode', key: 'instrmCode', width: '60px', className: 'text-align-left' },
      { title: '固资名称', dataIndex: 'tradeName', key: 'tradeName', width: '120px', className: 'text-align-left' },
      { title: '规格', dataIndex: 'instrmSpecs', key: 'instrmSpecs', width: '60px', className: 'text-align-left' },
      { title: '型号', dataIndex: 'batchNo', key: 'batchNo', width: '60px', className: 'text-align-left' },
      { title: '进价', dataIndex: 'buyPrice', key: 'buyPrice', width: '60px', className: 'text-align-right', render: text => (text.formatMoney(4)) },
      { title: '出库数量',
        dataIndex: 'outSum',
        key: 'outSum',
        width: '60px',
        className: 'text-align-right',
        render: (text, record) => (record.outSum ? record.outSum + record.instrmInfo.instrmUnit : 0),
      },
       { title: '总额', dataIndex: 'buyCost', key: 'buyCost', width: '60px', className: 'text-align-right' },
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
      { title: '折旧(月)',
        dataIndex: 'limitMonth',
        key: 'limitMonth',
        width: '60px',
        className: 'text-align-left',
        render: (text, record) => (record.instrmInfo ? record.instrmInfo.limitMonth : ''),
      },
      { title: '出厂日期',
        dataIndex: 'produceDate',
        key: 'produceDate',
        width: '80px',
        className: 'text-align-left',
      },
      { title: '购入日期',
        dataIndex: 'purchaseDate',
        key: 'purchaseDate',
        width: '80px',
        className: 'text-align-left',
      },
      { title: '目标科室',
        dataIndex: 'toDept',
        key: 'toDept',
        width: '60px',
        className: 'text-align-left',
        render: (text, record) => (record.toDept ? record.toDept.deptName : ''),
      },
      { title: '出库时间',
        dataIndex: 'outTime',
        key: 'outTime',
        width: '120px',
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
            scroll={{ y: (wsHeight - 140) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(({ hrpOutputDetailInfo, base }) => ({ hrpOutputDetailInfo, base }))(OutstockDetail);
