var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">

            <div class="product-image">
                <img v-bind:src="image" v-bind:alt="altText">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else v-bind:class="{ outOfStock: !inStock }">Out of Stock</p>
                <p>{{ sale }}</p>
                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants"
                     v-bind:key="variant.variantId"
                     class="color-box"
                     v-bind:style="{ backgroundColor: variant.variantColor }"
                     v-on:mouseover="updateProduct(index)">
                </div>

                <button v-on:click="addToCart"
                        v-bind:disabled="!inStock"
                        v-bind:class="{ disabledButton: !inStock }">
                    Add a Cart
                </button>

            </div>
            
            <product-tabs v-bind:reviews="reviews"></product-tabs>
           
        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            altText: 'A pair of socks',
            details: [
                '80%cotton',
                '20% polyester',
                'Gender-neutral'
            ],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green.jpg',
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue.jpg',
                    variantQuantity: 0,
                }
            ],
            onSale: true,
            reviews: [],
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
    },
    computed: {
        title: function () {
            return this.brand + ' ' + this.product
        },
        image: function () {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock: function () {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale: function () {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!'
            } else {
                return this.brand + ' ' + this.product + ' are not on sale!'
            }
        },
        shipping: function () {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" v-on:submit.prevent="onSubmit">
    
        <p class="error" v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
    
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        
        <p>
            <input type="submit" value="Submit">  
        </p>    
            
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods: {
        onSubmit: function () {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) {
                    this.errors.push("Name required.")
                }
                if (!this.review) {
                    this.errors.push("Review required.")
                }
                if (!this.rating) {
                    this.errors.push("Rating required.")
                }
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
                  v-bind:class="{ activeTab: selectedTab === tab }"
                  v-for="(tab, index) in tabs" 
                  v-bind:key="index"
                  v-on:click="selectedTab = tab">
                  {{ tab }}</span>
                  
            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="(review, index) in reviews" v-bind:key="index">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            
            <product-review v-show="selectedTab === 'Make a Review'" ></product-review>
        
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})


var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart: function (id) {
            this.cart.push(id)
        }
    }
})