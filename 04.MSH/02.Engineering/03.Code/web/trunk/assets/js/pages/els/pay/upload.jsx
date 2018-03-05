'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Refetch, Modal, Select, Upload, Icon, Button, Input, message, Table, DatePicker,} from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;

class UploadForm extends Component {
	constructor (props) {
		super(props);
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth();
        var yearChildren = [];
        var monthChildren = [];
        
        for (var i = 0; year - i >= 2016; i++) {
        	yearChildren.push(<Option key={2016 + i}>{2016 + i}</Option>);
        }
        
        for (var i = 1; i < 13; i++) {
        	monthChildren.push(<Option key={i}>{i}</Option>);
        }
        
        month = month<10?"0"+month:month;
		
		this.state = {
				month: year+month,
				note:"",
				fileName: "",
				resData:{},
				data: [],
				yearChildren: yearChildren,
				monthChildren: monthChildren,
	            loading: false,
	            visible: false,
				pagination: true,//分页器，为false时不显示分页
		};
		
	}
	
	showLoading(flag){
		this.setState({
			loading: flag,
		});
	}
	
	getColumn() {
		return [{
          title: '姓名',
          dataIndex: 'name',
		}, {
			title: '卡号',
			dataIndex: 'acctNo',
		},{
			title: '金额',
			dataIndex: 'amount',
      }];
	}

	refreshList(){
		if(this.props.refreshList){
			this.props.refreshList(arguments);
		}
	}
	
	getData(){
		this.showLoading(true);
        let fetch = Ajax.get('api/els/paypreview/' + this.state.resData.id, null, {catch: 3600});
        fetch.then(res => {
			let data = res.result;
			this.setState({data: data, loading: false,});
	    	return res;
		});
	}
	
	showModal() {
		this.getData();
		this.setState({
          visible: true,
		});
	}
	
	closeModal(){
		this.setState({
			loading: false,
            visible: false,
        });
	}
	
	deletePayPreview(){
		this.showLoading(true);
		let fetch = Ajax.del('api/els/paypreview/' + this.state.resData.id, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				message.success('取消导入成功！');
				this.setState({
					loading: false,
					visible: false,
				});
			}else{
				message.error('取消导入失败！'+res.msg); 
			}
		});
	}
	
    onView(e) {
    	let data = this.state.resData;
        if (this.props.onView) {
            this.props.onView(data);
        }
    }
    
    onMonthChange(date,dateString){
    	this.setState({
    		month: dateString,
		});
    }
	
	handleOk() {
		this.showLoading(true);
		let fetch = Ajax.put('api/els/paypreview/confirm/' + this.state.resData.id, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				message.success('导入批次成功！');
				this.setState({
					loading: false,
					visible: false,
				});
				this.onView(this);
			}else{
				message.error('导入批次失败！');
			}
	    	return res;
		});
	}
	
	handleCancel() {
		const scope = this;
		confirm({
		    title: '您确认要取消该发放明细的导入吗？',
		    onOk() {
		    	scope.deletePayPreview();//删除预览数据
		    },
		    onCancel() {},
		});
	}
	
	render () {
		const { getFieldProps } = this.props.form;
		const scope = this;
		const props = {
				  name: 'file',
				  showUploadList: false,
				  data: {'month': this.state.month,
					  	'note': this.props.form.getFieldValue("note") == null ?"":this.props.form.getFieldValue("note"),},
				  action: "api/els/paypreview/payupload",
				  beforeUpload(file){
					  var flag = false;
					  
					  const isExcel = (file.type === 'application/x-msdownload' 
						  || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
					 
					  if (!isExcel) {
						  Modal.error({title: '只能上传Excel文件！'});
					  }else if(null === scope.state.month || "" === scope.state.month){
						  Modal.error({title: '请填写发放批次所属年月！'});
					  }else{
						  flag = true;
					  }
					  
					  return flag;
				  },
				  onChange(info) {
					  if (info.file.status !== 'uploading') {
						  scope.setState({
							  fileName: info.file.name,
						  });
					  }
					  if (info.file.status === 'done') {
						  scope.setState({resData: info.file.response.result});
						  scope.showModal();//打开文件预览对话框
					  } else if (info.file.status === 'error') {
						  Modal.error({title: info.file.name + '上传失败！原因：'+info.file.response.msg});
					  }
				  },

		};
		return (
			<div style={{ width: '350' , margin: 'auto'}}>
				
				<Form inline >
					<FormItem label="年月" required>
						<MonthPicker {...getFieldProps('month',{initialValue:this.state.month,
								getValueFromEvent:(date, dateString) => dateString})} onChange={this.onMonthChange.bind(this)} format="yyyyMM" />
					</FormItem>
					
					<FormItem label="描述" style={{ marginTop: 10, marginLeft: 10  }}>
						<Input ref="noteInput" type="textarea" maxLength={200} rows={4} style={{ width: 278, }} {...getFieldProps('note',{initialValue:""})}/>
					</FormItem>
						
					<FormItem label="文件" style={{width: '240', marginTop: '10',}} required>
						<Upload {...props}>
							<Button type="ghost" style={{ width: '110', height: '32' }}>
								<Icon type="upload" /> 点击上传
							</Button>
						</Upload>
					</FormItem>

					<FormItem style={{ marginTop: 10,marginRight: 22, float: 'right'}}>
						<Button onClick={this.refreshList.bind(this)} style={{ marginLeft: 5 }}>取消</Button>
				    </FormItem>
				</Form>
		        <Modal ref = "previewModal" 
		        	visible = {this.state.visible} title = "批次明细预览" width = "500"
		        	onOk = {this.handleOk.bind(this)} onCancel = {this.handleCancel.bind(this)}>
		        	<div style={{ paddingLeft: 10, paddingRight: 10 }} >
			        	<Table
				        	columns = {this.getColumn()} 
					        rowKey = {record => record.id}
					        pagination = {this.state.pagination}
					        loading = {this.state.loading}
				        	dataSource = {this.state.data}/>
					</div>
				</Modal>
				
	       </div>
    );
  }
}

const UploadPayFile = createForm()(UploadForm);
module.exports = UploadPayFile;
