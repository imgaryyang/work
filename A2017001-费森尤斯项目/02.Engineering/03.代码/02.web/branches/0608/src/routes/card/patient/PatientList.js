import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './PatientSearchBar';

import styles from './Patient.less';

class PatientList extends Component {

  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'patient/load',
    });
  }

  onRowClick(record, idx) {
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        patient: record,
        selectedIdx: idx,
      },
    });
  }

  onSearch(values) {
    // console.info('list search ',values)
    this.props.dispatch({
      type: 'patient/load',
      payload: {
        query: values,
        search: true,
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'patient/load',
      payload: {
        page,
      },
    });
  }

  render() {
    // const windowHeight = document.documentElement.clientHeight;
    const { patient, utils, base } = this.props;
    const { page, patients, selectedIdx } = patient;
    const { wsHeight } = base;

    const columns = [
      /* {title:'医院id', dataIndex :'hosId', key:'hosId', },*/
      { title: '患者ID', dataIndex: 'patientId', key: 'patientId', width: 122 },
      { title: '姓名', dataIndex: 'name', key: 'name', width: 93 },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 60,
        render: (text) => {
          return utils.dicts.dis('SEX', text);
        },
      },
    ];
    return (
      <div style={{ paddingTop: '3px' }} >
        <Card style={{ height: `${wsHeight - 10}px` }} className={styles.listCard} >
          <div >
            <SearchBar onSearch={this.onSearch} />
          </div>
          <CommonTable
            rowSelection={false}
            data={patients}
            page={page}
            columns={columns}
            onPageChange={this.onPageChange}
            onRowClick={this.onRowClick}
            rowClassName={
              (record, idx) => { return idx === selectedIdx ? 'selectedRow' : ''; }
            }
            scroll={{ y: (wsHeight - 156 - 37 - 52) }}
            style={{ cursor: 'pointer' }}
            paginationStyle="mini"
            bordered
          />
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ patient, utils, base }) => ({ patient, utils, base }),
)(PatientList);

