'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var EmpVacaList = require('./empVacaList');

var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var FilterMixin = require('../../filter/FilterMixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	ListView,
    Alert,
} = React;

var FIND_URL = 'vacation/findByEmployee';
var VacaDetail = React.createClass({
	mixins: [UtilsMixin, TimerMixin, FilterMixin],
	item: null,

	/**
	* 初始化状态
	*/
	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			loaded: false,
			value: {
				id: this.props.id,

			},
			showLoading: false,
		};
	},
	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		/*for (var ii = 0; ii < 30; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}*/
		return dataBlob;
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			if(this.props.id && this.props.id != '')
				this.fetchData();
		});
	},

	toFloat: function(a) {
		var num = parseFloat(a);
		return num;
	},

	fetchData: async function() {

		this.showLoading();
		try {
			let responseData = await this.request(Global.host +FIND_URL, {
				body: JSON.stringify({
					employeeId: this.props.id,
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded: true,
			});
			
		} catch(e) {
			this.requestCatch(e);
		}

	},

	render: function(item) {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[styles.container]}>
				<ScrollView >
					<View style={styles.paddingPlace} />
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
					
					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>
			</View>
		);
	},
	renderItem: function(item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        
		return (
			<View >
				{topLine}
				<View style={[styles.list,Global.styles.CENTER]}>
	
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>申  请  人：</Text>
							<Text style={[styles.item2]}>{item.employeeName}</Text>
						</View>
						<View style={[styles.row,Global.styles.CENTER]}>
						<Text style={[styles.item1]}>事        由：</Text>
						<Text style={[styles.item2]}>{item.reson}</Text>
						</View>
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>休假时间：</Text>
							<Text style={[styles.item2]}>{this.filterDateFmt(item.startTime)} 至 {this.filterDateFmt(item.endTime)}</Text>
						</View>
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>休假天数：</Text>
							<Text style={[styles.item2]}>{this.toFloat(item.days)}天</Text>
						</View>
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>提交时间：</Text>
							<Text style={[styles.item2]}>{this.filterDateFmt(item.submitTime)}</Text>
						</View>
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>审批时间：</Text>
							<Text style={[styles.item2]}>{this.filterDateFmt(item.approveTime)}</Text>
						</View>
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>审批备注：</Text>
							<Text style={[styles.item2]}>{item.comment}</Text>
						</View>

					</View>
						
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

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	item: {
		width: Global.getScreen().width + 60,
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	row: {
		flex: 1,
		paddingLeft: 40,
		paddingRight: 10,
		height: 20,
		flexDirection:'row',
	},
	item1: {
		width: 80, 
		fontSize: 13,
	},
	item2:{
		width:Global.getScreen().width - 100,
		fontSize: 13,
	},

});

module.exports = VacaDetail;
