import React, { Component } from "react";
import AuthService from "./auth-service";

import { Link } from "react-router-dom";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  service = new AuthService();

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.service.login(username, password).then((response) => {
      // set the whole application with the user that just logged in - lifting up the state by using setCurrentUser function in the parent component
      this.props.setCurrentUser(response);

      this.setState({ username: "", password: "" });
      this.props.history.push("/projects");
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <label htmlFor="">username</label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <label htmlFor="">password</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />

          <button>Login</button>
        </form>

        <Link to="/signup">Sign up</Link>
      </div>
    );
  }
}

export default Login;
