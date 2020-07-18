import React, { Component } from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";

class RightMenu extends Component {
  service = new AuthService();

 

  render() {
    if (!this.props.currentUser) {
      return (
        <Menu mode={this.props.mode} theme="dark">
          <Menu.Item key="1">
            <Link to="/login">Signin</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/signup">Signup</Link>
          </Menu.Item>
        </Menu>
      );
    } else {
      return (
        <Menu mode={this.props.mode} theme="dark">
          <Menu.Item key="1">
            <Button onClick={this.props.handleLogout}>
              Logout
            </Button>
          </Menu.Item>
        </Menu>
      );
    }
  }
}

export default RightMenu;
