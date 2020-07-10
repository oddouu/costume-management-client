import React, { Component } from "react";
import NewProject from "./NewProject";
import instance from "../../instance";

import { Layout, Row, Col } from "antd";
import ProjectCard from "./ProjectCard";

const { Content } = Layout;


class ProjectList extends Component {
  state = {
    projects: [],
  };

  getAllProjects = () => {
    instance.get("/projects").then((response) => {
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
      <div >
        <Content key="new-project-button">
          <NewProject
            history={this.props.history}
            key="new-project"
            refreshProjects={this.getAllProjects}
          >
            Create new project
          </NewProject>
        </Content>
        <Row style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} >
          {this.state.projects.map((project) => {
            return (
              <Col key={project._id} span={24}>
                <ProjectCard project={{ ...project }} refreshAllProjects={this.getAllProjects} history={this.props.history}/>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default ProjectList;
