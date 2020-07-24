import React, { Component } from "react";
// import "./App.css";

import { Switch, Route, Redirect } from "react-router-dom";

import ProjectList from "./components/projects/ProjectList";
import NavBar from "./components/navbar/index";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Logout from "./components/auth/Logout"
import AuthService from "./components/auth/auth-service";

import { Layout, message } from "antd";
import CharacterList from "./components/characters/CharacterList";
import SceneList from "./components/scenes/SceneList";

import CostumeList from "./components/costumes/CostumeList";
import CostumeDetail from "./components/costumes/CostumeDetail";

/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import { enquireScreen } from "enquire-js";

import Nav3 from "./components/Home/Nav3";
import Footer1 from "./components/Home/Footer1";

import {
  Nav30DataSource,
  Nav31DataSource,
  Footer10DataSource,
} from "./components/Home/data.source";
import "./components/Home/less/antMotionStyle.less";
import Home from "./components/Home/index.jsx";

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

const { location } = window;

const { Footer, Content } = Layout;

class App extends Component {
  state = {
    currentUser: null,
    isMobile,
    show: !location.port, // 如果不是 dva 2.0 请删除
  };

  service = new AuthService();

  setCurrentUser = (userObj) => {
    this.setState({
      currentUser: userObj,
    });
  };

  

  componentDidMount() {
    this.fetchUser();
    // 适配手机屏幕;
    enquireScreen((b) => {
      this.setState({ isMobile: !!b });
    });
    // dva 2.0 样式在组件渲染之后动态加载，导致滚动组件不生效；线上不影响；
    /* 如果不是 dva 2.0 请删除 start */
    if (location.port) {
      // 样式 build 时间在 200-300ms 之间;
      setTimeout(() => {
        this.setState({
          show: true,
        });
      }, 500);
    }
    /* 如果不是 dva 2.0 请删除 end */
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
    const children = [
      <Nav3
        id="Nav3_0"
        key="Nav3_0"
        dataSource={this.state.currentUser ? Nav31DataSource : Nav30DataSource}
        isMobile={this.state.isMobile}
      />,
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
            <div>
              <Home setCurrentUser={this.setCurrentUser} {...props} />
              <Login setCurrentUser={this.setCurrentUser} {...props} />
            </div>
          )}
        />
        <Route
          path="/logout"
          render={(props) => {
            if (localStorage.getItem("loggedin")) {
              return <Logout setCurrentUser={this.setCurrentUser} {...props} />
            } else {
              return <Redirect to="/login" />;
            }
          }}
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
                <SceneList currentUser={this.state.currentUser} {...props} />
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
                <CostumeList currentUser={this.state.currentUser} {...props} />
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
      </Switch>,
      <Footer1
        id="Footer1_0"
        key="Footer1_0"
        dataSource={Footer10DataSource}
        isMobile={this.state.isMobile}
      />,
    ];
    return (
      <div
        className="templates-wrapper"
        ref={(d) => {
          this.dom = d;
        }}
      >
        {/* 如果不是 dva 2.0 替换成 {children} start */}
        {this.state.show && children}
        {/* 如果不是 dva 2.0 替换成 {children} end */}
      </div>
    );
  }
}

export default App;
