import React, { Component } from "react";
import instance from "../../instance";

import {
    Modal,
    Button,
    message,
    Form,
    Input,
} from "antd";

class NewCostume extends Component {
    state = {
        costumeNumber: 0,
        description: "",
        imageUrl: "",
        visible: false,
        responseFromAPI: false,
        submitState: "Create costume",
        loadings: [],
    };

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
            if (this.state.responseFromAPI) {
                this.setState({
                    costumeNumber: 0,
                    description: "",
                    imageUrl: "",
                });
                message.success({
                    content: "Success!",
                });

                this.setState({
                    visible: false,
                    submitState: "Create costume",
                });
            }
        }, 2000);
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
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    };

    handleFormSubmit = () => {
        let {
            costumeNumber,
            description,
            imageUrl
        } = this.state;

        const project = this.props.projId;
        const character = this.props.charId;

        const newCostume = {
            costumeNumber,
            description,
            imageUrl
        };

        instance
            .post(`/projects/${project}/characters/${character}/costumes`, newCostume)
            .then((response) => {
                this.setState({ submitState: "Creating costume..." });
                console.log("NEW COSTUME", response)
                //Lift the state
                this.props.refreshCostumes();
                this.setState({ responseFromAPI: true });

                this.enterLoading(0);
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    this.props.history.push("/login");
                }
                message.error(err.response.data.message);
                this.setState({
                    submitState: "Create costume",
                });
            });
    };

    render() {
        const { visible, confirmLoading } = this.state;

        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create new Costume
        </Button>
                <Modal
                    title="New Costume"
                    visible={visible}
                    onCancel={this.handleCancel}
                    confirmLoading={confirmLoading}
                    footer={[
                        <Button
                            type="primary"
                            form="new-costume-form"
                            key="submit"
                            htmlType="submit"
                            className="login-form-button"
                            loading={this.state.loadings[0]}
                            onClick={() => this.handleFormSubmit}
                        >
                            {this.state.submitState}
                        </Button>,
                    ]}
                >
                    <Form
                        id="new-costume-form"
                        name="new-costume"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.handleFormSubmit}
                    >
                        <Form.Item
                            rules={[
                                { required: true, message: "Please input the character name!" },
                            ]}
                        >
                            <Input
                                placeholder="costumeNumber"
                                name="costumeNumber"
                                onChange={this.handleChange}
                                value={this.state.costumeNumber}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                type="text"
                                name="description"
                                value={this.state.description}
                                onChange={this.handleChange}
                                placeholder="description"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="imageUrl"
                                value={this.state.imageUrl}
                                onChange={this.handleChange}
                                placeholder="imageUrl"
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default NewCostume;