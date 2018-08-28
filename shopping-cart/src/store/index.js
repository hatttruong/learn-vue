import Vuex from 'vuex'

import Vue from 'vue'


Vue.use(Vuex)

export default new Vuex.Store({
  state: { // data
    products: []
  },

  // computed properties: perfect for filtering or calculating at runtime
  getters: {
    availableProducts(state, getters) {
      return state.products.filter(product => product.inventory > 0)
    }
  },

  // methods: it can be complex but not for changing state
  actions: {
    fetchProducts () {
      // make the calls
    }
  },

  // setting and updating states
  // mutation should be as simple as possible, not complex computation
  mutations: {
    setProducts (state, products) {
      // update products
      state.products = products
    }
  }
})
