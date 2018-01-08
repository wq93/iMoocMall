<template>
  <div>
    <nav-header></nav-header>
    <nav-bread><span>Goods</span></nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <i class="iconfont" :class="priceFlag"></i>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('all')"
                     v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
              <dd v-for="(item,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img :src="'static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="view-more-normal"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :mdShow="mdShow" @close="closeModal">
      <p slot="message">
        请先登录,否则无法加入到购物车中!
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn-m" @click="mdShow = false">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import axios from 'axios'
  import NavHeader from '../base/NavHeader.vue'
  import NavBread from '../base/NavBread.vue'
  import NavFooter from '../base/NavFooter.vue'
  import Modal from '../components/Modal.vue'

  export default {
    data() {
      return {
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        mdShow: false,
        mdShowCart: false,
        busy: true, // 控制加载动画
        priceFilter: [ // 价格区间数组
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '5000.00'
          }
        ],
        priceChecked: 'all',
        loading: false // loading显隐
      }
    },
    mounted() {
      this._getGoodsList()
    },
    computed: {
      priceFlag() {
        return this.sortFlag ? 'icon-shangfan' : 'icon-xiafan'
      }
    },
    methods: {
      _getGoodsList(flag) {
        let params = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked
        };
        this.loading = true
        axios.get('/goods/list', {params}).then((response) => {
          let res = response.data
          this.loading = false
          if (res.status === 0) {
            // 加载更多
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list)
              // 如果没有数据,禁用加载动画
              if (res.result.count === 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list
              this.busy = false;
            }
          } else {
            this.goodsList = []
          }
        })
      },
      sortGoods() {
        this.page = 1
        this.sortFlag = !this.sortFlag
        this._getGoodsList()
      },
      loadMore() { // 翻页加载动画
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this._getGoodsList(true);
        }, 500);
      },
      setPriceFilter(index) { // 价格筛选
        this.priceChecked = index;
        this.page = 1;
        this._getGoodsList();
      },
      addCart(productId) { //添加购物车
        axios.post('/goods/addCart', {productId}).then((response) => {
          let res = response.data
          if (res.status === 0) {
            // 弹框提示
            this.mdShowCart = true
            // 添加购物车改变vuex
            this.$store.commit("updateCartCount", 1);
          } else {
            this.mdShow = true
          }
        })
      },
      closeModal() {
        this.mdShow = false
        this.mdShowCart = false
      }
    },
    components: {
      NavHeader,
      NavBread,
      NavFooter,
      Modal
    }
  }
</script>
