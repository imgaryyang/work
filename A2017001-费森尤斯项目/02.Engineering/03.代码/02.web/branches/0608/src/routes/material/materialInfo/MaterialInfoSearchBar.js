import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon } from 'antd';

// import DictCheckable from '../../../components/DictCheckable';
import DictSelect from '../../../components/DictSelect';
import DelRowsBtn from '../../../components/TableDeleteRowsButton';

const FormItem = Form.Item;

class MaterialInfoSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.onSearch = this.onSearch.bind(this);
    /* this.setSearchObjs = this.setSearchObjs.bind(this);
    this.setTag = this.setTag.bind(this);*/
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  onSearch(values) {
    // console.log('values in onSearch:', values);
    this.props.dispatch({
      type: 'material/load',
      payload: {
        query: values,
        startFrom0: true,
      },
    });
  }

  onSelectChange(value) {
    // console.log('value:', value);
    this.props.dispatch({
      type: 'material/setSearchObjs',
      payload: { ...this.props.searchObj, materialType: value },
    });
  }

  /* setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'material/setSearchObjs',
      payload: searchObj,
    });
  }

  setTag(selectedTag) {
    this.props.dispatch({
      type: 'material/setState',
      payload: { selectedTag },
    });
  }*/

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      // console.log('values:', values);
      if (err) return;
      if (!err) {
        // this.setSearchObjs(values);
        this.onSearch(values);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    /* this.setTag(null);
    this.setSearchObjs(null);*/
    this.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, dicts, searchObjs, selectedTag, namespace } = this.props;

    const onAdd = () => {
      this.props.dispatch({ type: 'material/toggleVisible' });
      this.props.dispatch({
        type: 'utils/setState',
        payload: { record: {} },
      });
    };

    const onDeleteAll = () => {
      const self = this;
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        /* confirm({
          title: `您确定要删除选择的${selectedRowKeys.length}条记录吗?`,
          onOk() {
            self.props.dispatch({ type: 'material/deleteSelected' });
          },
        });*/
        self.props.dispatch({ type: 'material/deleteSelected' });
      }/* else {
        notification.info({ message: '提示信息：', description: '您目前没有选择任何数据！' });
      }*/
    };

    /* const dictProps = {
      namespace,
      dictArray: dicts.MATERIAL_TYPE,
      tagColumn: 'materialType',
      searchObjs,
      selectedTag,
    };*/

    return (
      <div className="action-form-wrapper">
        {/* <Row type="flex" justify="left">
          <Col span={12}>
            <DictCheckable {...dictProps} />
          </Col>
        </Row>*/}
        <Row type="flex">
          <Col span={12} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {
                  getFieldDecorator('materialType')(
                    <DictSelect
                      columnName="MATERIAL_TYPE"
                      placeholder="选择物资类型"
                      style={{ width: '180px' }}
                      allowClear
                      onChange={this.onSelectChange}
                    />,
                  )
                }
              </FormItem>
              <FormItem>
                {getFieldDecorator('commonName')(<Input placeholder="查询码(名称/拼音/五笔/条码)" style={{ width: '180px' }} onPressEnter={this.handleSubmit} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}>
                  <Icon type="search" />查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 12 }} sm={8} xs={24} className="action-form-operating">
            <Button type="primary" size="large" onClick={onAdd.bind(this)} className="on-add">
              <Icon type="plus" />新增
            </Button>
            <DelRowsBtn onOk={onDeleteAll} selectedRows={selectedRowKeys} icon="delete" />
            {/* <Button type="danger" size="large" onClick={onDeleteAll.bind(this)} className="on-delete">
              <Icon type="delete" />删除
            </Button>*/}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(MaterialInfoSearchBar);
