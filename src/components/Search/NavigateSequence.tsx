import { DragIndicator } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, DraggingStyle, Droppable, DroppableProps, DropResult, NotDraggingStyle } from "react-beautiful-dnd";
import { useAppSelector } from "../../features/hooks";
import { FreeAddingListItem } from "../shared-list-items";

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

export const getItems = (count: number) => Array.from({ length: count }, (v, k) => k).map(k => k);

const reorder = (list: number[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle
} as React.CSSProperties);

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
} as React.CSSProperties);

export default function NavigateSequence(): JSX.Element {

  const sequence = useAppSelector(state => state.navigate.sequence);

  const [items, setItems] = useState(getItems(3));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) { return; }

    const is = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(is);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable">
          { (provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                <div>
                  <Draggable draggableId="x0" index={0}>
                    { (provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          <div {...provided.dragHandleProps} style={{ display: "inline-block" }}><DragIndicator fontSize="inherit"/></div>
                          {items[0]}
                        </div>
                      )
                    }
                  </Draggable>
                  <Draggable draggableId="x1" index={1}>
                    { (provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          <div {...provided.dragHandleProps} style={{ display: "inline-block" }}><DragIndicator fontSize="inherit"/></div>
                          {items[1]}
                        </div>
                      )
                    }
                  </Draggable>
                  <Draggable draggableId="x2" index={2}>
                    { (provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          <div {...provided.dragHandleProps} style={{ display: "inline-block" }}><DragIndicator fontSize="inherit"/></div>
                          {items[2]}
                        </div>
                      )
                    }
                  </Draggable>
                </div>
                {provided.placeholder}
              </div>
            )
          }
        </StrictModeDroppable>
      </DragDropContext>
      <div style={{ display: "flex", justifyItems: "center" }}>
        <DragIndicator fontSize="inherit"/>
        <FreeAddingListItem onClick={() => {}} />
      </div>
    </>
  );
}
