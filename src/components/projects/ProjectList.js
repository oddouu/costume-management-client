import React, { Component } from "react";
import Axios from "axios";
import NewProject from "./NewProject";
import { Link } from "react-router-dom";
import instance from "../../instance"

import { Layout } from "antd";
const {Content} = Layout;

class ProjectList extends Component {
  state = {
    projects: [],
  };

  getAllProjects = () => {
    instance.get("http://localhost:5000/api/projects").then((response) => {
      console.log(response);
      this.setState({
        projects: response.data,
      });
    });
  };

  componentDidMount() {
    this.getAllProjects();
  }

  render() {
    return (
      <Content>
      
      </Content>
    );
  }
}

export default ProjectList;
