import React, { Component } from "react";
import AuthService from "../auth/auth-service";

import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { Layout, Drawer, Button, message } from "antd";
import { AlignRightOutlined } from "@ant-design/icons";
import "./NavBar.css";

import { Link, Redirect } from "react-router-dom";

const { Header } = Layout;

class NavBar extends Component {
  state = {
    visible: false,
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  service = new AuthService();

  handleLogout = () => {
    this.service.logout().then(() => {
      this.props.setCurrentUser(null);
      localStorage.clear();
      // HOW TO REDIRECT USER TO /?
      message.success({
        content: "Logged out successfully!",
      });
      window.location.reload();
    });
  };

  render() {
    return (
      <Header className="menu">
        <div className="menu__logo">
          <a href="">Logo</a>
        </div>
        <div className="menu__container">
          <div className="menu_left">
            <LeftMenu mode="horizontal" />
          </div>
          <div className="menu_rigth">
            <RightMenu mode="horizontal" handleLogout={this.handleLogout} currentUser={this.props.currentUser} />
          </div>
          <Button
            className="menu__mobile-button"
            type="primary"
            onClick={this.showDrawer}
          >
            <AlignRightOutlined />
          </Button>
          <Drawer
            title="Basic Drawer"
            placement="right"
            className="menu_drawer"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <LeftMenu mode="inline" />
            <RightMenu
              mode="inline"
              currentUser={this.props.currentUser}
              handleLogout={this.handleLogout}
            />
          </Drawer>
        </div>
      </Header>
    );
  }
}

export default NavBar;
