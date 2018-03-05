/**
 * 电影主页
 */

'use strict';

var React = require('react-native');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var UtilsMixin = require('../lib/UtilsMixin');

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

var ChooseMovieAreaComp = React.createClass({

	mixins: [UtilsMixin],

    statics: {
        title: 'ChooseMovieAreaComp',
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
        this.chooseArea();
        return {
            areas: [],
        };
    },

    componentDidMount: function() {
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
    },

    chooseArea: async function() {
        try {
            // var res = await this.request(Global.host + 'ServiceArea/getAreasByServiceCode', {
            //     body: JSON.stringify({
            //         serviceCode: 'IMOV0001',
            //     })
            // });
            //改为从影票系统获取城市列表
            var res = await this.request(Global.movieHost+'yppt/getAllCity.do',{
                method:'GET',
            });
            //console.log(res.data);
            this.setState({areas: res.data});
        } catch(e) {
            this.requestCatch(e);
        }
    },

    afterChoose: function(item) {
        //设置全局位置
        Global.curr_location = {
            code: item.code, 
            name: item.name
        };

        //改变按钮文字
        this.props.changeBtnName(item);

        //回调
        if(typeof this.props.afterChoose == 'function')
            this.props.afterChoose(item);

        //隐藏选择窗口
        this.props.navigator._hideModal();
    },

    render: function() {

        var areas = this.state.areas.map(
            (item, idx) => {
                return (
                    <TouchableOpacity key={'key_'+idx} style={[Global.styles.CENTER, this.getStyles().areaBtn, (item.code == Global.curr_location.code ? {backgroundColor: Global.colors.IOS_GRAY_BG} : null)]} onPress={() => {
                        if(item.code != Global.curr_location.code)
                            this.afterChoose(item);
                    }} >
                        <Text numberOfLines={1} style={{marginLeft: 5, marginRight: 5}} >{item.name}</Text>
                    </TouchableOpacity>
                );
            }
        );
        
        return (
            <View style={this.getStyles().container} >
                <TouchableOpacity 
                    style={[Global.styles.CENTER, 
                        {width: 30, height: 30, marginLeft: 10, marginTop: Global.NBHeight - 44 + 10}]} 
                    onPress={() => this.props.navigator._hideModal()} >
                    <Icon name='ios-close-empty' color={Global.colors.IOS_GRAY_FONT} size={26} />
                </TouchableOpacity>
                <Text style={{margin: 15, fontSize: 14, fontWeight: '400'}} >请选择城市：</Text>
                <View style={this.getStyles().areaHolder} >
                    {areas}
                </View>
            </View>
        );
        
    },

    getStyles: function() {
        return StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
                width: Global.getScreen().width,
                height: Global.getScreen().height,
            },
            areaHolder: {
                flex: 1, 
                flexDirection: 'row',
                flexWrap: 'wrap',
                overflow: 'hidden', 
            },
            areaBtn: {
                width: (Global.getScreen().width - 20) / 3,
                height: 40,
                borderWidth: 1 / Global.pixelRatio,
                borderColor: Global.colors.IOS_SEP_LINE,
                //backgroundColor: Global.colors.IOS_GRAY_BG,
                marginLeft: 5,
                marginTop: 5,
            },
        });
    },
});

module.exports = ChooseMovieAreaComp;

