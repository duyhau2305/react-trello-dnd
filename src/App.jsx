import { useState, useCallback } from "react";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// ant core
import {
  Avatar,
  Button,
  Modal,
  Input,
  Form,
  Select,
} from "antd";

// ant icons
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// components
import TrelloList from "./components/TrelloList";

// mocks
import { data } from "./data";

const { TextArea } = Input;
const { Option } = Select;

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

function App() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [todos, setTodos] = useState(data);

  const handleSubmit = (values) => {
    console.log("values: ", values);

    setConfirmLoading(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onDragEnd = (event) => {
    // the only one that is required
    const { source, destination, type } = event;

    if(!destination) return;

    // lists
    if(type === 'LIST') {
      const cloneLists = [...todos.columns];
      const columnSpliced = cloneLists.splice(source.index, 1)[0];
      cloneLists.splice(destination.index, 0, columnSpliced);
      setTodos(prevState => {
        return {
          ...prevState,
          columns: cloneLists
        }
      })
      return;
    }
    console.log('onDragEnd: ', {
      event
    })

    // card
    // same list
    if(source.droppableId === destination.droppableId) {
      const cards = [...todos.lists[source.droppableId].cards];
      const cardSpliced = cards.splice(source.index, 1)[0];
      cards.splice(destination.index, 0, cardSpliced);
      setTodos(prevState => {
        return {
          ...prevState,
          lists: {
            ...prevState.lists,
            [source.droppableId]: {
              ...prevState.lists[source.droppableId],
              cards
            }
          }
        }
      })
      return;
    }

    // different list
  }

  function handleAddList() {
    const listItem = {
      id: Date.now(),
      title: `List ${Date.now()}`,
      cards: [],
    }
    setTodos(prevState => {
      return {
        ...prevState,
        columns: [...prevState.columns, listItem.id],
        lists: {
          ...prevState.lists,
          [listItem.id]: listItem
        }
      }
    })
  }

  console.log('todos: ', todos)

  return (
    <>
      <header>
        <div className="header__container">
          <div className="header__logo" />
          <div className="header__right">
            <div className="header__avatar">
              <img src="/assets/images/avatar.png" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="container flex mt-2 px-2">
        <DragDropContext
          onDragEnd={onDragEnd}
        >
          <Droppable droppableId="lists" direction="horizontal" type="LIST">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                // style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                {...provided.droppableProps}
                className="listContainer"
              >
                {todos.columns.map((listId, listIndex) => {
                  const listItem = todos.lists[listId];
                  const cards = listItem.cards.map(cardId => todos.cards[cardId]);
                  return (
                    <TrelloList
                      key={listItem.id}
                      index={listIndex}
                      title={listItem.title}
                      listId={listItem.id}
                      cards={cards}
                      setOpen={setOpen}
                    />
                  )
                })}
                {provided.placeholder}

                <Button type="text" onClick={handleAddList}>
                  <PlusOutlined /> Add another list
                </Button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
          
        </div>
      </main>

      <Modal
        title="Add Card"
        open={open}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <br />
        <Form
          name="basic"
          form={form}
          initialValues={{ status: "new" }}
          onFinish={handleSubmit}
          autoComplete="off"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          wrapperCol={{ flex: 1 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input your title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Member"
            name="member"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              optionLabelProp="label"
              onChange={handleChange}
            >
              <Option value="tony123" label="tony 123">
                <div className="selectField">
                  <Avatar src="https://picsum.photos/id/237/200/300" />
                  <span>Tony Nguyen</span>
                </div>
              </Option>
              <Option value="phuong123" label="phuong 123">
                <div className="selectField">
                  <Avatar src="https://picsum.photos/id/237/200/300" />
                  <span>Phuong Nguyen</span>
                </div>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                {
                  value: "new",
                  label: "New",
                },
                {
                  value: "inprocess",
                  label: "In process",
                },
                {
                  value: "done",
                  label: "Done",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default App;
