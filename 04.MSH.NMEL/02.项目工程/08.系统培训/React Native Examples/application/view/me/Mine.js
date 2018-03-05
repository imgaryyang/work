'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var movieOrders = require('./MovieOrders');

var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
// var ScrollableMixin = require('react-native-scrollable-mixin');


var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	AsyncStorage,
	Alert,
	StatusBarIOS,
	Animated,
	Navigator,
} = React;

var LOGIN_OUT = "login/logout";
var userModel = {};

var Mine = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

    statics: {
        title: 'Me',
        description: '我',
    },

    randomColors: [],

    getList: function() {
    	return [
	        {text: '影票订单', icon: 'ios-paper-outline', component: movieOrders},
	        
	    ];
    },

	getInitialState: function() {
        //this.getRandomColors();
		return {
			USER_LOGIN_INFO: this.props.USER_LOGIN_INFO,
			scrollY: new Animated.Value(0),
		};
	},

	componentWillReceiveProps: function(props) {
		this.setState({
			USER_LOGIN_INFO: props.USER_LOGIN_INFO,
		});
	},

    getRandomColors: function() {
        this.randomColors = [];
        for(var i = 0 ; i < 50 ; i++){
            this.randomColors[this.randomColors.length] = Global.getRandomColor();
        }
    },

    push: function(title, component, passProps) {
    	if(component != null)
	        this.props.navigator.push({
	            title: title,
	            component: component,
	            hideNavBar: false,
	        	sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
                passProps: passProps ? passProps : null,
	        });
    },

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},
    
    
	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}
				<ScrollView 
					automaticallyAdjustContentInsets={false} 
					style={[styles.sv]}>

					<View style={Global.styles.PLACEHOLDER20} />
					{this._renderList()}
					<View style={Global.styles.PLACEHOLDER20} />

			    </ScrollView>
		    </View>
		);
		
	},

    _renderList: function() {
        
        var list = this.getList().map(({text, icon, component, func, separator, passProps}, idx) => {
            
            var topLine = idx === 0 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;
            var bottomLine = idx === this.getList().length - 1 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;

            var itemLine = idx < this.getList().length - 1 ? (<View style={{flex: 1, backgroundColor: '#ffffff'}} ><View style={Global.styles.SEP_LINE} /></View>) : null;
            if(separator === true)
            	itemLine = (
            		<View key={idx + '_' + text} >
	            		<View style={Global.styles.FULL_SEP_LINE} />
	            		<View style={Global.styles.PLACEHOLDER20} />
	            		<View style={Global.styles.FULL_SEP_LINE} />
                	</View>
            	);

            return (
                <View key={idx + '_' + text} >
                    {topLine}
                    <TouchableOpacity style={[styles.listItem, Global.styles.CENTER]} onPress={()=>{
                    	if(func)
                    		func();
                    	else
	                        this.push(text, component, passProps);
                    }} >
                        <View style={[Global.styles.CENTER, styles.listItemIcon, ]} >
                            <Icon name={icon} size={22} color={Global.colors.ORANGE} style={[styles.icon, Global.styles.ICON]} />
                        </View>
                        <Text style={{flex: 1, marginLeft: 10}}>{text}</Text>
                        <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
                    </TouchableOpacity>
                    {itemLine}
                    {bottomLine}
                </View>
            );
        });
        return list;
    },

    _getNavBar: function() {
		return (
			<NavBar 
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	hideBackButton={false} 
		    	hideBottomLine={false} 
		    	flow={false} />
		);
	},
    _renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	},

});

var styles = StyleSheet.create({
	sv: {
	},


    listItem: {
        width: Global.getScreen().width,
        flexDirection: 'row',
        padding: 7,
        paddingLeft: 15,
        paddingRight: 0,
        backgroundColor: 'white',
    },
    listItemIcon: {
        width: 30,
        height: 30,
        borderRadius: 5,
    },
    icon: {
    },

    
});

module.exports = Mine;
