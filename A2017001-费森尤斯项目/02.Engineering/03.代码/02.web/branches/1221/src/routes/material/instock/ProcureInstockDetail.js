
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Card, notification } from 'antd';
import moment from 'moment';
import EditTable from '../../../components/editTable/EditTable';
import styles from './ProcureInstock.less';
import { testNumber } from '../../../utils/validation.js';
import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';

const FormItem = Form.Item;

class ProcureInstockDetail extends Component {

  constructor(props) {
    super(props);
    this.onCommit = this.onCommit.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
    this.companySelectEvent = this.companySelectEvent.bind(this);
  }

  componentWillMount() {
  }

  onCommit(id) {
    const { company } = this.props.procureDeptInstock;
    if (company) {
    const { buyDetail } = this.props.procureDeptInstock;
    const { data } = buyDetail;
    if (data && data.length > 0) {
      const today = moment(new Date()).format('YYYY-MM-DD')+"";
      const index = data.findIndex(value => value.inNum === 0 || testNumber(value.inNum) === false || value.inNum === '');
      const indexApprovalNo = data.findIndex(value => (value.approvalNo === '' || value.approvalNo === null));
      const indexProduceDate = data.findIndex(value => value.procuceDate === null || value.procuceDate > today);
      const indexValidDate = data.findIndex(value => value.validDate === null || value.validDate < today);
      if (index !== -1) {
        notification.error({
          message: '提示',
          description: '入库数量请输入非0的数字！',
        });
        return;
      }
      if (indexApprovalNo !== -1) {
        notification.error({
          message: '提示',
          description: '批号不能为空！',
        });
        return;
      }
      if (indexProduceDate !== -1) {
        notification.error({
          message: '提示',
          description: '生产日期不能为空且不能大于当天！',
        });
        return;
      }
      if (indexValidDate !== -1) {
        notification.error({
          message: '提示',
          description: '有效日期不能为空且不能小于当天！',
        });
        return;
      }
    } else {
      notification.error({
        message: '提示',
        description: '请输入数据后，再操作入库！',
      });
      return;
    }
    this.props.dispatch({
      type: 'procureDeptInstock/saveBuy',
      payload: { buyState: '4', id },
    });
   } else {
    notification.error({
      message: '提示',
      description: '请选择物资供货商!',
    });
  }
  }
  companySelectEvent(value) {
    this.props.dispatch({
      type: 'procureDeptInstock/setState',
      payload: { company: value.id },
    });
  }
  /*
  onSelect(value) {
      // console.info('zhoumin----组件', value);
      this.props.dispatch({
        type: 'procureDeptInstock/setState',
        payload: { company: value },
      });
    };
    filterUser(input, options) {
        // console.info('filterUser', input, options.props.children);
        return options.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };*/

  refreshTable(value, index, key) {
    const { buyDetail } = this.props.procureDeptInstock;
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    // console.info('newData=================', newData);
    if (key === 'inNum') {
      if (!testNumber(value) || value === 0) {
        notification.error({
          message: '提示',
          description: '入库数量请输入非0数字！',
        });
      }
    }
    if (key === 'procuceDate') {
      const today = moment(new Date()).format('YYYY-MM-DD')+"";
      if (value > today || !value) {
        notification.error({
          message: '提示',
          description: '生产日期不能为空且不能大于当天！',
        });
      }
    }
    if (key === 'validDate') {
      const today = moment(new Date()).format('YYYY-MM-DD')+"";
      if (value < today || !value) {
        notification.error({
          message: '提示',
          description: '有效日期不能为空且不能小于当天！',
        });
      }
    }
    /*
    if (key === 'approvalNo') {
        if (value === null || value === '') {
          notification.error({
                message: '提示',
                description: '批号不能为空！',
          });
        }
      }
    */
    this.props.dispatch({
      type: 'procureDeptInstock/setState',
      payload: {
        buyDetail: { ...buyDetail, data: newData },
      },
    });
  }

  render() {
    const { buyDetail } = this.props.procureDeptInstock || {};
    const { depts, deptsIdx } = this.props.utils || {};
    const { page, deptId, createOper, buyBill, id } = (buyDetail || {});
    // console.info('zhoumin==========', buyDetail);
    const { data } = (buyDetail || []);

    const columns = [
      { title: '物资信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 250,
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.specs || '-'})`}<br />
              {`生产厂商：${record.producer ? (record.producer.companyName || '-') : '-'}`}<br />
            </div>
          );
        },
      },
      /* { title: '规格', dataIndex: 'specs', key: 'specs' },*/
      { title: '购入价/数量',
        dataIndex: 'buyPrice',
        key: 'buyPrice',
        width: 85,
        className: 'text-align-right text-no-wrap',
        render: (text, record) => {
          return (
            <div className="text-align-right text-no-wrap" >
              {text.formatMoney(4)}<br />
              {record.auitdNum} {record.buyUnit || '-'}
            </div>
          );
        },
      },
      /* { title: '审核数量', dataIndex: 'auitdNum', key: 'auitdNum', width: 65, className: 'text-align-right text-no-wrap' },*/
      { title: '入库数量',
        dataIndex: 'inNum',
        key: 'inNum',
        editable: true,
        width: 90,
        className: 'text-align-center',
        addonAfter: (text, record) => {
          return record.buyUnit;
        },
        render: (text, record) => {
          return text === 0 ? record.auitdNum : text;
        },
      },
      /* { title: '单位', dataIndex: 'buyUnit', key: 'buyUnit' },*/
      { title: '入库金额',
        dataIndex: 'buyCost',
        key: 'buyCost',
        width: 85,
        className: 'text-align-right',
        render: (text, record) => {
          return text === 0 ? ((record.inNum === 0 ? record.auitdNum : record.inNum) * record.buyPrice).formatMoney() : text.formatMoney();
        },
      },
      { title: '批号', dataIndex: 'approvalNo', key: 'approvalNo', editable: true, width: 90 },
      { title: '生产日期', dataIndex: 'procuceDate', key: 'procuceDate', editor: 'date', editable: true, width: 112 },
      { title: '有效日期', dataIndex: 'validDate', key: 'validDate', editor: 'date', editable: true, width: 112 },
    ];

    let total = 0;
    if (data && data.length > 0) {
      for (let i of data) {
        if (i.inNum === 0) {
          i.buyCost = i.buyPrice * i.buyNum;
        } else {
          i.buyCost = i.buyPrice * i.inNum;
        }
        total = total + i.buyCost;
      }
    }
    // console.info('zhoumin-----',data,total)

    const { wsHeight } = this.props.base;
    const bottomHeight = wsHeight - 43 - 6 - 5;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Form inline style={{ marginBottom: '5px' }} >
            <Row type="flex" justify="space-between" align="middle" >
              <Col span="5">
                <div >
                  {/* <Select placeholder="供货商" style={{width: '100%', marginRight: 5}}
          onChange={(value)=>this.onSelect(value)}
              showSearch filterOption={(input, option) => this.filterUser(input, option)}>
              {companyOptions}
          </Select>*/}
                  <FormItem>
                    {getFieldDecorator('companyName')(
                      <CompanySearchInput
                        placeholder="供货商"
                        companyType={['2']}
                        services={['2']}
                        onSelect={this.companySelectEvent}
                        style={{ width: '160px' }}
                      />)}
                  </FormItem>
                </div>
              </Col>
              <Col span="3">
                <div >采购科室：{depts.disDeptName(deptsIdx, deptId)}</div>
              </Col>
              <Col span="3">
                <div >采购人：{createOper}</div>
              </Col>
              <Col span="5">
                <div >单据号：{buyBill}</div>
              </Col>
              <Col span="4">
                <div >总金额：{total.formatMoney()}</div>
              </Col>
              <Col span="3" style={{ textAlign: 'right' }} >
                <Button type="primary" size="large" onClick={() => this.onCommit(id)} icon="download" >入库</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <EditTable
            ref="commonTable"
            onChange={this.refreshTable.bind(this)}
            data={data}
            page={page}
            pagination={false}
            columns={columns}
            bordered
            rowSelection={false}
            scroll={{ y: (bottomHeight - 10 - 33) }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  ({ base, procureDeptInstock, utils }) => ({ base, procureDeptInstock, utils }),
)(Form.create()(ProcureInstockDetail));

