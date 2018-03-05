/**
 * 影院列表
 */
'use strict';



var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');
var UtilsMixin = require('../view/lib/UtilsMixin');

var ChooseMovieArea = require('../view/common/ChooseMovieArea');
var MovieSchedule = require('./MovieSchedule');
var Cinema = require('./Cinema');
var Cinemas = require('./Cinemas');

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

var CinemasList = React.createClass({

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
        cityId:PropTypes.string,
        /**
        *影片信息
        */
        film:PropTypes.object,

    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        // console.log('---getDefaultProps--');
        return {
           URL:'yppt/getAllCinemaByCityId.do',
           film:null,
        };
    },	

	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			loaded: false,
			cityId:Global.curr_location.code,
			networkError:false,
		};

	},

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	},

	pullToRefresh: function() {
		 this.setState({isRefreshing: true});
		 this.fetchData();
	},

	/**
	* 组件接收参数变化
	*/
	componentWillReceiveProps: function(props) {
	},


	//抓取数据
	fetchData: async function() {
		console.log('CinemasList_fetchData---');
		this.showLoading();
		// this.changeUrl();
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
			this.hideLoading();
			// console.log(responseData);
			// console.log(responseData.return_code==='0'&& typeof responseData.data === 'object');
			if(responseData.return_code==='0'&& typeof responseData.data === 'object' ){
				this.data = responseData.data;
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(responseData.data),
					loaded: true,
					isRefreshing:false,
					networkError:false,
				});
				// console.log('--set-this.data---');
			}else{
				this.data=[];
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this._genRows({})),
					loaded: true,
					isRefreshing:false,
					networkError:false,
				});
			}
			
		} catch(e) {
			this.hideLoading();
			console.log(e);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this._genRows({})),
				loaded:true,
				isRefreshing:false,
				networkError:true,
			});
			// console.log('--End-Catch--');
		}
	},


	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}
			</View>
		);
	},

    onPress:function(item){
        if(this.props.film)
            this.props.navigator.push({
                title:'查看排期',
                component:MovieSchedule,
                passProps:{
                    cinema:item,
                    // cityId:this.state.cityId,
                    film:this.props.film,
                    //作为购票成功后跳转到影票首页使用
                    backRoute:this.props.navigator.getCurrentRoutes()[1],
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
                    backRoute:this.props.navigator.getCurrentRoutes()[1],
                },
                hideNavBar:true,
            });
    },

	render : function(){

        var noData = this.state.loaded&&!this.state.networkError&&this.data.length == 0 ? 
                (<View style={[styles.cinermasBar,Global.styles.CENTER]}>
                        <Text style={{flex:1,fontSize:14,textAlign:'center',}}>暂无此城市合作影院，请切换城市</Text>
                </View>):null;
        var netErr = this.state.networkError ?
        		(<View style={[styles.cinermasBar,Global.styles.CENTER]}>
                        <Text style={{flex:1,fontSize:14,textAlign:'center',}}>网络错误，请稍后尝试下拉刷新</Text>
                </View>):null;

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		

		return (
			<View style = {[Global.styles.CONTAINER]}>
				{this._getNavBar()}
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.pullToRefresh)}>
					<View style={Global.styles.PLACEHOLDER20} />
					{netErr}
					{noData}
				 	<ListView 
						key={this.data} 
				        dataSource={this.state.dataSource} 
				        renderRow={this.renderItem} 
				        style={[styles.list]} />
					<View style={Global.styles.PLACEHOLDER20} />
			    </ScrollView>
			</View>
			);
	},

	afterChooseArea:function(area){
		this.setState({cityId:area.code,});
		this.fetchData();
	},

	_getNavBar: function() {
		return (
			<NavBar title='影院列表' 
		    	navigator={this.props.navigator} 
				route={this.props.route} 
				hideNavBar={true}
		    	hideBackButton={false} 
		    	hideBottomLine={false} 
		    	backText={'返回'} 
		    	flow={false}
		    	rightButtons={(
		    		<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
						<ChooseMovieArea style={[Global.styles.NAV_BAR.BUTTON, Global.styles.CENTER, {flexDirection: 'row', flex: 1}]} navigator={this.props.navigator} afterChoose={this.afterChooseArea} />
					</View>		
		    	)} />
		);
	},


	renderItem : function(item: string, sectionID: number, rowID: number){


		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;

        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

        var picUri = Global.movieHost+Global.movieImgPath+item.logoUrl;

		return (
				<View>
					{topLine}
                    <TouchableOpacity key={item.id} style={styles.item} onPress={()=>{this.onPress(item)}}>
	                    <View style={{flex:0.4,padding:10,}}>
	                    	<Image style={{flex:1,width:100,height:80,}} source={{uri:picUri}}/>
	                    </View>
	                    <View style= {{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:20,}}>
	                        <View style={styles.cinemaStyle} >
	                            <Text style={{ textAlign:'left', fontSize: 16,color:Global.colors.FONT, fontWeight:'bold',}} >{item.name}</Text>
	                        </View>
	                        <View style={styles.cinemaStyle} >
	                            <Text style={{ fontSize: 14,textAlign:'left',}} >{item.address}</Text>
	                        </View>
	                        <View style={styles.cinemaStyle} >
	                            <Text style={{ fontSize: 14,textAlign:'left',}} >{item.buslines}</Text>
	                        </View>
	                    </View>
                        <View style={{flex:0.1,justifyContent:'center',alignItems:'center',height:100,}}>
                            <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={{width:20,textAlign:'center',}}/>
                        </View>
                    </TouchableOpacity>  
					{bottomLine}
				</View>
			);
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
    item:{
    	backgroundColor:'white',
    	flexDirection:'row',
    	flex:1,
    	justifyContent:'center',
    	alignItems:'center',
    	height:100,
    },
    cinemaStyle:{
    	flex:1, 
    	width:Global.getScreen().width-130, 
    	height:30,
    	justifyContent:'center',
    },
});

module.exports = CinemasList;
