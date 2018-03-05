'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Modal, message, Row, Col, Button, Form,DatePicker,Select,Input,Icon,Affix,Tag} from 'antd';

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;

class StubBatchinfoList extends Component {
	constructor (props) {
		super(props);
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth()+1;
		if(month<10) month = '-0'+month;
		var submitState=this.props.data.state=='1'?true:false;
		const scope = this;
		this.state = {
			data:[],
			month:month,
			inData:this.props.data,
			orgId:'4028b8815562d296015562d879fc000b',
			template:[
			],
			submitState:submitState,
			columns:[
			    { dataIndex: 'name', key: 'name', title: '姓名',fixed:'left',width:100
			    },
			    { dataIndex: 'idNo', key: 'idNo', title: '身份证号',fixed:'left',width:150
			    },
			    { dataIndex: 'note', key: 'note', title: '备注',fixed:'left',width:100
			    },			    
			    { dataIndex: '', key: 'x',title: <div style={{textAlign:'center'}}>操作</div>,fixed:'right',width:100,
			    render: (text,d) => {
			    	return <div style={{textAlign:'center'}}><a disabled={this.state.submitState} style={{color:'green',}} onClick={this.props.onView.bind(this,d)}><Icon type='file-text' />修改</a>
			    			<a disabled={this.state.submitState} style={{color:'red',marginLeft:10}} onClick={this.onDeleteInfo.bind(this,d)} ><Icon type='delete' />删除</a></div>
			    	}
				}
			],
			selectedRowKeys:[],
			selectedRows:[],
			pagination : {
				current:0,                                        //当前页数	Number	无
				total:0,                                          //数据总数	Number	0
				pageSize:5,                                       //每页条数	Number	
				onChange:scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
				showSizeChanger:true,                             //是否可以改变 pageSize	Boolfalse
				pageSizeOptions	: ['5', '10', '20', '40'],       //指定每页可以显示多少条	Array	
				onShowSizeChange:scope.pageSizeChange.bind(scope),//pageSize 变化的回调	Function	noop
				showQuickJumper:true                              //是否可以快速跳转至某页Bool	false
			},
	        loading : false
		};
		this.version= props.version;
	}
	
	
	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	componentWillMount () {
		this.setState({loading:true})
		let fetch = Ajax.get('api/els/stubtemplate/detail/'+ this.state.inData.templateId, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				let data = res.result;
				let out = this.state.columns;
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
				this.setState({columns:out});
				this.goToPage(1);
		    	return res;
		    }
		    else {
		    	Modal.error({title:'工资明细模板加载失败:'+res.msg})
		    }
		});
	}
	componentDidUpdate(){
		if(this.version != this.props.version){
			 this.version = this.props.version;
			 this.refresh();
		}else{
		}
	}
	onSearch(){		
		let note = this.refs.qnote.refs.input.value;
		let name = this.refs.qname.refs.input.value;
		this.goToPage(1,name,note)
	}

	onDeleteInfo(data){
		var scope = this;
		Modal.confirm({
		    title: '您是否确认要删除这项数据',
		    onOk() {
		    	let fetch = Ajax.del('api/els/stubbatchinfo/'+data.id, null, {catch: 3600});
				fetch.then(res => {
					if(res.success){
						message.success('操作成功');
						scope.refresh();
					}else{
						Modal.error({title: '操作失败:'+res.msg}); 
					}
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	deleteSelected(Rows){
		var scope = this;
		Modal.confirm({
		    title: '您是否确认要删除这'+Rows.length+'项数据',
		    onOk() {
		    	Rows.map((data)=>{
					let fetch = Ajax.del('api/els/stubbatchinfo/'+data.id, null, {catch: 3600});
					fetch.then(res => {
						if(res.success){
							message.success('操作成功');
							scope.setState({selectedRowKeys:[],selectedRows:[]});
							scope.refresh();
						}else{
							Modal.error({title: '操作失败:'+res.msg}); 
						}
				    	return res;
					});
		    })},
		    onCancel() {},
		});

	}


	onSaveBatch(oprFlag){
		const scope = this;
		var data = this.state.inData;
		data.note = this.refs.batchNote.refs.input.value;
		if(oprFlag == '1') {
			data.state=oprFlag;
			Modal.confirm({
			    title: '您是否确认要提交这个批次',
			    onOk() {
			    	let fetch = Ajax.put('api/els/stubbatch/update', data, {catch: 3600,dataType: 'json'});
					fetch.then(res => {
						if(res.success){
							message.success('操作成功');
							scope.close();
							if(scope.props.refreshList)
								scope.props.refreshList();							
						}else{
							Modal.error({title: '操作失败:'+res.msg}); 
						}
				    	return res;
					});
			    },
			    onCancel() {},
			});
		}
		else{
			let fetch = Ajax.put('api/els/stubbatch/update', data, {catch: 3600,dataType: 'json'});
			fetch.then(res => {
				if(res.success){
					message.success('操作成功');
					let data=this.state.inData;
					data.num = res.result.num;
					data.amount = res.result.amount;
					this.setState({inData:data})
					this.refresh();
				}else{
					Modal.error({title: '操作失败:'+res.msg}); 
				}
		    	return res;
			});
		}
	}

	onDeleteBatch(){
		var scope = this;
		var batchId=this.state.inData.id;
		Modal.confirm({
		    title: '您是否确认要删除整个批次',
		    onOk() {
		    	let fetch = Ajax.del('api/els/stubbatch/'+batchId, null, {catch: 3600});
				fetch.then(res => {
					if(res.success){
						message.success('操作成功');
						scope.close();
						if(scope.props.refreshList)
							scope.props.refreshList();
					}else{
						Modal.error({title: '操作失败:'+res.msg}); 
					}
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}

	onCreate(data)
	{
		if(this.props.onCreate)
			this.props.onCreate(data)
	}
	onView(data)
	{
		if(this.props.onView)
			this.props.onView(data)
	}

	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	goToPage(pageNo,iname,inote){
		let name='',note='';
		if(typeof(iname)!='undefined') name=iname;
		if(typeof(inote)!='undefined') note=inote;

		this.setState({loading:true});
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let fetch = Ajax.get('api/els/stubbatchinfo/list/'+start+'/'+this.state.pagination.pageSize+'?name='+name+'&note='+note+'&batchId='+this.state.inData.id, null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			let pagination = this.state.pagination;
			pagination.current = pageNo;
			pagination.total = total;
			this.setState({ data:data,pagination:pagination, loading:false });
	    	return res;
		});
	}
	pageChange(pageNo){
		this.goToPage(pageNo);
	}
	pageSizeChange(page,pageSize){
		let pagination = this.state.pagination;
		pagination.pageSize=pageSize;
		this.setState({ pagination: pagination});
		this.refresh()
	}
	onSelectChange(selectedRowKeys, selectedRows) {
		this.state.selectedRowKeys =selectedRowKeys;
		this.setState({selectedRows : selectedRows});
		//这里不用setState触发更新
	}
	
	onSelect(record, selected, selectedRows) {
		//console.log(record, selected, selectedRows);
	}
	
	onSelectAll(selected, selectedRows, changeRows) {
		//console.log(selected, selectedRows, changeRows);
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
	render () {
		const rowSelection = {
			onChange:this.onSelectChange.bind(this)
		}
		let tagStyle = {marginLeft: '5px', height: '30', lineHeight: '30px'};
		let rightButtonStyle = {marginRight: '3px', float: 'right'};
		let deleteButtonStyle = {marginRight: '3px', float: 'right',color:'red'};
		return (
			<div style={{ height:'500px',width:'85%', margin:'auto'}}>

				<h3 style={{textAlign:'center',marginBottom:10}}>{
						this.props.data.month.substring(0,4)+'年'+this.props.data.month.substring(4,6)+'月第'+this.props.data.batchNo+'批次工资条明细'
					}</h3>
				<div style={{textAlign:'center',marginBottom:10}}>
					<Input ref="batchNote" id="note" type="textarea" maxLength={200} addonBefore="描述：" rows={2} defaultValue={this.props.data.note}/>
				</div>
				
				<Row type='flex' align='middle' justify='space-between' style={{backgroundColor:'#dee4e6',}}>
					<Col span={4}><Input ref="qname" id="qname" placeholder="姓名" type="text" maxLength={100}/></Col>
					<Col span={4}><Input ref="qnote" id="qnote" placeholder="备注" type="text" maxLength={200}/></Col>					
					<Col span={2}><Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>查询</Button></Col>
					<Col span={1}><a style={{ marginLeft: 5,display:'inline'}} onClick={this.refresh.bind(this)}><Icon type="reload" /></a>
					</Col>
					<Col span={12}>
						<Button style={deleteButtonStyle} type='normal' disabled={this.state.submitState}icon="delete" 
							onClick={this.deleteSelected.bind(this,this.state.selectedRows)}>{'删除'+this.state.selectedRows.length+'项'}
						</Button>
						<Button style={rightButtonStyle} type='primary' disabled={this.state.submitState}icon="plus" 
							onClick={this.onCreate.bind(this,this.state.inData)}>新增
						</Button>
					</Col>
				</Row>
				<Table 
					size='middle'
					rowSelection={rowSelection}
					columns={this.state.columns} 
					dataSource={this.state.data}
					rowKey={record => record.id}
					pagination={this.state.pagination}
					loading={this.state.loading}
					scroll={{ x: 1300 }}
				/>

			    <Affix offsetBottom={20}>
		        	<Row type='flex' align='middle' justify='space-between' style={{backgroundColor:'#dee4e6',}}>
		        		<Col span={12}>
			        		<Tag>{'总人次:'+this.state.inData.num}</Tag>
			        		<Tag>{'总金额:'+this.formatMoney(this.state.inData.amount)}</Tag>
		        		</Col>
		        		<Col span={12}>
							<Button type="normal" style = {deleteButtonStyle} icon="delete" onClick={this.onDeleteBatch.bind(this)}>删除</Button>
							<Button type="primary" disabled={this.state.submitState} style = {rightButtonStyle} onClick={this.onSaveBatch.bind(this,'1')}>提交</Button>
							<Button type="primary" disabled={this.state.submitState} style = {rightButtonStyle} onClick={this.onSaveBatch.bind(this)}>保存</Button>
						</Col>
					</Row>
			    </Affix>
			    <div style={{height:40}}></div>
	    	</div>
    );
  }
}
module.exports = StubBatchinfoList;