import React, { Component } from 'react';
import { Menu } from 'antd';

class RightMenu extends Component {
  render() {
    return (
      <Menu mode={this.props.mode} theme="dark">
        <Menu.Item key="1">
          <a href="/login">Log in</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="/signup">Signup</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default RightMenu;
