'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
} from 'react-native';

import * as Global  from '../../Global';
import EasyIcon     from 'rn-easy-icon';
import * as ShopUtil from '../util/ShopUtil';

class Checkbox extends Component {

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        checked: this.props.checked ? true : false,
        iconName: this.getIconName(this.props.checked),
    };
    
    getIconName(checked) {
        return checked ? 'ios-checkbox-outline' : 'ios-square-outline';
    }

    constructor (props) {
        super(props);
    }

    componentDidMount () {
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.checked,
            iconName: this.getIconName(nextProps.checked),
        });
    }
    
    onCheck() {
        let checked = !this.state.checked;
        this.setState({
            checked: checked,
            iconName: this.getIconName(checked),
        });
        this.props.onCheck && this.props.onCheck(checked);
    }
    
    render () {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.style]}
                onPress={this.onCheck.bind(this)}
            >
                <EasyIcon name={this.state.iconName} size={22} />
                {
                    !this.props.label ? null : 
                        <Text style={styles.label}>{this.props.label}</Text>
                }
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    label: {
        marginLeft: 15,
    },
});

export default Checkbox;



