/**
 * 电影主页
 */

'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var NavBar = require('../NavBar');

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
    WebView,
} = React;

var WEBVIEW_REF = '__WebViewSample__';

var WebViewSample = React.createClass({

	mixins: [UtilsMixin],

    statics: {
        title: 'WebViewSample',
        description: 'WebView测试',
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

        /**
        * 路由
        * 必填
        */
        route: PropTypes.object.isRequired,

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
        //this.getRandomColors();
        return {
        	doRenderScene: false,
            url: 'http://www.baidu.com',
            loading: true,
            scalesPageToFit: true,
            title: 'loading...',
        };
    },

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
    },

    goBack: function() {
        if(this.state.backButtonEnabled)
            this.refs[WEBVIEW_REF].goBack();
    },

    goForward: function() {
        if(this.state.forwardButtonEnabled)
            this.refs[WEBVIEW_REF].goForward();
    },

    reload: function() {
        this.refs[WEBVIEW_REF].reload();
    },

    onNavigationStateChange: function(navState) {
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            title: navState.title,
            loading: navState.loading,
            scalesPageToFit: true
        });
    },

    onLoad: function() {
        console.log(arguments);
    },

    render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

        var backBtnTextStyle = this.state.backButtonEnabled ? styles.btnText : styles.disabledBtnText;
        var forwardBtnTextStyle = this.state.forwardButtonEnabled ? styles.btnText : styles.disabledBtnText;
        
        return (
			<View style={[Global.styles.CONTAINER/*, {backgroundColor: 'white'}*/]}>
			    {this._getNavBar()}
				<WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={false}
                    //domStorageEnabled={true}
                    //decelerationRate="normal"
                    //onLoad={this.onLoad}
                    onNavigationStateChange={this.onNavigationStateChange}
                    //onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    //scalesPageToFit={this.state.scalesPageToFit}
                />
                <View style={[Global.styles.CENTER, styles.statusBar]}>
                    <TouchableOpacity style={[Global.styles.CENTER, styles.bottomBtn]} onPress={this.goBack} >
                        <Text style={backBtnTextStyle} >后退</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Global.styles.CENTER, styles.bottomBtn]} onPress={this.goForward} >
                        <Text style={forwardBtnTextStyle} >前进</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Global.styles.CENTER, styles.bottomBtn]} onPress={this.reload} >
                        <Text style={styles.btnText} >刷新</Text>
                    </TouchableOpacity>
                </View>
		    </View>
        );
        
    },

	_renderPlaceholderView: function() {
		return (
			<View style={[Global.styles.CONTAINER/*, {backgroundColor: 'white'}*/]}>
			    {this._getNavBar()}
			</View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar title={this.state.title} 
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	hideBackButton={false} 
                hideBackText={true}
		    	hideBottomLine={false} 
		    	flow={false} 
                centerComponent={(
                    <View style={[Global.styles.NAV_BAR.CENTER_VIEW, {flex: 4, flexDirection: 'row'}]} >
                        <Text numberOfLines={1} style={Global.styles.NAV_BAR.TITLE_TEXT} >{this.state.title}</Text>
                    </View>
                )} />
		);
	},
});

var styles = StyleSheet.create({
    webView: {
    	flex: 1,
    },
    statusBar: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: 'white',
        borderTopWidth: 1 / Global.pixelRatio,
        borderTopColor: Global.colors.IOS_NAV_LINE,
    },
    bottomBtn: {
        flex: 1,
    },
    disabledBtnText: {
        color: 'gray',
    },
    btnText: {
        color: Global.colors.IOS_BLUE,
    },

});

module.exports = WebViewSample;

