<template>
  <div>
    <nav-header></nav-header>
    <nav-bread><span>Goods</span></nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods()">Price </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)">All</a></dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import axios from 'axios'
  import NavHeader from '../base/NavHeader.vue'
  import NavBread from '../base/NavBread.vue'
  import NavFooter from '../base/NavFooter.vue'

  export default {
    data() {
      return {
        goodsList: [],
        sortFlag: true
      }
    },
    mounted() {
      this._getGoodsList()
    },
    methods: {
      _getGoodsList() {
        axios.get('/goods?page=1&pageSize=8&sort=-1').then((response) => {
          let res = response.data
          if (res.status === 0) {
            this.goodsList = res.result.list
          } else {
            this.goodsList = []
          }
        })
      }
    },
    components: {
      NavHeader,
      NavBread,
      NavFooter
    }
  }
</script>
