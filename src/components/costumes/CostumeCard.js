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
  Descriptions
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

class CostumeCard extends Component {
  state = {
    costumeNumber: "",
    description: "",
    imageUrl: "",
    character: "",
    project: "",
    _id: "",
    key: 'info'
  };

  onTabChange = (key, type) => {
    console.log(key,type);
    this.setState({
      [type]: key
    });
  };

  getCostumeInfo = () => {
    const projId = this.props.projId;
    const charId = this.props.charId;
    const costId = this.props.costume._id;

    instance
      .get(`/projects/${projId}/characters/${charId}/costumes/${costId}`)
      .then((response) => {
        const {
          costumeNumber,
          description,
          imageUrl,
          character,
          project,
          _id,
        } = response.data;

        console.log(response.data);
        this.setState({
          costumeNumber,
          description,
          imageUrl,
          character,
          project,
          _id,
        });
      });
  };

  componentDidMount() {
    this.props.costume && this.getCostumeInfo();
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

  render() {
    const { costumeNumber, description, imageUrl, character, project, _id } = this.state;
    const tabList = [
      {
        key: 'info',
        tab: 'info'
      },
      {
        key: 'scenes',
        tab: 'scenes'
      }
    ]
    
    const info = (
      <div>
        <Link
          href={`/projects/${project}/characters/${character}/costumes/${_id}`}
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
        </Link>
        <Descriptions title="Costume info">
          <Descriptions.Item label="costumeNumber">{costumeNumber}</Descriptions.Item>
          <Descriptions.Item label="description">{description}</Descriptions.Item>
        </Descriptions>
      </div>
    )
    
    const contentList = {
      info,
      scenes: <p>content</p>
    }


    return (
      <div>
        <Card
          hoverable
          // style={{ width: 300, margin: 30 }}
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={key => {
            this.onTabChange(key,'key');
          }}
          actions={[
            
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
          ]}
        >
         {contentList[this.state.key]}
        </Card>
      </div>
    );
  }
}

export default CostumeCard;
