/**
 * 影院列表组件
 */
'use strict';


var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var UtilsMixin = require('../view/lib/UtilsMixin');

// var Cinema = require('./Cinema');
var MovieSchedule = require('./MovieSchedule');
var CinemasList = require('./CinemasList');

var {
    Alert,
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    PropTypes,
    Image,
    InteractionManager,
    ListView,
} = React;


var Cinemas = React.createClass({

    mixins: [UtilsMixin],

    data:[],

    statics: {
        title: 'Cinemas',
        description: '影院列表组件',
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
        *fetchData的URL
        *格式为:接口名
        */
        URL:PropTypes.string, 
        /**
        *城市id
        *值为this.state.cityId
        */
        cityId:PropTypes.string.isRequired,
        /**
        *影片信息
        */
        film:PropTypes.object,
        /**
        *显示影院数目
        *作为页面中一部分使用时默认显示8家影院，否则显示全部影院
        */
        pageSize:PropTypes.number,
        /**
        *是否显示查看全部影院的bottomBar
        *默认为false
        *只有在设置为true且影院数>pageSize时才会显示bottomBar
        */
        isShowAllFlag:PropTypes.bool,

    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        // console.log('--getDefaultProps-');
        // console.log(Global.curr_location.code);
        return {
            URL:'yppt/getAllCinemaByCityId.do',
            pageSize:4,
            film:null,
            isShowAllFlag:false,
        };
    },



    /**
    * 初始化状态
    */
    getInitialState: function () {
        var ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        // console.log('--getInitialState--');
        return {
            networkError:false,
            doRenderScene: false,
            dataSource: ds.cloneWithRows(this._genRows({})),
            loaded: false,
            isRefreshing:false,
            cityId:Global.curr_location.code,
        };
    },


    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob = [];
        return dataBlob;
    },

    componentDidMount: function() {
        // console.log('---componentDidMount--');
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
            this.setState({doRenderScene:true,});
        });
    },

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
        // console.log('--componentWillReceiveProps--');
        // if(this.state.cityId!=props.cityId){
            this.setState({cityId:props.cityId});
            this.fetchData();
        // }
    },

    //抓取数据
    fetchData:async function(){
        // this.showLoading();
        this.setState({
            loaded: false,
        });
        try {
            let responseData = null;
            if(this.props.film)
                responseData = await this.request(Global.movieHost +this.props.URL+'?cityId='+this.state.cityId+'&filmId='+this.props.film.id, {
                    method:'GET',
                });
            else
                responseData = await this.request(Global.movieHost +this.props.URL+'?cityId='+this.state.cityId, {
                    method:'GET',
                });
    
            // console.log(this.state.cityId);
            // console.log(responseData);
            // this.hideLoading();
            // console.log(responseData);
            console.log(responseData.return_code==='0'&& typeof responseData.data === 'object');
            if(responseData.return_code==='0'&& typeof responseData.data === 'object' ){
                this.data = responseData.data;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    loaded: true,
                    isRefreshing:false,
                    networkError:false,
                });
            }else{
                this.data=[];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this._genRows({})),
                    loaded: true,
                    isRefreshing:false,
                    networkError:false,
                });
            }
            // console.log('--set-this.data---');
        }
        catch(e){
            console.log('-出错了。。。。');
            console.log(e);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this._genRows({})),
                isRefreshing:false,
                loaded:true,
                networkError:true,
                refresh:new Date().getTime(),
            });
            console.log('---End-catch()--');
        }
    },

    onPress:function(item){
        //此处返回的影院信息中logoUrl包括图片地址前缀，但在影院列表CinemasList中只有图片名，
        //所以此处仅保留文件名即可
        // console.log(item);
        var logoUrls = item.logoUrl.split(Global.movieImgPath);
        if(logoUrls.length>1)
            item.logoUrl = logoUrls[1];
        // console.log('----logoUrl---'+logoUrls[1]);
        // console.log(item);
        if(this.props.film)
            this.props.navigator.push({
                title:'查看排期',
                component:MovieSchedule,
                passProps:{
                    cinema:item,
                    // cityId:this.state.cityId,
                    film:this.props.film,
                    //作为购票成功后跳转到影票首页使用
                    backRoute:this.props.route,
                },
                hideNavBar:true,
            });
        else
            this.props.navigator.push({
                title:'查看排期',
                component:MovieSchedule,
                passProps:{
                    cinema:item,
                    // cityId:this.state.cityId,
                    //作为购票成功后跳转到影票首页使用
                    backRoute:this.props.route,
                },
                hideNavBar:true,
            });
    },

    showAll:function(){
        // console.log('--showAll-');
        this.props.navigator.push({
            title:'影院',
            component:CinemasList,
            passProps:{
                URL:this.props.URL,
                cityId:this.state.cityId,
                film:this.props.film,
            },
            hideNavBar:true,
        });
    },

    pullToRefresh: function() {
         this.setState({isRefreshing: true});
         this.fetchData();
    },

    render: function() {

        var netErr = this.state.networkError ?
        (<View style={[{flex:1,backgroundColor:'white',height:150,paddingTop:20,},Global.styles.CENTER]}>
                <Text style={{flex:1,fontSize:14,textAlign:'center',}}>网络错误，请稍后尝试下拉刷新</Text>
        </View>):null;

        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();
        
        var watchAllCinemasBar =
             (<TouchableOpacity style={[styles.cinermasBar,Global.styles.CENTER]} onPress={this.showAll}>
                <Text style={{flex:1,fontSize:14,textAlign:'center',}}>查看全部影院 <Icon name='ios-arrow-right' size={14} color={Global.colors.IOS_ARROW} style={{alignItems:'center'}}/>  </Text>
            </TouchableOpacity>);

        if(this.state.loaded&&!this.state.networkError){
            if(this.data.length!=0){
                if(!this.props.isShowAllFlag || this.data.length<=this.props.pageSize){
                    watchAllCinemasBar = null;
                }
            }else{
                watchAllCinemasBar = 
                (<View style={[styles.cinermasBar,Global.styles.CENTER]}>
                            <Text style={{flex:1,fontSize:14,textAlign:'center',}}>暂无此城市合作影院，请切换城市</Text>
                </View>);
            }
        }


        return (
            <View style={Global.styles.CONTAINER}>
                <ScrollView style={[styles.sv]} refreshControl={this.getRefreshControl(this.pullToRefresh)}>
                {netErr}
                <ListView 
                        key={this.data}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderItem}
                        style={[styles.list]} />
                {watchAllCinemasBar}
                </ScrollView>
            </View>
        );
        
    },




    renderItem : function(item: string, sectionID: number, rowID: number){

        // console.log('--renderItem--');

        if(this.props.isShowAllFlag&&rowID>=this.props.pageSize){
            return (<View/>);
        }else{
                let topLine = rowID == 0 ? <View style={Global.styles.FULL_SEP_LINE}/>:null;
                let bottomLine = <View style= {Global.styles.FULL_SEP_LINE}/>;

                return (
                    <View >
                        {topLine}
                        <TouchableOpacity style={{backgroundColor:'white',flexDirection:'row',flex:1,}} onPress={()=>{this.onPress(item);}}>
                            <View style={{flex:1,flexDirection:'column',}}>    
                                <View style={ {height: 30, flexDirection: 'row', paddingLeft: 10, paddingRight: 10,alignItems: 'center', }} >
                                    <Text style={[{flex: 1, paddingLeft: 20, fontSize: 14,color:Global.colors.FONT, fontWeight:'bold',}]} >{item.name}</Text>
                                </View>
                                <View style={{height: 30, flexDirection: 'row', paddingLeft: 10, paddingRight: 10,alignItems: 'center', }} >
                                    <Text style={{flex: 1, paddingLeft: 20,fontSize: 14,}} >{item.address}</Text>
                                </View>
                            </View>
                            <View style={ {flexDirection: 'row',paddingLeft: 10,alignItems:'center',height:60,}} >
                                <Icon size={18} color={Global.colors.IOS_ARROW} 
                                    style={{flex:1,width:40,textAlign:'center',}} 
                                        name='ios-arrow-right' /> 
                            </View>
                        </TouchableOpacity>
                        {bottomLine}
                    </View>

                );            
        }
    },

    _renderPlaceholderView: function() {

        return (<View/>) ;
    },


});

var styles = StyleSheet.create({
    sv: {
        flex: 1,
    },
    list:{
        flex:1,
    },
    cinermasBar:{
        flex:1,
        flexDirection:'row',
        height:40,
        backgroundColor:'white',
    },
});

module.exports = Cinemas;


