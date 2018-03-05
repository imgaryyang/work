'use strict';
/**
 * 公用选择组件
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    Modal,
    Platform,
    Dimensions,
    PixelRatio,
    StyleSheet,

    DatePickerIOS,

    DatePickerAndroid,
    TimePickerAndroid,
} from 'react-native';

import moment           from 'moment';

class EasyDatePicker extends Component {

    static displayName = 'EasyDatePicker';
    static description = 'EasyDatePicker Component';

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        mode: 'date',
        date: new Date(),
        minDate: null,
        maxDate: null,
        hour: null,
        minute: null,
        is24Hour: true,
        timeZoneOffsetInHours: 0,
        visible: false,
        onPicked: null,
    };

    constructor (props) {
        super(props);

        this.pickDate       = this.pickDate.bind(this);
        this.pickTime       = this.pickTime.bind(this);
        this.pickDateTime   = this.pickDateTime.bind(this);
        this.toggle         = this.toggle.bind(this);
        this.onDateChange   = this.onDateChange.bind(this);
        this.onOk           = this.onOk.bind(this);
        this.onCancel       = this.onCancel.bind(this);
        this.clear          = this.clear.bind(this);
    }

    componentDidMount () {
    }

    /**
     * 选择日期
     * arg 0 - config : {
     *     date - 当前选择日期
     *     minDate - 最小日期
     *     maxDate - 最大日期
     * }
     * arg 1 - onPicked - 回调方法
     */
    async pickDate (config, onPicked) {
        //console.log('........... in pickDate()');
        this.setState({
            mode: 'date',
            date: config['date'],
            minDate: config['minDate'],
            maxDate: config['maxDate'],
            onPicked: onPicked,
        });
        if (Platform.OS == 'ios') {
            this.toggle();
        } else {
            try {
                const {action, year, month, day} = await DatePickerAndroid.open(config);
                //console.log({action, year, month, day});
                if (action === DatePickerAndroid.dismissedAction) {
                    return;
                } else {
                    var date = new Date(year, month, day);
                    //console.log(date.toLocaleDateString());
                    this.setState({date: date}, () => this.onOk());
                }
            } catch(e) {}
        }
    }

    /**
     * 选择时间
     * arg 0 - config : {
     *     hour - 当前选择小时
     *     minute - 当前选择分钟
     *     is24Hour - 是否24小时制（默认true）
     * }
     * arg 1 - onPicked - 回调方法
     */
    async pickTime (config, onPicked) {
        //console.log('........... in pickTime()');

        let day = moment(
            moment().format('YYYY-MM-DD') + ' ' + 
            (config['hour'] ? config['hour'] + ':' : '')  +
            (config['minute'] ? config['minute'] : '')
        ).toDate();

        //console.log('day from moment in pickTime() : ', day);

        this.setState({
            mode: 'time',
            date: day,
            hour: config['hour'],
            minute: config['minute'],
            is24Hour: (config['is24Hour'] === true || config['is24Hour'] === false ? config['is24Hour'] : true),
            onPicked: onPicked,
        });
        if (Platform.OS == 'ios') {
            this.toggle();
        } else {
            try {
                const {action, minute, hour} = await TimePickerAndroid.open(config);
                //console.log({action, minute, hour});
                if (action === TimePickerAndroid.dismissedAction) {
                    return;
                } else {
                    var date = new Date();
                    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
                    //console.log(date.toLocaleDateString());
                    this.setState({date: date}, () => this.onOk());
                }
            } catch(e) {}
        }
    }


    /**
     * 选择日期及时间
     * IOS有效
     * arg 0 - config : {
     *     date - 当前选择日期
     *     minDate - 最小日期
     *     maxDate - 最大日期
     *     is24Hour - 是否24小时制（默认true）
     * }
     * arg 1 - onPicked - 回调方法
     */
    async pickDateTime (config, onPicked) {
        //console.log('........... in pickDateTime()');
        this.setState({
            mode: 'datetime',
            date: config['date'],
            minDate: config['minDate'],
            maxDate: config['maxDate'],
            is24Hour: (config['is24Hour'] === true || config['is24Hour'] === false ? config['is24Hour'] : true),
            onPicked: onPicked,
        });
        if (Platform.OS == 'ios') {
            this.toggle();
        }
    }

    clear () {
        this.setState({
            mode: 'date',
            date: new Date(),
            minDate: null,
            maxDate: null,
            hour: null,
            minute: null,
            is24Hour: true,
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
            visible: false,
            onPicked: null,
        });
    }

    toggle () {
        this.setState({visible: !this.state.visible});
    }

    onCancel () {
        this.clear();
    }

    onOk () {
        if(typeof this.state.onPicked == 'function')
            this.state.onPicked(this.state.date);
        this.clear();
    }

    onDateChange (date) {
        //console.log(arguments);
        this.setState({date: date});
    }

	render () {
        let dp = this.state.visible ? (
            <DatePickerIOS
                mode = {this.state.mode}
                date = {this.state.date}
                minimumDate = {this.state.minDate}
                maximumDate = {this.state.maxDate}
                onDateChange = {this.onDateChange}
                timeZoneOffsetInMinutes = {this.state.timeZoneOffsetInHours * 60}
                style = {{flex: 1}}
            />
        ) : null;
		return (
			<Modal
                animationType = "slide"
                transparent = {true}
                visible = {this.state.visible} >
                <View style = {styles.bg} >
                    <View style = {styles.container} >
                        <View style = {styles.buttonContainer} >
                            <TouchableOpacity style = {[styles.button]} onPress = {this.onCancel} ><Text style = {{color: 'rgba(0,122,255,1)'}} >取消</Text></TouchableOpacity>
                            <View style = {{flex: 1}} />
                            <TouchableOpacity style = {[styles.button]} onPress = {this.onOk} ><Text style = {{color: 'rgba(0,122,255,1)'}} >确定</Text></TouchableOpacity>
                        </View>
                        {dp}
                    </View>
                </View>
			</Modal>
		);
	}

}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    container: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: Dimensions.get('window').width,
        height: 280,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    buttonContainer: {
        width: Dimensions.get('window').width,
        height: 40,
        borderBottomColor: 'rgba(200,199,204,1)',
        borderBottomWidth: 1 / PixelRatio.get(),
        flexDirection: 'row',
    },
    button: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EasyDatePicker;



