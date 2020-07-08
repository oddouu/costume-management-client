import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "./auth/auth-service";

class NavBar extends Component {
  service = new AuthService();

  logoutUser = () => {
    this.service.logout()
        .then(()=>{
          // lift the state
          this.props.setCurrentUser(null);
        })
  }

  render() {
    if (this.props.getCurrentUser) {
      return (
        <nav>
          <ul>
            <li>Welcome {this.props.getCurrentUser.username}</li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/">
                <button onClick={this.logoutUser}>Logout</button>
              </Link>
            </li>
          </ul>
        </nav>
      )
    } else {
      return (
        <nav>
          <ul>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
          </ul>
        </nav>
      );
    }
  }
}

export default NavBar;
