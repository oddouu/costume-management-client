import React, { useContext, useState, useEffect, useRef, Component } from "react";
import NewScene from "./NewScene";
import instance from "../../instance";

import "./SceneList.css";

import {
  Layout,
  List,
  Skeleton,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Button,
} from "antd";

const { Content } = Layout;


const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


class SceneList extends Component {
  state = {
  };

  columns = [
    {
      title: 'sceneNumber',
      dataIndex: 'sceneNumber',
      width: "30%",
      editable: true,
    },
    {
      title: 'timeOfDay',
      dataIndex: 'timeOfDay',
      width: "30%",
      editable: true,
    },

    {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) =>
      this.state.scenes.length >= 1 ? (
        <Popconfirm title="sure?" onConfirm={() => this.handleDelete(record.key)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null,
    },
  ];

  getAllScenes = () => {
    const { params } = this.props.match;
    console.log("PARAMS", params.projId);
    instance.get(`/projects/${params.projId}/scenes`).then((response) => {
      console.log("ALL SCENES", response);

      for (let i = 0; i < response.data.length; i++) {
        response.data[i].key = i;
      }
      this.setState({
        scenes: response.data,
        count: response.data.length - 1
      });
    });
  };

  handleDelete = key => {
    const scenes = [...this.state.scenes];
    this.setState({
      scenes: scenes.filter(item => item.key !== key),
    })
  }

  handleAdd = () => {
    const {count,scenes} = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`
    };
    this.setState({
      scenes: [...scenes, newData],
      count: count +1
    })
  }

  handleSave = row => {
    const newData = [...this.state.scenes];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {...item, ...row});
    this.setState({
      scenes: newData
    })
  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.getAllScenes();
    }
  }

 

  render() {
    const { params } = this.props.match;
    const {scenes} = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if(!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
       <Button
       onClick={this.handleAdd}
       type="primary"
       style={{marginBottom: 16,}}
       >
         Add a row
       </Button>

       <Table
        components={components}
        rowClassName={()=>'editable-row'}
        bordered
        dataSource={scenes}
        columns={columns}
        />
        {/* <Content key="new-scene-button">
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
          renderItem={(item) => (
            <List.Item actions={[<a key="list-loadmore-edit">edit</a>]}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta title={item.sceneNumber} />
                <div>content</div>
              </Skeleton>
            </List.Item>
          )}
        /> */}
      </div>
    );
  }
}

export default SceneList;
