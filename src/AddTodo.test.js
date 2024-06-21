import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// No duplicate task
test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  
  fireEvent.change(inputTask, { target: { value: "Test Task" } });
  fireEvent.change(inputDate, { target: { value: "06/30/2024" } });
  fireEvent.click(element);
  
  fireEvent.change(inputTask, { target: { value: "Test Task" } });
  fireEvent.change(inputDate, { target: { value: "06/30/2024" } });
  fireEvent.click(element);
  
  const tasks = screen.getAllByText(/Test Task/i);
  expect(tasks.length).toBe(1);
});

// Submit Task with No Task Name
test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputDate, { target: { value: "06/30/2024" } });
  fireEvent.click(element);

  const tasks = screen.queryByText(/06\/30\/2024/i);
  expect(tasks).toBeNull();
});

// Submit Task with No Due Date
test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const element = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: "Test Task" } });
  fireEvent.click(element);

  const task = screen.queryByText(/Test Task/i);
  expect(task).toBeNull();
});

// Late Tasks have Different Colors
test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const overdueTask = screen.getByTestId(/History Test/i);
  expect(overdueTask.style.backgroundColor).toBe('rgb(255, 204, 204)'); // Checking the color

});

// Delete Task
test('test that App component can delete tasks through checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "06/30/2024";

  fireEvent.change(inputTask, { target: { value: "Task to Delete" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const task = screen.getByText(/Task to Delete/i);
  expect(task).toBeInTheDocument();

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  expect(task).not.toBeInTheDocument();
});
