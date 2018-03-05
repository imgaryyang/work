var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var QRCode = require('../lib/QRCode');

var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');

var {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    PropTypes,
    Navigator,
    PixelRatio,
    Dimensions,
    Alert,
    Image,
    InteractionManager,   
} = React;

var MovieQrView = React.createClass({

    mixins: [UtilsMixin,FilterMixin],

    statics: {
        title: 'MovieOrder',
        description: '订单详情',
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

        /**
        * 影票信息tic
        */
        tic:PropTypes.array.isRequired
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
            tic : this.props.tic
            //price: this.props.price,
           // filmName: this.props.filmName,
            //id: this.props.id,
        };
    },
    componentDidMount:  function() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
        });
    },
    getQR:function(){
        return this.state.tic.map((item,idx)=>{
            return(
                <View key={'qr_'+idx} style={[Global.styles.CENTER]}>
                    <View style={[{paddingRight:10,backgroundColor:'#ffffff'},Global.styles.CENTER,Global.styles.BORDER]}>
                        <QRCode
                        value={item.exchangeCode}
                        size={200}
                        bgColor='purple'
                        fgColor='white'/>
                        <View style={[Global.styles.CENTER]}>
                            <Text style={{flex:1,color:'green',textAlign:'center',fontSize:15}}>{item.waitDate.substring(0,10)} {item.waitTime}</Text>
                            <Text style={{flex:1,color:'green',textAlign:'center',fontSize:15}}>{item.seatInfo}</Text>
                        </View>
                    </View>
                    <View style={Global.styles.PLACEHOLDER20} />   

                </View>
            );
        }); 
    },
    render:function(){
         if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style={Global.styles.CONTAINER}>
                {this._getNavBar()}
                <View style={Global.styles.PLACEHOLDER20} />        
                <ScrollView style={[styles.sv,]}>
                    <View style={Global.styles.CENTER}>
                        {this.getQR()}
                    </View>
                </ScrollView>
            </View>
            );
    },
    _renderPlaceholderView: function() {
        return (
            <View style={Global.styles.CONTAINER}>
                {this._getNavBar()}
            </View>
        );
    },
    
    _getNavBar: function() {
        return (
            <NavBar title='影票二维码'
                navigator={this.props.navigator} 
                route={this.props.route} 
                hideBackButton={false} 
                hideBottomLine={false} 
                flow={false} 
                centerComponent={(
                    <View style={[Global.styles.NAV_BAR.CENTER_VIEW, {flex: 2, flexDirection: 'row'}]} >
                        <Text numberOfLines={1} style={[{fontSize: 16, color: '#000000'}]}>{this.state.navTitle}</Text>
                    </View>
                )} />
        );
    },


});

var styles = StyleSheet.create({
    sv: {
        flex: 1,
    },
    item: {
        backgroundColor: '#ffffff', 
        paddingTop:10,
        paddingBottom:10        
    },
    itemtext: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    itemtext1: {
        paddingLeft: 10,
    },
    itemButton: {
        flex: 1, 
        flexDirection: 'row', 
    },
   
    paddingPlace: {
        flex: 1,
        height: Global.NBPadding-45,
    },
    rend_row: {
        flexDirection: 'row',
        height:50,
        paddingLeft:10,
        backgroundColor:'#FFFFFF',
        borderLeftWidth: 1 / PixelRatio.get(),
        borderRightWidth: 1 / PixelRatio.get(),
        borderColor:Global.colors.TAB_BAR_LINE,
        alignItems: 'center',
    },
   
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    thumb: {
        width: 30,
        height: 20,
    },
    text: {
        flex: 1,
    },
    icon: {
        textAlign: 'center',
    },

    button:{
        marginLeft:90,
        width:50,
        height:25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#ef473a',
        borderColor:'#ffffff',
        borderWidth:1 / PixelRatio.get(),
    },
});

module.exports = MovieQrView;
