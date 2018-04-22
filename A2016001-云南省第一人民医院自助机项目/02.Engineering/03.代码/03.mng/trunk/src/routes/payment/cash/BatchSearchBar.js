import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Select, Button, DatePicker, Upload, Icon, message} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class UserSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.showCreateBatch = this.showCreateBatch.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    // console.info('bar handleSubmit ',search);
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        search(values);
      }
    });
  }

  handleExport() {
	  const showExport = this.props.showExport;
	  if(showExport) showExport();
  }
  
  handleReset() {
	  this.props.form.resetFields();
  }
  showCreateBatch(){
	  this.props.dispatch({
	      type: 'cash/setState',
	      payload: {
	    	  batchVisible: true,
	      },
	  });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const props = {
	  name: 'file',
	  action: '/api/ssm/pay/cash/batch/import',
	  headers: {
	    authorization: 'authorization-text',
	  },
	  multiple: false,
	  accept: '.xlsx',
	  onChange(info) {
	    if (info.file.status !== 'uploading') {
	      console.log(info.file, info.fileList);
	    }
	    if (info.file.status === 'done') {
	    	console.info(info.file.response);
	    	message.success(`${info.file.name} file uploaded successfully`);
	    	this.handleSubmit()
	    } else if (info.file.status === 'error') {
	    	message.error(`${info.file.name} file upload failed.`);
	    }
	  },
	};
    
    return (
      <Form inline onSubmit={this.handleSubmit.bind(this)}>
        <FormItem>
          {getFieldDecorator('batchNo')(
            <Input placeholder="批次号" />,
          )}
        </FormItem>
	    <FormItem>
	      {getFieldDecorator('batchDay')(
	        <DatePicker placeholder="日期" />,
	      )}
	    </FormItem>
        <FormItem>
          {getFieldDecorator('status')(
		  <Select defaultValue='' style ={{width:'100px'}} placeholder="状态" >
		  <Option value={''}> {'全部'}</Option>
		  <Option value={'0'}> {'已清钞'}</Option>
		  <Option value={'1'}> {'已打印'}</Option>
	      </Select>	  
          )}
        </FormItem>
        
        <FormItem>
          <Button type="primary" htmlType="submit" size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset.bind(this)} size="large" icon="reload" >清空</Button>
        </FormItem>
        <FormItem>
        	<Button onClick={this.handleExport.bind(this)} size="large" icon="download" >导出清钞记录</Button>
        </FormItem>
        <FormItem>
	        <Upload {...props}>
		    	<Button><Icon type="upload" /> 导入点钞记录</Button>
		    </Upload>
	    </FormItem>
	    <FormItem>
    		<Button onClick={this.showCreateBatch.bind(this)} size="large" >清钞</Button>
    	</FormItem>
      </Form>
    );
  }
}
const UserSearchBarForm = Form.create()(UserSearchBar);
export default connect()(UserSearchBarForm);
