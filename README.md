# @ozylog/ui-dropdown
React UI Dropdown with react-jss

[![Travis](https://img.shields.io/travis/ozylog/ui-dropdown.svg)](https://travis-ci.org/ozylog/ui-dropdown) [![npm](https://img.shields.io/npm/dt/@ozylog/ui-dropdown.svg)](https://www.npmjs.com/package/@ozylog/ui-dropdown)

## Installation
```
npm install @ozylog/ui-dropdown --save
```

## Usage

```
<Dropdown onChange={onChangeFunc} combo required getOptions={getOptionsFunc} placeholder='Please select item' />
```

| Properties | Type | Description | Example |
|------------|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| combo | `Boolean` | Enable comboBox mode. User can filter dropdown items based on input. |  |
| required | `Boolean` | Activate remove icon/button if dropdown has value. Allow dropdown to has null value. | true |
| placeholer | `String` | Input placeholder. |  |
| options | `Array<Object:{text: String, value: any}>` | Static dropdown options. | [{text: 'Australia', value: {countryCode: 'AU', ...}}] |
| getOptions | `Function` | Dynamic dropdown option. The function will be called when dropdown is on focus / after typing. The function should return `Array<{text: String, value: any}>` or Promise of `Array<{text: String, value: any}>`. |  |
| onChange | `Function` | The function will called when dropdown value has changed. It will return `value` of  `{text: String, value: any}`. |  |
| onBlur | `Function` | The function will called when dropdown is onBlur. |  |

## Usage Example
```javascript
'use strict';

import React, {Component} from 'react';
import Dropdown from '@ozylog/ui-dropdown';

export default class TestComponent extends Component {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    // do something
  };

  render() {
    return (
      <div className='Test'>
        Test
        <ArrowIcon name='down' onClick={this.onClick} >
      </div>
    );
  }
}
```

## License
MIT
