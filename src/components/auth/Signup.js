import React, { Component } from "react";
import AuthService from "./auth-service";
import "./Login.css";
import { Modal, Button, Form, Input, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
class Signup extends Component {
  state = {
    username: "",
    password: "",
    submitState: "Sign up",
    visible: false,
    loadings: [],
    authenticated: false,
    error: ""
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
    this.props.history.push("/");
  };

  componentDidMount() {
    this.showModal();
  }

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
      if (this.state.authenticated) {
        this.setState({ username: "", password: "" });
        message.success({
          content: "Success!",
        });
        this.props.history.push("/projects");
      } else {
        message.error({
          content: `${this.state.error}`
        });
        this.setState({
          submitState: "Sign up"
        })
      }
    }, 2000);
  };
  service = new AuthService();
  handleFormSubmit = () => {
    
    const username = this.state.username;
    const password = this.state.password;
    this.service
      .signup(username, password)
      .then((response) => {
        console.log(response);
        this.setState({ submitState: "Creating account...", authenticated: true });
          // set the whole application with the user that just logged in - lifting up the state by using setCurrentUser function in the parent component
          this.props.setCurrentUser(response);
          localStorage.setItem("loggedin", true);

        this.enterLoading(0);
      });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div>
        <Modal
          className="modal-login"
          title="Sign up"
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={[
            <Button
              type="primary"
              form="login-form"
              key="submit"
              htmlType="submit"
              className="login-form-button"
              loading={this.state.loadings[0]}
              onClick={() => this.handleFormSubmit}
            >
              {this.state.submitState}
            </Button>,
            <div key="sign-up" className="login-form-button">
              Or <a href="/login">login</a>
            </div>,
          ]}
        >
          <Form
            id="login-form"
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.handleFormSubmit}
          >
            <Form.Item
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                name="username"
                onChange={this.handleChange}
                value={this.state.username}
              />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Password"
              />
            </Form.Item>
            
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Signup;
