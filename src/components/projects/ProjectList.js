import React, { Component } from "react";
import NewProject from "./NewProject";
import instance from "../../instance";

import {Link} from 'react-router-dom';

import { Layout, List, Breadcrumb } from "antd";
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
      <div
        style={{
          margin: "2rem 5rem 5rem 5rem",
          padding: "2rem 5rem 5rem 5rem",
          width: "100%"
        }}
      >
        <Content key="new-project-button">
          <NewProject
            history={this.props.history}
            key="new-project"
            refreshProjects={this.getAllProjects}
          />
        </Content>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={this.state.projects}
          renderItem={(project) => (
            <List.Item>
              <ProjectCard
                key={project._id + "Card"}
                project={{ ...project }}
                refreshProjects={this.getAllProjects}
                history={this.props.history}
              />
            </List.Item>
          )}
        />

        {/* <Row style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} >
          {this.state.projects.map((project) => {
            return (
              <Col key={project._id} span={24}>
                <ProjectCard key={project._id+"Card"} project={{ ...project }} refreshProjects={this.getAllProjects} history={this.props.history}/>
              </Col>
            );
          })}
        </Row> */}
      </div>
    );
  }
}

export default ProjectList;
