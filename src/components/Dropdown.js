'use strict';

import React, {Component} from 'react';
import ArrowIcon from '@ozylog/arrow-icons';
import injectSheet from 'react-jss';

const styles = {
  container: {
    position: 'relative'
  },
  input: {
    background: '#ffffff',
    border: '1px solid #cccccc',
    borderRadius: '3px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    padding: '9px 11px',
    paddingRight: '27px !important',
    position: 'relative',
    width: '100%',
    '&:focus': {
      outline: 0
    }
  },
  inputNoCombo: {
    color: 'transparent',
    textShadow: '0 0 0 #333333'
  },
  options: {
    background: '#ffffff',
    border: '1px solid #cccccc',
    borderRadius: '0 0 3px 3px',
    fontSize: '15px',
    marginTop: '-1px',
    maxHeight: '250px',
    minWidth: '100%',
    overflowY: 'auto',
    position: 'absolute',
    zIndex: 1,
    '& > div': {
      cursor: 'pointer',
      padding: '7px 11px',
      borderBottom: '1px solid #f5f5f5'
    },
    '& > div:last-child': {
      borderBottom: 0
    },
    '& > div.active': {
      background: '#e5e5e5'
    }
  },
  arrowIcon: {
    marginRight: '10px',
    '&:before, &:after': {
      backgroundColor: '#cccccc'
    }
  }
};

@injectSheet(styles)
export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      options: [],
      optionIndex: -1,
      isOptionsOpen: false,
      isLoadingOptions: false,
      isFocus: false,
      keyword: '',
      isIgnoreBlur: false
    };
  }

  async componentWillMount() {
    if (this.props.value) {
      const selectedOption = await this.getOptionByValue(this.props.value);

      if (selectedOption) this.setState({selectedOption});
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      const value = nextProps.value;
      const selectedOption = await this.getOptionByValue(value);

      if (selectedOption) this.setState({selectedOption});
    }
  }

  async getOptionByValue(value) {
    const {combo, getOptions} = this.props;
    const options = combo && getOptions ? await getOptions('') : (this.props.options || []);
    const selectedOption = options.find((option) => option.value === value);

    return selectedOption || null;
  }

  onFocus = () => {
    this.setState({isFocus: true});
  };

  onBlur = () => {
    const {isIgnoreBlur} = this.state;

    if (isIgnoreBlur) return;
    this.setState({
      optionIndex: -1,
      isOptionsOpen: false,
      isFocus: false,
      keyword: ''
    });
    if (this.props.onBlur) this.props.onBlur();
  };

  onChange = (event) => {
    const {combo, getOptions} = this.props;

    if (combo) {
      const keyword = event.target.value;

      this.setState({
        isOptionsOpen: true,
        keyword
      });

      if (getOptions) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(async() => {
          const newOptions = await getOptions(keyword);
          this.setState({options: newOptions});
        }, 500);
      }
    }
  };

  onClick = async() => {
    const {isOptionsOpen, keyword} = this.state;
    const {combo, getOptions} = this.props;

    if (!isOptionsOpen) {
      this.setState({
        isOptionsOpen: true,
        options: []
      });

      if (combo && getOptions) {
        const newOptions = await getOptions(keyword);

        this.setState({options: newOptions});
      }
    } else {
      this.setState({isOptionsOpen: false});
    }
  };

  onKeyDown = (event) => {
    const {isOptionsOpen, optionIndex} = this.state;
    const options = this.filterOptions();

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (isOptionsOpen) {
        if (optionIndex < options.length - 1) {
          const index = optionIndex + 1;

          this.setState({optionIndex: index}, () => {
            const option = this.refs[`option-${index}`];

            option.scrollIntoView(false);
          });
        }
      } else {
        this.setState({isOptionsOpen: true});
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (optionIndex > 0) {
        const index = optionIndex - 1;

        this.setState({optionIndex: index}, () => {
          const option = this.refs[`option-${index}`];

          option.scrollIntoView(false);
        });
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();

      this.onSelectOption(options[optionIndex]);
    } else if (event.key === 'Escape') {
      this.onBlur();
    }
  };

  onMouseDownOption = () => {
    this.setState({isIgnoreBlur: true});
  };

  onMouseOverOption = (optionIndex) => {
    this.setState({optionIndex});
  };

  onSelectOption = (selectedOption) => {
    this.setState({
      selectedOption,
      isIgnoreBlur: false
    }, () => {
      if (this.props.onChange) {
        this.props.onChange({
          target: {value: selectedOption ? selectedOption.value : null}
        });
      }
      this.onBlur();
      this.refs.dropdown.blur();
    });
  };

  filterOptions() {
    const {combo, getOptions} = this.props;
    const {keyword} = this.state;
    let filteredOptions = combo && getOptions ? this.state.options : (this.props.options || []);

    if (combo && keyword) {
      filteredOptions = filteredOptions.filter((option) => {
        if (!option.text) option.text = option.value;

        return option.text.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
    }

    return filteredOptions;
  }

  removeSelectedOption = () => {
    const {selectedOption} = this.state;
    const {required} = this.props;

    if (selectedOption && !required) { // Remove value
      this.onSelectOption(null);
      this.refs.dropdown.focus();
    }
  }

  renderInput() {
    const {classes, required, combo, placeholder, inputClassName} = this.props;
    const {onBlur, onChange, onClick, onFocus, onKeyDown} = this;
    const {isFocus, isOptionsOpen, keyword, selectedOption} = this.state;
    const inputClassNameArr = [classes.input];
    let inputValue = selectedOption ? selectedOption.text : '';
    let arrowIconType;
    let onClickIcon;

    if (isOptionsOpen) {
      arrowIconType = 'up';
    } else if (selectedOption && selectedOption.value && !required) {
      arrowIconType = 'remove';
      onClickIcon = this.removeSelectedOption;
    } else {
      arrowIconType = 'down';
    }
    if (isFocus && combo) inputValue = keyword;

    if (!combo) inputClassNameArr.push(classes.inputNoCombo);
    if (inputClassName) inputClassNameArr.push(inputClassName);

    return (
      <div>
        <input
          className={inputClassNameArr.join(' ')}
          autoComplete='off'
          onBlur={onBlur}
          onChange={onChange}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref='dropdown'
          type='text'
          value={inputValue}
        />
        <ArrowIcon name={arrowIconType} className={classes.arrowIcon} onClick={onClickIcon} />
      </div>
    );
  }

  renderOptions() {
    const {classes} = this.props;
    const {onMouseDownOption, onMouseOverOption, onSelectOption} = this;
    const {isOptionsOpen, optionIndex} = this.state;
    const filteredOptions = this.filterOptions();

    return (
      <div className={classes.options} style={{display: isOptionsOpen && filteredOptions && filteredOptions.length ? 'block' : 'none'}} onMouseDown={onMouseDownOption} ref='options'>
        {filteredOptions.map((option, key) => {
          if (!option.text) option.text = option.value;

          return (
            <div className={optionIndex === key ? 'active' : ''} key={key} onClick={() => onSelectOption(option)} onMouseOver={() => onMouseOverOption(key)} ref={`option-${key}`}>
              {option.text}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        {this.renderInput()}
        {this.renderOptions()}
      </div>
    );
  }
}
