<template>
    <div>
      <h1>Product List</h1>
      <img v-if="this.loading" src="https://i.imgur.com/JfPpwOA.gif" />
      <ul v-else>
        <li v-for="product in products">
          {{product.title}} - {{product.price | currency}} - Remaining: {{product.inventory}}

          <button :disabled="!productIsInStock(product)" @click="addProductToCart(product)">Add to cart</button>
        </li>
      </ul>
    </div>
</template>

<script>

    export default {
      name: "ProductList",

      data () {
        return {loading: false}
      },

      computed: {

        products () {
          return this.$store.state.products
        },

        productIsInStock () {
          return this.$store.getters.productIsInStock
        },

      },

      methods: {
        addProductToCart (product) {
          this.$store.dispatch('addProductToCart', product)
        }

      },

      // dispatch similar to commit, but for calling actions
      created() {
        this.loading = true
        this.$store.dispatch('fetchProducts').then(() => this.loading = false)
      }
    }
</script>

<style scoped>

</style>
