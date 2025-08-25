class Todo {
  constructor(id, text, completed = false, createdAt = new Date()) {
    this.id = id;
    this.text = text;
    this.completed = completed;
    this.createdAt = createdAt;
  }
}
let todos = [];
let filter = "all";
window.onload = () => {
  loadTodos();
  renderTodos();
};
function addTodo() {
  const input = document.querySelector(".todo-input");
  const text = input.value.trim();
  if (text == "") return;

  const todo = new Todo(Date.now(), text, new Date());
  todos.push(todo);
  input.value = "";
  saveTodos();
  renderTodos();
}
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}
function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}
function filterTodo(type) {
  filter = type;
  document
    .querySelectorAll(".filter-buttons button")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`button[onclick="filterTodo('${type}')"]`)
    .classList.add("active");
  renderTodos();
}
function renderTodos() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  const table = document.createElement("table");
  table.className = "todo-table";
  table.border = "1";
  table.style.width = "100%";
  table.innerHTML = `
    <tr>
      <th>Công việc</th>
      <th>Thời gian tạo</th>
      <th>Action</th>
    </tr>
  `;

  let filteredTodos = todos;
  if (filter == "active")
    filteredTodos = todos.filter((todo) => !todo.completed);
  else if (filter == "completed")
    filteredTodos = todos.filter((todo) => todo.completed);

  filteredTodos.forEach((todo) => {
    const tr = document.createElement("tr");
    tr.className = todo.completed ? "completed" : "";

    // cột công việc
    const tdText = document.createElement("td");
    tdText.innerText = todo.text;
    tdText.style.cursor = "pointer";
    tdText.onclick = () => toggleTodo(todo.id);

    // cột thời gian
    const tdTime = document.createElement("td");
    tdTime.innerText = new Date(todo.createdAt).toLocaleString();

    const tdAction = document.createElement("td");
    const button = document.createElement("button");
    button.innerText = "Xóa";
    button.onclick = () => deleteTodo(todo.id);

    tdAction.appendChild(button);

    tr.appendChild(tdText);
    tr.appendChild(tdTime);
    tr.appendChild(tdAction);
    table.appendChild(tr);
  });
  todoList.appendChild(table);
}
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function loadTodos() {
  const data = localStorage.getItem("todos");
  if (data) {
    todos = JSON.parse(data);
  }
}
document.querySelector(".todo-input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    addTodo();
  }
});
