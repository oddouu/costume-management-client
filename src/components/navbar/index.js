import React, { Component } from "react";
import AuthService from "../auth/auth-service";

import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { Layout, Drawer, Button } from "antd";
import { AlignRightOutlined } from "@ant-design/icons";
import "./NavBar.css";

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
  logoutUser = () => {
    this.service.logout().then(() => {
      // lift the state
      this.props.setCurrentUser(null);
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
              <RightMenu mode="horizontal" />
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
              <RightMenu mode="inline" />
            </Drawer>
          </div>
      </Header>
    );
  }
}

export default NavBar;
