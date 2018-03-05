/**
 * 查看排期
 */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');
var chooseSeat = require('./ChooseSeat');
var filmDetail = require('./Movie');
var Cinema = require('./Cinema');
var UtilsMixin = require('../view/lib/UtilsMixin');
var FilterMixin = require('../filter/FilterMixin');

var {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    PropTypes,
    Image,
    InteractionManager,
    ListView
} = React;

var FIND_SCHEDULE_FILM = 'yppt/getWaitingByFilmAndCinema.do';
var FIND_SCHEDULE_CINEMA = 'yppt/getWaitingByCinemaId.do';
var FIND_FILM_URL = 'yppt/getFilmListbyCinemId.do';
var FIND_SCHEDULE_SEATS = 'yppt/getSeatNumByWaitNo.do';

var MovieSchedule = React.createClass({

    mixins: [UtilsMixin,FilterMixin],

    statics: {
        title: 'MovieSchedule',
        description: '查看排期',
    },

    data :[],
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

        //影片信息
        film: PropTypes.object,
        //影院信息
        cinema:PropTypes.object.isRequired,

    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        return {
        };
    },

    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob = [];
        
        return dataBlob;
    },

    /**
    * 初始化状态
    */
    getInitialState: function() {
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        var film = this.props.film ? this.props.film : {
            id: '',
            filmName: ''
        };
        return {
            doRenderScene: false,
            navTitle: '查看排期',
            dataSource: ds.cloneWithRows(this._genRows({})),
            // cinema: this.props.cinema,
            film: film,
            dateFlag: 1,
            loaded: false,
            flag:false,
            movies: []

        };
    },

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
            this.findFilm();
            if(this.state.film.id != ''){
                this.findSchedule();
            }
		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
    },
    findFilm:async function(){
        this.showLoading();
        try {
            console.log(Global.movieHost+FIND_FILM_URL+'?cinemaId='+this.props.cinema.id);
            let responseData = await this.request(Global.movieHost+FIND_FILM_URL+'?cinemaId='+this.props.cinema.id,{
                method:'GET'
            });
            console.log(responseData);
            if(responseData.data != undefined){
                this.setState({
                    movies:responseData.data,
                    loaded: true,
                });
                if(this.state.film.id == ''){
                    this.setState({film:this.state.movies[0]});
                    this.findSchedule(this.state.film.id);
                }
            }else{
                this.hideLoading();

            }

        } catch(e) {
            this.requestCatch(e);
        }
        

    },
    findSchedule:async function(){
        this.showLoading();
        try {
            console.log(Global.movieHost+FIND_SCHEDULE_FILM+'?cinemaId='+this.props.cinema.id+'&filmId='+this.state.film.id);
            let responseData = await this.request(Global.movieHost+FIND_SCHEDULE_FILM+'?cinemaId='+this.props.cinema.id+'&filmId='+this.state.film.id,{
                method:'GET'
            });
            console.log(responseData);
            this.data = responseData;
            if(responseData.today != undefined){
                for(let i =0;i < responseData.today.length;i++){
                    console.log(Global.movieHost+FIND_SCHEDULE_SEATS+'?waitNo='+responseData.today[i].waitNo);
                    let resp = await this.request(Global.movieHost+FIND_SCHEDULE_SEATS+'?waitNo='+responseData.today[i].waitNo,{
                        method:'GET'
                    });
                    responseData.today[i].availaleSeats = resp.seatToSellAmount;
                }
                this.setState({
                    dateFlag:1,
                    flag:false,
                    dataSource:this.state.dataSource.cloneWithRows(responseData.today),
                    loaded: true,
                });
            }else{
               this.setState({
                    flag: true,
                    dataSource:this.state.dataSource.cloneWithRows(this._genRows({})),
                }); 

            }
            this.hideLoading();
        } catch(e) {
            this.requestCatch(e);
        }
    },
    refreshSchedule:function(){
       this.findSchedule();
    },
    refresh:function(){
        this.findFilm();
        this.findSchedule();
    },
    changeList:async function(dateFlag) {
        this.showLoading();
        this.setState({
            dateFlag: dateFlag
        });
        if (dateFlag == 1) {
            if (this.data.today != undefined) {
                for(let i =0;i < this.data.today.length;i++){
                    let resp = await this.request(Global.movieHost+FIND_SCHEDULE_SEATS+'?waitNo='+this.data.today[i].waitNo,{
                        method:'GET'
                    });
                    console.log('resp---------------_____________________________');
                    console.log(resp);
                    this.data.today[i].availaleSeats = resp.seatToSellAmount;
                }
                this.setState({
                    flag: false,
                    dataSource: this.state.dataSource.cloneWithRows(this.data.today),
                });
            } else {
                this.setState({
                    flag: true,
                    dataSource: this.state.dataSource.cloneWithRows([]),
                });
            }
        } else if (dateFlag == 2) {
            if (this.data.tomorrow != undefined) {
                for(let i =0;i < this.data.tomorrow.length;i++){
                    let resp = await this.request(Global.movieHost+FIND_SCHEDULE_SEATS+'?waitNo='+this.data.tomorrow[i].waitNo,{
                        method:'GET'
                    });
                    console.log('resp---------------_____________________________');
                    console.log(resp);
                    this.data.tomorrow[i].availaleSeats = resp.seatToSellAmount;
                }
                this.setState({
                    flag: false,
                    dataSource: this.state.dataSource.cloneWithRows(this.data.tomorrow),
                });
            } else {
                this.setState({
                    flag: true,
                    dataSource: this.state.dataSource.cloneWithRows([]),
                });
            }

        } else if (dateFlag == 3) {
            if (this.data.aftertomorrow != undefined) {
                for(let i =0;i < this.data.aftertomorrow.length;i++){
                    let resp = await this.request(Global.movieHost+FIND_SCHEDULE_SEATS+'?waitNo='+this.data.aftertomorrow[i].waitNo,{
                        method:'GET'
                    });
                    console.log('resp---------------_____________________________');
                    console.log(resp);
                    this.data.aftertomorrow[i].availaleSeats = resp.seatToSellAmount;
                }
                this.setState({
                    flag: false,
                    dataSource: this.state.dataSource.cloneWithRows(this.data.aftertomorrow),
                });
            } else {
                this.setState({
                    flag: true,
                    dataSource: this.state.dataSource.cloneWithRows([]),
                });
            }
        }
        this.hideLoading();
    },
    fmtToday : function(){
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        return month+'月'+day+'日';
    },
    fmtTomorrow : function(){
        let date = new Date();
        date.setDate(new Date().getDate()+1);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return month+'月'+day+'日';

    },
    fmtDayAfterTomorrow : function(){
        let date = new Date();
        date.setDate(new Date().getDate()+2);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return month+'月'+day+'日';
    },
    getMovies: function() {
        return this.state.movies.map(
            ({id, filmName,grade,coverImag}, idx) => {
                let selectedIcon = this.state.film.id == id ? <Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, styles.iconOnPortrait]} />:null;
                return (
                    <TouchableOpacity key={'_key'+id}style={[styles.movieHolder]} onPress={() => {this.chooseMovie(id, filmName)}} >
                        <Image source={{uri:coverImag}} resizeMode='cover' style={styles.post} >
                            {selectedIcon}
                        </Image>
                        <Text numberOfLines={1} style={styles.movieName} >{filmName}</Text>
                        <Text style={styles.movieScore} >{grade}</Text>
                    </TouchableOpacity>
                );
            }
        );
    },
    chooseMovie : function(id,filmName){
        this.setState({
            film: {
                id: id,
                filmName: filmName
            },
            dateFlag: 1
        });
        this.findSchedule();

    },
    showCinemaDetail: function() {
        
        this.props.navigator.push({
            title: '影院详情',
            component: Cinema,
            hideNavBar: false,
            passProps:{
                CinemaInfo:this.props.cinema
            }

        });
    },
    showFilmDetail:function(){
        this.props.navigator.push({
            title: '电影详情',
            component: filmDetail,
            hideNavBar: false,
            passProps:{
                filmId : this.state.film.id
            }

        });
    },
    chooseSeat:function(item){
        this.props.navigator.push({
            title: '选座购票',
            component: chooseSeat,
            hideNavBar: false,
            passProps:{
                schedule:item,
                backRoute: this.props.backRoute,

            },


        });
    },
    render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
        var clickText1 = this.state.dateFlag == 1 ? {color : Global.colors.IOS_BLUE}:null;
        var clickText2 = this.state.dateFlag == 2 ? {color : Global.colors.IOS_BLUE}:null;
        var clickText3 = this.state.dateFlag == 3 ? {color : Global.colors.IOS_BLUE}:null;
        var clickStyle1 =this.state.dateFlag == 1 ? {borderBottomWidth:2,borderColor:Global.colors.IOS_BLUE}:null;
        var clickStyle2 =this.state.dateFlag == 2 ? {borderBottomWidth:2,borderColor:Global.colors.IOS_BLUE}:null;
        var clickStyle3 =this.state.dateFlag == 3 ? {borderBottomWidth:2,borderColor:Global.colors.IOS_BLUE}:null;
        

        var refreshView = this.state.flag == true?
            this.getListRefreshView("暂无影片排期", this.refreshSchedule) : 
            null;
        return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
				<ScrollView style={[styles.sv]}>
					<TouchableOpacity style={{flex:1,backgroundColor:Global.colors.ORANGE,flexDirection:'row',paddingTop:10,paddingBottom:10,alignItems: 'center', }} onPress={()=>{this.showCinemaDetail()}}>
                        <Image source={{uri:Global.movieHost+Global.movieImgPath+this.props.cinema.logoUrl}} resizeMode='cover' style={[styles.image,]}/>
                        <View style={[{flex:1,marginLeft:20},]}>
                            <Text style={[{color:'#ffffff',fontSize:15,marginBottom:5,}]}>{this.props.cinema.name}</Text>
                            <View style={[{flexDirection:'row',alignItems: 'center'}]}>
                                <Icon name='ios-telephone' size={18} color={'#ffffff'} style={Global.styles.ICON}/>
                                <Text style={[{color:'#ffffff',fontSize:15,marginLeft:5}]}>{this.props.cinema.tel}</Text>
                            </View>
                          { /*<Text style={[{color:'#ffffff',fontSize:12,marginBottom:5,}]}>{this.props.cinema.address}</Text> */}
                        </View>
                        <Icon name='ios-arrow-right' size={18} color={'#ffffff'} style={[Global.styles.ICON, {width: 20,marginRight:20}]} />
                    </TouchableOpacity>
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false} 
                        showsVerticalScrollIndicator={false} 
                        automaticallyAdjustContentInsets={false} 
                        style={styles.moviesHolder} >

                        {this.getMovies()}

                    </ScrollView>
                    <View style={[Global.styles.PLACEHOLDER10,{backgroundColor:'#ffffff'}]}/>
                    <View style={Global.styles.FULL_SEP_LINE} />
                    <TouchableOpacity style={{backgroundColor:'#ffffff',flex:1,flexDirection:'row',padding:10}} onPress={this.showFilmDetail}>
                        <Text style={{flex:1,fontSize:15}}>{this.state.film.filmName}</Text>
                        <Icon name='ios-arrow-right' size={18} color={Global.colors.GREY} style={[Global.styles.ICON, {width: 20,marginRight:10}]} />
                    </TouchableOpacity>
                    <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={{paddingLeft:10,flex:1,flexDirection:'row',borderBottomWidth:1/Global.pixelRatio,borderColor:Global.colors.IOS_SEP_LINE}}>
                        <TouchableOpacity style={[{paddingTop:10,paddingBottom:10,marginRight:10},clickStyle1]} onPress={()=>{this.changeList(1)}}>
                            <Text style={[{fontSize:15},clickText1]}>今天{this.fmtToday()}</Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={[{paddingTop:10,paddingBottom:10,marginRight:10},clickStyle2]} onPress={()=>{this.changeList(2)}}>
                            <Text style={{fontSize:15},clickText2}>明天{this.fmtTomorrow()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{paddingTop:10,paddingBottom:10,},clickStyle3]} onPress={()=>{this.changeList(3)}}>
                            <Text style={{fontSize:15},clickText3} >后天{this.fmtDayAfterTomorrow()}</Text>
                        </TouchableOpacity>
                    </View>
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

    renderItem:function(item: string, sectionID: number, rowID: number){
        // var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        return(
            <TouchableOpacity style={[{backgroundColor:'#ffffff'}]} onPress={()=>{this.chooseSeat(item)}}>
                    <View style={[{flexDirection:'row'},Global.styles.CENTER]}>
                        <View style={{flex:1,padding:10}}>
                            <View style={{flex:1}}>
                                <View style={{flex:1,flexDirection:'row'}}>
                                    <Text style={{flex:1,fontSize:12}}>{item.waitTime}</Text>
                                    <Text style={{flex:1,fontSize:12}}>{item.hallName}</Text>
                                    <Text style={{flex:1,fontSize:12,color:Global.colors.ORANGE}}>￥{this.filterMoney(item.standardPrice)}</Text>
                                </View>
                                <View style={{flex:1,flexDirection:'row'}}>
                                    <Text style={{flex:1,fontSize:12}}>{item.endTime}</Text>
                                    <Text style={{flex:1,fontSize:12}}>剩余{item.availaleSeats}张</Text>
                                    <Text style={{flex:1,fontSize:12}}>{item.copyLanguage}{item.copyType}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[{marginRight:20,borderWidth:1,borderColor:Global.colors.IOS_BLUE,borderRadius: 3,width:40,height:30},Global.styles.CENTER]}>
                            <Text style={{fontSize:12,color:Global.colors.IOS_BLUE}}>购票</Text>
                        </View>
                    </View>
                {bottomLine}
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
		    	hideBottomLine={false} 
		    	flow={false} 
                rightButtons={(
                    <View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
                        <TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
                            <Text style={{color: Global.colors.IOS_BLUE}}>刷新</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    image:{
        width:100,
        height:75,
        marginLeft:20,
        backgroundColor:'transparent'
    },
    moviesHolder: {
        height: 170,
        padding: 10,
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
    iconOnPortrait: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 3,
        right: 3,
    },
});

module.exports = MovieSchedule;



