import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Card, Tooltip, Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import SimpleCard from "./SimpleCard";

function TrelloList({ title, listId, index, cards, setModalType, onDeleteList, onRemoveCard, setCurrentListId, openEditCard }) {
  const onAddCard = () => {
    setCurrentListId(listId)
    setModalType('add')
  };

  return (
    <Draggable draggableId={String(listId)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className='todoList'
        >
          <Droppable droppableId={String(listId)} type="CARD">
            {(provided) => (
              <Card
                title={title}
                className="cardList"
                extra={
                  <Space>
                    <Tooltip title="Add a card">
                      <Button
                        shape="circle"
                        icon={<PlusOutlined />}
                        onClick={onAddCard}
                      />
                    </Tooltip>
    
                    <Popconfirm
                      title="Are you sure to delete this list?"
                      onConfirm={() => onDeleteList(listId)}
                      okText="Yes"
                      cancelText="No"
                      showCancel={false}
                    >
                      <Tooltip title="Delete this list">
                        <Button
                          shape="circle"
                          icon={<DeleteOutlined />}
                        />
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                }
              >
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="todoList__content"
                >
                  {cards.map((card, cardIndex) => (
                    <SimpleCard 
                      key={card.id}
                      index={cardIndex}
                      card={card}
                      listId={listId}
                      onRemoveCard={onRemoveCard}
                      openEditCard={openEditCard}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              </Card>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default TrelloList;
