/**
 * 根据电影选择影院
 */
'use strict';



var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');
var UtilsMixin = require('../view/lib/UtilsMixin');
var Movie = require('./Movie');
var Cinemas = require('./Cinemas');
var ChooseMovieArea = require('../view/common/ChooseMovieArea');

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

var ChooseCinemaByMovie = React.createClass({
    mixins: [UtilsMixin],
    
    statics: {
        title: 'ChooseCinemaByMovie',
        description: '根据电影选择影院',
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
        console.log('ChooseCinemaByMovie');
        return {
        	doRenderScene: false,
        	navTitle: '选择影院',
            movieId:this.props.movieId,
            cityId:Global.curr_location.code,
                        
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
    onPressToMovie:function(hideNavBar){
        console.log('ChooseCinemaByMovie_onPress');
        console.log(this.props.filmId);

        var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
            nav.push({
                title: '电影详情',
                component: Movie,
                hideNavBar: hideNavBar ? hideNavBar : false,
                passProps: {
                    filmId:this.props.film.id,
                    // filmName:this.props.filmName,
                    // shortDesc:this.props.shortDesc,
                    // releaseDate:this.props.releaseDate,
                    // filmType:this.props.filmType,
                    // grade:this.props.grade,
                    // image:this.props.image,
            },
            });

    },
    afterChooseArea: function(area) {
        console.log(area);
        this.setState({cityId:area.code});
    },
    /*URL={'yppt/getCinemaListbyFilmId.do'} film={this.props.film}<Cinemas   isShowAllFlag={true} isShowNavBar={false} navigator={this.props.navigator} route={this.props.route}  />*/
    render: function() {
        console.log('render22');
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
        
        return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
				<ScrollView style={[styles.sv]}>
                    {this._MovieShortDesc()}
                <Cinemas cityId={this.state.cityId} isShowAllFlag={true} URL={'yppt/getCinemaListbyFilmId.do'} film={{id:this.props.film.id,filmName:this.props.film.filmName,}} isShowNavBar={false} navigator={this.props.navigator} route={this.props.route}    />
                </ScrollView>
		    </View>
        );
        
    },
    

    _MovieShortDesc: function(){
        console.log('_MovieDescript');
        return (
            <TouchableOpacity style={styles.movieShortDesc} onPress={()=>{this.onPressToMovie(true);}}>
                <View style={styles.itemimages} >
                    <View style={{flex:1}}>
                        <Image source={{uri:this.props.film.coverImag}} style={{height:160,width:120}}/>
                    </View>
                </View>
                <View style={styles.itemtext1}>
                    <Text style={styles.text16}>{this.props.film.filmName}</Text>
                    <Text style={styles.text}>评分：{this.props.film.grade}分</Text>
                    <Text style={styles.text}>{this.props.film.shortDesc}</Text>
                    <Text style={styles.text}>类型：{this.props.film.filmType}</Text>
                    <Text style={styles.text}>上映时间：{this.props.film.releaseDate.substr(0,10)}</Text>
                </View>
                <View style={[Global.styles.CENTER,{width:30}]}> 
                    <Icon name='ios-arrow-right' size={18} color={Global.colors.BLUE} style={[Global.styles.ICON, {width: 40}]} />
                </View>
            </TouchableOpacity>
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
						<Text numberOfLines={1} style={[{fontSize: 16, color: '#000000'}]}>{this.state.navTitle}</Text>
					</View>
				)} 
                rightButtons={(
                    <View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
                        <ChooseMovieArea style={[Global.styles.NAV_BAR.BUTTON, Global.styles.CENTER, {flexDirection: 'row', flex: 1}]} navigator={this.props.navigator} afterChoose={this.afterChooseArea} />
                    </View>     
                )}/>
		);
	},
});

var styles = StyleSheet.create({
    sv: {
    	flex: 1,
    },
    movieShortDesc:{
        height:180,
        flexDirection: 'row',
        backgroundColor:'#DDDDDD',
    }, 
    itemimages:{
        width:140,
        padding: 10,
        // backgroundColor: 'green',
    },
    itemtext1: {
        flex:1,
        paddingTop: 15,
        // backgroundColor: 'red',
    },
    text16:{
        fontSize:16,
        margin:3,
    },
    text:{
        fontSize:13,
        margin:3,
    },
});

module.exports = ChooseCinemaByMovie;


