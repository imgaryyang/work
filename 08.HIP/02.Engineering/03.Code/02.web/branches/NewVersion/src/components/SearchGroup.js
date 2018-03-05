import React from 'react';
import { Input, Select, Button, Icon } from 'antd';
import Styles from './SearchGroup.less';

class SearchGroup extends React.Component {
  state = {
    clearVisible: false,
    selectValue: (this.props.select && this.props.selectProps) ? this.props.selectProps.defaultValue : '',
  }
  handleSearch = () => {
    const selectKey = this.state.selectValue;
    const selectValue = this.searchInput.refs.input.value;
    const data = { [selectKey]: selectValue };
    this.props.onSearch(data);
  }
  handleInputChange = (e) => {
    this.setState({
      ...this.state,
      clearVisible: e.target.value !== '',
    });
  }
  handeleSelectChange = (value) => {
    this.setState({
      ...this.state,
      selectValue: value,
    });
  }
  handleClearInput = () => {
    this.searchInput.refs.input.value = '';
    this.setState({
      clearVisible: false,
    });
    this.handleSearch();
  }
  render() {
    const {
      size, selectOptions, selectProps, style, keyword,
    } = this.props;
    const { clearVisible } = this.state;
    const InputGroup = Input.Group;
    const SelectOption = Select.Option;
    return (
      <InputGroup compact size={size} className={Styles.search} style={style}>
        {
          <Select onChange={this.handeleSelectChange} size={size} {...selectProps}>
            {
              selectOptions.map((item, key) =>
                  (<SelectOption value={item.value} key={key}>
                    {item.name || item.value}
                   </SelectOption>))
            }
          </Select>
        }
          <Input
            ref={(node) => { this.searchInput = node; }}
            size={size}
            onChange={this.handleInputChange}
            onPressEnter={this.handleSearch}
            defaultValue={keyword}
          />
            <Button size={size} type="primary" onClick={this.handleSearch}>搜索</Button>
        {clearVisible && <Icon type="cross" onClick={this.handleClearInput} />}
      </InputGroup>
    );
  }
}

export default SearchGroup;
