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
      <div
        style={{
          margin: "2rem 5rem 5rem 5rem",
          padding: "2rem 5rem 5rem 5rem",
          width: "100%",
        }}
      >
        <Content key="new-character-button" style={{ width: "100%", marginBottom: "20px", disply: "flex", flexDirection: "row" }}>
          <NewCharacter
            history={this.props.history}
            key="new-character"
            refreshCharacters={this.getAllCharacters}
            projId={params.projId}
          />

          <Link to="/projects">
            <Button>Go back to projects</Button>
          </Link>
        </Content>
        <List
          grid={{
            gutter: 1,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 2,
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
