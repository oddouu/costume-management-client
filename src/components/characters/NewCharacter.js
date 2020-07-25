import React, { Component } from "react";
import instance from "../../instance";

import { Modal, Button, message, Form, Input } from "antd";

class NewCharacter extends Component {
  state = {
    actorName: "",
    characterName: "",
    age: "",
    imageUrl: "",
    numberOfCostumes: 0,
    visible: false,
    responseFromAPI: false,
    submitState: "Create character",
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
          actorName: "",
          characterName: "",
          age: "",
          imageUrl: "",
          numberOfCostumes: 0,
        });
        message.success({
          content: "Success!",
        });

        this.setState({
          visible: false,
          submitState: "Create character",
        });
      }
    }, 2000);
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
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
      actorName,
      characterName,
      age,
      imageUrl,
      numberOfCostumes,
    } = this.state;

    const project = this.props.projId;
    numberOfCostumes = Number(numberOfCostumes);

    const newCharacter = {
      actorName,
      characterName,
      age,
      imageUrl,
      project,
      numberOfCostumes,
    };

    instance
      .post(`/projects/${project}/characters`, newCharacter)
      .then((response) => {
        this.setState({ submitState: "Creating character..." });
        console.log("NEW CHARACTER", response);
        //Lift the state
        this.props.refreshCharacters();
        this.setState({ responseFromAPI: true });

        this.enterLoading(0);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.props.history.push("/login");
        }
        message.error(err.response.data.message);
        this.setState({
          submitState: "Create character",
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
          style={{ marginBottom: "20px" }}
        >
          Create new Character
        </Button>
        <Modal
          title="New Character"
          visible={visible}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
          footer={[
            <Button
              type="primary"
              form="new-character-form"
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
            id="new-character-form"
            name="new-character"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.handleFormSubmit}
          >
            <Form.Item
              rules={[
                { required: true, message: "Please input the character name!" },
              ]}
            >
              <Input
                placeholder="characterName"
                name="characterName"
                onChange={this.handleChange}
                value={this.state.characterName}
              />
            </Form.Item>
            <Form.Item>
              <Input
                type="text"
                name="actorName"
                value={this.state.actorName}
                onChange={this.handleChange}
                placeholder="actorName"
              />
            </Form.Item>
            <Form.Item>
              <Input
                name="age"
                value={this.state.age}
                onChange={this.handleChange}
                placeholder="age"
              />
            </Form.Item>
            <Form.Item>
              <Input
                name="imageUrl"
                value={this.state.imageUrl}
                onChange={this.handleChange}
                placeholder="imageUrl"
              />
            </Form.Item>
            <Form.Item label="numberOfCostumes">
              <Input
                type="number"
                onChange={this.handleChange}
                name="numberOfCostumes"
                value={this.state.numberOfCostumes}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default NewCharacter;
