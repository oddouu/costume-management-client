import React, { Component } from "react";
import AuthService from "./auth-service";
import {Redirect} from "react-router-dom";
import {message} from "antd";

class Logout extends Component {
  state = {
    loggedout: false,
  };
  service = new AuthService();

  handleLogout = () => {
    this.service.logout().then(() => {
      this.props.setCurrentUser(null);
      localStorage.clear();
      this.setState({
        loggedout: true,
      });
      message.success({
        content: "Logged out successfully!",
      });
    });
  };

  componentDidMount() {
      this.handleLogout();
  }
  render() {
      const { loggedout } = this.state;
    return (
        loggedout ? <Redirect to="/" /> : null
    );
  }
}

export default Logout;
