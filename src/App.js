import React, { Component } from "react";
import "./App.css";

import { Switch, Route, Redirect } from "react-router-dom";

import ProjectList from "./components/projects/ProjectList";
import ProjectDetail from "./components/projects/ProjectDetail";
import EditProject from "./components/projects/EditProject";
import NavBar from "./components/navbar/index";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import AuthService from "./components/auth/auth-service";



class App extends Component {
  state = {
    loggedInUser: null,
  };

  service = new AuthService();

  setCurrentUser = (userObj) => {
    this.setState({
      loggedInUser: userObj,
    });
  };

  // 1. save the user into the browser local storage

  //2. check if the user is still logged in by calling the backedn

  fetchUser = () => {
    if (this.state.loggedInUser === null) {
      this.service.loggedin().then((response) => {
        this.setState({
          loggedInUser: response,
        });
      });
    }
  };

  render() {
    this.fetchUser();
    return (
      <div className="App">
        <NavBar
          setCurrentUser={this.setCurrentUser}
          getCurrentUser={this.state.loggedInUser}
        />

        <Switch>
          {/* Passing props using render method inside the Route component */}
          <Route
            path="/login"
            render={(props) => (
              <Login setCurrentUser={this.setCurrentUser} {...props} />
            )}
          />
          <Route exact path="/projects" component={ProjectList} />
          <Route exact path="/projects/:id"
            render={(props) => (
              <ProjectDetail
                loggedInUser={this.state.loggedInUser}
                {...props}
              />
            )}
          />
          <Route
            path="/projects/:id/edit"
            render={(props) => {
              if (this.state.loggedInUser) {
                return <EditProject {...props} />;
              } else {
                return <Redirect to="/login" />;
              }
            }}
          />

          <Route
            path="/signup"
            render={(props) => (
              <Signup setCurrentUser={this.setCurrentUser} {...props} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
