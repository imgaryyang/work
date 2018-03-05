import React from 'react';
import { connect } from 'dva';
import { Row, Col, Select, Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import OutStockForm from './OutStockForm';
import styles from './OutputInfo.less';

class OutstockDetail extends React.Component {


  onPageChange(pageNew) {
    const { query } = this.props.matOutputSummary;
    this.props.dispatch({
      type: 'matOutputSummary/loadOutputDetail',
      payload: { pageNew, query },
    });
  }

  render() {
    const { matOutputSummary, base } = this.props;
    const { wsHeight } = base;
    const leftHeight = wsHeight - (90);
    const { data, page } = matOutputSummary;
    const columns = [
      { title: '出库科室',
        dataIndex: '3',
        key: 'deptName',
        width: '400px',
        className: 'text-align-left',
      },
      { title: '进价金额',
        dataIndex: '1',
        key: 'buyTotalCost',
        width: '400px',
        className: 'text-align-right',
        render: text => (text.formatMoney(2)) },
      { title: '零售金额',
        dataIndex: '2',
        key: 'saleTotalCost',
        width: '400px',
        className: 'text-align-right',
        render: text => (text.formatMoney(2)) },
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
export default connect(({ matOutputSummary, base }) => ({ matOutputSummary, base }))(OutstockDetail);
