import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'


Vue.use(Vuex)

export default new Vuex.Store({
  state: { // data
    products: [],
    // id, quantity
    cart: [],
    checkoutStatus: null,
  },

  // computed properties: perfect for filtering or calculating at runtime
  getters: {
    availableProducts(state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },

    productIsInStock() {
      return (product) => {
        return product.inventory > 0
      }
    },

    cartProducts(state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })

    },

    cartTotal(state, getters) {
      // use forEach
      // let total = 0
      //
      // getters.cartProducts.forEach(product => {
      //   total += product.price * product.quantity
      // })
      // return total

      // use reduce
      return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
    },

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

    // ES6: replace context with {getters, state, commit}
    addProductToCart({getters, state, commit}, product) {
      if (getters.productIsInStock(product)) {
        // find product in cart
        const cartItem = state.cart.find(item => item.id === product.id)

        if (!cartItem) {
          // add product to cart
          commit('pushProductToCart', product.id)
        } else {
          // increment Item quantity
          commit('incrementItemQuantity', cartItem)
        }

        commit('decrementProductInventory', product)

      }
    },

    // ES6 argument destructuring: context => {state, commit}
    checkout({state, commit}) {

      shop.buyProducts(
        state.cart,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'fail')
        }
      )

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

    setCheckoutStatus(state, status) {
      state.checkoutStatus = status
    },

    emptyCart(state) {
      state.cart = []
    },
  }
})
