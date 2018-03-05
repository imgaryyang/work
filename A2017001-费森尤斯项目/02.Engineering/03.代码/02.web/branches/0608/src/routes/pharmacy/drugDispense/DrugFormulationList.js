import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
// import uuid from 'uuid';
import SearchBar from './SearchBar';

import styles from './DrugDispense.less';

class DrugFormulationList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onInvoiceRowClick = this.onInvoiceRowClick.bind(this);
    this.onRecipeRowClick = this.onRecipeRowClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'drugDispense/loadInvoice',
      payload: {
        query: {
          drugDeptId: this.props.base.user.loginDepartment.id,
          applyState: '1',
        },
      },
    });
  }

  onSearch(query) {
    this.props.dispatch({
      type: 'drugDispense/loadInvoice',
      payload: {
        query,
      },
    });
  }

  onInvoiceRowClick(record, idx) {
    this.props.dispatch({
      type: 'drugDispense/loadRecipe',
      payload: {
        invoice: record,
        invoiceIdx: idx,
      },
    });
  }

  onRecipeRowClick(record, idx) {
    this.props.dispatch({
      type: 'drugDispense/setState',
      payload: {
        formulation: record,
        formulationIdx: idx,
      },
    });
  }

  render() {
    const { drugDispense, base } = this.props;
    const { invoices, formulations, page, invoiceIdx, formulationIdx } = drugDispense;
    const { wsHeight } = base;

    const invoicesColumns = [
      { title: '发票号', dataIndex: 0, key: 'invoiceNo', width: 130 },
      /* { title: '条形码', dataIndex: 1, key: 'barcode', width: 120 },*/
      { title: '姓名', dataIndex: 3, key: 'name', width: 93 },
    ];
    const formulationsColumns = [
      { title: '发票号', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 130 },
      { title: '处方号', dataIndex: 'recipeId', key: 'recipeId', width: 120 },
      { title: '金额',
        dataIndex: 'totCost',
        key: 'totCost',
        width: 80,
        className: 'text-align-right',
        render: text => text.formatMoney() },
    ];

    const listAreaHeight = wsHeight - 10 - 148 - 3;

    return (
      <div style={{ paddingTop: '3px' }} >
        <SearchBar onSearch={this.onSearch} />
        <Card style={{ height: `${(listAreaHeight / 2) - 12}px` }} className={styles.leftListContainer} >
          {/* page={page}
          paginationStyle="mini"*/}
          <CommonTable
            rowKey={record => `INVROW${record[0]}${record[1]}`}
            rowSelection={false}
            data={invoices}
            columns={invoicesColumns}
            onRowClick={this.onInvoiceRowClick}
            pagination={false}
            scroll={{ y: ((listAreaHeight / 2) - 10) }}
            bordered
            rowClassName={
              (record, idx) => { return idx === invoiceIdx ? styles.selectedRow : {}; }
            }
          />
        </Card>
        <Card style={{ height: `${(listAreaHeight / 2) - 12}px` }} className={styles.leftListContainer} >
          <CommonTable
            rowKey={record => `RCPROW${record.invoiceNo}${record.recipeId}`}
            rowSelection={false}
            data={formulations}
            columns={formulationsColumns}
            onRowClick={this.onRecipeRowClick}
            pagination={false}
            scroll={{ y: ((listAreaHeight / 2) - 10) }}
            bordered
            rowClassName={
              (record, idx) => { return idx === formulationIdx ? styles.selectedRow : {}; }
            }
          />
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ drugDispense, base }) => ({ drugDispense, base }),
)(DrugFormulationList);

