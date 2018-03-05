/**
 * 电影主页
 */

'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');

var Movies = require('./Movies');
var Movie = require('./Movie');
var Cinemas = require('./Cinemas');
var CinemasList = require('./CinemasList');
var Cinema = require('./Cinema');

var ChooseMovieArea = require('../view/common/ChooseMovieArea');
var UtilsMixin = require('../view/lib/UtilsMixin');

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

var Home = React.createClass({

	mixins: [UtilsMixin],

    randomColors: [
		'rgba(46, 204, 113, 1)',
		'rgba(243, 156, 18, 1)',
		'rgba(230, 126, 34, 1)',
		'rgba(231, 76, 60, 1)',
		'rgba(243, 156, 18, 1)',
    ],

    menus: [
		{code: 'mm01', name: '电影', icon: 'android-film', iconSize: 22, iconColor: '#DDD', component: Movies, hideNavBar: true, navTitle: '电影', func: null},
		{code: 'mm02', name: '影院', icon: 'social-chrome', iconSize: 22, iconColor: '#DDD', component: CinemasList, hideNavBar: true, navTitle: '影院', func:null},
        {code: 'mm03', name: '兑换券', icon: 'android-send', iconSize: 22, iconColor: '#DDD', component: null, hideNavBar: true, navTitle: '兑换券', func: null},
		{code: 'mm04', name: '会员卡', icon: 'card', iconSize: 22, iconColor: '#DDD', component: null, hideNavBar: true, navTitle: '会员卡', func: null},
		{code: 'mm05', name: '周边', icon: 'ios-cart', iconSize: 22, iconColor: '#DDD', component: null, hideNavBar: true, navTitle: '周边', func: null},
    ],

    movies: [],
    	
    statics: {
        title: 'Home',
        description: '电影购票主页',
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
        return {
        	doRenderScene: false,
            cityId:Global.curr_location.code,
        };
    },

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
            this.getMoviesImage();
			
		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
    },

    getMoviesImage: async function(){
        this.movies=[];
        this.data=[];
        console.log('Movies_fetchData');
        var FIND_URL = 'yppt/getHotFilms.do';/*获取热映影票*/
        this.showLoading();
        console.log(Global.movieHost+FIND_URL);
        try {
            let responseData = await this.request(Global.movieHost + FIND_URL);
            if(!responseData.data){
                console.log('没有data');
                this.data=[];
               
            }else{
                this.data = responseData.data;
                 for(var ii=0;ii<this.data.length;ii++){
                    console.log(ii);
                    var movie=this.data.slice(ii, parseInt( ii ) + 1);
                    var movieitem=movie[0];
                    console.log('movie!!!!!!!!');
                    console.log(movie);
                    this.movies.push({
                        id:ii,
                        movieId:movieitem.id?movieitem.id:null,
                        name:movieitem.filmName?movieitem.filmName:null,
                        post:movieitem.coverImag?movieitem.coverImag:null,
                        score:movieitem.grade?movieitem.grade:null,
                    });
                    this.setState({doRenderScene: true});
                }
            }
            console.log(this.data);
            this.hideLoading();
            this.setState({doRenderScene: true});
            // console.log('this.data.length');
            // console.log(this.data.length);
            
            // console.log('this.movies');
            console.log(this.movies);
        } catch (e) {

            this.requestCatch(e);
            
        }
    },
    getRandomColors: function() {
        this.randomColors = [];
        for(var i = 0 ; i < 50 ; i++){
            this.randomColors[this.randomColors.length] = this.getRandomColor();
        }
        console.log(this.randomColors);
    },

    goTo: function(component, hideNavBar, navTitle) {
    	this.props.navigator.push({
    		title: navTitle,
    		component: component,
    		hideNavBar: hideNavBar,
            passProps:{
                backRoute: this.props.route,
            }
    	});
    },

    watchMovie: function(movieId, name) {
        console.log('watchMovie');
        console.log(movieId);
        console.log(name);
        this.props.navigator.push({
            title: '电影详情',
            component: Movie,
            hideNavBar: true,
            passProps:{
                filmId: movieId,
            }
        });

    },

    getMovies: function() {
        console.log('getMovies');
    	return this.movies.map(
    		({id, movieId, name, post, score}, idx) => {
    			return (
    				<TouchableOpacity key={id} style={[styles.movieHolder]} onPress={() => {this.watchMovie(movieId, name)}} >
                		<Image source={{uri:post}} resizeMode='cover' style={styles.post} />
    					<Text numberOfLines={1} style={styles.movieName} >{name + idx}</Text>
    					<Text style={styles.movieScore} >{score}</Text>
    				</TouchableOpacity>
    			);
    		}
    	);
    },

    

    render: function() {
        console.log('render');
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
        
        return (
			<View style={[Global.styles.CONTAINER/*, {backgroundColor: 'white'}*/]}>
			    {this._getNavBar()}
				<ScrollView style={[styles.sv]}>

					<View style={[Global.styles.CENTER, styles.menuHolder]} >
						{this._renderMenus()}
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />

					<View style={Global.styles.PLACEHOLDER10} />

					<View style={Global.styles.FULL_SEP_LINE} />
					<ScrollView 
						horizontal={true} 
						showsHorizontalScrollIndicator={false} 
						showsVerticalScrollIndicator={false} 
						automaticallyAdjustContentInsets={false} 
						style={styles.moviesHolder} >

						{this.getMovies()}

						<TouchableOpacity style={[Global.styles.CENTER, styles.allMoviesBtn]} onPress={() => {this.goTo(Movies, true, '电影')}} >
	    					<Text style={styles.allMoviesText} >查{"\n"}看{"\n"}全{"\n"}部{"\n"}影{"\n"}片</Text>
	    				</TouchableOpacity>

					</ScrollView>
					<View style={Global.styles.FULL_SEP_LINE} />

					<View style={Global.styles.PLACEHOLDER10} />

					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={{backgroundColor: 'white'}} > 
						<Cinemas cityId={this.state.cityId} isShowAllFlag={true} navigator={this.props.navigator} route={this.props.route} />
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />

            		<View style={Global.styles.PLACEHOLDER20} />
			    </ScrollView>
		    </View>
        );
        
    },

    _renderMenus: function() {
    	return this.menus.map(
    		({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle, func}, idx) => {
    			return (
    				<TouchableOpacity key={code} style={[Global.styles.CENTER, styles.menuItem]} onPress={() => {
    					if (func){
    						func();
                        }
    					else {
    						if(component)
                                console.log('---goTo---');
                                console.log(hideNavBar);
	    						this.goTo(component, hideNavBar, navTitle);
    					}
    				}} >
                		<View style={[styles.iconHolder, Global.styles.CENTER, {backgroundColor: this.randomColors[idx]}]} >
			    			<Icon style={[styles.icon]} name={icon} size={iconSize} color='white' />
			    		</View>
    					<Text>{name}</Text>
    				</TouchableOpacity>
    			);
    		}
    	);
    },

	_renderPlaceholderView: function() {
		return (
			<View style={[Global.styles.CONTAINER/*, {backgroundColor: 'white'}*/]}>
			    {this._getNavBar()}
			</View>
		);
	},

	afterChooseArea: function(area) {
		console.log(area);
        this.setState({cityId:area.code});
	},

	_getNavBar: function() {
		return (
			<NavBar title='电影购票' 
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	hideBackButton={false} 
		    	hideBottomLine={false} 
		    	flow={false}
		    	rightButtons={(
		    		<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
						<ChooseMovieArea style={[Global.styles.NAV_BAR.BUTTON, Global.styles.CENTER, {flexDirection: 'row', flex: 1}]} navigator={this.props.navigator} afterChoose={this.afterChooseArea} />
					</View>		
		    	)} />
		);
	},
});

var styles = StyleSheet.create({
    sv: {
    	flex: 1,
    },
    menuHolder: {
    	backgroundColor: 'white',
    	flexDirection: 'row',
    	height: 85,
    },
    menuItem: {
    	flex: 1,
    	height: 60,
    },
	iconHolder: {
		width: 36,
		height: 36,
		borderRadius: 18,
		flexDirection: 'row',
		marginBottom: 5,
	},
	icon: {
		textAlign: 'center',
		backgroundColor: 'transparent',
	},

	moviesHolder: {
		height: 170,
		padding: 10,
		paddingBottom: 0,
		backgroundColor: 'white',
	},
	movieHolder: {
		width: 100,
		height: 165,
	},
	post: {
		width: 90,
		height: 120,
	},
	movieName: {
		width: 85,
		fontSize: 13,
		marginTop: 5,
		marginLeft: 4,
	},
	movieScore: {
		width: 85,
		fontSize: 12,
		marginTop: 3,
		marginLeft: 5,
		color: Global.colors.ORANGE,
	},


	allMoviesBtn: {
		width: 40,
		height: 120,
		borderWidth: 1 / Global.pixelRatio,
		borderColor: Global.colors.IOS_NAV_LINE,
		marginRight: 10,
	},
	allMoviesText: {
		color: Global.colors.IOS_GRAY_FONT,
	},

});

module.exports = Home;

