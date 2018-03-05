'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import Radio  from './Radio';
import * as Global  from '../../Global';
class RadioGroup extends Component {

    static propTypes = {};

    static defaultProps = {};

     constructor(props) {
        super(props);
        this.state = {
            selected: props.selected || null
        };
    }
    componentWillMount = () => {
        const { selected } = this.state;

        if (selected) {
            this.value = selected;
        }
    };
    componentDidMount = () => {
        const { onSelect } = this.props;
        onSelect && onSelect(this.value);
    };
    componentWillReceiveProps(nextProps){
        this.value = nextProps.selected;
	}
    onChange = (value) => {
        const { onSelect } = this.props;

        this.setState({
            selected: value
        });

        onSelect && onSelect(value);
    }
    onSelect = (value) => {
        this.setState({
            selected: value
        });
    };
    get value() {
        return this.state.selected
    }
    set value(value) {
        this.onSelect(value);
    }
    render() {
        const { items } = this.props;
        console.log(items);
        return (
            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                {
                    items && items.length && items.map((item) => {
                        const { value } = item;
                        return (
                            <Radio
                                ref={value}
                                key={`RadioButton${value}`}
                                value={`${value.toString()}`}
                                onSelect={this.onChange}
                                checked={this.state.selected && this.state.selected === value}
                                {...item}
                            />
                        );
                    })
                }
            </View>
        );
    }

}

export default RadioGroup;