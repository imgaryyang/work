import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';


class OutpatientChargeList extends Component {

  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onSelect(record) {
    this.props.dispatch({
      type: 'outpatientCharge/addCharge',
      addData: record,
    });
  }

  handleChange(value) {
    this.props.dispatch({
      type: 'outpatientCharge/loadOptions',
      spellCode: value,
    });
  }


  render() {
    const { outpatientCharge, utils, innerHeight } = this.props;
    const { data } = outpatientCharge;
    const { dicts } = utils;

    const columns = [
      { title: '处方号',
        dataIndex: 'recipeId',
        key: 'recipeId',
        width: 110,
      },
      { title: '项目名称',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 270,
        render: (text, record) => {
          return (
            <div>
              {text} {`(${record.specs || '-'})`}
            </div>
          );
        },
      },
      /* { title: '规格',
        dataIndex: 'specs',
        key: 'specs',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        render: (value) => {
          return dicts.dis('UNIT', value);
        },
      },*/
      {
        title: '单价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        className: 'text-align-right',
        width: 90,
        render: (value) => {
          return value ? value.formatMoney(4) : '';
        },
      },
      {
        title: '数量',
        dataIndex: 'qty',
        key: 'qty',
        className: 'text-align-right',
        width: 70,
        render: (text, record) => {
          return (
            <div>
              {text} {record.unit/* ? dicts.dis('UNIT', record.unit) : ''*/}
            </div>
          );
        },
      },
      {
        title: '执行科室',
        dataIndex: 'exeDept.deptName',
        key: 'exeDept.deptName',
        width: 90,
      },
    ];

    return (
      <div>
        <Row>
          <Col span="24">
            <CommonTable
              data={data}
              columns={columns}
              rowSelection={false}
              bordered
              pagination={false}
              className="compact-table"
              scroll={{
                y: (innerHeight - 35),
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ outpatientCharge, utils, base }) => ({ outpatientCharge, utils, base }),
)(OutpatientChargeList);
