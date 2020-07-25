import React, { Component } from "react";
import instance from "../../instance";

import { Modal, Button, message, Form, Input } from "antd";

class NewProject extends Component {
  state = {
    title: "",
    description: "",
    movieDirectorName: "",
    scriptWriter: "",
    date: "",
    productionName: "",
    numberOfCharacters: 0,
    numberOfScenes: 0,
    visible: false,
    responseFromAPI: false,
    submitState: "Create project",
    loadings: [],
  };

  enterLoading = (index) => {
    this.setState(({ loadings }) => {
      const newLoadings = [...loadings];
      newLoadings[index] = true;
      return {
        loadings: newLoadings,
      };
    });
    setTimeout(() => {
      this.setState(({ loadings }) => {
        const newLoadings = [...loadings];
        newLoadings[index] = false;

        return {
          loadings: newLoadings,
        };
      });
      if (this.state.responseFromAPI) {
        this.setState({
          title: "",
          description: "",
          movieDirectorName: "",
          scriptWriter: "",
          date: "",
          productionName: "",
          numberOfCharacters: 0,
          numberOfScenes: 0,
        });
        message.success({
          content: "Success!",
        });

        this.setState({
          visible: false,
          submitState: "Create project",
        });
      }
    }, 2000);
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = () => {
    let {
      title,
      description,
      movieDirectorName,
      scriptWriter,
      date,
      productionName,
      numberOfCharacters,
      numberOfScenes,
    } = this.state;

    numberOfCharacters = Number(numberOfCharacters);
    numberOfScenes = Number(numberOfScenes);

    const newProject = {
      title,
      description,
      movieDirectorName,
      scriptWriter,
      date,
      productionName,
      numberOfCharacters,
      numberOfScenes,
    };

    instance
      .post("/projects", newProject)
      .then((response) => {
        this.setState({ submitState: "Creating project..." });

        //Lift the state
        this.props.refreshProjects();
        this.setState({ responseFromAPI: true });

        this.enterLoading(0);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.props.history.push("/login");
        }
        message.error(err.response.data.message);
        this.setState({
          submitState: "Create project",
        });
      });
  };

  render() {
    const { visible, confirmLoading } = this.state;

    return (
      <div>
        <Button
          type="primary"
          onClick={this.showModal}
          style={{ marginBottom: "2rem" }}
        >
          Create new Project
        </Button>
        <Modal
          title="Basic Modal"
          visible={visible}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
          footer={[
            <Button
              type="primary"
              form="new-project-form"
              key="submit"
              htmlType="submit"
              className="login-form-button"
              loading={this.state.loadings[0]}
              onClick={() => this.handleFormSubmit}
            >
              {this.state.submitState}
            </Button>,
          ]}
        >
          <Form
            id="new-project-form"
            name="new-project"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.handleFormSubmit}
          >
            <Form.Item
              rules={[
                { required: true, message: "Please input the project title!" },
              ]}
            >
              <Input
                placeholder="Title"
                name="title"
                onChange={this.handleChange}
                value={this.state.title}
              />
            </Form.Item>
            <Form.Item>
              <Input
                type="text"
                name="description"
                value={this.state.description}
                onChange={this.handleChange}
                placeholder="Description"
              />
            </Form.Item>
            <Form.Item>
              <Input
                name="movieDirectorName"
                value={this.state.movieDirectorName}
                onChange={this.handleChange}
                placeholder="movieDirectorName"
              />
            </Form.Item>
            <Form.Item>
              <Input
                name="scriptWriter"
                value={this.state.scriptWriter}
                onChange={this.handleChange}
                placeholder="scriptWriter"
              />
            </Form.Item>
            <Form.Item>
              <Input
                name="productionName"
                value={this.state.productionName}
                onChange={this.handleChange}
                placeholder="productionName"
              />
            </Form.Item>

            <Form.Item label="Date">
              <Input
                type="date"
                name="date"
                value={this.state.date}
                onChange={this.handleChange}
              />
            </Form.Item>
            <Form.Item label="numberOfScenes">
              <Input
                type="number"
                onChange={this.handleChange}
                name="numberOfScenes"
                value={this.state.numberOfScenes}
              />
            </Form.Item>
            <Form.Item label="numberOfCharacters">
              <Input
                type="number"
                onChange={this.handleChange}
                name="numberOfCharacters"
                value={this.state.numberOfCharacters}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default NewProject;
