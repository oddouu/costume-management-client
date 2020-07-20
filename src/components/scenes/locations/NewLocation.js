import React, { Component } from "react";
import instance from "../../../instance";

import { Modal, Button, message, Form, Input } from "antd";

class NewLocation extends Component {
  state = {
    newDecor: "",
    newLocale: "",
    visible: false,
    responseFromAPI: false,
    submitState: "Create location",
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
          newDecor: "",
          newLocale: "",
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
    console.log("EVENT TARGET", e.target);
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = () => {
    let { newDecor, newLocale } = this.state;

    const project = this.props.projId;

    const newLocation = {
      newDecor,
      newLocale,
    };

    instance
      .post(`/projects/${project}/locations`, newLocation)
      .then((response) => {
        this.setState({ submitState: "Creating location..." });
        console.log("NEW LOCATION", response.data);
        //Lift the state
        this.props.refreshLocations();
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
    const { visible } = this.state;

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Create new Location
        </Button>
        <Modal
          title="New Location"
          visible={visible}
          onCancel={this.handleCancel}
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
            <Form.Item>
              <Input
                placeholder="newDecor"
                name="newDecor"
                onChange={this.handleChange}
                value={this.state.newDecor}
              />
            </Form.Item>
            <Form.Item>
              <Input
                type="text"
                name="newLocale"
                value={this.state.newLocale}
                onChange={this.handleChange}
                placeholder="newLocale"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default NewLocation;
