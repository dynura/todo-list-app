import React, { useState, useEffect } from 'react';
import './App.css';

// Define what a task looks like
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {

  // Window Handling Functions
  const handleMinimizeApp = () => {
    if((window as any).electronAPI) {
        (window as any).electronAPI.minimizeApp();
      } else {
        console.log("Not running in Electron environment, minimizeApp function is not available.");
      }
  };

  const handleMaximizeApp = () => {
    if((window as any).electronAPI) {
        (window as any).electronAPI.maximizeApp();
      } else {
        console.log("Not running in Electron environment, maximizeApp function is not available.");
      }
  };

  const handleCloseApp = () => {
    if((window as any).electronAPI) {
        (window as any).electronAPI.closeApp();
      } else {
        console.log("Not running in Electron environment, closeApp function is not available.");
      }
  };

  // States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Dynamic calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  // Prevent division by zero if list is completely empty
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Dynamic Milestone Text
  const getMilestoneText = (percentage: number): string => {
    // Check if the list is completely empty first
    if (totalTasks === 0 || tasks.length === 0) {
      return "Add some tasks to get started!";
    }
    
    // If there are tasks, check completion percentages
    if (percentage === 100) return "All tasks completed! Great job!";
    if (percentage >= 75) return "Almost there! Keep going!";
    if (percentage >= 50) return "Halfway done! Keep it up!";
    if (percentage >= 25) return "Making progress! Keep it up!";
    
    // Default fallback if tasks exist but progress is 0% to 24%
    return "Keep it up!";
  };

  // Operations
  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // FIX: Only return if the input is empty!
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: Date.now(), // Unique ID based on timestamp
      text: inputValue.trim(),
      completed: false
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const handleToggleComplete = (id: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const nextState = !task.completed;

        // Trigger sound & jump only when checking an item to true (completed)
        if (nextState) {
          triggerEffects();
        }
        return { ...task, completed: nextState };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const triggerEffects = () => {
    const doneSound = new Audio(`${process.env.PUBLIC_URL}/done-sound.mp3`);
    doneSound.loop = false; // Ensure it doesn't loop
    doneSound.play().catch(err => console.error("Error playing sound:", err));

    // Trigger jump animation
    setIsJumping(true);
  };

  // Reset jump state after animation duration (0.45s)
  useEffect(() => {
    if (isJumping) {
      const timer = setTimeout(() => setIsJumping(false), 450);
      return () => clearTimeout(timer);
    }
  }, [isJumping]);

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = (id: number) => {
    if (!editingText.trim()) return;
    setTasks(tasks.map(task => task.id === id ? { ...task, text: editingText.trim() } : task));
    setEditingId(null);
  };

  return (
    <div className="container">
      {/* Top windows control header bar */}
      <div className="header-bar">
        <span>STAY ORGANIZED!</span>
        <div className="window-controls">
          <div className="win-btn" onClick={handleMinimizeApp}>_</div>
          <div className="win-btn" onClick={handleMaximizeApp}>□</div>
          <div className="win-btn close-btn" onClick={handleCloseApp}>x</div>
        </div>
      </div>
      
      {/* Main content panel */}
      <div className="main-board">
        <h1 className="title-text">TO DO LIST</h1>

        {/* Dynamic Progress Panel Card */}
        <div className="progress-card">
          {/* Left column container for text and progress bar */}
          <div className="progress-left-column">
            <h2>{getMilestoneText(progress)}</h2>
            
            {/* Progress Loading Bar Tracking Framework */}
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          
          {/* Right column container for the circle and the cat asset */}
          <div className="counter-circle-wrapper">
            <div className="counter-circle">
              {completedTasks}/{totalTasks}
            </div>

            {/* Shifting cat avatar placed inside the wrapper so it anchors strictly to the circle base */}
            <img 
              src={isJumping ? `${process.env.PUBLIC_URL}/cat-action.gif` : `${process.env.PUBLIC_URL}/cat-idle.gif`} 
              alt="pixel cat" 
              className={`cat-head ${isJumping ? 'jump' : ''}`} 
            />
          </div>
        </div>

        {/* Input add task bar field */}
        <form className="input-area" onSubmit={handleAddTask}>
          <input 
            type="text" 
            placeholder="Enter task" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <button type="submit" className='add-btn'>+</button>
        </form>

        {/* Scrollable Todo List Container Node */}
        <div className='todo-list-scrollable'>
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-left" onClick={() => handleToggleComplete(task.id)}>
                <div className="custom-checkbox">
                  {task.completed && <span className='checkmark'>✓</span>}
                </div>

                {editingId === task.id ? (
                  <input 
                    type='text' 
                    className='edit-inline-input' 
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)}
                    autoFocus
                  />
                ) : (
                  <span className='task-text'>{task.text}</span>
                )}
              </div>

              <div className='task-actions'>
                {editingId === task.id ? (
                  <button className='action-btn save' onClick={() => handleSaveEdit(task.id)}>⎙</button>
                ) : (
                  <button className='action-btn edit' onClick={() => startEditing(task.id, task.text)}>✎</button>
                )}
                <button className='action-btn delete' onClick={() => handleDeleteTask(task.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;