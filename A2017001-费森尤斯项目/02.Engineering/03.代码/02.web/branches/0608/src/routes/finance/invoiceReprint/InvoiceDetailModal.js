import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class InvoiceDetailModal extends Component {
  onPageChange(page) {
    this.props.dispatch({
      type: 'invoiceReprint/loadDetail',
      payload: { page },
    });
  }

  close() {
    this.props.dispatch({
      type: 'invoiceReprint/setState',
      payload: {
        detailData: null,
        detailQuery: { invoiceNo: null },
      },
    });
  }
  print() {
    const regId = this.props.invoiceReprint.detailQuery.regId;
    const invoiceNo = this.props.invoiceReprint.detailQuery.invoiceNo;
    this.props.dispatch({
      type: 'print/getPrintInfo',
      payload: { code: '006', bizId: `${regId}&&&${invoiceNo}` },
    });
  }

  render() {
    const { detailPage, detailData, detailQuery } = this.props.invoiceReprint;
    const { dicts } = this.props.utils;
    const visible = !!detailQuery.invoiceNo;
    const title = `收费明细${detailQuery.invoiceNo}`;
    const { wsHeight } = this.props.base;

    const columns = [
      { title: '基本信息',
        dataIndex: 'feeType',
        key: 'feeType',
        width: 120,
        render: (text, record) => {
          return (
            <div>
              {`姓名：${record.patient ? record.patient.name : ''}`}<br />
              {`就诊类别：${dicts.dis('FEE_TYPE', text)}`}<br />
              {`费用分类：${dicts.dis('FEE_CODE', record.feeCode)}`}
            </div>
          );
        },
      },
      // { title: '病人姓名', dataIndex: 'patient.name', key: 'patient.name', width: 100 },
      // { title: '就诊类别',
      //   dataIndex: 'feeType',
      //   key: 'feeType',
      //   width: 70,
      //   render: (value) => {
      //     return dicts.dis('FEE_TYPE', value);
      //   },
      // },
      { title: '处方',
        dataIndex: 'recipeDept',
        key: 'recipeDept',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              {`科室：${record.recipeDept ? record.recipeDept.deptName : ''}`}<br />
              {`医生：${record.recipeDoc ? record.recipeDoc.name : ''}`}<br />
              {`时间：${record.recipeTime}`}
            </div>
          );
        },
      },
      // { title: '处方科室', dataIndex: 'recipeDept', key: 'recipeDept', width: 70, render: value => value.deptName },
      // { title: '处方医生', dataIndex: 'recipeDoc.name', key: 'recipeDoc.name', width: 100 },
      // { title: '处方时间', dataIndex: 'recipeTime', key: 'recipeTime', width: 100 },
      { title: '项目',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 140,
        render: (text, record) => {
          return (
            <div>
              {`名称：${record.itemName}`}<br />
              {`规格：${record.specs}`}
            </div>
          );
        },
      },
      // { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: 100 },
      // { title: '项目规格', dataIndex: 'specs', key: 'specs', width: 100 },
      { title: '收费',
        dataIndex: 'qty',
        key: 'qty',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              {`数量：${text}`}<br />
              {`付数：${record.days}`}<br />
              {`单位：${record.unit}`}<br />
              {`单价：${(record.salePrice || 0).formatMoney(4)}`}
            </div>
          );
        },
      },
      // { title: '收费数量', dataIndex: 'qty', key: 'qty', width: 100 },
      // { title: '付数', dataIndex: 'days', key: 'days', width: 100 },
      // { title: '收费单位', dataIndex: 'unit', key: 'unit', width: 100 },
      // { title: '收费单价', dataIndex: 'salePrice', key: 'salePrice', width: 100, render: text => (text || 0.00).formatMoney(), className: 'text-align-right' },
      { title: '金额',
        dataIndex: 'totCost',
        key: 'totCost',
        width: 120,
        render: (text, record) => {
          return (
            <div>
              {`项目金额：${(text || 0).formatMoney(2)}`}<br />
              {`报销金额：${(record.pubCost || 0).formatMoney(2)}`}<br />
              {`自费金额：${(record.ownCost || 0).formatMoney(2)}`}
            </div>
          );
        },
      },
      // { title: '项目金额', dataIndex: 'totCost', key: 'totCost', width: 100, render: text => (text || 0.00).formatMoney(), className: 'text-align-right' },
      // { title: '报销金额', dataIndex: 'pubCost', key: 'pubCost', width: 100, render: text => (text || 0.00).formatMoney(), className: 'text-align-right' },
      // { title: '自费金额', dataIndex: 'ownCost', key: 'ownCost', width: 100, render: text => (text || 0.00).formatMoney(), className: 'text-align-right' },
      { title: '减免',
        dataIndex: 'rebateType',
        key: 'rebateType',
        width: 70,
        render: (text, record) => {
          return (
            <div>
              {`类型：${dicts.dis('REBATE_TYPE', text) || '无'}`}<br />
              {`金额：${(record.rebateCost || 0).formatMoney(2)}`}
            </div>
          );
        },
      },
      // { title: '减免类型',
      //   dataIndex: 'rebateType',
      //   key: 'rebateType',
      //   width: 70,
      //   render: (value) => {
      //     return dicts.dis('REBATE_TYPE', value);
      //   },
      // },
      // { title: '减免金额', dataIndex: 'rebateCost', key: 'rebateCost', width: 100, render: text => (text || 0.00).formatMoney(), className: 'text-align-right' },
      // { title: '分类/状态',
      //   dataIndex: 'feeCode',
      //   key: 'feeCode',
      //   width: 120,
      //   render: (text, record) => {
      //     return (
      //       <div>
      //         {`分类：${dicts.dis('FEE_CODE', text)}`}<br />
      //         {`状态：${dicts.dis('APPLY_STATE', record.applyState)}`}
      //       </div>
      //     );
      //   },
      // },
      // { title: '费用分类',
      //   dataIndex: 'feeCode',
      //   key: 'feeCode',
      //   width: 70,
      //   render: (value) => {
      //     return dicts.dis('FEE_CODE', value);
      //   },
      // },
      // { title: '状态',
      //   dataIndex: 'applyState',
      //   key: 'applyState',
      //   width: 70,
      //   render: (value) => {
      //     return dicts.dis('APPLY_STATE', value);
      //   },
      // },
      { title: '收费操作信息',
        dataIndex: 'chargeOper.name',
        key: 'chargeOper.name',
        width: 110,
        render: (text, record) => {
          return (
            <div>
              {`状态：${dicts.dis('APPLY_STATE', record.applyState)}`}<br />
              {`人员：${record.chargeOper ? record.chargeOper.name : ''}`}<br />
              {`时间：${record.chargeTime}`}
            </div>
          );
        },
      },
      // { title: '收费人员', dataIndex: 'chargeOper.name', key: 'chargeOper.name', width: 100 },
      // { title: '收费时间', dataIndex: 'chargeTime', key: 'chargeTime', width: 100 },
      { title: '取消操作信息',
        dataIndex: 'cancelFlag',
        key: 'cancelFlag',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              {`状态：${dicts.dis('CANCEL_FLAG', text) || '无'}`}<br />
              {`人员：${record.cancelOper ? (record.cancelOper.name || '无') : '无'}`}<br />
              {`时间：${record.cancelTime || '无'}`}<br />
            </div>
          );
        },
      },
      // { title: '取消标志',
      //   dataIndex: 'cancelFlag',
      //   key: 'cancelFlag',
      //   width: 70,
      //   render: (value) => {
      //     return dicts.dis('CANCEL_FLAG', value);
      //   },
      // },
      // { title: '取消人员', dataIndex: 'cancelOper.name', key: 'cancelOper.name', width: 100 },
      // { title: '取消时间', dataIndex: 'cancelTime', key: 'cancelTime', width: 100 },
    ];

    // hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
    return (
      <Modal
        width={1080}
        title={title}
        visible={visible}
        closable
        onOk={this.print.bind(this)}
        okText="打印"
        cancelText="取消"
        onCancel={this.close.bind(this)}
      >
        <CommonTable
          rowSelection={false}
          data={detailData}
          page={detailPage}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          bordered
          scroll={{ y: (wsHeight - 135) }}
        />
      </Modal>
    );
  }
}

export default connect(({ invoiceReprint, utils, base }) =>
  ({ invoiceReprint, utils, base }))(InvoiceDetailModal);

    // 发票号、费用分类、金额、处方科室、执行科室、取消标志
    // INVOICE_NO FEE_CODE TOT_COST RECIPE_DEPT EXE_DEPT CANCEL_FLAG  CANCEL_OPER CANCEL_TIME
    // const columns = [
    //   { title: '费用分类',
    //     dataIndex: 'feeCode',
    //     key: 'feeCode',
    //     width: 70,
    //     render: (value) => {
    //       return dicts.dis('FEE_CODE', value);
    //     },
    //   },
    //   { title: '金额', dataIndex: 'totCost', key: 'totCost', width: 100 },
    //   { title: '处方科室', dataIndex: 'recipeDept', key: 'recipeDept', width: 100 },
    //   { title: '执行科室', dataIndex: 'exeDept', key: 'exeDept', width: 100 },
    //   { title: '取消标志',
    //     dataIndex: 'cancelFlag',
    //     key: 'cancelFlag',
    //     width: 70,
    //     render: (value) => {
    //       return dicts.dis('CANCEL_FLAG', value);
    //     },
    //   },
    //   { title: '取消人员', dataIndex: 'cancelOper', key: 'cancelOper', width: 100 },
    //   { title: '取消时间', dataIndex: 'cancelTime', key: 'cancelTime', width: 100 },
    // ];
