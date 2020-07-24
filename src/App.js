import React, { Component } from "react";
// import "./App.css";

import { Switch, Route, Redirect } from "react-router-dom";

import ProjectList from "./components/projects/ProjectList";
import NavBar from "./components/navbar/index";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import AuthService from "./components/auth/auth-service";

import { Layout } from "antd";
import CharacterList from "./components/characters/CharacterList";
import SceneList from "./components/scenes/SceneList";

import CostumeList from "./components/costumes/CostumeList";
import CostumeDetail from "./components/costumes/CostumeDetail";

import Home from "./components/Home/index.jsx";
const { Footer, Content } = Layout;

class App extends Component {
  state = {
    currentUser: null,
  };

  service = new AuthService();

  setCurrentUser = (userObj) => {
    this.setState({
      currentUser: userObj,
    });
  };

  componentDidMount() {
    this.fetchUser();
  }

  // 1. save the user into the browser local storage

  //2. check if the user is still logged in by calling the backedn

  fetchUser = () => {
    if (this.state.currentUser === null) {
      this.service.loggedin().then((response) => {
        if (response._id) {
          this.setCurrentUser(response);
          localStorage.setItem("loggedin", true);
        } else {
          localStorage.clear();
        }
      });
    }
  };

  render() {
    return (
      <Layout className="App">
        <NavBar
          setCurrentUser={this.setCurrentUser}
          currentUser={this.state.currentUser}
        />
        <Content className="site-layout-content" style={{ padding: "0 50px" }}>
          <Switch>
            {/* Passing props using render method inside the Route component */}

            <Route
              exact
              path="/"
              render={(props) => (
                <Home setCurrentUser={this.setCurrentUser} {...props} />
              )}
            />
            <Route
              path="/login"
              render={(props) => (
                <Login setCurrentUser={this.setCurrentUser} {...props} />
              )}
            />
            <Route
              exact
              path="/projects"
              render={(props) => {
                if (localStorage.getItem("loggedin")) {
                  return <ProjectList {...props} />;
                } else {
                  return <Redirect to="/login" />;
                }
              }}
            />
            <Route
              exact
              path="/projects/:projId/characters"
              render={(props) => {
                if (localStorage.getItem("loggedin")) {
                  return (
                    <CharacterList
                      currentUser={this.state.currentUser}
                      {...props}
                    />
                  );
                } else {
                  return <Redirect to="/login" />;
                }
              }}
            />
            <Route
              exact
              path="/projects/:projId/scenes"
              render={(props) => {
                if (localStorage.getItem("loggedin")) {
                  return (
                    <SceneList
                      currentUser={this.state.currentUser}
                      {...props}
                    />
                  );
                } else {
                  return <Redirect to="/login" />;
                }
              }}
            />
            <Route
              exact
              path="/projects/:projId/characters/:charId/costumes"
              render={(props) => {
                if (localStorage.getItem("loggedin")) {
                  return (
                    <CostumeList
                      currentUser={this.state.currentUser}
                      {...props}
                    />
                  );
                } else {
                  return <Redirect to="/login" />;
                }
              }}
            />

            <Route
              exact
              path="/projects/:projId/characters/:charId/costumes/:costId"
              render={(props) => {
                if (localStorage.getItem("loggedin")) {
                  return (
                    <CostumeDetail
                      currentUser={this.state.currentUser}
                      {...props}
                    />
                  );
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
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    );
  }
}

export default App;
