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
  Descriptions,
  Select,
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
import SelectScene from "./SelectScene";

class CostumeCard extends Component {
  state = {
    costumeNumber: "",
    description: "",
    images: [],
    character: "",
    scenes: [],
    project: "",
    _id: "",
    allScenes: [],
    key: "info",
    disabledInput: true,
    visiblePopConfirm: false,
    editIconColor: "rgba(0, 0, 0, 0.45)",
  };

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({
      [type]: key,
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

  getAllScenes = () => {
    const projId = this.props.projId;

    instance.get(`/projects/${projId}/scenes`).then((response) => {
      console.log("ALL SCENES", response.data);
      this.setState({
        allScenes: response.data,
      });
    });
  };

  getCostumeInfo = () => {
    this.getAllScenes();

    const projId = this.props.projId;
    const charId = this.props.charId;
    const costId = this.props.costume._id;

    instance
      .get(`/projects/${projId}/characters/${charId}/costumes/${costId}`)
      .then((response) => {
        const {
          costumeNumber,
          description,
          images,
          character,
          project,
          scenes,
          _id,
        } = response.data;

        const costume = response.data;

        console.log("COSTUME INFO", response.data);
        this.setState({
          costumeNumber,
          description,
          images,
          character,
          project,
          scenes,
          _id,
          costume
        });

        // GET ALL SCENES OF THE PROJECT AS WELL
      });
  };

  componentDidMount() {
    this.getCostumeInfo();
  }

  handleDeleteSubmit = () => {
    const { _id, character, project } = this.state;

    instance
      .delete(`/projects/${project}/characters/${character}/costumes/${_id}`)
      .then((response) => {
        console.log(response);
        message.success({
          content: "costume deleted successfully",
        });
        // lift the state
        this.props.refreshCostumes();
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

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
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
    const { _id, character, costumeNumber, description, project } = this.state;

    instance
      .put(`/projects/${project}/characters/${character}/costumes/${_id}`, {
        costumeNumber,
        description,
      })
      .then((response) => {
        console.log("COSTUME UPDATED:", response.data);
        message.success({
          content: "costume information updated",
        });
        // lift the state
        this.props.refreshCostumes();
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

  render() {
    const {
      costumeNumber,
      description,
      scenes,
      character,
      project,
      _id,
      disabledInput,
      visiblePopConfirm,
      allScenes,
      images
    } = this.state;
    const tabList = [
      {
        key: "info",
        tab: "info",
      },
      {
        key: "scenes",
        tab: "scenes",
      },
    ];

    const scene = <div></div>;


 

    const info = (
      <div>
        <Link
          to={`/projects/${project}/characters/${character}/costumes/${_id}`}
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
              width: "100%"
            }}
            alt="example"
            src={images[0] ? images[0].imageUrl : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
          />
        </Link>

        <Form>
          <Form.Item label="costumeNumber">
            <Input
              value={costumeNumber}
              name="costumeNumber"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
          </Form.Item>
          <Form.Item label="description">
            <Input
              value={description}
              name="description"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
          </Form.Item>
        </Form>
        <Descriptions>
          <Descriptions.Item label="appears in scenes">
            <SelectScene
              key={_id + "sceneNumber"}
              options={allScenes}
              costId={_id}
              charId={character}
              projId={project}
              selectedItems={this.state.scenes}
              refreshCostume={this.getCostumeInfo}
              showing="sceneNumber"
              disabled={disabledInput}
            />
          </Descriptions.Item>
          {/* <Descriptions.Item label="appears in story days">
            {scenes.map((scene) => {
              return (
                <div>
                  <Descriptions.Item>{scene.storyDayNumber}, </Descriptions.Item>

                </div>
              );
            })}
          </Descriptions.Item> */}
        </Descriptions>
      </div>
    );

    const contentList = {
      info,
      scenes: <p>content</p>,
    };

    return (
      <div>
        <Card
          hoverable
          // style={{ width: 300, margin: 30 }}
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={(key) => {
            this.onTabChange(key, "key");
          }}
          actions={[
            <Tooltip title="enable edits">
              <EditOutlined key="edit" onClick={this.enableEdit} />
            </Tooltip>,

            <Tooltip title="delete costume">
              <Popconfirm
                title="Are you really sure you want to delete this costume?"
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
          {contentList[this.state.key]}
        </Card>
      </div>
    );
  }
}

export default CostumeCard;
