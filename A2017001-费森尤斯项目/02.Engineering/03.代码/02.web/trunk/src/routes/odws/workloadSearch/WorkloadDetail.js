import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import WorkloadForm from './WorkloadForm';
import styles from './Workload.less';

class WorkloadDetail extends React.Component {


  onPageChange(pageNew) {
    const { query } = this.props.workloadSearch;
    this.props.dispatch({
      type: 'workloadSearch/loadOutputDetail',
      payload: { pageNew, query },
    });
  }

  render() {
    const { workloadSearch, base } = this.props;
    const { wsHeight } = base;
    const leftHeight = wsHeight - (45);
    const { data, page } = workloadSearch;
    const columns = [
      { title: '科室名称', dataIndex: '0', key: 'deptName', width: '60px', className: 'text-align-left' },
      { title: '挂号',
        children: [
           { title: '数量', dataIndex: '1', key: 'regCountTotal', width: '60px', className: 'text-align-right' },
           { title: '挂号费', dataIndex: '2', key: 'regFeeTotal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '诊疗费', dataIndex: '3', key: 'medicFeeTotal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '附加费', dataIndex: '4', key: 'extraFeeTotal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '费用小计', dataIndex: '5', key: 'regTotal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
        ] },
      { title: '退号',
        children: [
           { title: '数量', dataIndex: '6', key: 'bRegCountTotal', width: '60px', className: 'text-align-right' },
           { title: '挂号费', dataIndex: '7', key: 'bRegFeeToTal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '诊疗费', dataIndex: '8', key: 'bMedicFeeTotal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '附加费', dataIndex: '9', key: 'bExtraFeeTotal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '费用小计', dataIndex: '10', key: 'bRegTotal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
        ] },
      { title: '合计',
        children: [
           { title: '数量', dataIndex: '11', key: 'countSum', width: '60px', className: 'text-align-right' },
           { title: '挂号费', dataIndex: '12', key: 'RegSum', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '诊疗费', dataIndex: '13', key: 'medicSum', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '附加费', dataIndex: '14', key: 'extraSum', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
           { title: '费用小计', dataIndex: '15', key: 'sumTotal', width: '60px', className: 'text-align-right', render: text => (text.formatMoney()) },
        ] },
    ];

    return (
      <div>
        <Row style={{ paddingBottom: 3 }}>
          <Col span={24} >
            <WorkloadForm />
          </Col>
        </Row>
        <Card className={styles.bottomCard} style={{ height: leftHeight }}>
          <CommonTable
            data={data}
            pagination={false}
            columns={columns}
            bordered
            rowSelection={false}
            page={page}
            onPageChange={this.onPageChange.bind(this)}
            scroll={{ y: (wsHeight - 36) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(({ workloadSearch, base }) => ({ workloadSearch, base }))(WorkloadDetail);
