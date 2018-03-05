import React from 'react';
import { Button, Row, Col, Modal, Icon, notification } from 'antd';
import BaseComponent from '../../../components/BaseComponent';
import SearchGroup from '../../../components/SearchGroup';

const confirm = Modal.confirm;

class CompanyInfoSearchBar extends BaseComponent {
  render() {
    const { selectedRowKeys } = this.props;

    const onSearch = (values) => {
      this.props.dispatch({
        type: 'companyInfo/load',
        payload: { query: values },
      });
    };

    const onAdd = () => {
      this.props.dispatch({ type: 'companyInfo/toggleVisible' });
      this.props.dispatch({
        type: 'utils/setState',
        payload: { record: {}, shortcuts: true },
      });
    };

    const onDeleteAll = () => {
      const self = this;
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        confirm({
          title: `您确定要删除选择的${selectedRowKeys.length}条记录吗?`,
          onOk() {
            self.props.dispatch({ type: 'companyInfo/deleteSelected' });
          },
        });
      } else {
        notification.info({ message: '提示信息：', description: '您目前没有选择任何数据！' });
      }
    };

    const searchGroupProps = {
      size: 'large',
      select: true,
      selectOptions: [
        { value: 'companySpell', name: '拼音' },
        { value: 'companyWb', name: '五笔' },
        { value: 'companyName', name: '名称' },
      ],
      selectProps: {
        defaultValue: 'companySpell',
      },
      onSearch,
    };

    return (
      <div className="action-form-wrapper">
        <Row type="flex" gutter={24}>
          <Col lg={6} md={6} sm={16} xs={24} className="action-form-searchbar">
            <SearchGroup {...searchGroupProps} />
          </Col>
          <Col lg={{ offset: 6, span: 12 }} md={{ offset: 6, span: 12 }} sm={8} xs={24} className="action-form-operating">
            <Button type="primary" size="large" onClick={onAdd.bind(this)} className="btn-left">
              <Icon type="plus" />新增
            </Button>
            <Button type="danger" size="large" onClick={onDeleteAll.bind(this)} className="btn-right">
              <Icon type="delete" />删除
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CompanyInfoSearchBar;
