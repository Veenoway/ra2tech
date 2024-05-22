import React, { useEffect } from "react";
import "./index.css";

export default function KanbanBoard(props) {
  const inputRef = React.useRef(null);
  const [tasks, setTasks] = React.useState([
    { name: "1", stage: 0 },
    { name: "2", stage: 0 },
  ]);
  const [stagesTasks, setStagesTasks] = React.useState([]);
  const stagesNames = ["Backlog", "To Do", "Ongoing", "Done"];

  const initStages = (newTaks) => {
    const stagesTaskArr = [];
    for (let i = 0; i < stagesNames.length; ++i) {
      stagesTaskArr.push([]);
    }
    (newTaks?.length > 0 ? newTaks : tasks)?.forEach((task) => {
      const stageId = task?.stage;
      stagesTaskArr[stageId].push(task);
    });
    setStagesTasks(stagesTaskArr);
  };

  useEffect(() => {
    initStages();
  }, [tasks]);

  const handleAddTask = () => {
    const { value } = inputRef?.current;
    if (value) {
      const object = {
        name: value,
        stage: 0,
      };
      if (tasks.find((entry) => entry.name === value)) return;
      setTasks((prev) => [...(prev || []), object]);
    }
  };

  const handleRemove = (stageID, nameToRemove) => {
    const stages = [];
    stagesTasks?.forEach((stage, i) => {
      const activeStage = stagesTasks[stageID]?.find(
        (entry) => entry.name === nameToRemove
      )?.stage;
      if (activeStage === i) {
        stages.push(stage);
      }
    });
    const newTasks = tasks.filter((entry) => entry.name !== nameToRemove);
    setTasks(newTasks);
  };

  const handleClick = (nameOfTask, direction) => {
    const isForward = direction === "forward";
    const activeTaskIndex = tasks.findIndex(
      (entry) => entry.name === nameOfTask
    );
    const newTasks = [];
    tasks?.map((task, i) => {
      if (activeTaskIndex === i) {
        task.stage = isForward ? task.stage + 1 : task.stage - 1;
      }
      newTasks.push(task);
    });
    if (newTasks.length > 0) {
      initStages(newTasks);
      setTasks(newTasks);
    }
  };

  return (
    <div className="mt-20 layout-column justify-content-center align-items-center">
      <section className="mt-50 layout-row align-items-center justify-content-center">
        <input
          ref={inputRef}
          id="create-task-input"
          type="text"
          className="large"
          placeholder="New task name"
          data-testid="create-task-input"
        />
        <button
          type="submit"
          className="ml-30"
          data-testid="create-task-button"
          onClick={handleAddTask}
        >
          Create task
        </button>
      </section>

      <div className="mt-50 layout-row">
        {stagesTasks?.map((tasks, i) => {
          return (
            <div className="card outlined ml-20 mt-0" key={`${i}`}>
              <div className="card-text">
                <h4>{stagesNames[i]}</h4>
                <ul className="styled mt-50" data-testid={`stage-${i}`}>
                  {tasks?.map((task, index) => {
                    return (
                      <li className="slide-up-fade-in" key={`${i}${index}`}>
                        <div className="li-content layout-row justify-content-between align-items-center">
                          <span
                            data-testid={`${task.name
                              .split(" ")
                              .join("-")}-name`}
                          >
                            {task.name}
                          </span>
                          <div className="icons">
                            {task.stage > 0 ? (
                              <button
                                className="icon-only x-small mx-2"
                                onClick={() => handleClick(task.name, "back")}
                              >
                                <i className="material-icons">arrow_back</i>
                              </button>
                            ) : null}
                            {task.stage < stagesTasks?.length - 1 ? (
                              <button
                                className="icon-only x-small mx-2"
                                onClick={() =>
                                  handleClick(task.name, "forward")
                                }
                              >
                                <i className="material-icons">arrow_forward</i>
                              </button>
                            ) : null}
                            <button
                              className="icon-only danger x-small mx-2"
                              onClick={() => handleRemove(i, task.name)}
                            >
                              <i className="material-icons">delete</i>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
