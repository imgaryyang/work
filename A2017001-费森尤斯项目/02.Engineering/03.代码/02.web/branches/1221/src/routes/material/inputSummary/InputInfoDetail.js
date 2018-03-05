import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import InputForm from './InputForm';
import styles from './InputInfo.less';

class InputInfoDetail extends React.Component {


  onPageChange(pageNew) {
    const { query } = this.props.matinputsummary;
    this.props.dispatch({
      type: 'matinputsummary/loadInputDetail',
      payload: { pageNew, query },
    });
  }
  render() {
    const { base } = this.props;
    const { wsHeight } = base;
    const leftHeight = wsHeight - (95);
    const { data, page } = this.props.matinputsummary;
    const columns = [
      { title: '入库科室',
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
            <InputForm />
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
export default connect(({ matinputsummary, base }) => ({ matinputsummary, base }))(InputInfoDetail);
