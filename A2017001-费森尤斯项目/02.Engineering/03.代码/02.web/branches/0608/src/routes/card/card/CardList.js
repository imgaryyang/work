import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import CommonTable from '../../../components/CommonTable';
import SearchBar from './CardSearchBar';

import DictRadioGroup from '../../../components/DictRadioGroup';

class CardList extends Component {

  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);

    this.handleCTChange = this.handleCTChange.bind(this);
    this.handleCFChange = this.handleCFChange.bind(this);
    this.filter = this.filter.bind(this);
  }

  state = {
    fctVisible: false,
    fcfVisible: false,
    cardType: '',
    cardFlag: '',
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'card/load',
    });
  }

  onRowClick(record) {
    this.props.dispatch({
      type: 'card/setState',
      payload: { card: record },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'card/load',
      payload: {
        query: values,
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'card/load',
      payload: {
        page,
      },
    });
  }

  handleCTChange(e) {
    this.setState({ cardType: e.target.originData.columnKey }, () => this.filter());
  }

  handleCFChange(e) {
    this.setState({ cardFlag: e.target.originData.columnKey }, () => this.filter());
  }

  filter() {
    this.setState({
      fctVisible: false,
      fcfVisible: false,
    });
    this.onSearch({
      ...this.props.card.query,
      cardType: this.state.cardType,
      cardFlag: this.state.cardFlag,
    });
  }

  render() {
    const { card, utils, base } = this.props;
    const { page, cards } = card;
    const { wsHeight } = base;

    const columns = [
      /* {title:'医院id', dataIndex :'hosId', key:'hosId', },*/
      { title: '患者ID', dataIndex: 'patientId', key: 'patientId', width: 122 },
      { title: '姓名', dataIndex: 'name', key: 'name', width: 93 },
      { title: '就诊卡号', dataIndex: 'cardNo', key: 'cardNo', width: 93 },
      { title: '卡类型',
        dataIndex: 'cardType',
        key: 'cardType',
        width: 93,
        render: (text) => { return utils.dicts.dis('CARD_TYPE', text); },
        filterDropdown: (
          <Card bodyStyle={{ padding: '12px' }} >
            <DictRadioGroup columnName="CARD_TYPE" onChange={this.handleCTChange} value={this.state.cardType} />
            <div style={{ whiteSpace: 'nowrap' }} >
              <Button
                onClick={() => {
                  this.setState({ cardType: '' }, () => this.filter());
                }}
                style={{ marginTop: '10px', width: '70px' }}
                size="small"
              >清空</Button>
            </div>
          </Card>
        ),
        filterDropdownVisible: this.state.fctVisible,
        onFilterDropdownVisibleChange: visible => this.setState({ fctVisible: visible }),
      },
      { title: '卡状态',
        dataIndex: 'cardFlag',
        key: 'cardFlag',
        width: 93,
        render: (text) => { return utils.dicts.dis('CARD_FLAG', text); },
        filterDropdown: (
          <Card bodyStyle={{ padding: '12px' }} >
            <DictRadioGroup columnName="CARD_FLAG" onChange={this.handleCFChange} value={this.state.cardFlag} />
            <div style={{ whiteSpace: 'nowrap' }} >
              <Button
                onClick={() => {
                  this.setState({ cardFlag: '' }, () => this.filter());
                }}
                style={{ marginTop: '10px', width: '70px' }}
                size="small"
              >清空</Button>
            </div>
          </Card>
        ),
        filterDropdownVisible: this.state.fcfVisible,
        onFilterDropdownVisibleChange: visible => this.setState({ fcfVisible: visible }),
      },
    ];
    return (
      <div style={{ paddingTop: '3px' }} >
        <div style={{ marginBottom: 8 }} >
          <SearchBar onSearch={this.onSearch} />
        </div>
        <CommonTable
          rowSelection={false}
          data={cards}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange}
          onRowClick={this.onRowClick}
          scroll={{ y: (wsHeight - 41 - 36 - 62) }}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ card, utils, base }) => ({ card, utils, base }))(CardList);

