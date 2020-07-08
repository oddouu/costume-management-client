import React, { Component } from "react";
import AuthService from "./auth-service";
import "./Login.css";
import { Modal, Button, Form, Input, Checkbox } from "antd";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";

class Login extends Component {
  state = {
    username: "",
    password: "",
    visible: false,
    loadings: [],
    authenticated: false,
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
        this.setState({ username: "", password: "", authenticated: true });
        this.props.history.push("/projects");
      }
    }, 2000);
  };

  service = new AuthService();

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = (e) => {
    const { username, password } = this.state;
    this.service.login(username, password).then((response) => {
      // set the whole application with the user that just logged in - lifting up the state by using setCurrentUser function in the parent component
      if (response) {
        this.props.setCurrentUser(response);
        this.setState({ authenticated: true });
      }
      this.enterLoading(0);
    });
  };

  render() {
    const { visible, confirmLoading, ModalText } = this.state;

    return (
      <div>
        <Modal
          className="modal-login"
          title="Log in"
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
              Log in
            </Button>,
            <div className="login-form-button">
              Or <a href="">register now!</a>
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
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Login;
