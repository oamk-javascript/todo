import { Task } from "./Task.js"

class Todos {
  #url = 'http://localhost:3001'

  constructor() {
    this.tasks = []
  }

  getTasks = async() => {
    return new Promise(async (resolve,reject) => {
      axios.get(this.#url)
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
      const task = new Task(element.id,element.description,false)
      this.tasks.push(task)
    }); 
  }

  addTask = async (text) => {
    return new Promise(async (resolve,reject) => {
      const json = JSON.stringify({description:text})
      try {
        const response = await axios.post(this.#url + '/new',json, {
          headers: {
            'Content-Type' : 'application/json'
          }
        })
        resolve(this.#addToArray(response.data.id,text,false))
      } catch (error) {
        console.log(error)
        reject("Error adding new task!")
      }
    })
  }

  #addToArray(id,text,checked) {
    const task=new Task(id,text,checked)
    this.tasks.push(task)
    return task
  }

  removeTask = (id) => {
    return new Promise(async (resolve,reject) => {
      axios.delete(this.#url + '/delete/' + id)
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