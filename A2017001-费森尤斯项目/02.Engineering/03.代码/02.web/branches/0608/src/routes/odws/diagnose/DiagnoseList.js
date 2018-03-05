/**
 * 下诊断
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Button, Badge } from 'antd';

import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';
import DiagnosisSearchInput from '../../../components/searchInput/DiagnosisSearchInput';

import styles from './Diagnose.less';

const FormItem = Form.Item;

class DiagnoseList extends Component {

  constructor(props) {
    super(props);
    this.handleReset = this.handleReset.bind(this);
    this.onDiagnoseSelect = this.onDiagnoseSelect.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.changeMainDiagnose = this.changeMainDiagnose.bind(this);
  }

  state = {
    formValue: {},
  };

  componentWillMount() {
  }

  /**
   * 选择诊断
   */
  onDiagnoseSelect(diagnose) {
    /* this.setState({
      formValue: {
        ...this.state.formValue,
        diagnoseId: diagnose.id,
        diagnoseCode: diagnose.diagnosisCode,
        diagnoseName: diagnose.diagnosisName,
      },
    });*/
    const newDiagnose = {
      ...diagnose,
      regId: this.props.odws.currentReg.id,
      iscurrent: this.props.odwsDiagnose.diagnosis.length === 0 ? '1' : '0',
      sortNo: this.props.odwsDiagnose.diagnosis.length + 1,
    };
    this.props.dispatch({
      type: 'odwsDiagnose/saveDiagnose',
      payload: newDiagnose,
    });
  }

  onDelete(diagnose) {
    this.props.dispatch({
      type: 'odwsDiagnose/deleteDiagnose',
      payload: diagnose,
    });
  }

  handleReset() {
    this.setState({ formValue: {} });
    this.props.form.resetFields();
  }

  /**
   * 变更主诊断
   */
  changeMainDiagnose(diagnose) {
    this.props.dispatch({
      type: 'odwsDiagnose/changeMainDiagnose',
      payload: diagnose,
    });
  }

  render() {
    const { base, odws, odwsDiagnose, form } = this.props;
    const { odwsWsHeight } = odws;
    const { diagnosis } = odwsDiagnose;
    const { getFieldDecorator } = form;
    const { formValue } = this.state;
    const { user } = base;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const formItemLayoutColspan = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    /* const noLableFormItemLayout = {
      wrapperCol: { span: 24 },
    };*/

    const columns = [
      { title: '序号', dataIndex: 'sortNo', key: 'sortNo', width: 40, className: 'text-align-center' },
      { title: '诊断代码', dataIndex: 'diseaseId', key: 'diseaseId', width: 120 },
      { title: '诊断描述', dataIndex: 'diseaseName', key: 'diseaseName', width: 200 },
      { title: '诊断科室', dataIndex: 'diseaseDept.deptName', key: 'diseaseDept', width: 80 },
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
      { title: '操作',
        dataIndex: 'id',
        key: 'rowOperation',
        width: 100,
        render: (text, record) => (
          <span>
            <RowDelBtn onOk={() => this.onDelete(record)} />
            <span className="ant-divider" />
            <Button disabled={record.iscurrent === '1'} onClick={() => this.changeMainDiagnose(record)} size="small" >主诊断</Button>
          </span>
        ),
        className: 'text-align-center',
      },
    ];

    return (
      <Form inline >
        <div style={{ padding: '3px' }} >
          <Card className={styles.inputCard} >
            <div>
              {/* <Row>
                <Col span={12} >
                  <FormItem style={{ width: '100%' }} label="序号" {...formItemLayout} >
                    {getFieldDecorator('index', {
                      initialValue: formValue.index,
                    })(
                      <Input maxLength={12} placeholder="序号" />,
                    )}
                  </FormItem>
                </Col>
              </Row>*/}
              <Row>
                <Col span={24} >
                  <FormItem style={{ width: '100%' }} label="搜索诊断" {...formItemLayoutColspan} >
                    {getFieldDecorator('diagnoseDesc', {
                      initialValue: formValue.diagnoseDesc,
                    })(
                      <DiagnosisSearchInput onSelect={this.onDiagnoseSelect} placeholder="点击搜索诊断" />,
                    )}
                  </FormItem>
                </Col>
                {/* <Col span={8} >
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('diagnoseId', {
                      initialValue: formValue.diagnoseId,
                    })(<Input />)}
                  </FormItem>
                  <FormItem style={{ width: '100%' }} label="诊断" {...formItemLayout} >
                    {getFieldDecorator('diagnoseCode', {
                      initialValue: formValue.diagnoseCode,
                    })(
                      <Input placeholder="诊断代码" title={formValue.diagnoseCode} disabled />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} >
                  <FormItem style={{ width: '100%', paddingLeft: '5px' }} wrapperCol={{ span: 24 }} >
                    {getFieldDecorator('diagnoseName', {
                      initialValue: formValue.diagnoseName,
                    })(
                      <Input placeholder="诊断名称" title={formValue.diagnoseName} disabled />,
                    )}
                  </FormItem>
                </Col>*/}
              </Row>
              <Row>
                <Col span={12} >
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('deptId', {
                      initialValue: user.loginDepartment.id,
                    })(<Input />)}
                  </FormItem>
                  <FormItem style={{ width: '100%' }} label="诊断科室" {...formItemLayout} >
                    {getFieldDecorator('deptName', {
                      initialValue: user.loginDepartment.deptName,
                    })(
                      <Input maxLength={12} placeholder="诊断科室" disabled />,
                    )}
                  </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('doctorId', {
                      initialValue: user.id,
                    })(<Input />)}
                  </FormItem>
                  <FormItem style={{ width: '100%' }} label="诊断医生" {...formItemLayout} >
                    {getFieldDecorator('doctorName', {
                      initialValue: user.name,
                    })(
                      <Input maxLength={12} placeholder="诊断医生" disabled />,
                    )}
                  </FormItem>
                </Col>
                {/* <Col span={8} >
                  <FormItem style={{ width: '100%', paddingLeft: '10px' }} wrapperCol={{ span: 24 }} >
                    {getFieldDecorator('isMain', {
                      initialValue: false,
                    })(
                      <Checkbox tabIndex={3} >主诊断</Checkbox>,
                    )}
                  </FormItem>
                </Col>*/}
              </Row>
              {/* <div style={{ textAlign: 'right', marginTop: '15px' }} >
                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }} icon="plus" size="large" >保存</Button>
                <Button onClick={this.handleReset} icon="reload" size="large" >清空</Button>
              </div>*/}
            </div>
          </Card>
          <Card style={{ height: `${odwsWsHeight - 6 - 95 - 10}px` }} className={styles.listCard} >
            <CommonTable
              rowSelection={false}
              data={diagnosis}
              columns={columns}
              pagination={false}
              scroll={{ y: (odwsWsHeight - 6 - 95 - 10 - 10 - 35) }}
              bordered
              size="middle"
            />
            {/* <div className={styles.mainButtonContainer} >
              <Button type="primary" onClick={this.saveDiagnose} style={{ marginRight: '10px' }} icon="save" size="large" >保存诊断</Button>
              <Button type="danger" onClick={this.clearDiagnose} icon="reload" size="large" >清空所有诊断</Button>
            </div>*/}
          </Card>
        </div>
      </Form>
    );
  }
}

const DiagnoseListForm = Form.create()(DiagnoseList);
export default connect(
  ({ odws, odwsDiagnose, base }) => ({ odws, odwsDiagnose, base }),
)(DiagnoseListForm);
