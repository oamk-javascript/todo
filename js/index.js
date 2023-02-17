const BACKEND_ROOT_URL = 'http://localhost:3001'

import { Todos } from "../class/Todos.js"

const todos = new Todos(BACKEND_ROOT_URL)

const list = document.querySelector('#todolist')
const input = document.querySelector('#newtodo')

list.visible = false
input.disabled = true

todos.getTasks().then((tasks) => {
  tasks.sort()
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
  const list_item = document.createElement("li")
  list_item.setAttribute('data-key',task.id)
  list_item.setAttribute('class','list-group-item')

  list_item.addEventListener('click',event => {
    document.querySelectorAll(".list-group-item").forEach(item => {
      item.setAttribute('class','list-group-item')
    })
    
    const selected_element= document.querySelector(`[data-key='${task.id}']`) 
    selected_element.setAttribute('class','list-group-item active')
  })

  const span = list_item.appendChild(document.createElement("span"))
  span.innerHTML = task.text
  
  const link = list_item.appendChild(document.createElement("a"))
  link.innerHTML = '<i class="bi bi-trash"></i>'
  link.setAttribute('style','float:right')

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
  list.append(list_item)
}