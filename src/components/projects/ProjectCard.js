import React, { Component } from "react";
import {
  Card,
  Form,
  Input,
  Popconfirm,
  message,
  Menu,
  Dropdown,
  Tooltip,
} from "antd";

import instance from "../../instance";
import {
  EditOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

class ProjectCard extends Component {
  state = {
    title: "",
    date: "",
    description: "",
    movieDirectorName: "",
    scriptWriter: "",
    productionName: "",
    numberOfCharacters: "",
    numberOfScenes: "",
    _id: "",
    disabledInput: true,
    visiblePopConfirm: false,
    editIconColor: "rgba(0, 0, 0, 0.45)",
  };

  componentDidMount() {
    this.props.project &&
      this.setState({
        title: this.props.project.title,
        description: this.props.project.description,
        date: this.props.project.date,
        movieDirectorName: this.props.project.movieDirectorName,
        scriptWriter: this.props.project.scriptWriter,
        productionName: this.props.project.productionName,
        numberOfCharacters: this.props.project.numberOfCharacters,
        numberOfScenes: this.props.project.numberOfScenes,
        _id: this.props.project._id,
      });

    console.log("PROJECT", this.props.project);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  enableEdit = () => {
    if (!this.state.disabledInput) {
      this.setState({
        disabledInput: !this.state.disabledInput,
        editIconColor: "rgba(0, 0, 0, 0.45)",
      });
    } else {
      this.setState({
        disabledInput: !this.state.disabledInput,
        editIconColor: "#1890ff",
      });
    }
  };

  handleVisibleChange = (visiblePopConfirm) => {
    if (!visiblePopConfirm) {
      this.setState({ visiblePopConfirm });
      return;
    }
    // Determining condition before show the popconfirm.
    if (!this.state.disabledInput) {
      this.setState({ visiblePopConfirm }); // show the popconfirm
    }
  };

  handleEditSubmit = () => {
    const {
      _id,
      title,
      description,
      date,
      movieDirectorName,
      scriptWriter,
      productionName,
    } = this.state;
    instance
      .put(`/projects/${_id}`, {
        title,
        description,
        date,
        movieDirectorName,
        scriptWriter,
        productionName,
      })
      .then((response) => {
        console.log(response);
        message.success({
          content: "project information updated",
        });
        // lift the state
        this.props.refreshProjects();
        this.setState({
          disabledInput: !this.state.disabledInput,
        });
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.props.history.push("/login");
        }
        message.error({
          content: err.response.data.message,
        });
      });
  };

  handleDeleteSubmit = () => {
    const { _id } = this.state;

    instance
      .delete(`/projects/${_id}`)
      .then((response) => {
        console.log(response);
        message.success({
          content: "project deleted successfully",
        });
        // lift the state
        this.props.refreshProjects();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.props.history.push("/login");
        }
        message.error({
          content: err.response.data.message,
        });
      });
  };

  render() {
    const {
      title,
      description,
      date,
      movieDirectorName,
      scriptWriter,
      productionName,
      numberOfScenes,
      numberOfCharacters,
      _id,
      disabledInput,
      visiblePopConfirm,
    } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to={`/projects/${_id}/characters`}>Go to characters</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/projects/${_id}/scenes`}>Go to scenes</Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Card
          hoverable
          style={{ width: 300 }}
          cover={
            <img
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                objectFit: "cover",
              }}
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <Dropdown overlay={menu} placement="bottomCenter">
              <EllipsisOutlined
                key="ellipsis"
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>,

            <Tooltip title="enable edits">
              <EditOutlined key="edit" onClick={this.enableEdit} />
            </Tooltip>,

            <Tooltip title="delete project">
              <Popconfirm
                title="Are you really sure you want to delete this project?"
                onConfirm={this.handleDeleteSubmit}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined
                  key="delete-icon"
                  onClick={(e) => e.preventDefault()}
                />
              </Popconfirm>
            </Tooltip>,

            <Tooltip title="submit edits">
              <Popconfirm
                title="Do you want to submit your changes?"
                onConfirm={this.handleEditSubmit}
                okText="Yes"
                cancelText="No"
                visible={visiblePopConfirm}
                onVisibleChange={this.handleVisibleChange}
              >
                <CheckOutlined
                  key="confirm"
                  style={{ color: this.state.editIconColor }}
                  onClick={(e) => e.preventDefault()}
                />
              </Popconfirm>
            </Tooltip>,
          ]}
        >
          <Form>
            <Form.Item label="Title">
              <Input
                value={title}
                name="title"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input
                value={description}
                name="description"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
            <Form.Item label="Director">
              <Input
                value={movieDirectorName}
                name="movieDirectorName"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
            <Form.Item label="Writer">
              <Input
                value={scriptWriter}
                name="scriptWriter"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
            <Form.Item label="Date">
              <Input
                type="date"
                value={date}
                name="date"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
            <Form.Item label="Production">
              <Input
                value={productionName}
                name="productionName"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
            <Form.Item label="Number of Characters">
              <span>{numberOfCharacters}</span>
            </Form.Item>
            <Form.Item label="Number of Scenes">{numberOfScenes}</Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default ProjectCard;
