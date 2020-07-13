import React, { Component } from "react";
import instance from "../../instance";

import {
    Modal,
    Button,
    message,
    Form,
    Input,
} from "antd";

class NewScene extends Component {
    state = {
        sceneNumber: "",
        timeOfDay: "",
        description: "",
        season: "",
        visible: false,
        responseFromAPI: false,
        submitState: "Create scene",
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
                    sceneNumber: "",
                    timeOfDay: "",
                    description: "",
                    season: "",
                });
                message.success({
                    content: "Success!",
                });

                this.setState({
                    visible: false,
                    submitState: "Create scene",
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
            sceneNumber,
            timeOfDay,
            description,
            season,
            
        } = this.state;

        const project = this.props.projId;
         

        const newScene = {
            sceneNumber,
            timeOfDay,
            description,
            season,
            project,
            
        };

        instance
            .post(`/projects/${project}/scenes`, newScene)
            .then((response) => {
                this.setState({ submitState: "Creating scene..." });
                console.log("NEW SCENE", response)
                //Lift the state
                this.props.refreshScenes();
                this.setState({ responseFromAPI: true });

                this.enterLoading(0);
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    this.props.history.push("/login");
                }
                message.error(err.response.data.message);
                this.setState({
                    submitState: "Create scene",
                });
            });
    };

    render() {
        const { visible, confirmLoading } = this.state;

        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create new Scene
        </Button>
                <Modal
                    title="New Scene"
                    visible={visible}
                    onCancel={this.handleCancel}
                    confirmLoading={confirmLoading}
                    footer={[
                        <Button
                            type="primary"
                            form="new-scene-form"
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
                        id="new-scene-form"
                        name="new-scene"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.handleFormSubmit}
                    >
                        <Form.Item
                            rules={[
                                { required: true, message: "Please input the Scene name!" },
                            ]}
                        >
                            <Input
                                placeholder="timeOfDay"
                                name="timeOfDay"
                                onChange={this.handleChange}
                                value={this.state.timeOfDay}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                type="text"
                                name="sceneNumber"
                                value={this.state.sceneNumber}
                                onChange={this.handleChange}
                                placeholder="sceneNumber"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="description"
                                value={this.state.description}
                                onChange={this.handleChange}
                                placeholder="description"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                name="season"
                                value={this.state.season}
                                onChange={this.handleChange}
                                placeholder="season"
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default NewScene;