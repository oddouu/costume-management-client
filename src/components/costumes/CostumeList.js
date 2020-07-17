import React, { Component } from "react";
import NewCostume from "./NewCostume";
import instance from "../../instance";
import { Link } from "react-router-dom";
import { Layout, List, Button } from "antd";
import CostumeCard from "./CostumeCard";

const { Content } = Layout;

class CharacterList extends Component {
    state = {};

    getAllCostumes = () => {
        const { params } = this.props.match;

        instance.get(`/projects/${params.projId}/characters/${params.charId}/costumes`).then((response) => {
            console.log("ALL COSTUMES", response);
            this.setState({
                costumes: response.data,
            });
        });
    };

    componentDidMount() {
        this.getAllCostumes();
    }

    render() {
        const { params } = this.props.match;
        return (
            <div>
                <Content key="new-costume-button">
                    <NewCostume
                        history={this.props.history}
                        key="new-costume"
                        refreshCostumes={this.getAllCostumes}
                        projId={params.projId}
                        charId={params.charId}
                    >
                        Create new Costume
          </NewCostume>
                    <Link to="/projects">
                        <Button>Go back to projects</Button>
                    </Link>
                </Content>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                    }}
                    dataSource={this.state.costumes}
                    renderItem={(costume) => (
                        <List.Item>
                            <CostumeCard
                                key={costume._id + "Card"}
                                costume={{ ...costume }}
                                projId={params.projId}
                                charId={params.charId}
                                refreshCostumes={this.getAllCostumes}
                                history={this.props.history}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default CharacterList;
