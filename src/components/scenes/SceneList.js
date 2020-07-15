import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  Component,
} from "react";
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
  state = {};

  columns = [
    {
      title: "sceneNumber",
      dataIndex: "sceneNumber",
      editable: true,
    },
    {
      title: "storyDayNumber",
      dataIndex: "storyDayNumber",
      editable: true,
    },
    {
      title: "timeOfDay",
      dataIndex: "timeOfDay",
      editable: true,
    },
    {
      title: "intExt",
      dataIndex: "intExt",
      editable: true,
    },
    {
      title: "description",
      dataIndex: "description",
      editable: true,
    },
    {
      title: "season",
      dataIndex: "season",
      editable: true,
    },

    {
      title: "operation",
      dataIndex: "operation",
      render: (text, record) =>
        this.state.scenes.length >= 1 ? (
          <div>
            <Popconfirm
              title="sure?"
              onConfirm={() => this.handleDelete(record)}
            >
              <Button>Delete</Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  getAllScenes = () => {
    const { params } = this.props.match;
    instance.get(`/projects/${params.projId}/scenes`).then((response) => {
      if (response.data.length) {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].key = i;
        }
      } else {
        response.data.length = 0;
      }
      this.setState({
        scenes: response.data,
        count: response.data.length,
      });
    });
  };

  handleDelete = (scene) => {
    instance
      .delete(`/projects/${scene.project}/scenes/${scene._id}`)
      .then((deletedScene) => {
        console.log("DELETED SCENE: ", deletedScene);
        this.getAllScenes();
      });
  };

  handleAdd = () => {
    const { count, scenes } = this.state;
    let sceneNumber;
    if (count) {
      sceneNumber = parseInt(scenes[count - 1].sceneNumber) + 1;
    } else {
      sceneNumber = 1;
    }
    // console.log("COUNT",parseInt(scenes[count-1].sceneNumber))
    const newData = {
      key: count,
      sceneNumber,
    };
   
     const { params } = this.props.match;
    instance
      .post(`/projects/${params.projId}/scenes`, newData)
      .then((newScene) => {
        console.log("CREATED SCENE: ", newScene);
        this.getAllScenes();
      })

  };

  handleSave = (editedScene) => {

    instance
      .put(`projects/${editedScene.project}/scenes/${editedScene._id}`, editedScene)
      .then(response => {
        console.log("EDITED SCENE: ", response)
        this.getAllScenes();
      })
  };

  componentDidMount() {
    if (this.props.currentUser) {
      this.getAllScenes();
    }
  }

  render() {
    const { params } = this.props.match;
    const { scenes } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
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
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>

        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={scenes}
          columns={columns}
        />
      </div>
    );
  }
}

export default SceneList;
