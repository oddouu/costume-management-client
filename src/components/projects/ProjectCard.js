import React, { Component } from "react";
import { Card, Form, Input, Popconfirm, message } from "antd";

import instance from "../../instance";
import {
  EditOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

class ProjectCard extends Component {
  state = {
    title: "",
    date: "",
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
    this.setState({
      title: this.props.project.title,
      date: this.props.project.date,
      movieDirectorName: this.props.project.movieDirectorName,
      scriptWriter: this.props.project.scriptWriter,
      productionName: this.props.project.productionName,
      numberOfCharacters: this.props.project.numberOfCharacters,
      numberOfScenes: this.props.project.numberOfScenes,
      _id: this.props.project._id,
    });
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

  handleVisibleChange = visiblePopConfirm => {
    if (!visiblePopConfirm) {
      this.setState({ visiblePopConfirm });
      return;
    }
    // Determining condition before show the popconfirm.
    console.log(this.state.condition);
    if (this.state.disabledInput) {

    } else {
      this.setState({ visiblePopConfirm }); // show the popconfirm
    }
  };
  
  handleEditSubmit = () => {
    const {
      _id,
      title,
      date,
      movieDirectorName,
      scriptWriter,
      productionName,
    } = this.state;
    instance
      .put(`/projects/${_id}`, {
        title,
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
        this.props.refreshAllProjects();
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
        this.props.refreshAllProjects();
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
    return (
      <div>
        <Card
          hoverable
          style={{ width: 300, marginBottom: "5rem" }}
          cover={
            <a
              href={`/projects/${_id}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{
                  marginRight: "auto",
                  marginLeft: "auto",
                  objectFit: "cover",
                }}
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            </a>
          }
          actions={[
            <EditOutlined key="edit" onClick={this.enableEdit} />,
            <Popconfirm
              title="Are you really sure you want to delete this project?"
              onConfirm={this.handleDeleteSubmit}
              okText="Yes"
              cancelText="No"
              icon={<ExclamationCircleOutlined />}
              style={{ color: "red" }}
            >
              <DeleteOutlined key="delete" />,
            </Popconfirm>,

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
              />
            </Popconfirm>,
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
