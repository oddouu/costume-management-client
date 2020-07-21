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
import MeasuresTab from "./measures/MeasuresTab";

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
    key: "tab1",
    heightMeasures: "",
    shouldersMeasures: "",
    chestMeasures: "",
    waistMeasures: "",
    hipsMeasures: "",
    armMeasures: "",
    legMeasures: "",
    unitMeasure: "",
    shirtSize: "",
    coatSize: "",
    trousersSize: "",
    shoeSize: "",
    suitSize: "",
    braSize: "",
    measId: ""
  };

  tabList = [
    {
      key: "tab1",
      tab: "Character Overview",
    },
    {
      key: "tab2",
      tab: "Measures",
    },
  ];

  getCharacterInfo = () => {
    const projId = this.props.character.project;
    const charId = this.props.character._id;

    instance
      .get(`/projects/${projId}/characters/${charId}`)
      .then((response) => {
        console.log("CHARACTER INFO: ", response.data);
        const {
          characterName,
          actorName,
          age,
          imageUrl,
          numberOfCostumes,
          project,
          charId: _id,
        } = response.data;

        this.setState({
          characterName,
          actorName,
          age,
          imageUrl,
          numberOfCostumes,
          project,
          charId: _id,
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
    console.log("MEASID", this.state.measId)
    if (this.state.key === "tab1") {
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
    } else {
      const {
        heightMeasures,
        shouldersMeasures,
        chestMeasures,
        waistMeasures,
        hipsMeasures,
        armMeasures,
        legMeasures,
        unitMeasure,
        shirtSize,
        coatSize,
        trousersSize,
        shoeSize,
        suitSize,
        braSize,
        measId,
        _id,
        project,
      } = this.state;

      instance
        .put(`/projects/${project}/characters/${_id}/measures/`, {
          heightMeasures,
          shouldersMeasures,
          chestMeasures,
          waistMeasures,
          hipsMeasures,
          armMeasures,
          legMeasures,
          unitMeasure,
          shirtSize,
          coatSize,
          trousersSize,
          shoeSize,
          suitSize,
          braSize,
        })
        .then((response) => {
          console.log("EDIT RESPONSE", response);
          message.success({
            content: "measure information updated",
          });
          // lift the state
          this.getMeasures();
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
    }
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

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({
      [type]: key,
    });

    if (this.state.key === "tab2") {
      this.getCharacterInfo();
    } else {
      this.getMeasures();
    }
  };

  getMeasures = () => {
    const projId = this.state.project;
    const charId = this.state._id;
    instance
      .get(`/projects/${projId}/characters/${charId}/measures`)
      .then((response) => {
        console.log("MEASURES: ", response.data);

        const {
          heightMeasures,
          shouldersMeasures,
          chestMeasures,
          waistMeasures,
          hipsMeasures,
          armMeasures,
          legMeasures,
          unitMeasure,
          shirtSize,
          coatSize,
          trousersSize,
          shoeSize,
          suitSize,
          braSize,
        } = this.state;

        if (response.data._id) {
          const {
            heightMeasures,
            shouldersMeasures,
            chestMeasures,
            waistMeasures,
            hipsMeasures,
            armMeasures,
            legMeasures,
            unitMeasure,
            shirtSize,
            coatSize,
            trousersSize,
            shoeSize,
            suitSize,
            braSize,
            measId: _id,
          } = response.data;

          this.setState({
            heightMeasures,
            shouldersMeasures,
            chestMeasures,
            waistMeasures,
            hipsMeasures,
            armMeasures,
            legMeasures,
            unitMeasure,
            shirtSize,
            coatSize,
            trousersSize,
            shoeSize,
            suitSize,
            braSize,
            measId: _id,
          });
        } else {
          instance
            .post(`/projects/${projId}/characters/${charId}/measures`, {
              heightMeasures,
              shouldersMeasures,
              chestMeasures,
              waistMeasures,
              hipsMeasures,
              armMeasures,
              legMeasures,
              unitMeasure,
              shirtSize,
              coatSize,
              trousersSize,
              shoeSize,
              suitSize,
              braSize,
            })
            .then((response) => {
              console.log("NEW MEASURES: ", response.data);
              const {
                heightMeasures,
                shouldersMeasures,
                chestMeasures,
                waistMeasures,
                hipsMeasures,
                armMeasures,
                legMeasures,
                unitMeasure,
                shirtSize,
                coatSize,
                trousersSize,
                shoeSize,
                suitSize,
                braSize,
              } = response.data.newMeasures;

              this.setState({
                heightMeasures,
                shouldersMeasures,
                chestMeasures,
                waistMeasures,
                hipsMeasures,
                armMeasures,
                legMeasures,
                unitMeasure,
                shirtSize,
                coatSize,
                trousersSize,
                shoeSize,
                suitSize,
                braSize,
                measId: response.data.newMeasures._id,
              });

              console.log("MEASURES(AFTER): ", this.state.measId);

            });
        }
      });
  };

  render() {
    const {
      heightMeasures,
      shouldersMeasures,
      chestMeasures,
      waistMeasures,
      hipsMeasures,
      armMeasures,
      legMeasures,
      unitMeasure,
      shirtSize,
      coatSize,
      trousersSize,
      shoeSize,
      suitSize,
      braSize,
    } = this.state;
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
          <Link to={`/projects/${project}/characters/${_id}/costumes`}>
            Go to costumes
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/projects/${project}/scenes`}>Go to scenes</Link>
        </Menu.Item>
      </Menu>
    );

    const overview = (
      <div>
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
        <Form style={{ marginTop: "20px" }}>
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
      </div>
    );

    const measures = (
      <Form>
        <Form.Item label="heightMeasures">
          <Input
            value={heightMeasures}
            name="heightMeasures"
            type="number"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="shouldersMeasures">
          <Input
            value={shouldersMeasures}
            name="shouldersMeasures"
            type="number"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="chestMeasures">
          <Input
            value={chestMeasures}
            name="chestMeasures"
            type="number"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>

        <Form.Item label="waistMeasures">
          <Input
            value={waistMeasures}
            name="waistMeasures"
            type="number"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="hipsMeasures">
          <Input
            value={hipsMeasures}
            name="hipsMeasures"
            type="number"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="armMeasures">
          <Input
            value={armMeasures}
            name="armMeasures"
            type="number"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="legMeasures">
          <Input
            value={legMeasures}
            name="legMeasures"
            type="number"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>

        {/* THESE ARE SELECTS */}
        <Form.Item label="unitMeasure">
          <Input
            value={unitMeasure}
            name="unitMeasure"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="shirtSize">
          <Input
            value={shirtSize}
            name="shirtSize"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="coatSize">
          <Input
            value={coatSize}
            name="coatSize"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="trousersSize">
          <Input
            value={trousersSize}
            name="trousersSize"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="shoeSize">
          <Input
            value={shoeSize}
            name="shoeSize"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="suitSize">
          <Input
            value={suitSize}
            name="suitSize"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
        <Form.Item label="braSize">
          <Input
            value={braSize}
            name="braSize"
            onChange={this.handleChange}
            disabled={disabledInput}
          />
        </Form.Item>
      </Form>
    );

    const contentList = {
      tab1: overview,
      tab2: measures,
    };
    return (
      <div>
        <Card
          hoverable
          style={{ width: 300, margin: 30 }}
          tabList={this.tabList}
          activeTabKey={this.state.key}
          onTabChange={(key) => {
            this.onTabChange(key, "key");
          }}
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
          {contentList[this.state.key]}
        </Card>
      </div>
    );
  }
}

export default CharacterCard;
