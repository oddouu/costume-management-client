import React, { Component } from "react";
import instance from "../../../instance";

import { Modal, Button, message, Form, Input } from "antd";

class NewLocation extends Component {
  state = {
    decor: "",
    locale: "",
    visible: false,
    responseFromAPI: false,
    submitState: "Create costume",
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
          decor: "",
          locale: "",
        });
        message.success({
          content: "Success!",
        });

        this.setState({
          visible: false,
          submitState: "Create location",
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
    let { decor, locale } = this.state;

    const project = this.props.projId;

    const newLocation = {
      decor,
      locale
    };

    instance
      .post(`/projects/${project}/locations`, newLocation)
      .then((response) => {
        this.setState({ submitState: "Creating location..." });
        console.log("NEW LOCATION", response.data);
        //Lift the state
        this.props.refreshScenes();
        this.setState({ responseFromAPI: true });

        this.enterLoading(0);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.props.history.push("/login");
        }
        message.error(err.response.data.message);
        this.setState({
          submitState: "Create location",
        });
      });
  };

  render() {
    const { visible, confirmLoading } = this.state;

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Create new Location
        </Button>
        <Modal
          title="New Location"
          visible={visible}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
          footer={[
            <Button
              type="primary"
              form="new-location-form"
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
            id="new-location-form"
            name="new-location"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.handleFormSubmit}
          >
            <Form.Item
              rules={[
                { required: true, message: "Please input the location decor!" },
              ]}
            >
              <Input
                placeholder="decor"
                name="decor"
                onChange={this.handleChange}
                value={this.state.decor}
              />
            </Form.Item>
            <Form.Item>
              <Input
                type="text"
                name="locale"
                value={this.state.locale}
                onChange={this.handleChange}
                placeholder="locale"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default NewLocation;
