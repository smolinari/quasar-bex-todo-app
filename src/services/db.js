export default {

  /**
   * This will ask for ALL items from chrome storage and return only the ones we're interested in.
   * @param type
   */
  getAll (type) {
    return this.get(null).then(allItems => {
      return allItems.filter(f => f && f.type && f.type === type)
    })
  },

  /**
   * Use the bridge to contact the background BEX script and get a given key from BEX storage.
   * @param key
   * @param id
   * @returns {Promise<unknown>}
   */
  get (key, id = null) {
    const useKey = id
      ? `${key}.${id}`
      : key

    return window.QBexBridge.send('storage.get', {
      key: useKey
    }).then(event => {
      return event.data
    })
  },

  /**
   * Use the bridge to contact the background BEX script and save a given key to the BEX storage.
   * @param key
   * @param data
   * @returns {Promise<unknown>}
   */
  save (key, data) {
    return window.QBexBridge.send('storage.set', { key, data }).then(event => {
      return event.data
    })
  },

  /**
   * Use the bridge to contact the background BEX script and delete a given key from BEX storage.
   * @param key
   * @param id
   * @returns {Promise<unknown>}
   */
  delete (key, id) {
    return window.QBexBridge.send('storage.remove', {
      key: `${key}.${id}`
    })
  }
}
