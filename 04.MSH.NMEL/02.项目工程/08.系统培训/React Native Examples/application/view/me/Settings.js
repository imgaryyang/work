'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	TextInput,
	AsyncStorage,
	InteractionManager,
	Alert,
} = React;

var Host = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

	getInitialState: function() {
		return {
			doRenderScene: false,
			host: Global.host,
			hostTimeout: Global.hostTimeout,
			movieHost: Global.movieHost,
			acctHost:Global.acctHost,
		};
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	save: async function() {
		try {
			await Global.setHost(this.state.host);
			await Global.setHostTimeout(parseFloat(this.state.hostTimeout));
			await Global.setMovieHost(this.state.movieHost);
			await Global.setAcctHost(this.state.acctHost);
			this.props.refreshUser();
			this.toast('保存配置信息成功！');
		} catch(e) {
			this.toast('保存配置信息失败！');
			console.warn(e);
		}
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[Global.styles.CONTAINER]} >
				<ScrollView style={styles.sv}>

					<View style={styles.paddingPlace} />

					<Text style={{marginLeft: 20, marginBottom: 5}} >小企业管家后台服务地址：</Text>

					<View style={Global.styles.FULL_SEP_LINE} />
					<TextInput 
						key='host'
						style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, styles.textInput]} 
						placeholder="小企业管家后台服务地址" 
						value={this.state.host} 
						onChangeText={(value) => this.setState({host: value})} />
					<View style={Global.styles.FULL_SEP_LINE} />

					<Text style={{marginLeft: 20, marginBottom: 5, marginTop: 20}} >小企业管家后台响应超时时间(毫秒 - ms)：</Text>

					<View style={Global.styles.FULL_SEP_LINE} />
					<TextInput 
						key='hostTimeout'
						style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, styles.textInput]} 
						placeholder="小企业管家后台响应超时时间" 
						value={this.state.hostTimeout + ''} 
						onChangeText={(value) => this.setState({hostTimeout: value})} />
					<View style={Global.styles.FULL_SEP_LINE} />

					<Text style={{marginLeft: 20, marginBottom: 5, marginTop: 20}} >影票平台后台服务地址：</Text>

					<View style={Global.styles.FULL_SEP_LINE} />
					<TextInput 
						key='movieHost'
						style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, styles.textInput]} 
						placeholder="影票平台后台服务地址" 
						value={this.state.movieHost + ''} 
						onChangeText={(value) => this.setState({movieHost: value})} />
					<View style={Global.styles.FULL_SEP_LINE} />

					<Text style={{marginLeft: 20, marginBottom: 5, marginTop: 20}} >账户管理后台服务地址</Text>

					<View style={Global.styles.FULL_SEP_LINE} />
					<TextInput 
						key='acctHost'
						style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, styles.textInput]} 
						placeholder="账户管理后台服务地址" 
						value={this.state.acctHost + ''} 
						onChangeText={(value) => this.setState({acctHost: value})} />
					<View style={Global.styles.FULL_SEP_LINE} />

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {margin: 20}]} 
						onPress={this.save}>
			    		<Text style={{color: '#ffffff',}}>保存</Text>
			    	</TouchableOpacity>
				</ScrollView>
			    
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={[Global.styles.CONTAINER]} />
		);
	},

});

var styles = StyleSheet.create({
	sv: {
	},
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	
	textInput:{
		flex: 1,
		fontSize: 15,
		height: 50,
		backgroundColor: 'white',
		paddingLeft: 22,
	}
});

module.exports = Host;



