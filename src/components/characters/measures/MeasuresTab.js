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

import instance from "../../../instance";
import {
  EditOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

class MeasuresTab extends Component {
  state = {
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
    project: this.props.projId,
    character: this.props.charId,
  };

  handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({
        [name]: value,
      });
    };

  render() {
    const { disabledInput } = this.props;
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

    return (
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
  }
}

export default MeasuresTab;
