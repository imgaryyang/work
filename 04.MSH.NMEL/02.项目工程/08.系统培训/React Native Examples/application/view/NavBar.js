/**
 * 顶端导航栏组件 - NavBar
**/
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var cssVar = require('cssVar');
var Global = require('../Global');
var {
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    PropTypes,
    Image,
    StatusBarIOS,
} = React;

var nbPadding = Platform.OS === 'ios' ? 20 : 0;

var NavBar = React.createClass({

    statics: {
        title: 'NavBar',
        description: '导航栏',
        THEME: {
            GRAY: {
                bar: {
                    backgroundColor: Global.colors.IOS_NAV_BG,
                },
                barBottomLine: {
                    backgroundColor: Global.colors.IOS_NAV_LINE,
                },
                titleText: {
                    flex: 1,
                    fontSize: 16,
                    color: '#000000',
                    textAlign: 'center',
                },
                backBtn: {
                    flex: 1, 
                    flexDirection: 'row', 
                    height: 44,
                    alignItems: 'center', 
                    justifyContent: 'center',
                },
                backIcon: {
                    width: 23, 
                    marginLeft: 7, 
                    color: Global.colors.IOS_BLUE,
                    textAlign: 'center',
                },
                backText: {
                    flex: 1, 
                    fontSize: 13, 
                    color: Global.colors.IOS_BLUE,
                },
            },
            BLUE: {
                bar: {
                    backgroundColor: 'rgba(68, 92, 149, 1)', //#445c95
                },
                barBottomLine: {
                    backgroundColor: 'rgba(68, 92, 149, 1)', //#445c95
                },
                titleText: {
                    flex: 1,
                    fontSize: 16,
                    color: '#FFFFFF',
                    textAlign: 'center',
                },
                backBtn: {
                    flex: 1, 
                    flexDirection: 'row', 
                    height: 44,
                    alignItems: 'center', 
                    justifyContent: 'center',
                },
                backIcon: {
                    width: 23, 
                    marginLeft: 7, 
                    color: 'white',
                    textAlign: 'center',
                },
                backText: {
                    flex: 1, 
                    fontSize: 13, 
                    color: 'white',
                },
            },
        },
    },

    propTypes: {

        /**
        * 导航容器
        * 必填
        */
        navigator: PropTypes.object.isRequired,

        /**
        * 路由
        * 必填
        */
        route: PropTypes.object.isRequired,

        /**
        * 如果传入此参数，则NavBar只保留基础样式，NavBar里的子节点直接使用传入的组件
        */
        component: PropTypes.node,

        /**
        * 标题
        * 可以为空，如果不空，则NavBar标题将使用此处传入的title，如果为空，则使用route中的title
        */
        title: PropTypes.string,

        /**
        * 是否隐藏后退按钮
        */
        hideBackButton: PropTypes.bool,

        /**
         * 是否隐藏后退按钮文字
         */
        hideBackText: PropTypes.bool,

        /**
         * 特定后退按钮文体
         */
        backText: PropTypes.string,

        /**
        * 自定义左侧按钮，传入的按钮将显示在Back按钮之后
        */
        //leftButtons: PropTypes.node,

        /**
        * 自定义右侧按钮，传入的按钮将显示在NavBar右侧
        */
        rightButtons: PropTypes.node,

        /**
        * 如果传入此参数，则将使用传入的组件替换title
        */
        centerComponent: PropTypes.node,

        /**
         * 是否显示底端线条
        */
        hideBottomLine: PropTypes.bool,

        /**
         * 是否浮动
         */
        flow: PropTypes.bool,

        /**
         * 主题，可定制部分样式
         */
        theme: PropTypes.object,

        /**
         * IOS 状态栏样式
         */
        statusBarStyle: PropTypes.string,

        /**
        * 自定义后退按钮方法
        */
        backFn:PropTypes.func

    },

    getDefaultProps: function() {
        return {
            flow: true,
            theme: this.THEME.GRAY,
            statusBarStyle: 'default', //light-content
        };
    },

    /**
    * 初始化状态
    */
    getInitialState: function () {
        return {
            component: null,
            title: null,
            hideBackButton: false,
            hideBackText: false,
            backFn:null,
            //leftButtons: null,
            rightButtons: null,
            centerComponent: null,
            statusBarStyle: this.props.statusBarStyle ? this.props.statusBarStyle : 'default',
        };
    },

    /**
    * 渲染完成后接收参数变化，以此支持动态改变NavBar
    */
    componentWillReceiveProps: function(props) {
        this.setState(props);
    },

    /**
    * 后退，供NavBar后退按钮使用
    */
    pop: function() {
        /*console.log('```````````````````' + this.props.navigator);
        console.log('```````````````````' + this.props.navigator.getCurrentRoutes().length);*/
        if(this.props.backFn){
            this.props.backFn();
        }
        this.props.navigator.pop();
    },

    preTitle: '',

    getPreTitle: function() {
        if(this.preTitle == '') {
            if(this.props.hideBackButton || this.props.hideBackText)
                this.preTitle = null;
            else {
                if(this.props.backText)
                    this.preTitle = this.props.backText;
                else {
                    if(this.props.navigator.getCurrentRoutes())
                        this.preTitle = this.props.navigator.getCurrentRoutes().length > 1 ? this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length - 2].title : null;
                    this.preTitle = this.preTitle ? this.preTitle : '返回';
                }
            }
        }
        return this.preTitle;
    },

    renderLeftButtons: function() {
        var backBtn = null;
        if(!this.props.hideBackButton) {
            var patchStyle = Global.os == 'ios' ? {marginTop: 2.2} : null;
            backBtn = (
                <TouchableOpacity onPress={this.pop} style={this.props.theme.backBtn}>
                    <Icon name='ios-arrow-back' size={22} style={[this.props.theme.backIcon, patchStyle]} />
                    <Text numberOfLines={1} style={this.props.theme.backText} >{this.getPreTitle()}</Text>
                </TouchableOpacity>
            );
        }
        return (
            <View style={[styles.navItemView, styles.leftButtons]}>
                {backBtn}
                {/*this.props.leftButtons ? this.props.leftButtons: null*/}
            </View>
        );
    },

    renderRightButtons: function() {
        return (
            <View style={[styles.navItemView, styles.rightButtons]}>
                {this.props.rightButtons ? this.props.rightButtons : null }
            </View>
        );
    },

    renderTitle: function() {
        if(this.props.centerComponent) {
            return this.props.centerComponent;
        } else {
            var title = this.props.title ? this.props.title : (this.props.route ? this.props.route.title : null);
            return (
                <View style={[styles.navItemView, styles.titleView, Global.styles.CENTER]}>
                    <Text numberOfLines={1} style={this.props.theme.titleText}>{title}</Text>
                </View>
            );
        }
    },

    render: function() {
        if(Global.os == 'ios') {
            StatusBarIOS.setStyle(this.state.statusBarStyle);
        }

        //var bg = null;(<Image source={require('../res/images/nav-bg.png')} style={styles.navBg} />);
        //
        var bottomLine = this.props.hideBottomLine == true ? null : (<View style={[styles.bottomLine, this.props.theme.barBottomLine]} />);

        var flowStyle = this.props.flow == false ? null : styles.navBarFlow;

        if(this.props.component) {
            return (
                <View style={[styles.navBar, flowStyle, this.props.theme.bar]}>
                    {/*bg*/}
                    {this.props.component}
                    {bottomLine}
                </View>
            );
        } else {
            return (
                <View style={[styles.navBar, flowStyle, this.props.theme.bar]}>
                    {/*bg*/}
                    {this.renderLeftButtons()}
                    {this.renderTitle()}
                    {this.renderRightButtons()}
                    {bottomLine}
                </View>
            );
        }
    }
});

var styles = StyleSheet.create({
    navBarFlow: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    navBar: {
        width: Global.getScreen().width,
        height: Global.NBHeight,
        borderTopWidth: 0,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    /*navBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Global.getScreen().width,
        height: Global.getScreen().width * 10 / 8,
    },*/
    navItemView: {
        height: Global.NBHeight,
        backgroundColor: 'transparent',
        paddingTop: nbPadding,
    },
    leftButtons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1.5,
        backgroundColor: 'transparent',
    },
    rightButtons: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    bottomLine: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: Global.getScreen().width,
        height: 1 / Global.pixelRatio,
    },
});

module.exports = NavBar;
