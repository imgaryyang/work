/**
 * 电影列表
 */
'use strict';



var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');
var UtilsMixin = require('../view/lib/UtilsMixin');
var FilterMixin = require('../filter/FilterMixin');
var TopGridMenu = require('../view/lib/TopGridMenu');
var ChooseCinemaByMovie = require('./ChooseCinemaByMovie');
var ChooseMovieArea = require('../view/common/ChooseMovieArea');

var {
    TouchableOpacity,
    ScrollView,
    View,
    ListView,
    Text,
    StyleSheet,
    PropTypes,
    Image,
    InteractionManager,
} = React;

var Movies = React.createClass({
	mixins: [UtilsMixin,FilterMixin],
    statics: {
        title: 'Movies',
        description: '电影列表',    
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
        *城市
        */
        cityId: PropTypes.string,

    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        return {
        	// navigator: PropTypes.object.isRequired,
        	// route: PropTypes.object.isRequired,
        };
    },

    /**
    * 初始化状态
    */
    getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
        	doRenderScene: false,
            selected: 0,
            dataSource: ds.cloneWithRows(this._genRows({})),
            isRefreshing: false,
            loaded:false,
        };
    },

    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		/*for (var ii = 0; ii < 30; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}*/
		return dataBlob;
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.fetchData(this.state.selected);
			this.setState({doRenderScene: true});
		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
    },

    fetchData: async function(index) {
    	var FIND_URL =  '';
    	console.log('Movies_fetchData');
    	// console.log(index);
    	if(index == 1){
    		FIND_URL = 'yppt/getWillFilms.do';/*获取即将上映电影*/
    	}else{
    		FIND_URL = 'yppt/getHotFilms.do';/*获取热映影票*/
    	}
    	
		this.showLoading();
		console.log(Global.movieHost+FIND_URL);
		try {
			let responseData = await this.request(Global.movieHost + FIND_URL);
			// console.log(responseData);
			/*返回没有data*/
			if(!responseData.data){
				console.log('没有data');
				this.data=[];
			}else{
				this.data = responseData.data;
			}
			// console.log(this.data);
			
			this.hideLoading();
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.data),
				isRefreshing: false,
				loaded: true,
				selected:index
			});
			// console.log('这里不报错！！！');
		} catch (e) {

			this.requestCatch(e);
			
		}
	},

	pullToRefresh: function(index) {
    	this.setState({isRefreshing: true});
		this.fetchData(index);
	},
	onPress:function(item,hideNavBar){
		console.log('Movies_onPress');
		// console.log(item.id);

		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
	        nav.push({
	        	title: '选择影院',
	            component: ChooseCinemaByMovie,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	            passProps: {
            		film:item,
            		backRoute: this.props.backRoute,

            		// filmName:item.filmName,
            		// shortDesc:item.shortDesc,
            		// releaseDate:item.releaseDate.substr(0,10),
            		// filmType:item.filmType,
            		// grade:item.grade,
            		// image:item.coverImag,
            	},
	        });

	},
	
    render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

        var refreshText = '暂无符合条件的数据，点击此处重新载入';

		var refreshView = this.state.loaded && this.data.length === 0 ?
			this.getListRefreshView(refreshText, ()=>this.pullToRefresh(this.state.selected)) : 
			null;

        return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
				<ScrollView style={[styles.sv]} refreshControl={this.getRefreshControl(()=>this.pullToRefresh(this.state.selected))}>
					<View style={Global.styles.PLACEHOLDER20} />
						{refreshView}
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

  // http://10.1.9.17:8080/iMovie/images/filmImages/20160322_13034262.jpg',
// ttp://10.1.9.17:8080/iMovie/images/filmImages/20160322_1303420.jpg',
// <ListView
// 							key={this.data}
// 					        dataSource={this.state.dataSource}
// 					        renderRow={this.renderItem}
// 					        style={[styles.list]} />

    renderItem: function(item: string, sectionID: number, rowID: number) {
		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		console.log('item'+rowID);
		// console.log(item.coverImag);
		// console.log(item);
		return (
			<View >
				{topLine}
				<TouchableOpacity style={[styles.item]} onPress={()=>{this.onPress(item,true);}}>
					<View style={styles.itemimages} >
						<View style={{flex:1}}>
							<Image source={{uri:item.coverImag}} style={{width: 75, height: 100}}  />							
						</View>
					</View>
					<View style={styles.itemtext1}>
						<Text style={{fontSize:16}}>{item.filmName}</Text>
						<View style={Global.styles.PLACEHOLDER20} />
						<Text style={{fontSize:13}}>{item.shortDesc}</Text>
					</View>
					<View style={styles.itemtext2}>
						<Text style={{fontSize:18,color:'#FFCC22',fontStyle:'italic'}}>{item.grade}分</Text>
					</View>
				</TouchableOpacity>
				{bottomLine}
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
			<NavBar 
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	hideBackButton={false} 
		    	backText='电影'
		    	hideBottomLine={false} 
		    	flow={false} 
				centerComponent={(
					<View style={[Global.styles.NAV_BAR.CENTER_VIEW, {flex: 2, flexDirection: 'row'}]} >
						<TopGridMenu 
							items={[
								{text: '热映中', onPress: this.fetchData},
								{text: '即将上线', onPress: this.fetchData},
								{text: '已下线', onPress: this.fetchData},
							]} 
							selected={this.state.selected}/>
					</View>
				)} />
		);
	},
});

var styles = StyleSheet.create({
    sv: {
    	flex: 1,
    },
    list: {
	},
	item:{
		flexDirection: 'row',
		backgroundColor: '#ffffff', 
        height:120,
        
	},
	itemimages:{
		width:95,
		padding: 10,
	},
	itemtext1: {
		flex:1,
        paddingTop: 12,
        paddingRight: 15,
        // backgroundColor: 'green',
	},
	itemtext2:{
		width:70,
		paddingLeft:10,
		paddingTop: 15,
	},
	itemimage:{
		resizeMode: 'stretch',
		width:75,
		height:100,
	},
});
module.exports = Movies;



