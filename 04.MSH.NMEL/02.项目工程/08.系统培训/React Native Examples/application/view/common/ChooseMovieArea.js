/**
 * 电影主页
 */

'use strict';

var React = require('react-native');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var UtilsMixin = require('../lib/UtilsMixin');
var ChooseMovieAreaComp = require('./ChooseMovieAreaComp');

var {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    PropTypes,
    Image,
    InteractionManager,
} = React;

var ChooseMovieArea = React.createClass({

	mixins: [UtilsMixin],

    statics: {
        title: 'ChooseMovieArea',
        description: '影票-选择地区',
    },

    /**
     * 参数说明
     */
    propTypes: {

        /**
        * 导航容器
        * 必填
        */
        navigator: PropTypes.object.isRequired,

    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        return {
        };
    },

    /**
    * 初始化状态
    */
    getInitialState: function () {
        return {
        	doRenderScene: false,
            areaName: Global.curr_location.name,
        };
    },

    componentDidMount: function() {
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
    },

    changeAreaName: function(item) {
        this.setState({areaName: item.name});
    },

    chooseArea: function() {
        var comp = (<ChooseMovieAreaComp navigator={this.props.navigator} afterChoose={this.props.afterChoose} changeBtnName={this.changeAreaName} />);
    	this.props.navigator._showModal(comp);
    },

    render: function() {
        
        return (
            <TouchableOpacity style={[this.props.style]} onPress={this.chooseArea}>
                <Text numberOfLines={1} style={{flex: 1, textAlign: 'right', color: Global.colors.IOS_RED, marginRight: 5}}>{this.state.areaName}</Text>
                <Icon name='ios-location' size={15} color={Global.colors.IOS_RED} style={{width: 15}} />
            </TouchableOpacity>
        );
        
    },
});

var styles = StyleSheet.create({

});

module.exports = ChooseMovieArea;

