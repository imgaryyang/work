import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import PayChannelSelect from '../../../components/PayChannelSelect';
import { Form, Input, Select, Button, DatePicker, Upload, Icon, message, Modal} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.showImport = this.showImport.bind(this);
  }
  componentWillMount() {
	const { dicts } = this.props.payChannel;
	 if(!dicts || dicts.length < 1){
		 this.props.dispatch({
			 type: 'payChannel/initDicts',
		 });
	 }
  }
  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        search(values);
      }
    });
  }

  showImport() {
	  this.props.dispatch({
	      type: 'check/setState',
	      payload: {
	    	  importDetailVisible: true,
	      },
	  });
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
	      {getFieldDecorator('chkDate')(
	        <DatePicker placeholder="对账日期" />,
	      )}
	    </FormItem>
	    <FormItem>
		    {getFieldDecorator('payChannel.id', {
	        })(<PayChannelSelect defaultValue='' style ={{width:'120px'}} placeholder="渠道" />)}
        </FormItem>
        <FormItem>
	        {getFieldDecorator('chkType')(
			  <Select defaultValue='' style ={{width:'120px'}} placeholder="对账类型" >
				  <Option value={''}> {'全部'}</Option>
				  <Option value={'0'}> {'全部'}</Option>
				  <Option value={'1'}> {'支付'}</Option>
				  <Option value={'2'}> {'退款'}</Option>
				  <Option value={'3'}> {'退汇'}</Option>
		      </Select>	  
	        )}
	    </FormItem>
        <FormItem>
          {getFieldDecorator('status')(
		  <Select defaultValue='' style ={{width:'120px'}} placeholder="对账状态" >
			  <Option value={''}> {'全部'}</Option>
			  <Option value={'A'}> {'初始'}</Option>
			  <Option value={'0'}> {'对账完成'}</Option>
			  <Option value={'9'}> {'对账失败'}</Option>
			  <Option value={'1'}> {'已同步文件'}</Option>
			  <Option value={'2'}> {'同步文件失败'}</Option>
			  <Option value={'3'}> {'已导入数据库'}</Option>
			  <Option value={'4'}> {'导入数据库失败'}</Option>
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
	    	<Button onClick={this.showImport.bind(this)} size="large" >导入退汇明细</Button>
	    </FormItem>
      </Form>
    );
  }
}
  
const SearchBarForm = Form.create()(SearchBar);
export default connect( ({ payChannel, check }) => ({ payChannel, check }),)(SearchBarForm);
