/* eslint linebreak-style: ["error", "windows"]*/
import React, { Component } from 'react';
import { Icon, Button, Menu, Dropdown, Modal } from 'antd';
import CommonTable from '../../../components/CommonTable';

const confirm = Modal.confirm;
class PhaRecipeBackList extends Component {

  onEdit(record) {
    this.props.dispatch({
      type: 'phaRecipe/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    this.props.dispatch({ type: 'phaRecipe/delete', id: record.id });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'phaRecipe/load',
      payload: { values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'phaRecipe/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'phaRecipe/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts } = this.props;
    const handleMenuClick = (record, e) => {
      const self = this;
      if (e.key === '1') {
        confirm({
          title: '您确定要退药吗?',
          onOk() {
            self.props.dispatch({
              type: 'phaRecipe/update',
              id: record.id,
            });
          },
        });
      }
    };

    const columns = [
      {
        title: '发药申请单',
        dataIndex: 'applyNo',
        key: 'applyNo',
      }, {
        title: '商品名称',
        dataIndex: 'tradeName',
        key: 'tradeName',
      }, {
        title: '商品规格',
        dataIndex: 'specs',
        key: 'specs',
      }, {
        title: '正负类型',
        dataIndex: 'plusMinus',
        key: 'plusMinus',
        render: (value) => {
          return value == "1"
            ? '正'
            : '负';
        },
      }, {
        title: '零售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
      }, {
        title: '申请数量',
        dataIndex: 'applyNum',
        key: 'applyNum',
      }, {
        title: '申请状态',
        dataIndex: 'applyState',
        key: 'applyState',
        render: (value) => {
          return dicts.dis('APPLY_STATE', value);
        },
      }, {
        title: '处方id',
        dataIndex: 'recipeId',
        key: 'recipeId',
      }, {
        title: '付数',
        dataIndex: 'days',
        key: 'days',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (record.applyState == '2'){
            return (
              <Dropdown
                overlay={
                  <Menu onClick={e => handleMenuClick(record, e)}>
                    <Menu.Item key="1">退药</Menu.Item>
                  </Menu>}
              >
                <Button style={{ border: 'none' }}>
                  <Icon style={{ marginRight: 2 }} type="bars" />
                  <Icon type="down" />
                </Button>
              </Dropdown>
            );
          }
        },
      },
    ];
    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
        />
      </div>
    );
  }
}
export default PhaRecipeBackList;
