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

class CharacterCard extends Component {
  state = {
    characterName: "",
    actorName: "",
    age: "",
    imageUrl: "",
    numberOfCostumes: 0,
    project: "",
    _id: "",
    disabledInput: true,
    visiblePopConfirm: false,
    editIconColor: "rgba(0, 0, 0, 0.45)",
  };

  getCharacterInfo = () => {
    const projId = this.props.character.project;
    const charId = this.props.character._id;

    instance.get(`/projects/${projId}/${charId}`).then((response) => {
      const {
        characterName,
        actorName,
        age,
        imageUrl,
        numberOfCostumes,
        project,
        _id,
      } = response.data;

      this.setState({
        characterName,
        actorName,
        age,
        imageUrl,
        numberOfCostumes,
        project,
        _id,
      });
    });
  };

  componentDidMount() {
    this.props.character &&
      this.setState({
        characterName: this.props.character.characterName,
        actorName: this.props.character.actorName,
        age: this.props.character.age,
        imageUrl: this.props.character.imageUrl,
        numberOfCostumes: this.props.character.numberOfCostumes,
        project: this.props.character.project,
        _id: this.props.character._id,
      });

    console.log("CHARACTER", this.props.character);
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
    const { _id, characterName, actorName, age, project } = this.state;

    console.log("PUT REQ", `/projects/${project}/characters/${_id}`);
    instance
      .put(`/projects/${project}/characters/${_id}`, {
        characterName,
        actorName,
        age,
      })
      .then((response) => {
        console.log("EDIT RESPONSE", response);
        message.success({
          content: "character information updated",
        });
        // lift the state
        this.props.refreshCharacters();
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
    const { _id, project } = this.state;

    instance
      .delete(`/projects/${project}/characters/${_id}`)
      .then((response) => {
        console.log(response);
        message.success({
          content: "character deleted successfully",
        });
        // lift the state
        this.props.refreshCharacters();
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
      project,
      actorName,
      characterName,
      age,
      numberOfCostumes,
      imageUrl,
      _id,
      disabledInput,
      visiblePopConfirm,
    } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href={`/projects/`}>
            Go to costumes
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href={`/projects/`}>
            Go to scenes
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Card
          hoverable
          style={{ width: 300, margin: 30 }}
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
            <Dropdown overlay={menu} placement="bottomCenter">
              <EllipsisOutlined
                key="ellipsis"
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>,

            <Tooltip title="enable edits">
              <EditOutlined key="edit" onClick={this.enableEdit} />
            </Tooltip>,

            <Tooltip title="delete character">
              <Popconfirm
                title="Are you really sure you want to delete this character?"
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
            <Form.Item label="actorName">
              <Input
                value={actorName}
                name="actorName"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
            <Form.Item label="characterName">
              <Input
                value={characterName}
                name="characterName"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
            <Form.Item label="Age">
              <Input
                value={age}
                name="age"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>

            <Form.Item label="Number of Costumes">
              <Input
                value={numberOfCostumes}
                name="numberOfCostumes"
                type="number"
                onChange={this.handleChange}
                disabled={disabledInput}
              />
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default CharacterCard;
