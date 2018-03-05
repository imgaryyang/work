'use strict';

var Checkbox = require('../lib/Checkbox');
var SalaryInfoList = require('./SalaryInfoList');
// var PayDetail = require('./PayDetail');
var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var UtilsMixin = require('../lib/UtilsMixin');




var {
    Animated,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    ListView,
    Alert,
} = React;

'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');

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
	DatePickerAndroid
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	sv: {
		
	},
	paddingPlace: {
		height: Global.NBPadding + 20,
	},
});

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var Cost = t.struct({
	date:t.Date
});

var options = {
	mixins:[UtilsMixin,FilterMixin],	
	fields: {
		date: {
			label: '选择月份',
			mode: 'date',
			maximumDate:new Date(),
			config: {
				format: function(date) {
					var date = new Date(date);
					var year = date.getFullYear();
					var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
					// var day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate());
					return year + '年' +parseInt(month) + '月'  ;
				}
			}
		},
	}
};

	
					

					
var ChooseMonth = React.createClass({

	mixins: [UtilsMixin],

	getInitialState: function() {
		return {
			month: null,
		};
		
	},

    componentDidMount: function() {
    
	},
	
	onFormChange: function(value, objName) {
		/*console.log('``````````````````` arguments in edit.onChange():');
		console.log(arguments);
		console.log('``````````````````` end of arguments in edit.onChange():');*/
		this.setState({value:value});
		var date = new Date(value.date);
		var yy = date.getFullYear();
		var mm = date.getMonth();
		mm = mm<=9?('0'+mm):mm;
		var month = yy + '-'+mm;
		console.log('KKKKKKKKKKK');
		console.log(month);
		// this.props.fresh.call(this.month);
		this.props.fresh(month);
		this.props.navigator.pop();
	},
	render: function() {
		return (
			<View style={[styles.container]}>
				<View style={styles.paddingPlace} />
				<View style={Global.styles.CENTER}>
					<Form
							ref="form"
							type={Cost}
							options={options}
							value={this.state.value}
							onChange={this.onFormChange} />		
		    	</View>
		    </View>
		);
	}
	});


module.exports =ChooseMonth;
