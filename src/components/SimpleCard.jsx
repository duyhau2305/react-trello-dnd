import React from "react";
import { Card, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { Draggable } from "react-beautiful-dnd";

const { Meta } = Card;

function SimpleCard({ card, index, listId, onRemoveCard, openEditCard }) {
  const handleRemoveCard = () => {
    onRemoveCard(listId, card.id);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card mt-2"
        >
          <Card
            className="cardItem"
            cover={<img alt="example" src="https://picsum.photos/265/160" />}
            actions={[
              <Tooltip title="View">
                <FileTextOutlined key="view" />
              </Tooltip>,
              <Tooltip title="Edit">
                <EditOutlined key="edit" onClick={() => openEditCard(card)}/>
              </Tooltip>,
              <Popconfirm
                title="Delete the card"
                description="Are you sure to delete this card?"
                onConfirm={handleRemoveCard}
                showCancel={false}
                okText="Yes"
                cancelText="No"
                className="ml-10"
              >
                <Tooltip title="Delete">
                  <DeleteOutlined key="ellipsis" />
                </Tooltip>
              </Popconfirm>,
            ]}
          >
            <Meta
              title={card.title}
              description={
                <>
                  {card.description}
                </>
              }
            />
          </Card>
        </div>
      )}
    </Draggable>
  );
}

export default SimpleCard;
