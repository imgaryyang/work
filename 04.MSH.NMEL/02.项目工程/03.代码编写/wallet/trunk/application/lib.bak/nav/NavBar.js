/**
 * 顶端导航栏组件 - NavBar
**/
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    Image,
    StatusBar,
    PixelRatio,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const nbPadding = Platform.OS === 'ios' ? 20 : 0;
const nbHeight = Platform.OS === 'ios' ? 64 : 44;

export default class NavBar extends Component {

    static displayName = 'NavBar';
    static description = '导航栏';

    static THEME = {
        GRAY: {
            bar: {
                backgroundColor: '#f5f5f7',
            },
            barBottomLine: {
                backgroundColor: '#a7a7aa',
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
                color: '#007AFF',
                textAlign: 'center',
            },
            backText: {
                flex: 1, 
                fontSize: 13, 
                color: '#007AFF',
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
        SKY_BLUE: {
            bar: {
                backgroundColor: '#5bc8f3', //#445c95
            },
            barBottomLine: {
                backgroundColor: 'transparent', //#445c95
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
    };

    static propTypes = {

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
        backFn: PropTypes.func,

    };

    static defaultProps = {
        flow: false,
        theme: NavBar.THEME.SKY_BLUE,
        statusBarStyle: 'light-content', //'default',
    };

    /**
    * 初始化状态
    */
    state = {
        component: null,
        title: null,
        hideBackButton: false,
        hideBackText: false,
        backFn: null,
        rightButtons: null,
        centerComponent: null,
        statusBarStyle: this.props.statusBarStyle ? this.props.statusBarStyle : 'default',
    };

    constructor (props) {
        super(props);

        this.pop                       = this.pop.bind(this);
        this.getPreTitle               = this.getPreTitle.bind(this);
        this.renderLeftButtons         = this.renderLeftButtons.bind(this);
        this.renderRightButtons        = this.renderRightButtons.bind(this);
        this.renderTitle               = this.renderTitle.bind(this);
    }

    /**
    * 渲染完成后接收参数变化，以此支持动态改变NavBar
    */
    componentWillReceiveProps (props) {
        this.setState(props);
    }

    /**
    * 后退，供NavBar后退按钮使用
    */
    pop () {
        /*console.log('```````````````````' + this.props.navigator);
        console.log('```````````````````' + this.props.navigator.getCurrentRoutes().length);*/
        if(this.props.backFn) {
            this.props.backFn();
        } else
            this.props.navigator.pop();
    }

    preTitle = '';

    getPreTitle () {
        if(this.preTitle == '') {
            if(this.props.hideBackButton || this.props.hideBackText)
                this.preTitle = null;
            else {
                if(this.props.backText)
                    this.preTitle = this.props.backText;
                else {
                    if(typeof this.props.navigator.getCurrentRoutes == 'undefined' || this.props.navigator.getCurrentRoutes() == null)
                        this.preTitle = this.preTitle ? this.preTitle : '返回';
                    else
                        this.preTitle = this.props.navigator.getCurrentRoutes().length > 1 ? this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length - 2].title : null;
                    this.preTitle = this.preTitle ? this.preTitle : '返回';
                }
            }
        }
        return this.preTitle;
    }

    renderLeftButtons () {
        var backBtn = null, leftButtons;
        if(!this.props.hideBackButton) {
            var patchStyle = Platform.OS == 'ios' ? {marginTop: 2.2} : null;
            backBtn = (
                <TouchableOpacity onPress = {this.pop} style = {this.props.theme.backBtn}>
                    <Icon name = 'ios-arrow-back' size = {22} style = {[this.props.theme.backIcon, patchStyle]} />
                    <Text numberOfLines = {1} style = {this.props.theme.backText} >{this.getPreTitle()}</Text>
                </TouchableOpacity>
            );
        } else {
            leftButtons = this.props.leftButtons ? this.props.leftButtons: null;
        }
        return (
            <View style = {[styles.navItemView, styles.leftButtons]}>
                {backBtn}
                {leftButtons}
            </View>
        );
    }

    renderRightButtons () {
        return (
            <View style = {[styles.navItemView, styles.rightButtons]}>
                {this.props.rightButtons ? this.props.rightButtons : null }
            </View>
        );
    }

    renderTitle () {
        if(this.props.centerComponent) {
            return this.props.centerComponent;
        } else {
            var title = this.props.title ? this.props.title : (this.props.route ? this.props.route.title : null);
            return (
                <View style = {[styles.navItemView, styles.titleView, {alignItems: 'center', justifyContent: 'center'}]}>
                    <Text numberOfLines = {1} style = {this.props.theme.titleText}>{title}</Text>
                </View>
            );
        }
    }

    render () {
        if(Platform.OS == 'ios') {
            StatusBar.setBarStyle(this.state.statusBarStyle);
        }

        //var bg = null;(<Image source = {require('../res/images/nav-bg.png')} style = {styles.navBg} />);
        //
        var bottomLine = this.props.hideBottomLine == true ? null : (<View style = {[styles.bottomLine, this.props.theme.barBottomLine]} />);

        var flowStyle = this.props.flow == false ? null : styles.navBarFlow;

        if(this.props.component) {
            return (
                <View style = {[styles.navBar, flowStyle, this.props.theme.bar]}>
                    {/*bg*/}
                    {this.props.component}
                    {bottomLine}
                </View>
            );
        } else {
            return (
                <View style = {[styles.navBar, flowStyle, this.props.theme.bar]}>
                    {/*bg*/}
                    {this.renderLeftButtons()}
                    {this.renderTitle()}
                    {this.renderRightButtons()}
                    {bottomLine}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    navBarFlow: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    navBar: {
        width: Dimensions.get('window').width,
        height: nbHeight,
        borderTopWidth: 0,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    navItemView: {
        height: nbHeight,
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
        width: Dimensions.get('window').width,
        height: 1 / PixelRatio.get(),
    },
});

