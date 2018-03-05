'use strict';
var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var costEdit = require('./CostEdit');
var Checkbox = require('../lib/Checkbox');
var chooseExpenseLeader = require('./ChooseExpenseLeader');
var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var TcombSelect = require('../lib/TcombSelect');
var ImageSelect = require('../lib/ImageSelect');
var TcombHidden = require('../lib/TcombHidden');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	TextInput,
	ListView,
	Alert,
	Animated,
	Easing
} = React;



var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var Expense = t.struct({
	id: t.maybe(t.String),
	name: t.String,
	memo1: t.String,
	// date: t.Date,
});

var expenseOptions = {	
	fields: {
		id: {
			factory: TcombHidden,
		},
		name: {
			label: '报销类型',
			factory: TcombSelect,
			type: 'single',
			display: 'one-row',
			disabled: false,
			options: {
				'0': '日常',
				'1': '差旅',
			},
			icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			error: '请选择报销类型',
		},
		memo1: {
			label: '简述',
			error: '简述必须填写且长度不能超过100位',
		},
		
	},
};

var FIND_URL =  'expense/findOne';
var SUBMIT_URL =  'expense/save';
var FIND_COST_URL = 'cost/findIds';
var UPDATE_ALLOWANCE_URL =  'cost/updateAllowance';
var ExpenseEdit = React.createClass({

	mixins: [UtilsMixin,FilterMixin],
	
	/**
	* 初始化状态
	*/
	totalamt : 0,
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => {r1 !== r2}});
		return {
			doRenderScene: false,
			loaded: false,
			value: {
				id: this.props.id,
			},
			dataSource: ds.cloneWithRows(this._genRows({})),
			dataSource1: ds.cloneWithRows(this._genRows({})),
			showLoading: false,
			alertMsg: null,
			expense: {
				name: '',
				id: this.props.id?this.props.id:'',
				totalamt: 0,
				memo1: '',
				custId : Global.USER_LOGIN_INFO.Employees.id,
				allowance :[]
			},
			showDialog : false,
			amt:null,
			memo:null,
			costId:null
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			if (this.props.id && this.props.id != '') {
				this.fetchData();
			}
			this.allowanceList=[];
			this.allowances=[];
			this.data1 = this.allowanceList;
			this.setState({
				dataSource1: this.state.dataSource1.cloneWithRows(this.allowanceList),
			});
			this.costIds = [];
			this.findCost();
		});
		

	},

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		for (var ii = 0; ii < 3; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}
		return dataBlob;
	},
	findCost: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + FIND_COST_URL, {
				body: JSON.stringify({
					id: this.state.expense.id,
					custId: this.state.expense.custId
				}),
			});

			for (let i = 0; i < responseData.body.length; i++) {
				/*let date = new Date(responseData.body[i].date);
				let hours = (date.getHours() > 9) ? date.getHours() : '0' + date.getHours();
				let minute = (date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes();
				// let second = (date.getSeconds() > 9) ? date.getSeconds() : '0' + date.getSeconds();
				let year = date.getFullYear();
				let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
				let day = date.getDate()> 9 ? date.getDate()  : ('0' + date.getDate());
				responseData.body[i].date = year + '-' + month + '-' + day + ' ' + hours + ':' + minute ;*/
				responseData.body[i].date = this.filterDateFmt(responseData.body[i].date);
				if (this.props.id && this.props.id != '') {
					this.costIds.push(responseData.body[i].costId);
				}
			}
			this.hideLoading();
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
			});
		}catch(e) {
			this.requestCatch(e);
		}
	},
	doCostEdit:function(costId,type){
		if (type != '7') {
			this.props.navigator.push({
				title: "修改消费记录",
				component: costEdit,
				passProps: {
					costId: costId,
					refresh: this.refresh,

				},
			});
		}else{
			
		}
	},
	refresh: async function() {
		this.showLoading();
		let costAmt = 0;
		await this.findCost();
		if (this.state.expense.id) {
			for (let i = 0; i < this.data.length; i++) {
				costAmt += this.data[i].amt;

			}
			this.setState({
				expense: {
					name: this.state.value.name,
					id: this.state.expense.id,
					memo1: this.state.value.memo1,
					totalamt: costAmt,
					custId: this.state.expense.custId,
					allowance: this.state.expense.allowance,
					state: '0'
				}
			});
			try {
				let responseData = await this.request(Global.host + SUBMIT_URL, {
					body: JSON.stringify({
						expense: this.state.expense,
					}),
				});
				this.hideLoading();
				this.setState({
					loaded: true,
				});
				this.props.refreshExpenseList.call();
			} catch (e) {
				this.requestCatch(e);
			}
		} else {
			for (let i = 0; i < this.allowances.length; i++) {
				costAmt = costAmt + parseFloat(this.allowances[i].amt);
			}
			for (let i = 0; i < this.data.length; i++) {
				if (this.costIds.indexOf(this.data[i].costId) !== -1) {
					costAmt += parseFloat(this.data[i].amt);
				}
			}
			this.setState({
				expense: {
					name: this.state.expense.name,
					id: this.state.expense.id,
					memo1: this.state.expense.memo1,
					totalamt: costAmt,
					custId: this.state.expense.custId,
					allowance: this.state.expense.allowance
				}
			});
		}

	},
	fetchData: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					id: this.props.id,
				})
			});
			this.hideLoading();
			this.setState({
				expense: {
					name: responseData.body.name,
					id: responseData.body.id,
					totalamt: responseData.body.totalamt,
					memo1: responseData.body.memo1,
					custId: this.state.expense.custId,
					allowance: this.state.expense.allowance,

				},
				value:responseData.body,
				loaded: true,
			});
		} catch (e) {
			this.requestCatch(e);
		}
	},

	/**
	* 保存数据
	*/
	save: async function() {
		var value = this.refs.form.getValue();
		if(!value){
			return;
		}
		// console.log(this.state.expense);
		console.log(this.costIds);
		if(this.costIds.length ==0){
			Alert.alert(
					'Warning',
					'请选择至少一条要报销的记录！',
				);
			return;
		}
		this.setState({
			expense: {
				name: this.state.value.name,
				id: this.state.expense.id,
				totalamt: this.state.expense.totalamt,
				memo1: this.state.value.memo1,
				custId: this.state.expense.custId,
				allowance: this.allowances,
				state: '0'
			}
		});
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + SUBMIT_URL, {
				body: JSON.stringify({
					expense: this.state.expense,
					costIds: this.costIds
				}),
			});
			this.hideLoading();
			this.setState({
				loaded: true,
			});
			this.toast('保存成功！');
			this.props.refreshExpenseList(0);
			this.props.navigator.pop();
		}catch (e) {
			this.requestCatch(e);
		}
	},
	chooseLeader (){
		var value = this.refs.form.getValue();
		if(!value){
			return;
		}
		if(this.costIds.length ==0){
			Alert.alert(
					'Warning',
					'请选择至少一条要报销的记录！',
				);
			return;
		}
		this.setState({
			expense: {
				name: this.state.value.name,
				id: this.state.expense.id,
				totalamt: this.state.expense.totalamt,
				memo1: this.state.value.memo1,
				custId: this.state.expense.custId,
				allowance: this.state.expense.allowance,
				state: '0'
			}
		});
		this.props.navigator.push({
	            title: "选择审批人",
	            component: chooseExpenseLeader,
	            // hideNavBar: true,
	            passProps: {
	            	expense: this.state.expense,
	            	costIds:this.costIds,
	            	refreshExpenseList:this.props.refreshExpenseList,
	            	backRoute: this.props.backRoute,
	            },
	        });
	},
	
	/**
	* 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
	* value: 表单所有元素的值，本例中为 {id : '', name: '', gender: '' ... }
	* objName: 触发此事件的元素，类型为数组（支持多个元素同时触发？），如 name 被更改时，传入的值为 ['name']
	*/
	onFormChange: function(value, objName) {
		/*console.log('``````````````````` arguments in edit.onChange():');
		console.log(arguments);
		console.log('``````````````````` end of arguments in edit.onChange():');*/
		console.log('value.......................');
		console.log(value);
		this.setState({value: value});

	},
	addAllowance:function(){
		this.setState({showDialog:true});
	},
	doAddAllowance : function(allowance){
		
		this.allowanceList.push(allowance);
		this.allowances.push(allowance);
		// console.log(this.allowances);
		this.setState({
			dataSource1: this.state.dataSource1.cloneWithRows(this.allowanceList),
			showDialog: false,
			expense: {
				name: this.state.expense.name,
				id: this.state.expense.id,
				totalamt: this.state.expense.totalamt+allowance.amt,
				memo1: this.state.expense.memo1,
				custId: this.state.expense.custId,
				allowance: this.allowances,
				state: '0'
			}
		});
		// console.log(this.state.expense);
	},
	editAllowance:function(memo,amt){
		
		this.setState({
			showEditDialog: true,
			amt: amt,
			memo: memo
		});

	},
	removeAllowance:function(allowance,allowances){
		for(let i=0;i<allowances.length;i++){
			if(allowance.memo == allowances[i].memo && allowance.costId == allowances[i].costId && allowance.amt==allowances[i].amt){
				allowances.splice(i,1);
				return true;
			}
		}
		return false;
		
	},
	doEditAllowance:async function(allowance){
		// console.log(allowance);
		if (allowance.costId == null) {
			let oldAllowance = {
				'costId': this.state.costId,
				'memo': this.state.memo,
				'amt': this.state.amt,
				
			};
			
			let flag = this.removeAllowance(oldAllowance,this.allowances);
			this.removeAllowance(oldAllowance,this.allowanceList);
			this.setState({
				dataSource1: this.state.dataSource1.cloneWithRows(this.allowanceList),
			});
			this.allowanceList.push(allowance);
			this.allowances.push(allowance);
			if(flag){
				var changedAmt = allowance.amt-this.state.amt; 
			}else{
				changedAmt = allowance.amt;
			}
			this.setState({
				showEditDialog:false,
				dataSource1:this.state.dataSource1.cloneWithRows(this.allowanceList),
				expense: {
					name: this.state.expense.name,
					id: this.state.expense.id,
					totalamt: this.state.expense.totalamt + changedAmt,
					memo1: this.state.expense.memo1,
					custId: this.state.expense.custId,
					allowance: this.allowances,
					state: '0',
				}
			});
		}else{
			//更新allowace到数据库
			//更新expense
			this.setState({
				showEditDialog:false
			});

			this.showLoading();
			try {
				let responseData = await this.request(Global.host + UPDATE_ALLOWANCE_URL, {
					body: JSON.stringify({
						costId: allowance.costId,
						amt: allowance.amt,
						memo: allowance.memo
					}),
				});
				this.findCost();
				this.setState({
					expense: {
						name: this.state.expense.name,
						id: this.state.expense.id,
						totalamt: this.state.expense.totalamt - this.state.amt + allowance.amt,
						memo1: this.state.expense.memo1,
						custId: this.state.expense.custId,
						allowance: this.allowances,
						state: '0'
					}
				});
				try {
					let responseData = await this.request(Global.host + SUBMIT_URL, {
						body: JSON.stringify({
							expense: this.state.expense,
							costIds: this.costIds
						}),
					});
					this.setState({
						loaded: true,
					});
					this.hideLoading();
					this.props.refreshExpenseList.call();
				} catch (e) {
					this.requestCatch(e);
				}
			} catch (e) {
				this.requestCatch(e);
			}
		}
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		{/*let allowance = this.state.expense.id?<View style={{height:20,borderBottomWidth:1,borderColor:'#000000',flex:1,backgroundColor:Global.colors.IOS_GRAY_BG}}/>:<View style={{height:40,borderBottomWidth:1,borderColor:'#000000',flex:1,flexDirection:'row',justifyContent :'space-between'}}>
						<TouchableOpacity style={[Global.styles.CENTER,]} onPress={()=>{this.addAllowance()}}>
							<Text style={{color:Global.colors.IOS_BLUE}}>+添加补助</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[Global.styles.CENTER,]} onPress={this.chooseAll}>
													<Text style={{color:Global.colors.IOS_BLUE}}>全选</Text>
												</TouchableOpacity>
					</View>;*/}
		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.placeholder} />
{					/*<View style={[{flex:1,flexDirection:'row',backgroundColor:'#FFFFFF'},Global.styles.BORDER]}>
						<TextInput style={styles.textInput} value={this.state.expense.name} placeholder="报销单名称" onChangeText={(value) => this.setState({expense:{name:value,id:this.state.expense.id,memo1:this.state.expense.memo1,totalamt:this.state.expense.totalamt,custId : this.state.expense.custId,allowance : this.state.expense.allowance}})}/>
					</View>
					<View style={[{flex:1,flexDirection:'row',backgroundColor:'#FFFFFF'}]}>
						<View style={[{flex:1,height:40,paddingTop:5},Global.styles.BORDER]}>
							<Text style={[{textAlign:'center',fontSize:18,}]}>{Global.USER_LOGIN_INFO.Employees.name}</Text>
						</View>
						<View style={[{flex:1,height:40,paddingTop:5},Global.styles.BORDER]}>
							<Text style={[{textAlign:'center',fontSize:18},]}>{Global.USER_LOGIN_INFO.Employees.dept}</Text>
						</View>
					</View>
					<View style={[{flex:1,backgroundColor:'#FFFFFF'},Global.styles.BORDER]}>
						<TextInput  style={styles.textInput} placeholder="简述" value={this.state.expense.memo1} onChangeText={(value) => this.setState({expense:{name:this.state.expense.name,id:this.state.expense.id,memo1:value,totalamt:this.state.expense.totalamt,custId : this.state.expense.custId,allowance : this.state.expense.allowance}})}/>
					</View>
					<View style={[{flex:1,paddingTop:5,paddingBottom:5,backgroundColor:'#FFFFFF'},Global.styles.BORDER]}>
						<Text style={[{fontSize:18},]}>金额￥{this.state.expense.totalamt}</Text>
					</View>
					{allowance}*/}
                    <View style={{paddingLeft:20,paddingRight:20}}>
						<Form
							ref="form"
							type={Expense}
							options={expenseOptions}
							value={this.state.value}
							onChange={this.onFormChange} />
				    </View>
				    <View style={[Global.styles.FULL_SEP_LINE]}/>
					<View style={{flex:1,flexDirection:'row',justifyContent :'space-between',paddingTop:10,paddingBottom:10}}>
						<View style={[Global.styles.CENTER,]} >
						</View>
						<View style={[Global.styles.CENTER,{paddingRight:20}]} >
								<Text style={{fontSize:18,fontWeight:'bold',color:Global.colors.ORANGE}}>合计:{this.filterMoney(this.state.expense.totalamt)}</Text>
						</View>
					</View>
					<ListView
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
			       {/* <ListView
			       			        key={this.data1}
			       			        dataSource={this.state.dataSource1}
			       			        renderRow={this.renderAllowanceItem}
			       			        style={[styles.list]} />*/}
				    <View style={{flex: 1, height: 20,}} />
					<View style={{flex: 1, flexDirection: 'row', marginTop: 10,paddingLeft:20,paddingRight:20}}>
						<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
							onPress={this.save}>
				    		<Text style={{color: '#ffffff',}}>保存</Text>
				    	</TouchableOpacity>
				    	<View style={{flex: 0.05}}></View>
				    	<TouchableOpacity 
				    		style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
				    		onPress={()=>{this.chooseLeader()}}>
				    		<Text style={{color: '#ffffff'}}>送审</Text>
				    	</TouchableOpacity>
					</View>
					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>
			   {/* <View style={[styles.footBar,Global.styles.CENTER]}>
			                       <TouchableOpacity style={[styles.footBarBtn,Global.styles.CENTER,Global.styles.BORDER]} onPress={()=>{this.save()}}>
			                           <Text style={{textAlign:'center',color:'#FFFFFF',fontSize:16}}>保存</Text>
			                       </TouchableOpacity>
			                       <TouchableOpacity style={[styles.footBarBtn,Global.styles.CENTER,Global.styles.BORDER]} onPress={()=>{this.chooseLeader()}}>
			                           <Text style={{textAlign:'center',color:'#FFFFFF',fontSize:16}}>送审</Text>
			                       </TouchableOpacity>
			                   </View>*/}
                
			    <Dialog show={this.state.showDialog} title={'添加补助'} ok={this.doAddAllowance} cancel={()=>{this.setState({showDialog:false})}}/>
			    <Dialog show={this.state.showEditDialog} title={'修改补助'} amt={this.state.amt} memo={this.state.memo} costId={this.state.costId}ok={this.doEditAllowance} cancel={()=>{this.setState({showEditDialog:false})}}/>
			</View>
		);
	},
	onCheck (amt,costId){
		this.costIds.push(costId);
		this.setState({
			expense: {
				name: this.state.expense.name,
				id: this.state.expense.id,
				totalamt: this.state.expense.totalamt + amt,
				memo1: this.state.expense.memo1,
				custId: this.state.expense.custId,
				allowance: this.state.expense.allowance,
				state: '0'
			}
		});
		console.log(this.costIds);

		
	},
	unCheck(amt,costId){
		this.setState({
			expense: {
				name: this.state.expense.name,
				id: this.state.expense.id,
				totalamt: this.state.expense.totalamt -amt,
				memo1: this.state.expense.memo1,
				custId: this.state.expense.custId,
				allowance: this.state.expense.allowance,
				state: '0'
			}
		});
		var idx = this.costIds.indexOf(costId);
		this.costIds.splice(idx, 1);
		console.log(this.costIds);
	},
	onAllowanceCheck(costId,amt,memo){
		this.setState({
			expense: {
				name: this.state.expense.name,
				id: this.state.expense.id,
				totalamt: this.state.expense.totalamt + amt,
				memo1: this.state.expense.memo1,
				custId: this.state.expense.custId,
				allowance: this.allowances,
				state: '0'
			}
		});
		let allowance = {costId:costId,memo:memo,amt:amt};
		this.allowances.push(allowance);
		// console.log(this.allowances);
	},
	unAllowanceCheck(costId,amt,memo){
		this.setState({
			expense: {
				name: this.state.expense.name,
				id: this.state.expense.id,
				totalamt: this.state.expense.totalamt -amt,
				memo1: this.state.expense.memo1,
				custId: this.state.expense.custId,
				allowance: this.state.expense.allowance,
				state: '0'
			}
		});
		let allowance = {costId:costId,memo:memo,amt:amt};
		this.removeAllowance(allowance,this.allowances);
		// console.log(this.allowances);
	},
	updateAllowance(item){
		this.setState({
			showEditDialog: true,
			amt: item.amt,
			memo: item.memo,
			costId:item.costId
		});
	},
	/*renderAllowanceItem:function(item: string, sectionID: number, rowID: number) {
		
		let check = this.state.expense.id?null:<Checkbox  checked={true} onCheck={()=>{this.onAllowanceCheck(item.costId,item.amt,item.memo);}} onUncheck={()=>{this.unAllowanceCheck(item.costId,item.amt,item.memo);}}/>;
		return (
			<TouchableOpacity style={[styles.item, Global.styles.CENTER, Global.styles.BORDER, {left: this.state.delBtnLeftPos}]} onPress={()=>{this.editAllowance(item.memo,item.amt);}}>
				<Image style={[styles.itemPortrait, Global.styles.BORDER]}  source={{uri:Global.host + Global.costTypePath + "7.png"}} />
				<View style={{flex:1,flexDirection:'column'}}>
					<View style={{flex:1,flexDirection:'row'}}>
						<Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>￥{item.amt}</Text>
					</View>
					<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
						<Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>补助名称:{item.memo}</Text>
					</View>
					
				</View>
				{check}

			</TouchableOpacity>
		);

	},*/
	renderItem: function(item: string, sectionID: number, rowID: number) {
		/*let costItem = item.type == '7'?(<TouchableOpacity style={[styles.item, Global.styles.CENTER, Global.styles.BORDER, {left: this.state.delBtnLeftPos}]} onPress={()=>{this.updateAllowance(item);}}>
				<Image style={[styles.itemPortrait, Global.styles.BORDER]}  source={{uri:Global.host + Global.costTypePath + item.type+".png"}} />
				<View style={{flex:1,flexDirection:'column'}}>
					<View style={{flex:1,flexDirection:'row'}}>
						<Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>￥{item.amt}</Text>
					</View>
					<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
						<Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>补助名称:{item.memo}</Text>
					</View>
				</View>
				{check}
			</TouchableOpacity>):(<TouchableOpacity style={[styles.item, Global.styles.CENTER, Global.styles.BORDER, {left: this.state.delBtnLeftPos}]} onPress={()=>{this.doCostEdit(item.costId,item.type);}}>
						<Image style={[styles.itemPortrait, Global.styles.BORDER]}  source={{uri:Global.host + Global.costTypePath + item.type+".png"}} />
						<View style={{flex:1,flexDirection:'column'}}>
							<View style={{flex:1,flexDirection:'row'}}>
								<Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>￥{item.amt}</Text>
								<Text style={{flex: 1, fontSize: 12}}>{item.num}张发票</Text>
							</View>
							<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
								<Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>{item.date}</Text>
								<Text style={{flex: 1, fontSize: 12}}>{item.memo}</Text>
							</View>
						</View>
						{check}
					</TouchableOpacity>);*/
		let check = this.state.expense.id?null:<Checkbox  onCheck={()=>{this.onCheck(item.amt,item.costId);}} onUncheck={()=>{this.unCheck(item.amt,item.costId);}}/>;
		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
		var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
		var image=null;
		switch (item.type){
    	case '1':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(111, 172, 240, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='plane' size={20}/></View>);
    		break;
    	case '2':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(240, 216, 79, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='android-car' size={20}/></View>);
    		break;
    	case '3':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(245, 80, 150, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='ios-home' size={20}/></View>);
    		break;
    	case '4':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(88, 209, 137, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='fork' size={20}/></View>);
    		break;
    	case '5':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(234, 148, 106, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='ios-telephone' size={20}/></View>);
    		break;
    	case '6':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(186, 119, 219, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='more' size={20}/></View>);
    		break;
        }
		return (
			<View>
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER]} onPress={()=>{this.doCostEdit(item.costId,item.type);}}>
						{image}
						<View style={{flex:1,flexDirection:'column'}}>
							<View style={{flex:1,flexDirection:'row'}}>
								<Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>￥{this.filterMoney(item.amt)}</Text>
								<Text style={{flex: 1, fontSize: 12}}>{item.num}张发票</Text>
							</View>
							<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
								<Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>{item.date}</Text>
								<Text style={{flex: 1, fontSize: 12}}>{item.memo}</Text>
							</View>
						</View>
						{check}
				</TouchableOpacity>
				{bottomLine}
			</View>
		);
	},
	
	_renderPlaceholderView: function() {
		return (
			<View></View>
		);
	},
});

//编辑补助弹出框
var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var Allowance = t.struct({
	costId: t.maybe(t.String),
	memo: t.String,
	amt: t.Number,
});

var options = {	
	fields: {
		costId: {
			factory: TcombHidden,
		},
		memo: {
			label: '补助名称',
			error: '名称必须填写且长度不能超过20位',
		},
		amt: {
			label: '补助金额',
			error: '金额必须填写且长度不能超过17位',
		},
	},
};
var Dialog = React.createClass({
    getInitialState() {
        return {
            top: new Animated.Value(Global.getScreen().height),
			value :{
				memo:null,
				amt:null,
				costId:null
			}            
        };
    },

    show: function() {
        Animated.timing(
            this.state.top,
            {
                toValue: 0,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
            },
        ).start();
    },

    hide: function() {
        Animated.timing(
            this.state.top,
            {
                toValue: Global.getScreen().height,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
            },
        ).start();
    },

    /**
    * 组件接收参数变化
    */
    componentWillReceiveProps: function(props) {
        if(props.amt !=null  && props.memo !=null){
			this.setState({
				value: {
					memo: props.memo,
					amt: props.amt,
					costId : props.costId
				}
			});
        }
        if(props.show) {
            this.show();
            //this.setState({top: 0});
        } else {
            this.hide();
            //this.setState({top: ENV.SCREEN.height});
        }
    },

    /**
    * 点击确认按钮触发
    */
    ok: function() {
        var value = this.refs.form.getValue();
        if(value){
        	this.hide();
        	if(this.props.ok)
			this.props.ok(value);
	        this.setState({
				value: {
					costId:null,
					memo: null,
					amt: null
				}
			});
        }
        
    },

    /**
    * 点击取消按钮触发
    */
    cancel: function() {
        this.hide();
        this.setState({
			value: {
				costId:null,
				memo: null,
				amt: null
			}
		});
        if(this.props.cancel)
            this.props.cancel.call();
    },
    onFormChange: function(value, objName) {
		/*console.log('``````````````````` arguments in edit.onChange():');
		console.log(arguments);
		console.log('``````````````````` end of arguments in edit.onChange():');*/
		console.log('value.......................');
		console.log(value);
	},
    render() {
        var title = this.props.title ? this.props.title : '提示';
        return (
            <Animated.View style={[styles.dialogContainer, Global.styles.CENTER, {top: this.state.top}]}>
                <View style={[Global.styles.CENTER, styles.msgContainer]}>
                    <Icon name='ios-information' size={25} color={Global.colors.ORANGE} style={[Global.styles.ICON, styles.icon]} />
                    <Text style={[styles.title]}>{title}</Text>
                    <View style={styles.separator}></View>
                  { /* <View style={[{flexDirection:'row'},Global.styles.CENTER]}>
                                          <Text style={{width:60}}>补助名称：</Text>
                                          <TextInput  style={{width:200}} value={this.state.memo} placeholder="请填写补助名称" onChangeText={(value) => {this.setState({memo:value})}}/>
                                      </View>*/}
	                    <Form
							ref="form"
							type={Allowance}
							options={options}
							value={this.state.value}
							onChange={this.onFormChange} />

                    <View style={[styles.buttonContainer]}>
                        <TouchableOpacity style={[Global.styles.CENTER, styles.button, {marginRight: 5}]} onPress={this.ok}>
                            <Text style={styles.buttonText}>确定</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Global.styles.CENTER, styles.button, {marginLeft: 5}]} onPress={this.cancel}>
                            <Text style={styles.buttonText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    },
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	sv: {
		// paddingLeft: 20,
		// paddingRight: 20,
	},
	placeholder: {
		flex: 1,
		height: Global.NBPadding + 20,
		backgroundColor: '#ffffff',
	},
	portrait: {
		width: 30,
		height: 30,
        borderRadius: 30,
        // marginLeft: 20,
	},
	iconOnPortrait: {
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 3,
		left: 3,
	},
	textInput:{
		height:40,
		borderWidth:1,
		borderColor:'gray',
		marginTop:5,
		borderRadius:3,
		flex:1,
	},
	list:{
		// paddingLeft: 20,
		// paddingRight: 20,
	},
	item: {
		// width: Global.getScreen().width ,
		backgroundColor: '#ffffff',
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
	},
	itemPortrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
	},
	delInItem: {
		width: 60,
		height: 40,
	},
	footBar: {
        flex: 1,
        width: Global.getScreen().width,
        height: 40,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row'
    },
    footBarBtn: {
        flex: 1,
        backgroundColor: Global.colors.IOS_BLUE,
        height: 40
    },

    // ---------------------------------------------------
    dialogContainer:{
        width: Global.getScreen().width,
        height: Global.getScreen().height,
        position: 'absolute',
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .75)',
        overflow: 'hidden',
    },
    msgContainer: {
        width: 300, 
        backgroundColor: '#ffffff', 
        borderRadius: 5,
    },
    icon: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        color: Global.colors.FONT_GRAY,
        margin: 15,
    },
    msg: {
        margin: 20,
    },
    buttonContainer: {
        width: 220,
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        width: 100,
        height: 40, 
        backgroundColor: Global.colors.IOS_BLUE, 
        borderRadius: 3, 
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#ffffff',
    },
    separator: {
        width: 260, 
        backgroundColor: Global.colors.NAV_BAR_LINE, 
        height: 1/Global.pixelRatio,
    },
});

module.exports = ExpenseEdit;
