import React, { useEffect, useState } from "react";
import { Container, ListGroup, Form } from "react-bootstrap";
import { ResetButton } from "./uiComponent";
import axios from "axios";

type TodoItem = {
  id: number;
  title: string;
  checked: boolean;
};

type Props = {
  todoItems: TodoItem[];
};

const TodoList: React.FC<Props> = ({ todoItems }) => {
  const [items, setItems] = useState(todoItems);

  useEffect(() => {
    const token = document.querySelector(
      "[name=csrf-token]"
    ) as HTMLMetaElement;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
  }, []);

  const checkBoxOnCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoItemId: number
  ): void => {
    const isChecked = e.target.checked;

    setItems(items.map((item) => item.id === todoItemId ? { ...item, checked: isChecked } : item));

    axios.post("/todo", {
      id: todoItemId,
      checked: isChecked,
    });
  };

  const resetButtonOnClick = (): void => {
    axios.post("/reset").then(() => {
      setItems(items.map((item) => ({ ...item, checked: false })));
    });
  };

  return (
    <Container>
      <h3>2022 Wish List</h3>
      <ListGroup>
        {items.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <Form.Check
              type="checkbox"
              label={todo.title}
              checked={todo.checked}
              onChange={(e) => checkBoxOnCheck(e, todo.id)}
            />
          </ListGroup.Item>
        ))}
        <ResetButton onClick={resetButtonOnClick}>Reset</ResetButton>
      </ListGroup>
    </Container>
  );
};

export default TodoList;
