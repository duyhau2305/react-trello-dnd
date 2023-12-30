import React from "react";
import {
  Card,
  Avatar,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AntDesignOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

import { Draggable } from 'react-beautiful-dnd';

function SimpleCard({ card, index}) {
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
                <EditOutlined key="edit" />
              </Tooltip>,
              <Popconfirm
                title="Delete the card"
                description="Are you sure to delete this card?"
                onConfirm={() => {}}
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
