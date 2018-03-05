import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Button, Icon, Row, Col, Tooltip, Card, Select, notification } from 'antd';
import EditTable from '../../../components/editTable/EditTable';
import ShadowDiv from '../../../components/ShadowDiv';
import { testNumber } from '../../../utils/validation.js';
import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';

import styles from './DirectIn.less';

const Option = Select.Option;
const FormItem = Form.Item;
class DirectInList extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.filterUser = this.filterUser.bind(this);
    this.companySelectEvent = this.companySelectEvent.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'hrpDirectIn/loadApply',
    });
    this.props.dispatch({
      type: 'hrpDirectIn/load',
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'hrpDirectIn/loadSearchBar',
      payload: {
        query: values,
      },
    });
  }
  onDelete(record) {
    this.props.dispatch({
      type: 'hrpDirectIn/deleteApply',
      record,
    });
  }
  doPrint(record) {
    
    this.props.dispatch({
        type: 'print/getPrint',
        payload: { code: '117', printData: record },
    });
  }
  onNew(dataApply) {
    this.props.dispatch({
      type: 'hrpDirectIn/newApply',
      dataApply,
    });
  }
  onSave() {
    // todo 判断
    const { hrpDirectIn } = this.props;
    // 校验todo
    const { dataApply } = hrpDirectIn;
    if (dataApply && dataApply.length > 0) {
      const today = moment(new Date()).format('YYYY-MM-DD') + "";
      const index = dataApply.findIndex(value => value.inSum === 0 || testNumber(value.inSum) === false);
      const indexApprovalNo = dataApply.findIndex(value => value.approvalNo === '');
      const indexProduceDate = dataApply.findIndex(value => value.produceDate == null || value.produceDate > today);
      //        const indexValidDate = dataApply.findIndex(value=>value.validDate == null||value.validDate<today);
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
    } else {
      notification.error({
        message: '提示',
        description: '请输入数据后，再操作保存！',
      });
      return;
    }
    this.props.dispatch({
      type: 'hrpDirectIn/saveDirectIn', // 暂存只是操作入库表
      inputState: '0',
    });
  }

  onCommit() {
    // todo 判断
    const { hrpDirectIn } = this.props;
    const { dataApply } = hrpDirectIn;
    if (dataApply && dataApply.length > 0) {
      const today = moment(new Date()).format('YYYY-MM-DD') + "";
      const index = dataApply.findIndex(value => value.inSum === 0 || testNumber(value.inSum) === false);
      const indexApprovalNo = dataApply.findIndex(value => value.approvalNo === '');
      const indexProduceDate = dataApply.findIndex(value => value.produceDate == null || value.produceDate > today);
      //        const indexValidDate = dataApply.findIndex(value=>value.validDate == null||value.validDate<today);
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
      //        if (indexValidDate!= -1){
      //          notification.error({
      //                  message: '提示',
      //                  description: '有效日期不能为空且不能小于当天！',
      //            });
      //          return;
      //        }
    } else {
      notification.error({
        message: '提示',
        description: '请输入数据后，再操作入库！',
      });
      return;
    }
    this.props.dispatch({
      type: 'hrpDirectIn/saveDirectIn', // 加药房库存，会调用汐鸣提供的接口
      inputState: '4',
    });
  }
  onSelect(value) {
    this.props.dispatch({
      type: 'hrpDirectIn/setState',
      payload: { company: value.id },
    });
  }

  onPrint(dataApply) {
    let _ids = '';
    let _in_bill = '';
    for (let i = 0; i < dataApply.length; i++) {
      _in_bill = dataApply[i].inBill;
      if (dataApply[i].id) {
        _ids = dataApply[i].id + ",";
      } else {
        _ids = '';
        notification.error({
          message: '提示',
          description: `请先暂存数据!`,
        });
      }
    }
    if (_ids.length > 0) {
      this.props.dispatch({
        type: 'print/getPrintInfo',
        payload: { code: '010', bizId: _in_bill },
      });
    }
  }

  filterUser(input, options) {
    return options.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  companySelectEvent(value) {
    this.props.dispatch({
      type: 'hrpDirectIn/setState',
      payload: { company: value.id },
    });
  }

  refreshTable(value, index, key) {
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    let reg = '';
    if (key === 'inSum') {
      reg = /^-?([1-9][0-9]*)?$/;
      if (!reg.test(value)) {
        notification.error({
          message: '提示',
          description: '入库数量请输入数字！',
        });
      }
    } else if (key === 'inSum') {
      reg = /^-?\d+\.{0,1}\d{0,4}$/;
      if (!reg.test(value)) {
        notification.error({
          message: '提示',
          description: '入库数量请输入数字！',
        });
      }
    }
    if (key === 'produceDate') {
      const today = moment(new Date()).format('YYYY-MM-DD') + "";
      if (value > today || !value) {
        notification.error({
          message: '提示',
          description: '生产日期不能为空且不能大于今天！',
        });
      }
    }
    if (key === 'validDate') {
      const today = moment(new Date()).format('YYYY-MM-DD') + "";
      if (value < today || !value) {
        notification.error({
          message: '提示',
          description: '有效日期不能为空且不能小于当天！',
        });
      }


    }
    this.props.dispatch({
      type: 'hrpDirectIn/setState',
      payload: {
        dataApply: newData,
      },
    });
  }
  render() {
    const { hrpDirectIn, base } = this.props;
    const { dataApply, companyInfo, company } = hrpDirectIn;
    const { wsHeight } = base;
    const companyOptions = companyInfo.map(company => < Option key = { company.id } > { company.name } < /Option>);
      const columns = [{
          title: '资产信息',
          dataIndex: 'id',
          key: 'id',
          width: 250,
          render: (text, record) => {
            return ( <
              div > { `名称：${record.commonName}` } <
              /div>
            );
          },
        },
        {
          title: '固定资产编码',
          width: 100,
          dataIndex: 'instrmCode',
          key: 'instrmCode',
          editable: true,
          className: 'text-align-center',
        },
        {
          title: '零售价',
          width: 75,
          dataIndex: 'salePrice',
          key: 'salePrice',
          render: text => (text ? text.formatMoney(4) : 0),
          className: 'text-align-right',
        },
        {
          title: '入库数量',
          width: 78,
          dataIndex: 'inSum',
          key: 'inSum',
          editable: true,
          className: 'text-align-center',
          addonAfter: (text, record) => {
            return record.instrmUnit;
          },
        },
        /* { title: '包装单位', width: '2%', dataIndex: 'packUnit', key: 'packUnit' },*/
        {
          title: '入库金额',
          width: 78,
          dataIndex: 'saleCost',
          key: 'saleCost',
          render: text => (text ? text.formatMoney() : 0),
          className: 'text-align-right',
        },
        {
          title: '批号',
          width: 78,
          dataIndex: 'approvalNo',
          key: 'approvalNo',
          className: 'text-align-center',
          editable: true,
        },
        {
          title: '生产日期',
          width: 100,
          dataIndex: 'produceDate',
          key: 'produceDate',
          editor: 'date',
          className: 'text-align-center',
          editable: true,
        },
        //      { title: '资产编号',
        //        width: 100,
        //        dataIndex: 'validDate',
        //        key: 'validDate',
        //        editor: 'date',
        //        className: 'text-align-center',
        //        editable: true,
        //      },
        {
          title: '操作',
          width: 58,
          key: 'action',
          className: 'text-align-center',
          render: (text, record) => ( <
            span >
            <
            Tooltip placement = "top"
            title = { '删除' } >
            <
            Icon onClick = { this.onDelete.bind(this, record) } type = "delete"
            style = { { cursor: 'pointer', color: 'red' } }
            /> < /
            Tooltip >
            <span className="ant-divider" />
            <Tooltip placement = "top"
            title = { '打印' } >
            <Icon onClick = { this.doPrint.bind(this, record) } type = "printer"
            style = { { cursor: 'pointer' } }
            /> < /
            Tooltip > <
            /span>
          
             

          ),
        },
      ];

      let total = 0.00;
      if (dataApply && dataApply.length > 0) {
        for (const i of dataApply) {
          i.saleCost = i.inSum * i.salePrice;
           //total += i.saleCost;
          i.buyCost = i.inSum * i.buyPrice;
          total += i.buyCost;
        }
      }

      const bottomHeight = wsHeight - 50 - 6 - 5;
      const { getFieldDecorator } = this.props.form;

      return ( <
          div style = { { padding: '3px' } } >
          <
          Card className = { styles.infoCard } > {
            /* <Row>
                    <Col span={24} ><SearchBar onSearch={this.onSearch.bind(this)} /></Col>
                  </Row>*/
          } <
          Form inline style = { { marginBottom: '5px' } } >

          <
          Row >
          <
          Col span = { 8 } >
          <
          div style = { { lineHeight: '28px' } } > 供货商： {
            /*
                          <Select placeholder="供货商" style={{width: 200, marginRight: 5}} 
                      onChange={(value)=>this.onSelect(value)} value = {company}
                      showSearch filterOption={(input, option) => this.filterUser(input, option)}>
                      {companyOptions}
                  </Select>*/
          } <
          FormItem > {
            getFieldDecorator('companyName')( <
              CompanySearchInput placeholder = "供货商"

              companyType = {
                ['2']
              }
              services = {
                ['3']
              }
              onSelect = { this.companySelectEvent } style = { { width: '200px' } }
              allowClear = 'true'
              />
            )
          } <
          /FormItem> < /
          div > <
          /Col> <
          Col span = { 8 } style = { { lineHeight: '28px' } } >
          <
          div > 备注： 直接入库 < /div> < /
          Col > <
          Col span = { 8 } style = { { lineHeight: '28px' } } >
          <
          div > 总金额： { total ? total.formatMoney() : 0 } < /div> < /
          Col > <
          /Row> < /
          Form > <
          /Card> <
          Card className = { styles.bottomCard } style = { { height: `${bottomHeight}px` } } >
          <
          ShadowDiv showTopShadow = { false } style = { { height: `${bottomHeight - 52}px` } } >
          <
          EditTable data = { dataApply } pagination = { false } columns = { columns } size = "middle"
          rowSelection = { false } bordered ref = "commonTable"
          onChange = { this.refreshTable.bind(this) } scroll = { { y: (wsHeight - 52 - 33 - 53) } }
          /> < /
          ShadowDiv > <
          div style = { { textAlign: 'right', paddingTop: '5px' } } >
          <
          Button size = "large"
          onClick = {
            () => this.onNew(dataApply)
          }
          style = { { marginRight: '10px' } } icon = "plus" > 新建 < /Button> <
          Button size = "large"
          onClick = {
            () => this.onSave()
          }
          style = { { marginRight: '10px' } } icon = "cloud-upload-o" > 暂存 < /Button> <
          Button type = "primary"
          size = "large"
          onClick = {
            () => this.onCommit()
          }
          icon = "download" > 入库 < /Button> < /
          div > <
          /Card> {
          /* <Col span={2}><Button type="primary" size="large" onClick={() => this.onSave()}>暂存</Button></Col>
                      <Button size="large" onClick={() => this.onPrint(dataApply)} style={{ marginRight: '10px' }} icon="printer" >打印</Button>
                    <Col span={2} ><Button type="primary" size="large" onClick={() => this.onCommit()}>提交</Button></Col>
                    <Col span={2}><Button type="primary" size="large" onClick={() => this.onNew(dataApply)}>新建</Button></Col>*/
        } {
          /* <EditTable
                    ref="commonTable" onChange={this.refreshTable.bind(this)}
                    data={dataApply} scroll={{ y: (leftHeight - 18 - 72 * 2) }} pagination={false} columns={columns} bordered rowSelection={false}
                  />*/
        } <
        /div>
    );
  }
}
export default connect(({ hrpDirectIn, base, utils }) => ({ hrpDirectIn, base, utils }))(Form.create()(DirectInList));
