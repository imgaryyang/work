import React, { Component } from 'react';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class ChargeStatisByDocList extends Component { 

  onPageChange(page) {
    this.props.dispatch({
      type: 'chargeStatisByDoc/load',
      payload: { page },
    });
  }

  render() {
    const { data, chargeStatisByDoc } = this.props;
    const { dataList, title, rowMap } = data;
    const { xiyaoSum, zhenchaSum, zhiliaoSum, guahaoSum, zhongchengSum, huayanSum } = chargeStatisByDoc;
    let dataSize = 0;
    if (rowMap) {
      dataSize = rowMap.size;
    }
    console.info(data);
    let Sum = 0;
    Sum = xiyaoSum + zhenchaSum + zhiliaoSum + guahaoSum + zhongchengSum + huayanSum;
    const { wsHeight } = this.props.base;
    let columnItem = [];
    if (title && title.length > 0) {
      columnItem = title.map((row, index) => {
        if (index === 0) {
          return {
            title: row.title,
            dataIndex: row.dataIndex,
            key: row.dataIndex,
            width: '120px',
            render: (value, row, index) => {
              const obj = {
                children: value,
                props: {},
              };
              for (let i = 0; i < dataSize; i++) {
                if (rowMap[index] && rowMap[index] > 1) { /* 合并行的第一条数据*/
                  obj.props.rowSpan = rowMap[index];
                } else if (rowMap[index] === 1) { /* 一个科室只有一条数据*/
                  obj.props.rowSpan = 1;
                } else { /* 该行属于合并行内*/
                  obj.props.rowSpan = 0;
                }
              }
              return obj;
            },
          };
        } else if (index === 1) {
          return (
            { title: row.title, dataIndex: row.dataIndex, key: row.dataIndex, width: '120px' }
          );
        } else {
          return (
            { title: row.title, dataIndex: row.dataIndex, key: row.dataIndex, width: '120px', className: 'text-align-right', render: text => (text ? text.formatMoney(2) : '0.00') }
          );
        }
      }, 
      );
    }
    return (
      <div>
      <CommonTable
        data={dataList}
        size="middle"
        className="compact-table"
        bordered
        columns={columnItem}
        pagination={false}
        onPageChange={this.onPageChange.bind(this)}
        rowSelection={false}
        scroll={{ y: (wsHeight - 32) }}
      />
      <div style={{ position: 'absolute', left: '10px', bottom: '-40px' }} >
          <font style={{ fontSize: '14px' }} >
            {`西药费总计：${xiyaoSum ? xiyaoSum.formatMoney() : 0.00} 元，中成药费总计：${zhongchengSum ? zhongchengSum.formatMoney() : 0.00} 元，挂号费总计：${guahaoSum ? guahaoSum.formatMoney() : 0.00} 元，诊查费总计：${zhenchaSum ? zhenchaSum.formatMoney() : 0.00} 元, 治疗费总计：${zhiliaoSum ? zhiliaoSum.formatMoney() : 0.00} 元，化验费总计：${huayanSum ? huayanSum.formatMoney() : 0.00} 元，合计：${Sum ? Sum.formatMoney() : 0.00} 元，`}
          </font> 
        </div>
      </div>
    ); 
  }
}
export default connect(({ base, utils, chargeStatisByDoc }) => ({ base, utils, chargeStatisByDoc }))(ChargeStatisByDocList);
