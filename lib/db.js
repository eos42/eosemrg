
module.exports = {
  findOne: (model, query = {}) => {
    let p = new Promise((resolve, reject) => {
      return model.findOne(query, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
    return p.then((data) => {
      return {success: true, result: data}
    }).catch((err) => {
      return {error: true, result: err}
    })
  },

  save: (model, query) => {
    let p = new Promise((resolve, reject) => {
      let obj = new model(query)
      return obj.save((err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
    return p.then((data) => {
      return {success: true, result: data}
    }).catch((err) => {
      return {error: true, result: err}
    })
  }
}