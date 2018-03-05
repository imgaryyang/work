'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Form, Refetch, Modal, Button, Table, Pagination, Select, InputNumber, Input, Tag, Affix, message, Icon, } from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
const Option = Select.Option;

class CreatePayForm extends Component{
	constructor (props) {
		super(props);
		this.state = {
			optionEl:[],
			selSet:null,
		};
	}
	
	componentWillMount(){
			let res = this.props.perData;
			if(res.success){
				let data = res.result;
				let options = data.map((domain) => {
			        return <Option key={domain.id+'-'+domain.name+'-'+domain.acctNo}>{domain.name+'-'+domain.acctNo}</Option>;
			     });
				
				this.setState({optionEl:options});
			}else{
				Modal.error({title:'人员列表加载失败: 请刷新重试！'});
			}
	}
	
	onSearchSelectChange(value){
		if(this.props.onSearchSelectChange){
			this.props.onSearchSelectChange(this.props.form,value);
	    }
	}
	
	onSubmit(){//保存新增修改信息
		if(this.props.onSubmit){
			this.props.onSubmit(this.props.form);
	    }
	}
	
	onCancel(){//取消修改或新增
		if(this.props.onCancel){
			this.props.onCancel();
		}
	}
	
	render() {
		let bStyle = {marginRight: '3px'};
		const { getFieldProps } = this.props.form;
		return (
			<div style={{ height: '120px',}}>
				<Form inline>
	        		<FormItem label="姓名" validateStatus={this.props.nameValidateStatus} help={this.props.nameHelp} required>
		        		<Select showSearch placeholder="请选择员工"
						    optionFilterProp="children" notFoundContent="无法找到" style={{ width: 215 }} 
						    {...getFieldProps('name',{initialValue: this.props.initData.initSelect})} onChange={this.onSearchSelectChange.bind(this)} >
		    				{this.state.optionEl}
		    			</Select>
	        		</FormItem>
					<FormItem label="金额" style={{ marginTop: 10 }} validateStatus={this.props.amountValidateStatus} help={this.props.amountHelp} required>
						<Input {...getFieldProps('amount',{initialValue: this.props.initData.amount})} style={{ width: 215 }}  placeholder="工资金额"/>
					</FormItem>
					<FormItem>
						<Input {...getFieldProps('id',{initialValue: this.props.initData.id})} type="hidden" />
						<Input {...getFieldProps('perId',{initialValue: this.props.initData.perId})} type="hidden" />
						<Input {...getFieldProps('batchId',{initialValue: this.props.payBatch.id})} type="hidden" />
						<Input {...getFieldProps('batchNo',{initialValue: this.props.initData.batchNo})} type="hidden" />
						<Input {...getFieldProps('month',{initialValue: this.props.initData.month})} type="hidden" />
						<Input {...getFieldProps('payTime',{initialValue: this.props.initData.payTime})} type="hidden" />
						<Input {...getFieldProps('payState',{initialValue: this.props.initData.payState})} type="hidden" />
						<Input {...getFieldProps('stateMemo',{initialValue: this.props.initData.stateMemo})} type="hidden" />
					</FormItem>
					<FormItem style={{ float: 'right', marginTop: this.props.buttonTop }}>
						<Button onClick={this.onCancel.bind(this)} style = {bStyle}>取消</Button>
						<Button onClick={this.onSubmit.bind(this)} style = {bStyle} type="primary" >确定</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

const PayForm = createForm()(CreatePayForm);

class Editor extends Component {
	constructor (props) {
		super(props);
		
		const scope = this;
		
		var noteDisable = false;		//初始化描述input是否可以编辑，只有在新建状态下可以编辑
		
		if(props.data.state != '0'){	//判断当前批次是否是新建状态
			noteDisable = true;			//如果是新建状态允许编辑描述
		}
		
		this.state = {
				selectedRowKeys:[],
				selectedRows:[],
				data: [],
				propsData: props.data,
				batchinfo: {},
				perData: {},
				payPagination: {									   //批次明细的分页
					current: 0,                                        //当前页数	Number	无
					total: 0,                                          //数据总数	Number	0
					pageSize: 5,                                       //每页条数	Number	
					onChange: scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
					showQuickJumper: false,                            //是否可以快速跳转至某页Bool	false
				},
				visible: false,
	            loading: false,
	            create: false,
	            newBtnDisabled: true,
	            modalTitle: '',
	            amountValidateStatus: '',
	            amountHelp:'',
	            nameValidateStatus: '',
	            nameHelp:'',
	            buttonTop: '10px',
	            submitBtnText: '提交',
	            noteDisable: noteDisable,
	            year: props.data.month.substring(0, 4),
	            month: props.data.month.substring(4),
		};
	}
	
	showLoading(flag){//设置加载状态
		this.setState({
			loading: flag,
		});
	}
	
	cleanValidateStatus(){
		this.setState({
			amountValidateStatus: '',
			nameValidateStatus: '',
			amountHelp: '',
			nameHelp:'',
			buttonTop: '10px',
		});
	}
	
	goToPage(pageNo,name,acctNo) {
		
		this.showLoading(true);
		let start = (pageNo-1)*this.state.payPagination.pageSize;
		
		name = (name==null?"":name);
		acctNo = (acctNo==null?"":acctNo);
		
        let fetchBatchInfo = Ajax.get('api/els/paybatchinfo/list/' + start + '/' + this.state.payPagination.pageSize+ '/' + this.state.propsData.id +'?name='+name+'&acctNo='+acctNo, null, {catch: 3600});
        fetchBatchInfo.then(res => {
        	let data = res.result,total=res.total,start=res.start;
        	let payPagination = this.state.payPagination;
        	payPagination.current=pageNo,payPagination.total = total;
			this.setState({ payPagination: payPagination,data:data,loading:false});
	    	return res;
		});
        
        let fetchBatch = Ajax.get('api/els/paybatch/' + this.state.propsData.id, null, {catch: 3600});
        fetchBatch.then(res => {
        	let data = res.result;
        	
        	if(data.state == "0"){
        		this.setState({propsData: data, submitBtnText: '提交', });
        	}else if(data.state == "1"){
        		this.setState({propsData: data, submitBtnText: '发放', });
        	}else if(data.state == "2"){
        		this.setState({propsData: data, submitBtnText: '完成', });
        	}
        	
        	this.showLoading(false);
        	return res;
        });
	}
	
	getPerData(){
		let fetch = Ajax.get('api/els/permng/list/0/5000', null, {catch: 3600, dataType:'json'});
		fetch.then(res => {
			this.setState({
				perData: res,
				newBtnDisabled: false,
			});
		});
	}
	
	componentWillMount(){
		this.goToPage(1);
		this.getPerData();
	}
	
	pageChange(pageNo){
		this.goToPage(pageNo);
	}
	
	refresh(){
		this.goToPage(1);
	}

	refreshList(){
		if(this.props.refreshList){
			this.props.refreshList(arguments);
		}
	}
	
	onSelectChange(selectedRowKeys, selectedRows) {
		this.state.selectedRowKeys =selectedRowKeys;
		this.setState({selectedRows : selectedRows});
	}
	
	onSelect(record, selected, selectedRows) {
	}
	
	onSelectAll(selected, selectedRows, changeRows) {
	}
	
	validateData(data){
		
		var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		
		this.cleanValidateStatus();
		
		if("" == data.name || null == data.name ){
			this.setState({
				nameValidateStatus: 'error',
	            nameHelp:'请选择员工',
	            buttonTop: '0px',
			});
			return false;
		}else if("" == data.amount || null == data.amount ){
			this.setState({
				amountValidateStatus: 'error',
				amountHelp: '请输入发放金额',
				buttonTop: '0px',
			});
			return false;
		}else if(!reg.test(data.amount)){
			this.setState({
				amountValidateStatus: 'error',
				amountHelp: '整数最长10位，精确到小数点后两位！',
				buttonTop: '0px',
			});
			return false;
		}else{
			this.setState({
				amountValidateStatus: 'success',
				amountHelp: '',
			});
		}
		
		return true;
	}
	
	onSubmit(form) {	//保存新增或修改人员批次的详细信息
		
		var data;
		let fetch;
		
		form.validateFields((errors, values) => {
			data = values;
		});
		
		if(!this.validateData(data)){
			return false;
		}
		
		var person = data.name;
		data.perId = person.split('-')[0];
		data.name = person.split('-')[1];
		data.acctNo = person.split('-')[2];
		
		this.showLoading(true);
		
		if(this.state.create){
			fetch = Ajax.post('api/els/paybatchinfo/create', data, {
				catch: 3600,dataType:'json'
			});
		}else{
			fetch = Ajax.put('api/els/paybatchinfo/update', data, {
				catch: 3600,dataType:'json'
			});
		}
		
		fetch.then(res => {
			this.showLoading(false);
			if(res.success){
				message.success('保存成功！');
				this.handleCancel();
				this.refresh();
			}
			else {
				this.setState({
					nameValidateStatus: 'error',
		            nameHelp: res.msg,
		            buttonTop: '0px',
				});
			}
		});
	}
	handleCancel() {
		this.setState({
			visible: false,
			loading: false,
		});
	}
	showModal() {
		if(this.state.propsData.state != "0"){
			message.error('此批次信息的状态已经不允许添加任何信息');
        	return false;
		}
		this.cleanValidateStatus();
		this.setState({
          visible: true,
		});
	}
	addPer(){//点击添加人员
		this.setState({
			create: true,
			batchinfo: {},
			modalTitle: "添加批次信息",
		});
		this.showModal();
	}
	onView(row){//点击人员姓名修改
		
		//组合人员选择下拉列表的默认值
		row.initSelect = row.perId+'-'+row.name+'-'+row.acctNo;
		
		this.setState({
			create: false,
			batchinfo: row,
			modalTitle: "修改批次信息",
		});
		this.showModal();
	}
	
	onSearchSelectChange(form,value){
		form.validateFields((errors, values) => {
			values.initSelect = value;
			this.setState({
				batchinfo: values,
			});
		});
	}
	
	onCancel(){
		this.setState({
	          visible: false,
		});
	}
	
	onSavePayBacth(){
		const scope = this;
		var data = this.state.propsData;
		data.note = this.refs.payNote.refs.input.value;
		
        if(data.state != "0"){
        	message.error('此批次信息的状态已经不允许修改信息');
        	return;
        }
		
		scope.showLoading(true);
		
		let fetch = Ajax.put('api/els/paybatch/update', data, {catch: 3600,dataType: 'json'});
		fetch.then(res => {
			if(res.success){
				message.success('保存成功');
			}else{
				message.error(res.msg); 
			}
			scope.showLoading(false);
			scope.refresh();
	    	return res;
		});
	}
  
	onSubmitPayBacth(){
		const scope = this;
		var data = this.state.propsData;
		if(this.state.propsData.state == "0"){
			confirm({
			    title: '您是否确认要提交批次到上级进行审核',
			    onOk() {
			    	data.state = "1";
			    	scope.showLoading(true);
			    	let fetch = Ajax.put('api/els/paybatch/update', data, {catch: 3600,dataType: 'json'});
					fetch.then(res => {
						if(res.success){
							message.success('提交成功');
						}else{
							message.error(res.msg); 
						}
						scope.refresh();//刷新页面
						scope.showLoading(false);
				    	return res;
					});
			    },
			    onCancel() {},
			});
		}
		else if(this.state.propsData.state == "1"){
			confirm({
			    title: '您是否确认要提交批次到系统进行发放工资',
			    onOk() {
			    	data.state = "2";
			    	scope.showLoading(true);
			    	let fetch = Ajax.put('api/els/paybatch/update', data, {catch: 3600,dataType: 'json'});
					fetch.then(res => {
						if(res.success){
							message.success('提交成功');
						}else{
							message.error(res.msg); 
						}
						scope.refresh();//刷新页面
						scope.showLoading(false);
				    	return res;
					});
			    },
			    onCancel() {},
			});
		}
		else if(this.state.propsData.state == "2"){
			confirm({
			    title: '您是否确认要完成此次的工资发放',
			    onOk() {
			    	data.state = "3";
			    	scope.showLoading(true);
			    	let fetch = Ajax.put('api/els/paybatch/update', data, {catch: 3600,dataType: 'json'});
					fetch.then(res => {
						if(res.success){
							message.success('发放成功');
						}else{
							message.error(res.msg); 
						}
						scope.refresh();//刷新页面
						scope.showLoading(false);
				    	return res;
					});
			    },
			    onCancel() {},
			});
		}else{
			message.success('此工资批次已经完成无需再次提交！');
		}
	}
	
	onDelete(data){
		const scope = this;
        if(scope.state.propsData.state != "0"){
        	message.error('此批次信息的状态已经不允许删除任何信息');
        	return;
        }
		confirm({
		    title: '您是否确认要删除此人的发放明细',
		    onOk() {
		    	scope.showLoading(true);
		    	let fetch = Ajax.del('api/els/paybatchinfo/'+data.id, null, {catch: 3600,dataType: 'json'});
				fetch.then(res => {
					if(res.success){
						message.success('删除成功');
						scope.refresh();
					}else{
						message.error(res.msg); 
					}
					scope.showLoading(false);
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	onBatchDelete(data){
		const scope = this;
		
        if(scope.state.propsData.state != "0"){
        	message.error('此批次信息的状态已经不允许删除任何信息');
        	return;
        }
        
        let selected = this.state.selectedRowKeys;
        
		let param  = JSON.stringify(selected);
		if(selected.length<1){
			message.error('你没有选中任何数据'); 
			return;
		}
		
		var ids = selected[0];
		for(var i = 1;i < selected.length;i++){
			ids += "," + selected[i];
		}
		
		confirm({
		    title: '您是否确认要删除这'+selected.length+'条内容',
		    onOk() {
		    	scope.showLoading(true);
		    	let fetch = Ajax.del('api/els/paybatchinfo/delete/'+ids, null, {catch: 3600,dataType:'json'});
				fetch.then(res => {
					if(res.success){
						message.success('删除成功');
						scope.refresh();
					}else{
						message.error(res.msg); 
					}
					scope.showLoading(false);
			    	return res;
				});
		    },
		    onCancel() {},
		});
        
	}
	onDeletePayBacth(){
		const scope = this;
		
        if(scope.state.propsData.state != "0"){
        	message.error('此批次信息的状态已经不允许删除');
        	return;
        }
        
		confirm({
		    title: '您是否确认要删除这个批次的所有内容',
		    onOk() {
		    	scope.showLoading(true);
		    	let fetch = Ajax.del('api/els/paybatch/'+scope.state.propsData.id, null, {catch: 3600});
				fetch.then(res => {
					if(res.success){
						message.success('删除成功');
						scope.refreshList();
					}else{
						message.error(res.msg); 
					}
					scope.showLoading(false);
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	
	formatMoney(s, n) {//格式化金额
	    n = n > 0 && n <= 20 ? n: 2;
	    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	    var l = s.split(".")[0].split("").reverse(),
	    r = s.split(".")[1];
	    var t = "";
	    
	    for (var i = 0; i < l.length; i++) {
	        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ",": "");
	    }
	    
	    return t.split("").reverse().join("") + "." + r;
	}
	
	onSearchBacthinfo(){
		let acctNo = this.refs.qacctNo.refs.input.value;
		let name = this.refs.qname.refs.input.value;
		this.goToPage(1,name,acctNo)
	}
	
	getEditColumn() {
		const scope = this;
		return [{
          title: '姓名',
          dataIndex: 'name',
          render(text, record, index) {
              return < a onClick = {scope.onView.bind(scope, record)}> {text} < /a>;
          },
		}, {
			title: '卡号',
			dataIndex: 'acctNo',
		}, {
			title: '金额（元）',
			dataIndex: 'amount',
			render(text,record,index) {
				return <span>{scope.formatMoney(record.amount, 2)}</span>;
          },
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				return <a onClick = {scope.onDelete.bind(scope,record)} style={{color:'red'}}><Icon type='delete' />删除</a> ;
          },
      }];
	}
	
	render () {
		let bStyle = {marginRight: '3px'};
		let bottomButtonStyle = {marginRight: '3px', float: 'right'};
		let deleteButtonStyle = {color:'red', marginRight: '3px', float: 'right'};
		let tagStyle = {marginLeft: '5px', height: '30', lineHeight: '30px'};
		const rowSelection = {
			onChange:this.onSelectChange.bind(this),
			onSelect:this.onSelect.bind(this),
			onSelectAll:this.onSelectAll.bind(this)
		}
		
	return (
		<div style={{ height:'550px',width:'70%',margin: 'auto'}}>
			<center><h3  style = {{marginBottom: '5px'}}>{this.state.year}年{this.state.month}月&nbsp;&nbsp;第{this.state.propsData.batchNo}批次工资</h3></center>
			<div>
				<Input ref="payNote" id="note" type="textarea" maxLength={200} addonBefore="描述：" rows={3} disabled={this.state.noteDisable}  defaultValue={this.state.propsData.note}/>
			</div>
			
			<div style = {{backgroundColor: "#dee4e6",  marginTop: '5px'}}>
				<Input ref="qname" id="qname" placeholder="姓名" type="text" style={{ width:'120px', marginRight: '3px'}} maxLength={100}/>
				<Input ref="qacctNo" id="qacctNo" placeholder="卡号" type="text" style={{ width:'120px', marginRight: '3px'}} maxLength={20}/>
				<Button type="primary" htmlType="submit" style={{marginRight: '3px'}} onClick={this.onSearchBacthinfo.bind(this)}>查询</Button>
				<a style={{ marginLeft: 5,display:'inline'}} onClick={this.refresh.bind(this)}><Icon type="reload" /></a>
				<Button type = "normal" style = {deleteButtonStyle} onClick = {this.onBatchDelete.bind(this)} icon="delete">{'删除'+this.state.selectedRows.length+'项'}</Button>
				<Button type = "primary" style = {{marginRight: '3px', float: 'right'}} onClick = {this.addPer.bind(this)} disabled={this.state.newBtnDisabled} icon="plus">新增</Button>
			</div>
	        
			<Table
	        	rowSelection={rowSelection} 
	        	columns = {this.getEditColumn()} 
		        rowKey = {record => record.id}
		        pagination = {this.state.payPagination}
		        loading = {this.state.loading}
	        	dataSource = {this.state.data}/>
			
	        <Affix offsetBottom={0}>
	        	<div style={{background: 'rgb(222, 228, 230)'}}>
					<Tag style = {tagStyle}>总人数：{this.state.propsData.num}</Tag>
		        	<Tag style = {tagStyle}>总金额：{this.formatMoney(this.state.propsData.amount, 2)}元</Tag>
		        	<Button type="normal" style={deleteButtonStyle} onClick={this.onDeletePayBacth.bind(this)} icon="delete">删除</Button>
		        	<Button type="primary" style = {bottomButtonStyle} onClick={this.onSubmitPayBacth.bind(this)}>{this.state.submitBtnText}</Button>
					<Button type="primary" style = {bottomButtonStyle} onClick={this.onSavePayBacth.bind(this)}>保存</Button>
				</div>
		    </Affix>
			
	        <Modal ref = "addModal" 
	        	visible = {this.state.visible} title = {this.state.modalTitle} width = "350" maskClosable = {false}
	        	onCancel = {this.onCancel.bind(this)}
	        	footer = {[
	        	]}>
	        	<div style={{ paddingLeft: 20, paddingRight: 20 }}>
	        		<PayForm 
	        				onSubmit={this.onSubmit.bind(this)}//点击Modal对话框的确定，调用此方法，保存数据
	        				onCancel={this.onCancel.bind(this)}//点击Modal对话框的取消，调用此方法，关闭Modal
	        				onSearchSelectChange={this.onSearchSelectChange.bind(this)}
	        				initData={this.state.batchinfo}//批次明细，当修改信息时，传入
	        				payBatch={this.props.data}//批次信息，
	        				create={this.state.create}//是否是新建触发
	        				buttonTop={this.state.buttonTop}//设置确定按钮的不同时期的距离顶端距离
	        				amountValidateStatus={this.state.amountValidateStatus}//校验金额的正确性
	        				amountHelp={this.state.amountHelp}//金额校验的提示信息
			        		nameValidateStatus={this.state.nameValidateStatus}//姓名的正确性
			        		nameHelp={this.state.nameHelp}//姓名校验的提示信息
	        				perData={this.state.perData}//人员数据
	        		/>
				</div>
			</Modal>
			
		</div>
      
    );
  }
}

module.exports = Editor;