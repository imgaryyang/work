'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table,Button,Icon,Form,Input,Row,Col,message,Modal,Checkbox,Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class CreateForm extends Component {
	constructor (props) {
		super(props);
		
		this.state = {
			orgId:'4028b8815562d296015562d879fc000b',
			columns:[],
			data:[]

		};
	}

	getColumns() {
		return [
			{	title: '明细项',dataIndex: 'seqNo',
				render: (text,d,index) => {
					if(this.state.data.length==index+2) return '';
					else if(this.state.data.length==index+1) return index;
					else return (index+1);
				}
			},
			{	title: '明细项',dataIndex: 'item',
				render: (text,d,index) => {
					const setName = this.props.form.getFieldProps;
					if(this.state.data.length==index+1 || index==0)
						return <Input type="text" value={text}/>;
					if(this.state.data.length==index+2) 
						return <Input placeholder="明细项" type="text" maxLength={48} onBlur={this.onItemChange.bind(this,index)}
						/>;
					else return <Input type="text" {...setName('item'+index,{initialValue:text})} maxLength={48} onBlur={this.onItemChange.bind(this,index)}/>;
				}
			}, 
			{	title: '是否金额项',dataIndex: 'isAmt',
				render: (text,d,index) => {
					if(this.state.data.length==index+1 || index==0)
						return <Checkbox disabled >非金额项</Checkbox>
					else
						return <Checkbox onChange={this.onIsAmtChange.bind(this,index)}>非金额项</Checkbox>
				}
			}, 
			{	title: '发扣标志',	dataIndex: 'ioFlag',
				render: (text,d,index) => {
					if(this.state.data.length==index+1 || index==0)
						return <RadioGroup disabled 
						value='1'>
							<Radio key="a" value='1'>发</Radio>
							<Radio key="b" value='0'>扣</Radio>
				        </RadioGroup>
					else
						return <RadioGroup disabled={d.isAmt=='0'?true:false} onChange={this.onIoFlagChange.bind(this,index)}
						value={text}>
							<Radio key="a" value='1'>发</Radio>
							<Radio key="b" value='0'>扣</Radio>
				        </RadioGroup>
				}
			},
		
			{ 	title: '操作',dataIndex: '', key: 'x',
			    render: (text,d,index) => {
					if(this.state.data.length!=index+1 && index!=0)
			    		return <div className={this.state.data.length==index+2?'templOperationPlus':'templOperationMinus'} 
			    				onClick={this.onItemClick.bind(this,d,index)} >
			    			<a style={{color:'white'}}>
			    				<Icon type={this.state.data.length==index+2?'plus':'minus'} />
			    			</a></div>
			    	else
			    		return <div>固定项</div>
		    	}
			}
		]
	}

	componentWillMount () {
		let columns = this.getColumns();
		let data =[];
		data.splice(0,0,{item:'基本工资',isAmt:'1',ioFlag:'1'});
		data.splice(1,0,{item:' ',isAmt:'1',ioFlag:'1'});
		data.splice(2,0,{item:'实发工资',isAmt:'1',ioFlag:'1'});
		
		this.setState({columns:columns, data:data});
	}
	onSubmit(e){

		e.preventDefault();
		let scope = this;
		var tmpdata = this.state.data;
		tmpdata.splice(tmpdata.length-2,1);
		for(var i=0;i<tmpdata.length;i++){
			tmpdata[i].seqNo = i+1;
		}

		var data ={};
		data.orgId = this.state.orgId;
		data.template = this.props.form.getFieldsValue().template; 
		data.stubTemplateinfos = tmpdata;
		console.log('收到表单值：', data);

		let fetch = Ajax.post('api/els/stubtemplate/create', data, {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				message.success('操作成功!');
				scope.close();
				scope.refresh();
			}
			else Modal.error({title:'操作失败:'+res.msg});
		});
	}

	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	refresh(){
		if(this.props.refreshList){
			this.props.refreshList();
		}
	}
	onItemChange(index,e) {
		this.state.data[index].item = e.target.value;
		this.setState({data:this.state.data})
	}
	onIsAmtChange(index,e) {
		this.state.data[index].isAmt = e.target.checked?'0':'1';
		this.setState({data:this.state.data})
	}
	onIoFlagChange(index,e) {
		this.state.data[index].ioFlag = e.target.value;
		this.setState({data:this.state.data})
	}
	onItemClick(row,index){
		//plus
		if(this.state.data.length==index+2) {			
			if(index==29) Modal.error({title:'明细项最多30项!'});
			else {
				/*当前项前插入*/
				this.state.data.splice(index,0,{item:row.item,isAmt:row.isAmt,ioFlag:row.ioFlag});
				/*初始化当前项*/
				this.state.data.splice(index+1,1,{item:'',isAmt:'1',ioFlag:'1'});
			}

		}
		//minus
		else{
			this.state.data.splice(index,1);
		}
		this.setState({data:this.state.data});
	}

	render () {
		const setName = this.props.form.getFieldProps;
		return (<div>
		        	<Row gutter={16} type='flex' align='middle' justify='center' style={{marginBottom:'10px'}} >
			        	<Col span={14}><Input {...setName('template',{initialValue:''})} addonBefore="模板名" type="text" maxLength={48}/></Col>
			        </Row>
		        	<div style={{boder:'thin solid red'}}></div>
					<Row type='flex' align='middle' justify='center' >
			        	<Col span={18}><Table columns={this.state.columns} dataSource={this.state.data} size="small" /></Col>
			        </Row>
			        <FormItem style={{textAlign:'center'}}>
			        	<Button type="primary" style={{marginRight:'3px'}} onClick={this.onSubmit.bind(this)}>提交</Button>
			        	<Button type="normal" onClick={this.close.bind(this)} >取消</Button>
			        </FormItem>
			    </div>
		);
  }
}
const Create = Form.create()(CreateForm);

module.exports = Create;