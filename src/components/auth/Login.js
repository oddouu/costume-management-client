import React, { Component } from "react";
import AuthService from "./auth-service";
import "./Login.css";
import { Modal, Button, Form, Input, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

class Login extends Component {
  state = {
    username: "",
    password: "",
    submitState: "Log in",
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
        this.setState({ username: "", password: "" });
        message.success({
          content: "Success!",
        });
        this.props.history.push("/projects/5f09d2f4d47c1500176d58e8/scenes");
      } else {
        message.error({
          content: "Something went wrong, please try again.",
        });
        this.setState({
          submitState: "Log in"
        })
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
      console.log(response);
      this.setState({ submitState: "Logging in..." });
      if (response.status === 200) {
        // set the whole application with the user that just logged in - lifting up the state by using setCurrentUser function in the parent component
        this.props.setCurrentUser(response);
        this.setState({ authenticated: true });
      // } else {
      //   console.log(response)
       }
      this.enterLoading(0);
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;

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
              {this.state.submitState}
            </Button>,
            <div key="sign-up" className="login-form-button">
              Or <a href="/signup">register now!</a>
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

              <a className="login-form-forgot" href="/">
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
