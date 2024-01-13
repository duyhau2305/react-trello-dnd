import { useState } from "react";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// ant core
import {
  Button,
  Modal,
  Input,
  Form,
  Select,
} from "antd";

// ant icons
import { PlusOutlined } from "@ant-design/icons";

// components
import TrelloList from "./components/TrelloList";

// mocks
import { data } from "./data";

const { TextArea } = Input;

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

function App() {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [todos, setTodos] = useState(data);
  const [modalType, setModalType] = useState(null);
  const [currentListId, setCurrentListId] = useState(null);

  const handleSubmit = (values) => {
    setConfirmLoading(true);

    setTodos(prevState => {
      // Create a new card object with a unique ID and details passed from cardDetails
      const newCard = {
        id: `card-${Date.now()}`,
        ...values
      };
  
      // Get the current list and add the new card ID to it
      const updatedList = {
        ...prevState.lists[currentListId],
        cards: [...prevState.lists[currentListId].cards, newCard.id]
      };
  
      // Update the state with the new list and card
      return {
        ...prevState,
        lists: {
          ...prevState.lists,
          [currentListId]: updatedList // push cardId into cards array
        },
        cards: {
          ...prevState.cards,
          [newCard.id]: newCard // Assuming you maintain a separate cards collection
        }
      };
    });

    setTimeout(() => {
      setConfirmLoading(false);
      setModalType(null);
      form.resetFields();
    }, 500)
  };

  const handleCancel = () => {
    setModalType(null);
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
      console.log (" ", cloneLists)
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

      console.log('cards: ', cards)
      setTodos(prevState => {
        return {
          ...prevState,
          lists: {
            ...prevState.lists,
            [destination.droppableId]: {
              ...prevState.lists[destination.droppableId],
              cards
            }
          }
        }
      })
      return;
    }

    // different list
    const start = todos.lists[source.droppableId];
    const finish = todos.lists[destination.droppableId];

    // clone  list cũ và xóa list khỏi danh sach
    const newStartCards = [...start.cards];
    const [movedCard] = newStartCards.splice(source.index, 1);

    // Clone list mới và thêm list vào danh sách
    const newFinishCards = [...finish.cards];
    newFinishCards.splice(destination.index, 0, movedCard);

    // Clone lại list cũ và mới để update state
    const newStart = { ...start, cards: newStartCards };
    const newFinish = { ...finish, cards: newFinishCards };

    // Update the state with the new lists
    const newState = {
      ...todos,
      lists: {
        ...todos.lists,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setTodos(newState);
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
  // delete
  const onDeleteList = (listId) => {
    setTodos(prevState => {
      const updatedLists = { ...prevState.lists };
      delete updatedLists[listId];
      const updatedColumns = prevState.columns.filter(id => id !== listId);

      return {
        ...prevState,
        lists: updatedLists,
        columns: updatedColumns
      };
    });
  };
  console.log('todos: ', todos)
  const onRemoveCard = (listId, cardId) => {
   
    setTodos(prevState => {
      const list = prevState.lists[listId];
      const filteredCards = list.cards.filter(id => id !== cardId);
  
      return {
        ...prevState,
        lists: {
          ...prevState.lists,
          [listId]: {
            ...list,
            cards: filteredCards
          }
        }
      };
    });
  };

  const openEditCard = (card) => {
    setModalType("edit");

    console.log('card: ', card)
  }

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
                      setModalType={setModalType}
                      setCurrentListId={setCurrentListId}
                      onDeleteList={onDeleteList}
                      onRemoveCard={onRemoveCard}
                      openEditCard={openEditCard}
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
        title={modalType === "add" ? "Add new card" : "Edit card"}
        open={Boolean(modalType)}
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

      <Modal
        title="Learn javascript"
        // open
        // open={open}
        // onOk={form.submit}
        // onCancel={handleCancel}
      >
        <br />
        <h3>Description</h3>
        <div>todo 1</div>
      </Modal>
    </>
  );
}

export default App;
