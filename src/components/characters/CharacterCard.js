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
import MeasuresTab from "./measures/MeasuresTab";
import { FormInstance } from "antd/lib/form";
import UploadImage from "../images/UploadImage";

const { Option } = Select;

class CharacterCard extends Component {
  state = {
    characterName: "",
    actorName: "",
    age: "",
    imageUrl: "",
    numberOfCostumes: 0,
    project: "",
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
    measId: "",
    charId: "",
    cmAfter: true,
    cmBefore: true,
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
    const charId = this.props.charId;

    instance
      .get(`/projects/${projId}/characters/${charId}`)
      .then((response) => {
        console.log("CHARACTER INFO: ", response.data);
        const {
          characterName,
          actorName,
          age,
          numberOfCostumes,
          project,
          image
        } = response.data;

        const charId = response.data._id

        if (image) {
          const { imageUrl } = image;
          if (imageUrl) {
            this.setState({
              imageUrl,
            });
            console.log("IMAGEURL",this.state.imageUrl)
          }
        }


        this.setState({
          characterName,
          actorName,
          age,
          numberOfCostumes,
          project,
          charId
        });
      });
  };

  componentDidMount() {
    this.getCharacterInfo();
    console.log("CHARID", this.state.charId)
    // this.props.character &&
    //   this.setState({
    //     characterName: this.props.character.characterName,
    //     actorName: this.props.character.actorName,
    //     age: this.props.character.age,
    //     imageUrl: this.props.character.imageUrl,
    //     numberOfCostumes: this.props.character.numberOfCostumes,
    //     project: this.props.character.project,
    //     _id: this.props.character._id,
    //   });
    // console.log("CHARACTER", this.props.character);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSelectChange = (selectedValue, object) => {
    // {value: "unitMeasure", label:"in", key: "unitMeasure"}
    const name = object.children[0].props.name;

    this.setState({
      [name]: selectedValue,
    });
    //     const name = selectedOption.value;
    //     const value = selectedOption.label;
    //     console.log(name, value)
    //     this.setState({
    //       [name] : value
    //  })
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
    console.log("MEASID", this.state.measId);
    if (this.state.key === "tab1") {
      console.log("TAB1")
      const { charId, characterName, actorName, age, project } = this.state;

      console.log("PUT REQ", `/projects/${project}/characters/${charId}`);
      instance
        .put(`/projects/${project}/characters/${charId}`, {
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
            content: "unauthorized",
          });
        });
    } else if (this.state.key === 'tab2') {
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
        charId,
        project,
      } = this.state;

      instance
        .put(`/projects/${project}/characters/${charId}/measures/`, {
          heightMeasures, // .getFieldValue(value)

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
    const { charId, project } = this.state;

    instance
      .delete(`/projects/${project}/characters/${charId}`)
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
      charId,
      disabledInput,
      visiblePopConfirm,
    } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>
          <Link to={`/projects/${project}/characters/${charId}/costumes`}>
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
      <div className="image-wrapper">

        <UploadImage  staticImageUrl={imageUrl} projId={project} charId={charId} />
      </div>
        {/* <a
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
        </a> */}

        <div className="form-parent">

        
        <Form style={{ marginTop: "20px" }} className="card-form">
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
      </div>
    );

    const measures = (
      <div className="form-parent">
        <Form name="control-ref" className="card-form">
          <Form.Item label="unitMeasure">
            <Select
              // labelInValue
              value={unitMeasure}
              onSelect={this.handleSelectChange}
              name="unitMeasure"
              disabled={disabledInput}
            >
              <Option value="cm" key="cm">
                <span name="unitMeasure"></span>cm
              </Option>
              <Option value="in" key="in">
                <span name="unitMeasure"></span>in
              </Option>
            </Select>
          </Form.Item>

          <Form.Item label="heightMeasures">
            <Input
              value={heightMeasures}
              name="heightMeasures"
              type="number"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
            <span>{this.state.unitMeasure}</span>
          </Form.Item>
          <Form.Item label="shouldersMeasures">
            <Input
              value={shouldersMeasures}
              name="shouldersMeasures"
              type="number"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
            <span>{this.state.unitMeasure}</span>
          </Form.Item>
          <Form.Item label="chestMeasures">
            <Input
              value={chestMeasures}
              name="chestMeasures"
              type="number"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
            <span>{this.state.unitMeasure}</span>
          </Form.Item>

          <Form.Item label="waistMeasures">
            <Input
              value={waistMeasures}
              name="waistMeasures"
              type="number"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
            <span>{this.state.unitMeasure}</span>
          </Form.Item>
          <Form.Item label="hipsMeasures">
            <Input
              value={hipsMeasures}
              name="hipsMeasures"
              type="number"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
            <span>{this.state.unitMeasure}</span>
          </Form.Item>
          <Form.Item label="armMeasures">
            <Input
              value={armMeasures}
              name="armMeasures"
              type="number"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
            <span>{this.state.unitMeasure}</span>
          </Form.Item>
          <Form.Item label="legMeasures">
            <Input
              value={legMeasures}
              name="legMeasures"
              type="number"
              onChange={this.handleChange}
              disabled={disabledInput}
            />
            <span>{this.state.unitMeasure}</span>
          </Form.Item>

          {/* THESE ARE SELECTS */}

          <Form.Item label="shirtSize">
            <Select
              value={shirtSize}
              name="shirtSize"
              key="shirtSize"
              onChange={this.handleSelectChange}
              disabled={disabledInput}
            >
              <Option value="N/A" key="N/A">
                <span name="shirtSize"></span>N/A
              </Option>
              <Option value="XS" key="XS">
                <span name="shirtSize"></span>XS
              </Option>
              <Option value="S" key="S">
                <span name="shirtSize"></span>S
              </Option>
              <Option value="M" key="M">
                <span name="shirtSize"></span>M
              </Option>
              <Option value="L" key="L">
                <span name="shirtSize"></span>L
              </Option>
              <Option value="XL" key="XL">
                <span name="shirtSize"></span>XL
              </Option>
              <Option value="XXL" key="XXL">
                <span name="shirtSize"></span>XXL
              </Option>
              <Option value="XXXL" key="XXXL">
                <span name="shirtSize"></span>XXXL
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="coatSize">
            <Select
              value={coatSize}
              name="coatSize"
              key="coatSize"
              onChange={this.handleSelectChange}
              disabled={disabledInput}
            >
              <Option value="N/A" key="N/A">
                <span name="coatSize"></span>N/A
              </Option>
              <Option value="XS" key="XS">
                <span name="coatSize"></span>XS
              </Option>
              <Option value="S" key="S">
                <span name="coatSize"></span>S
              </Option>
              <Option value="M" key="M">
                <span name="coatSize"></span>M
              </Option>
              <Option value="L" key="L">
                <span name="coatSize"></span>L
              </Option>
              <Option value="XL" key="XL">
                <span name="coatSize"></span>XL
              </Option>
              <Option value="XXL" key="XXL">
                <span name="coatSize"></span>XXL
              </Option>
              <Option value="XXXL" key="XXXL">
                <span name="coatSize"></span>XXXL
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="trousersSize">
            <Select
              value={trousersSize}
              name="trousersSize"
              key="trousersSize"
              onChange={this.handleSelectChange}
              disabled={disabledInput}
            >
              <Option value="N/A" key="N/A">
                <span name="trousersSize"></span>N/A
              </Option>
              <Option value="XS" key="XS">
                <span name="trousersSize"></span>XS
              </Option>
              <Option value="S" key="S">
                <span name="trousersSize"></span>S
              </Option>
              <Option value="M" key="M">
                <span name="trousersSize"></span>M
              </Option>
              <Option value="L" key="L">
                <span name="trousersSize"></span>L
              </Option>
              <Option value="XL" key="XL">
                <span name="trousersSize"></span>XL
              </Option>
              <Option value="XXL" key="XXL">
                <span name="trousersSize"></span>XXL
              </Option>
              <Option value="XXXL" key="XXXL">
                <span name="trousersSize"></span>XXXL
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="shoeSize">
            <Select
              value={shoeSize}
              name="shoeSize"
              key="shoeSize"
              onChange={this.handleSelectChange}
              disabled={disabledInput}
            >
              <Option value="N/A" key="N/A">
                <span name="shoeSize"></span>N/A
              </Option>
              <Option value="XS" key="XS">
                <span name="shoeSize"></span>XS
              </Option>
              <Option value="S" key="S">
                <span name="shoeSize"></span>S
              </Option>
              <Option value="M" key="M">
                <span name="shoeSize"></span>M
              </Option>
              <Option value="L" key="L">
                <span name="shoeSize"></span>L
              </Option>
              <Option value="XL" key="XL">
                <span name="shoeSize"></span>XL
              </Option>
              <Option value="XXL" key="XXL">
                <span name="shoeSize"></span>XXL
              </Option>
              <Option value="XXXL" key="XXXL">
                <span name="shoeSize"></span>XXXL
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="suitSize">
            <Select
              value={suitSize}
              name="suitSize"
              key="suitSize"
              onChange={this.handleSelectChange}
              disabled={disabledInput}
            >
              <Option value="N/A" key="N/A">
                <span name="suitSize"></span>N/A
              </Option>
              <Option value="XS" key="XS">
                <span name="suitSize"></span>XS
              </Option>
              <Option value="S" key="S">
                <span name="suitSize"></span>S
              </Option>
              <Option value="M" key="M">
                <span name="suitSize"></span>M
              </Option>
              <Option value="L" key="L">
                <span name="suitSize"></span>L
              </Option>
              <Option value="XL" key="XL">
                <span name="suitSize"></span>XL
              </Option>
              <Option value="XXL" key="XXL">
                <span name="suitSize"></span>XXL
              </Option>
              <Option value="XXXL" key="XXXL">
                <span name="suitSize"></span>XXXL
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="braSize">
            <Select
              value={braSize}
              name="braSize"
              key="braSize"
              onChange={this.handleSelectChange}
              disabled={disabledInput}
            >
              <Option value="N/A" key="N/A">
                <span name="braSize"></span>N/A
              </Option>
              <Option value="XS" key="XS">
                <span name="braSize"></span>XS
              </Option>
              <Option value="S" key="S">
                <span name="braSize"></span>S
              </Option>
              <Option value="M" key="M">
                <span name="braSize"></span>M
              </Option>
              <Option value="L" key="L">
                <span name="braSize"></span>L
              </Option>
              <Option value="XL" key="XL">
                <span name="braSize"></span>XL
              </Option>
              <Option value="XXL" key="XXL">
                <span name="braSize"></span>XXL
              </Option>
              <Option value="XXXL" key="XXXL">
                <span name="braSize"></span>XXXL
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    );

    const contentList = {
      tab1: overview,
      tab2: measures,
    };
    return (
      <div style={{ width: "512px", maxWidth: "512px", marginBottom: "20px" }}>
        <Card
          hoverable
          
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
