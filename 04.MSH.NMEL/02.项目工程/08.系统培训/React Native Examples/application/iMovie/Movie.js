/**
 * 电影
 */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');
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

var Movie = React.createClass({

    mixins: [UtilsMixin],
    data:[],
    movies:[],
    
    statics: {
        title: 'Movie',
        description: '电影详情',
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
        *电影Id
        */
        filmId:PropTypes.string.isRequired, 
        // film:PropTypes.object.isRequired, 

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
        console.log('@@@@@Movie——————getInitialState@@@@@@@');
     
        return {
            doRenderScene: false,
            isRefreshing: false,
            navTitle: '电影详情',
            filmId:this.props.filmId,
            showAllFlag:null,
        };
        
    },

    componentDidMount: function() {
        console.log('mmmmmmmmmmmmmmmm');
        console.log(this.props.filmId);
	    console.log(this.state.filmId);
       	InteractionManager.runAfterInteractions(() => {
            this.fetchData();
			this.setState({doRenderScene: true});

		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
        // this.setState({filmId:this.props.filmId});
        // this.fetchData();
    },

    fetchData: async function() {  
        this.movies=[];
        this.data=[]; 
        var FIND_URL = 'yppt/getFilmDetailById.do';/*后台接口*/
        console.log(Global.movieHost + FIND_URL + '?filmId='+this.state.filmId);
        try {
         let responseData = await this.request(Global.movieHost + FIND_URL + '?filmId='+this.state.filmId); 
            if(!responseData.filminfo){
                console.log('没有data');
                this.data=[];
            }else{
                this.data = responseData.filminfo;
            }  
            console.log(this.data);
            for(var ii=0;ii<this.data.images.length;ii++){
                this.movies.push({
                    id: ii, 
                    post: this.data.images[ii]
                });
            }
            console.log('wwdddd');
            console.log(this.data.id);
            this.hideLoading();
            this.setState({
                isRefreshing: false,
                loaded: true
            });

        } catch (e) {

         this.requestCatch(e);
            
        }
    },

   
    pressBuyButton:function(){
        var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
         nav.pop();
    },

    changShowText:function(){
        // console.log('hahaha w jinlai l !!');
        console.log(this.state.showAllFlag);
        console.log(this.state.textNum);
        this.setState({
            showAllFlag:!this.state.showAllFlag,
        });
    },

    render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
        console.log('%%%%%render%%%%%');
        console.log(this.state.showAllFlag);

        return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
                <ScrollView style={[styles.sv]}>
                    {this._MovieShortDesc()}
                    <View style={Global.styles.PLACEHOLDER10}/>
                    <TouchableOpacity style={[Global.styles.CENTER,styles.payButton]} onPress={()=>{this.pressBuyButton()}}>
                        <Text style={{color: '#ffffff',}}>选座购票</Text>
                    </TouchableOpacity>
                    <View style={Global.styles.PLACEHOLDER10}/>
                    {this._MovieDescript()}
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false} 
                        showsVerticalScrollIndicator={false} 
                        automaticallyAdjustContentInsets={false} 
                        style={styles.moviesHolder} >

                        {this.getPictures()}

                    </ScrollView>
                </ScrollView>
		    </View>
        );
        
    },
     getPictures: function() {
    // console.log('nnnnnnnnnnn');

        return this.movies.map(
            ({id, post}, idx) => {
                return (
                    <TouchableOpacity key={'key_'+idx} style={[styles.movieHolder]} >
                       <Image source={{uri:post}}  resizeMode='cover' style={styles.post} />
                    </TouchableOpacity>
                );
            }
        );
    },
   _MovieShortDesc: function(){
        return(
            <View style={styles.movieShortDesc} >
                <View style={styles.itemimages} >
                    <View style={{flex:1}}>
                        <Image source={{uri:this.data.coverImag}} style={{height:160,width:120}}/>
                    </View>
                </View>
                <View style={styles.itemtext1}>
                    <Text style={styles.text16}>{this.data.filmName}</Text>
                    <Text style={styles.text}>评分：{this.data.grade}分</Text>
                    <Text style={styles.text}>{this.data.shortDesc}</Text>
                    <Text style={styles.text}>类型：{this.data.filmType}</Text>
                    <Text style={styles.text}>上映时间：{this.data.releaseDate}</Text>
                </View>
            </View>
            );
        
    },
    _MovieDescript:function(){
        // console.log('_MovieDescript');
        var movie = this.data;
        // var movie = movies[0];
        var showIcon = this.state.showAllFlag?
                        (<Icon name='ios-arrow-up' size={18} style={[Global.styles.ICON, {width: 40}]} />)
                        :(<Icon name='ios-arrow-down' size={18} style={[Global.styles.ICON, {width: 40}]} />);
        var MovieDesc = this.state.showAllFlag?
                        (<Text style={styles.text13} >剧情：{movie.filmDesc}</Text>)
                        :(<Text style={styles.text13} numberOfLines={3}>剧情：{movie.filmDesc}</Text>);

        // console.log(this.state.showAllFlag);
        return(
            <View style={{padding:10}}>
                <Text style={styles.text13}>导演：{movie.director}</Text>
                <Text style={styles.text13}>演员：{movie.actrole}</Text>
                {MovieDesc}
                <TouchableOpacity onPress={()=>{this.changShowText();}} style={Global.styles.CENTER}>
                    {showIcon}
                </TouchableOpacity>               
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
                backText='选择影院'
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
    payButton:{
        height:40,
        width:Global.getScreen().width-20,
        marginLeft:10,
        backgroundColor: Global.colors.IOS_BLUE,
    },
    text16:{
        fontSize:16,
        margin:3,
    },
    text:{
        fontSize:13,
        margin:3,
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
});

module.exports = Movie;


