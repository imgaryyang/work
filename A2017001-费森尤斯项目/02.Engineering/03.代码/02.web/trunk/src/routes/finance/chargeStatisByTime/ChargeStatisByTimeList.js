import React, { Component } from 'react';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class chargeStatisByTimeList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'chargeStatisByDoc/loadByTimeAndDept',
    });
  }

  render() {
    const { dataOfTime, chargeStatisByDoc } = this.props;
    const { xuetouSum, fumoSum } = chargeStatisByDoc;
    const { dataList, title, timeList } = dataOfTime;
    const { wsHeight } = this.props.base;
    let columnItem = [];
    if (title && title.length > 0) {
      columnItem = title.map((row, index) => {
        if (index === 0) {
          return {
            title: '缴费时间',
            dataIndex: 'dateTime',
            key: 'dateTime',
            width: '120px',
          };
        } else {
          return (
          {
            title: row.title,
            dataIndex: row.dataIndex,
            key: row.dataIndex,
            width: '120px',
            render: (value) => {
              return value ? value.formatMoney(2) : '0';
            },
          }
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
        rowSelection={false}
        scroll={{ y: (wsHeight - 32) }}
      />
       <div style={{ position: 'absolute', left: '10px', bottom: '-30px' }} >
          <font style={{ fontSize: '14px' }} >
            {`血透室总计：${xuetouSum ? xuetouSum.formatMoney() : 0.00} 元，腹膜室总计：${fumoSum ? fumoSum.formatMoney() : 0.00} 元` }
          </font> 
        </div>
      </div>
    );
  }
}
export default connect(({ base, utils, chargeStatisByDoc }) => ({ base, utils, chargeStatisByDoc }))(chargeStatisByTimeList);
