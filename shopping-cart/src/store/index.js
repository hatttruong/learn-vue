import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'


Vue.use(Vuex)

export default new Vuex.Store({
  state: { // data
    products: [],
    // id, quantity
    cart: [],
  },

  // computed properties: perfect for filtering or calculating at runtime
  getters: {
    availableProducts(state, getters) {
      return state.products.filter(product => product.inventory > 0)
    }
  },

  // methods: it can be complex but not for changing state
  // context obj exposes the same set of methods and properties as store object
  // (1)
  // (2) responsible for the logic of when a mutation should be fired
  actions: {
    fetchProducts ({commit}) {
      return new Promise((resolve, reject) => {
        // make the calls
        shop.getProducts(products => {
          // commit a mutation
          commit('setProducts', products)

          resolve()
        })
      })
    },

    addProductToCart(context, product) {
      if (product.inventory > 0) {
        // find product in cart
        const cartItem = context.state.cart.find(item => item.id === product.id)

        if (!cartItem) {
          // add product to cart
          context.commit('pushProductToCart', product.id)
        } else {
          // increment Item quantity
          context.commit('incrementItemQuantity', cartItem)
        }

        context.commit('decrementProductInventory', product)

      }
    },

  },

  // setting and updating states
  // mutation should be as simple as possible, not complex computation
  mutations: {
    setProducts (state, products) {
      // update products
      state.products = products
    },

    pushProductToCart(state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1
      })
    },

    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++
    },

    decrementProductInventory(state, product) {
      product.inventory--
    },
  }
})
