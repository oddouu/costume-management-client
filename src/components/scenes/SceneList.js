import React, { Component } from "react";
import NewScene from "./NewScene";
import instance from "../../instance";

import { Layout, List, Skeleton } from "antd";

const { Content } = Layout;

class SceneList extends Component {
  state = {};

  getAllScenes = () => {
    const { params } = this.props.match;
    console.log("PARAMS", params.projId);
    instance.get(`/projects/${params.projId}/scenes`).then((response) => {
      console.log("ALL SCENES", response);
      this.setState({
        scenes: response.data,
      });
    });
  };

  componentDidMount() {
    this.getAllScenes();
  }

  render() {
    const { params } = this.props.match;
    return (
      <div>
        <Content key="new-scene-button">
          <NewScene
            history={this.props.history}
            key="new-scene"
            refreshScenes={this.getAllScenes}
            projId={params.projId}
          />
        </Content>
        <List
         itemLayout="horizontal"
         dataSource={this.state.scenes}
         renderItem={item=> (
             <List.Item
             actions={[<a key="list-loadmore-edit">edit</a>]}
             >
                 <Skeleton avatar title={false} loading={item.loading} active>
                     <List.Item.Meta
                        title={item.sceneNumber}
                     />
                    <div>content</div>
                 </Skeleton>
                 </List.Item>
         )}
        />
      </div>
    );
  }
}

export default SceneList;
