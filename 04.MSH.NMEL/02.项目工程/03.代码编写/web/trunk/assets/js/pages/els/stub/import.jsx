'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row,Col,Form, Modal, Select, Upload, Icon, Button, Input, message, DatePicker, Table } from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const createForm = Form.create;
const MonthPicker = DatePicker.MonthPicker;

class BatchImportForm extends Component {
	constructor (props) {
		super(props);
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth()+1;
		if(month<10) month = '0'+month;
		this.state = {
			orgId: '4028b8815562d296015562d879fc000b',
			loading: false,
			data: [],
			month: year+month,
			visible: false,
			optionEl: '',
			selSet:null,
			pagination: true,//分页器，为false时不显示分页
			templateId:'',
			template:'',
			note:'',
			resData: {},
			columns:[{ dataIndex: 'name', key: 'name', title: '姓名'
				    },
				    { dataIndex: 'idNo', key: 'idNo', title: '身份证号'
				    },
				    { dataIndex: 'note', key: 'note', title: '备注'
				    },
				]
		};
	}
	
	componentWillMount () {
		const setName = this.props.form.getFieldProps;
		let fetch = Ajax.get('api/els/stubtemplate/list/0/100?orgId='+this.state.orgId, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				let data = res.result;

				let options = data.map((domain) => {
			        return <Option key={domain.id+'-'+domain.template}>{domain.template}</Option>;
			      });
					
				this.setState({ optionEl:options, selSet:setName('template',{
							initialValue:data[0].id+'-'+data[0].template,
						}),
					templateId:data[0].id,
		    		template:data[0].template
				});
				this.getColumn(data[0].id);
		    	return res;
		    }
		});
	}
	
	getColumn(templateId) {		
		let fetch = Ajax.get('api/els/stubtemplate/detail/'+ templateId, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				let data = res.result;
				let out = this.state.columns;
				out.splice(3,27);
				for(let i=data.length-1;i>=0;i--){
					if(i==data.length-1) {
						out.splice(3,0,{
							dataIndex:'item'+(i+1),
							key:'item'+(i+1),
							title : data[i].item,
							fixed: 'right',width:100
						});
					}
					else {
						out.splice(3,0,{
							dataIndex:'item'+(i+1),
							key:'item'+(i+1),
							title : data[i].item
						});
					}
				}
				this.setState({columns : out});
		    	return this.state.columns;
		    }
		    else {
		    	Modal.error({title:'工资明细模板加载失败:'+res.msg})
		    	return this.state.columns
		    }
		});
	}
	
	showLoading(flag){
		this.setState({
			loading: flag,
		});
	}
	
	getData(){
		this.showLoading(true);
        let fetch = Ajax.post('api/els/stubpreview/list?batchId=' + this.state.resData.id, null, {catch: 3600});
        fetch.then(res => {
			let data = res.result;
			this.setState({data: data, loading: false,});
	    	return res;
		});
	}
	
	deleteStubPreview(){
		let scope = this;
		let fetch = Ajax.del('api/els/stubpreview/' + this.state.resData.id, null, {catch: 3600});
        fetch.then(res => {
        	if(res.success){
				this.setState({
					visible: false,
				});
				let fetch1 = Ajax.del('api/els/stubbatch/' + this.state.resData.id, null, {catch: 3600});
				fetch1.then(res1 => {
        			if(res1.success){
        				message.success('取消导入数据成功!')
        				scope.close();        				
        			}else{
        			Modal.error({title:'取消导入数据失败:'+res1.msg});
        			}
        		});
			}else{
				Modal.error({title:'取消导入数据失败:'+res.msg});
			}
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
            visible: false
        });
	}
	
    onView(e) {
    	let data = this.state.resData;
        if (this.props.onView) {
            this.props.onView(data);
        }
    }
	
	handleOk() {
		this.showLoading(true);
		let fetch = Ajax.get('api/els/stubpreview/confirm?batchId=' + this.state.resData.id, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				message.success('导入成功');
				this.setState({
					loading: false,
					visible: false,
				});
				this.onView(this);

			}else{
				message.error('导入失败');
			}
	    	return res;
		});
	}
	
	handleCancel() {
		const scope = this;
		confirm({
		    title: '您确认要取消该发放明细的导入吗？',
		    onOk() {
		    	scope.deleteStubPreview();//删除预览数据
		    },
		    onCancel() {},
		});
	}
	
	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	
	onTemplateChange(value){
		const setName = this.props.form.getFieldProps;
	    this.setState({ selSet:setName('template',{
				initialValue:value
			}),
	    	templateId:value.split('-')[0],
	    	template:value.split('-')[1]
		});
		this.getColumn(value.split('-')[0]);
	}
	onDateChange(date,dateString){
		this.setState({month: dateString});
	}
	onNoteChange(e){
		this.setState({note: e.target.value});
	}

	refreshList(){
		if(this.props.refreshList){
			this.props.refreshList(arguments);
		}
	}
	render () {
		
		const { getFieldProps } = this.props.form;
		
		const scope = this;
		
		const props = {
			name: 'file',
			action: "api/els/stubbatch/import?" +
				"orgId="+this.state.orgId+
				"&month="+this.state.month+
				"&templateId="+this.state.templateId+
				"&template="+this.state.template+
				"&note="+this.state.note,
			data:{},
			showUploadList: false,
			beforeUpload(file){
				if(scope.state.month==''){
					Modal.error({title: '输入年月为空！'});
					return false;
				}
				const isExcel = (file.type === 'application/x-msdownload' || file.type === 'application/json'
				  || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				  );
				if (!isExcel) {
					Modal.error({title: '只能上传Excel文件！'});
				}
				return isExcel;
			},
			onChange(info) {				
				console.log(info.file);
				if (info.file.status !== 'uploading') {
					scope.setState({
						fileName: info.file.name,
				  });
				}
				if (info.file.status === 'done') {
				  scope.setState({resData: info.file.response.result});
				  scope.showModal();//打开文件预览对话框
				} else if (info.file.status === 'error') {
				  Modal.error({title: info.file.name + '上传失败:'+info.file.response.msg});
				}
			},

		};
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 18 },
	    };
		return (
			<Row>
				<Col span={10} offset={6}>
				<Form horizontal>
					<FormItem {...formItemLayout} label="年月" required>
						<MonthPicker {...getFieldProps('month',{initialValue:this.state.month,
								getValueFromEvent:(date, dateString) => dateString})} onChange={this.onDateChange.bind(this)} format="yyyyMM" />
					</FormItem>
					
					<FormItem {...formItemLayout} label="模板" required>
						<Select  {...this.state.selSet} onChange={this.onTemplateChange.bind(this)}>
							{this.state.optionEl}
						</Select>
					</FormItem>
					
					<FormItem {...formItemLayout} label="描述" >
						<Input type="textarea" maxLength={200} rows={3}  {...getFieldProps('note',{initialValue:this.state.note,
							onChange:this.onNoteChange.bind(this)})} />
					</FormItem>
					
					<FormItem ref='uploadItem' {...formItemLayout} label="文件" required>
						<Upload {...props}>
							<Button type="ghost" style={{ width: '110', height: '32', marginTop: '10' }}>
								<Icon type="upload" /> 点击上传
							</Button>
						</Upload>
			        </FormItem>
					
			        <FormItem ref='submitItem' style={{textAlign:'center'}}>
			        	<Button onClick={this.close.bind(this)}>取消</Button>
			        </FormItem>

				</Form>
				
		        <Modal 
		        	visible = {this.state.visible} title = "明细预览" width = "80%"
		        	onOk = {this.handleOk.bind(this)} onCancel = {this.handleCancel.bind(this)}>
		        	<div style={{ paddingLeft: 10, paddingRight: 10 }} >
			        	<Table
				        	columns = {this.state.columns}
					        rowKey = {record => record.id}
					        loading = {this.state.loading}
				        	dataSource = {this.state.data}/>
					</div>
				</Modal>
				</Col>
	       </Row>);
  }
}

const BatchImport = createForm()(BatchImportForm);
module.exports = BatchImport;