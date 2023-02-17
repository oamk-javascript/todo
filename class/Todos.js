import { Task } from "./Task.js"

class Todos {
  #backenend_url = ''

  constructor(url) {
    this.tasks = []
    this.#backenend_url = url
  }

  getTasks = async() => {
    return new Promise(async (resolve,reject) => {
      axios.get(this.#backenend_url)
        .then(response => {
          this.#readJson(response.data)
          resolve(this.tasks)
        }).catch(error => {
          console.log(error)
          reject("Error retrieving tasks from database!")
        })
    })
  }

  #readJson(tasksAsJson) {
    tasksAsJson.forEach(element => {
      const task = new Task(element.id,element.description)
      this.tasks.push(task)
    }); 
  }

  addTask = async (text) => {
    return new Promise(async (resolve,reject) => {
      const json = JSON.stringify({description:text})
      try {
        const response = await axios.post(this.#backenend_url + '/new',json, {
          headers: {
            'Content-Type' : 'application/json'
          }
        })
        resolve(this.#addToArray(response.data.id,text))
      } catch (error) {
        console.log(error)
        reject("Error adding new task!")
      }
    })
  }

  #addToArray(id,text) {
    const task=new Task(id,text)
    this.tasks.push(task)
    return task
  }

  removeTask = (id) => {
    return new Promise(async (resolve,reject) => {
      axios.delete(this.#backenend_url + '/delete/' + id)
        .then(response => {
          this.#removeFromArray(id)
          resolve(response.data.id)
        }).catch(error => {
          console.log(error)
          reject("Error deleting task from database!")
        })
    })
  }

  #removeFromArray(id) {
    const arrayWithoutRemoved = this.tasks.filter(task => task.id !== id)
    this.tasks = arrayWithoutRemoved 
  }
}

export {Todos}