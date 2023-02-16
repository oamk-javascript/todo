import { Todos } from "../class/Todos.js"

const list = document.querySelector('#todolist')
const input = document.querySelector('#newtodo')
const todos = new Todos()

list.visible = false
input.disabled = true

todos.getTasks().then((tasks) => {
  tasks.forEach(task => {
    renderTask(task)
  })
  list.visible = true
  input.disabled = false
}).catch(err => {
  alert(err)
})

input.addEventListener('keypress',event => {
  if (event.key === 'Enter') {
    event.preventDefault()
    const text = input.value.trim()
    if (text !== '') {
      todos.addTask(text).then((task) => {
        input.value = ''
        input.focus() 
        renderTask(task)
      }).catch (err => {
        alert(err)
      })   
    }
  }
})

const renderTask = (task) => {
  //const isChecked = todo.checked ? 'done' : ''
  const node = document.createElement("li")
  node.setAttribute('data-key',task.id)
  const span = node.appendChild(document.createElement("span"))
  span.innerHTML = task.text
  const link = node.appendChild(document.createElement("a"))
  link.innerHTML = '<i class="bi bi-trash"></i>'
  link.addEventListener('click',event => {
    todos.removeTask(task.id).then((id) => {
      const elementToRemove = document.querySelector(`[data-key='${id}']`) 
      if (elementToRemove) {
        list.removeChild(elementToRemove)
      }
    }).catch(err => {
      alert(err)
    })
  })
  list.append(node)
}