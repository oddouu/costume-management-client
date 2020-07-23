import React, { Component } from "react";
import NewCharacter from "./NewCharacter";
import instance from "../../instance";
import { Link } from "react-router-dom";
import { Layout, List, Button } from "antd";
import CharacterCard from "./CharacterCard";

const { Content } = Layout;

class CharacterList extends Component {
  state = {};

  getAllCharacters = () => {
    const { params } = this.props.match;
    console.log("PARAMS", params.projId);
    instance.get(`/projects/${params.projId}/characters`).then((response) => {
      console.log("ALL CHARACTERS", response);
      this.setState({
        characters: response.data,
      });
    });
  };

  componentDidMount() {
    this.getAllCharacters();
  }

  render() {
    const { params } = this.props.match;
    return (
      <div>
        <Content key="new-character-button">
          <NewCharacter
            history={this.props.history}
            key="new-character"
            refreshCharacters={this.getAllCharacters}
            projId={params.projId}
          >
            Create new Character
          </NewCharacter>
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
          dataSource={this.state.characters}
          renderItem={(character) => (
            <List.Item>
              <CharacterCard
                key={character._id + "Card"}
                character={{ ...character }}
                charId={character._id}
                refreshCharacters={this.getAllCharacters}
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
