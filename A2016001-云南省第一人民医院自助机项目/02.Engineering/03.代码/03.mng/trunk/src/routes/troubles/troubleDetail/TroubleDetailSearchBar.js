import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, DatePicker, Upload, Icon} from 'antd';
import moment from 'moment';

import MachineSelect 		from '../../../components/MachineSelect';

const FormItem = Form.Item;

class TroubleDetailSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleExportByMachine = this.handleExportByMachine.bind(this);
    this.handleExportByTrouble = this.handleExportByTrouble.bind(this);
  }
  
  componentWillMount() {
	  const { dicts } = this.props.machine;
		 if(!dicts || dicts.length < 1){
			 this.props.dispatch({
				 type: 'machine/initDicts',
		  });
	  }
  }
  
  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
    	  const newValues = {...values};
    	  if(newValues.createDay){
    		  newValues.createDay = newValues.createDay.format('YYYY-MM-DD');
    	  }
    	  search(newValues);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }
  
  handleExportByMachine() {
		  const showExport = this.props.showExport;
		  if(showExport) showExport();
  }
  
  handleExportByTrouble() {
	  const showExport = this.props.showExport2;
	  if(showExport) showExport();
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const { troubles } = this.props.troubleDetail;
    const options = troubles.map(d => <Option key={d.id}>{d.name}</Option>);
    const props = {
    		  name: 'file',
    		  action: '/api/ssm/troubleDetail/import',
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
          {getFieldDecorator('trouble.id')(
        		<Select style={{width:'150px'}} placeholder="故障" >
        	  		{options}
	      		</Select>
          )}
        </FormItem>
        <FormItem>
        {getFieldDecorator('machine.id')(
        		<MachineSelect style={{width:'150px'}} placeholder="自助机" />,
        )}
        </FormItem>
        <FormItem>
        {getFieldDecorator('createDay')(
        		<DatePicker format={'YYYY-MM-DD'} placeholder="时间" />,
        )}
        </FormItem>
        <FormItem>
          		<Button type="primary" htmlType="submit" size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          		<Button onClick={this.handleReset.bind(this)} size="large" icon="reload" >清空</Button>
        </FormItem>
        <FormItem>
    			<Button onClick={this.handleExportByMachine.bind(this)} size="large" icon="download" >按机器导出</Button>
    	</FormItem>
    	<FormItem>
				<Button onClick={this.handleExportByTrouble.bind(this)} size="large" icon="download" >按故障类型导出</Button>
		</FormItem>
    	
      </Form>
    );
  }
}
const TroubleDetailSearchBarForm = Form.create()(TroubleDetailSearchBar);
export default connect(({ machine, troubleDetail }) => ({ machine, troubleDetail }))(TroubleDetailSearchBarForm); 

