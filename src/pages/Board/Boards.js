import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import useBoard from "../../store/Board";
import "./Board.css";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import AddCardModal from "../../Components/AddCardModal/AddCardModal";

const Boards = () => {
  const { board, setBoard } = useBoard();
  const [modalOpened, setModalOpened] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);

  // 🎯 Drag logic
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceItems = [...board[source.droppableId]];
    const destItems = [...board[destination.droppableId]];

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    setBoard({
      ...board,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });
  };

  // 🎯 Gradient logic (same as before)
  const getGradient = (column) => {
    if (column === "TODO")
      return { background: "linear-gradient(65deg,#414141,#30bddc)" };
    if (column === "Doing")
      return { background: "linear-gradient(65deg,#414141,#dc3030)" };
    if (column === "Completed")
      return { background: "linear-gradient(65deg,#414141,#30dc56)" };
    if (column === "Backlog")
      return { background: "linear-gradient(65deg,#414141,#8630dc)" };
  };

  // 🎯 Add card
  const handleCardAdd = (title, description) => {
    const newCard = {
      id: Date.now().toString(),
      title,
      description,
    };

    setBoard({
      ...board,
      [activeColumn]: [...board[activeColumn], newCard],
    });

    setModalOpened(false);
  };

  // 🎯 Remove card
  const removeCard = (column, index) => {
    const updated = [...board[column]];
    updated.splice(index, 1);

    setBoard({
      ...board,
      [column]: updated,
    });
  };

  return (
    <div className="board-container">
      <span>Trello Board</span>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-columns">
          {Object.entries(board).map(([column, cards]) => (
            <Droppable droppableId={column} key={column}>
              {(provided) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {/* COLUMN HEADER */}
                  <div className="column-header">
                    <span>{column}</span>
                    <IoMdAdd
                      size={22}
                      onClick={() => {
                        setActiveColumn(column);
                        setModalOpened(true);
                      }}
                    />
                  </div>

                  {/* CARDS */}
                  {cards.map((card, index) => (
                    <Draggable
                      draggableId={card.id}
                      index={index}
                      key={card.id}
                    >
                      {(provided) => (
                        <div
                          className="kanban-card"
                          style={getGradient(column)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card-header">
                            <span>{card.title}</span>
                            <button
                              onClick={() => removeCard(column, index)}
                            >
                              <RxCross2 color="white" />
                            </button>
                          </div>
                          <span>{card.description}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <AddCardModal
        visible={modalOpened}
        handleCardAdd={handleCardAdd}
        onClose={() => setModalOpened(false)}
      />
    </div>
  );
};

export default Boards;
