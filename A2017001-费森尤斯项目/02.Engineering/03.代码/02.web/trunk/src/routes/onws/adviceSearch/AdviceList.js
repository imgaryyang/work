import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Modal } from 'antd';
import CommonTable from '../../../components/CommonTable';
import ShadowDiv from '../../../components/ShadowDiv';

import styles from './Order.less';

class OrderList extends Component {
  componentWillMount() {
    // 载入医嘱信息
    this.props.dispatch({
      type: 'advice/load',
    });
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'advice/load',
      payload: { page },
    });
  }
  printData(record) {
    if (record.id) {
      Modal.confirm({
        content: '确定要打印吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.props.dispatch({
            type: 'print/getPrintInfo',
            payload: { code: '120', bizId: record.regId },
          });
        },
      });
    }
  }
  doPrint(drugFlag, regId) {
    // 治疗单打印
    if (drugFlag === '3') {
      this.props.dispatch({
        type: 'print/getPrintInfo',
        payload: { code: '004', bizId: regId },
      });
    } else { // 处方单打印
      this.props.dispatch({
        type: 'print/getPrintInfo',
        payload: { code: '002', bizId: regId },
      });
    }
  }

  render() {
    const { advice, utils, odws, odwsOrder, page } = this.props;
    const { data } = advice;
    const { odwsWsHeight } = odws;
    const { order } = odwsOrder;
    const bottomCardHeight = order.drugFlag !== '3' ?
      (odwsWsHeight - 147 - 10 - 6) :
      (odwsWsHeight - 106 - 10 - 6);
    // 不需要特殊渲染的列使用此方法公用判断是否跨列
    const columns = [
      { title: '姓名',
        dataIndex: 'patient.name',
        key: 'patient.name',
        width: '12%',
        className: 'text-no-wrap  text-align-center',
        render: (text, record) => {
          return `${record.patient ? record.patient.name : ''}`;
        },
      },
      { title: '挂号级别',
        dataIndex: 'regLevel',
        key: 'regLevel',
        width: '12%',
        className: 'text-no-wrap text-align-center',
        render: (text, record) => {
          return record.regLevel ? `${utils.dicts.dis('REG_LEVEL', text)}` : '';
        },
      },
      { title: '挂号科室',
        dataIndex: 'regDept.deptName',
        className: 'text-no-wrap text-align-center',
        key: 'regDept.deptName',
        width: '12%',
      },
      { title: '接诊医生',
        dataIndex: 'seeDoc.name',
        key: 'seeDoc.name',
        width: '12%',
        className: 'text-no-wrap text-align-center',
      },
      { title: '挂号日期',
        dataIndex: 'regTime',
        key: 'regTime',
        width: '15%',
        className: 'text-no-wrap text-align-center',
      },
      { title: '状态',
        dataIndex: 'orderState',
        key: 'orderState',
        className: 'text-no-wrap text-align-center',
        width: '15%',
        render: (value) => {
          if (value === '1') {
            return '新开立';
          } else if (value === '2') {
            return '已收费';
          } else {
            return '已执行';
          }
        },
      },
      { title: '操作',
        key: 'action',
        width: '15%',
        className: 'text-align-center',
        render: (text, record) => {
          return <Button onClick={this.printData.bind(this, record)} ><Icon type="printer" />打印明细</Button>;
        },
      },
    ];

    const expandTable = (record) => {
      const expandColumns = [
        { title: '组合号',
          dataIndex: 'comboNo',
          key: 'comboNo',
          width: 60,
          className: 'text-no-wrap text-align-center',
          render: (text, record) => {
            if (record.itemName) {
              return text;
            } else {
              return {
                children: (
                  <div style={{ fontWeight: 'bold', textAlign: 'left' }} >
                    {`处方号：${record.recipeId} (${utils.dicts.dis('GROUP_TYPE', record.drugFlag)})`}
                    <div style={{ float: 'right' }} >
                      <Button icon="printer" size="small" onClick={() => this.doPrint(record.drugFlag, record.regId)}>打印</Button>
                    </div>
                  </div>
                ),
                props: {
                  colSpan: 9,
                },
              };
            }
          },
        },
        { title: '项目',
          dataIndex: 'itemName',
          key: 'itemName',
          className: styles.itemNameCol,
          render: (text, record) => {
            const qty = `${record.qty ? parseFloat(record.qty) : '- '}${record.unit}`;
            const days = ` | ${record.days ? record.days : '-'}天`;
            const usage = record.usage ? `${utils.dicts.dis('USAGE', record.usage)} ` : '';
            const dosage = record.doseOnce || record.doseUnit ? ` 每次 ${record.doseOnce ? parseFloat(record.doseOnce) : '-'}${record.doseUnit || ''}` : '';
            const freq = record.freqDesc ? ` | ${record.freqDesc} ` : '';
            return {
              children: (
                <div>
                  {`${text} (${qty}${record.drugFlag !== '3' ? days : ''})`}
                  {
                    record.drugFlag !== '3' ? (
                      <div>
                        {`${usage}${dosage}${freq}`}
                      </div>
                    ) : null
                  }
                </div>
            ),
              props: {
                colSpan: record.itemName ? 1 : 0,
              },
            };
          },
        },
        { title: '单价',
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: 80,
          className: 'text-no-wrap text-align-right',
          render: (text, record) => {
            return {
              children: text ? parseFloat(text).formatMoney(4) : '',
              props: {
                colSpan: record.itemName ? 1 : 0,
              },
            };
          },
        },
        { title: '数量',
          dataIndex: 'qty',
          key: 'qty',
          width: 45,
          className: 'text-no-wrap text-align-right',
          render: (text, record) => {
            return {
              children: parseFloat(text),
              props: {
                colSpan: record.itemName ? 1 : 0,
              },
            };
          },
        },
      ];
      return (
        <CommonTable
          data={record.orders}
          size="small"
          bordered
          columns={expandColumns}
          pagination={false}
          rowSelection={false}
        />
      );
    };


    return (
      <div>
        <ShadowDiv showTopShadow={false} showBottomShadow={false} style={{ height: `${bottomCardHeight - 5 - 50}px` }} >
          <CommonTable
            data={data}
            columns={columns}
            page={page}
            onPageChange={this.onPageChange.bind(this)}
            bordered
            expandedRowRender={record => expandTable(record)}
            className="compact-table"
            scroll={{
              y: (bottomCardHeight - 10 - 33 - 52),
            }}
            rowSelection={false}
          />
        </ShadowDiv>
      </div>
    );
  }
}

export default connect(
  ({ utils, advice, odws, odwsOrder, print }) => ({ utils, advice, odws, odwsOrder, print }),
)(OrderList);

