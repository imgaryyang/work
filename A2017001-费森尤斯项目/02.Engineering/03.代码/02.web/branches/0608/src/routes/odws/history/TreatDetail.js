import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge } from 'antd';

import CommonTable from '../../../components/CommonTable';

import styles from './History.less';

class TreatDetail extends Component {

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变
    if (props.odwsHistory.record.id
      && this.props.odwsHistory.record.id !== props.odwsHistory.record.id) {
      // 载入诊疗历史信息
      this.props.dispatch({
        type: 'odwsHistory/loadDetail',
      });
    }
  }

  render() {
    const { odws, odwsHistory, utils } = this.props;
    const { odwsWsHeight } = odws;

    const { diagnosis, medicalRecord, orders, totalAmt } = odwsHistory;

    const diagnosisColumns = [
      { title: '序号', dataIndex: 'sortNo', key: 'sortNo', width: 50, className: 'text-align-center' },
      { title: '诊断代码', dataIndex: 'diseaseId', key: 'diseaseId', width: 130 },
      { title: '诊断描述', dataIndex: 'diseaseName', key: 'diseaseName' },
      { title: '诊断科室', dataIndex: 'diseaseDept.deptName', key: 'diseaseDept', width: 90 },
      { title: '诊断医生', dataIndex: 'diseaseDoc.name', key: 'diseaseDoc', width: 80 },
      { title: '主诊断',
        dataIndex: 'iscurrent',
        key: 'iscurrent',
        width: 60,
        render: text => (
          <span><Badge status={text === '1' ? 'success' : 'error'} />{text === '1' ? '是' : '否'}</span>
        ),
        className: 'text-align-center',
      },
    ];

    // 不需要特殊渲染的列使用此方法公用判断是否跨列
    const renderContent = (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      if (!row.itemName) {
        obj.props.colSpan = 0;
      }
      return obj;
    };

    const orderColumns = [
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
                </div>
              ),
              props: {
                colSpan: 9,
              },
            };
          }
        },
      },
      { title: '序号',
        dataIndex: 'recipeNo',
        key: 'recipeNo',
        width: 45,
        className: 'text-no-wrap text-align-center',
        render: renderContent,
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
            children: text ? parseFloat(text).formatMoney() : '',
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
      { title: '总价',
        dataIndex: 'salePrice',
        key: 'sumAmt',
        width: 80,
        className: 'text-no-wrap text-align-right',
        render: (text, record) => {
          return {
            children: text && record.qty ? (parseFloat(text) * parseFloat(record.qty)).formatMoney() : '',
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
      { title: '执行科室',
        dataIndex: 'exeDept',
        key: 'exeDept',
        width: 80,
        render: (text, record) => {
          return {
            children: utils.depts.disDeptName(utils.deptsIdx, text),
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
    ];

    return (
      <div className={styles.detailContainer} style={{ height: `${odwsWsHeight}px` }} >
        <Card style={{ marginTop: '0' }} className={styles.detailCard} title="诊断" >
          <CommonTable
            className={styles.detailTable}
            rowSelection={false}
            data={diagnosis}
            columns={diagnosisColumns}
            pagination={false}
            bordered
            size="middle"
          />
        </Card>
        <Card className={`${styles.detailCard} ${styles.medicalRecord}`} title="病历" >
          <font>主述：</font>
          <span>{medicalRecord.chiefComplaint}</span>
          <font>现病史：</font>
          <span>{medicalRecord.presentIllness}</span>
          <font>既往病史：</font>
          <span>{medicalRecord.pastHistory}</span>
          <font>体格检查：</font>
          <span>{medicalRecord.physicalExam}</span>
          <font>辅助检查：</font>
          <span>{medicalRecord.otherExam}</span>
          <font>病人体重：</font>
          <span>{medicalRecord.weight}{medicalRecord.weight ? ' 公斤（kg）' : ''}</span>
          <font>病人身高：</font>
          <span>{medicalRecord.height}{medicalRecord.height ? ' 厘米（cm）' : ''}</span>
          <font>嘱托：</font>
          <span>{medicalRecord.moOrder}</span>
        </Card>
        <Card className={styles.detailCard} title="医嘱" >
          <CommonTable
            className={styles.detailTable}
            rowSelection={false}
            data={orders}
            columns={orderColumns}
            pagination={false}
            bordered
            size="middle"
            footer={() => {
              return <div className={styles.totalAmt} >共计：<font>{totalAmt.formatMoney()}</font> 元</div>;
            }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ odws, odwsDiagnose, odwsHistory, utils }) => ({ odws, odwsDiagnose, odwsHistory, utils }),
)(TreatDetail);
