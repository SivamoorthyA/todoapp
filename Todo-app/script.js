const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const counter = document.getElementById('counter');
const clearBtn = document.getElementById('clear-done');
const filterBtns = document.querySelectorAll('[data-filter]');
const dateElement = document.getElementById('date');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let filter = 'all';

const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateElement.textContent = today.toLocaleDateString(undefined, options);


function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';

  const visible = todos.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );

  visible.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'list-group-item' + (todo.done ? ' done' : '');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'form-check-input';
    check.checked = todo.done;
    check.addEventListener('change', () => toggle(todo.id));

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = todo.text;
    text.addEventListener('click', () => toggle(todo.id));

    const del = document.createElement('button');
    del.className = 'btn-delete';
    del.innerHTML = '&times;';
    del.title = 'Destroy';
    del.addEventListener('click', () => remove(todo.id));

    li.append(check, text, del);
    list.appendChild(li);
  });

  const pending = todos.filter(t => !t.done).length;
  counter.textContent = pending + ' decree(s) await your command';
}

function toggle(id) {
  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  render();
}

function remove(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  input.value = '';
  save();
  render();
});

clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

render();
