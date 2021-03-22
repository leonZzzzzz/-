<template>
  <div class="simulator-personal">
    <div :style="`height:150px;background:${color}`">
      <div></div>
    </div>
    <img v-if="personalMall == 1" src="./img/personal.jpg" width="100%" />
    <div class="sort-list">
      <div class="menu-item" v-for="item in list" :key="item.id">
        <div style="display: flex;align-items: center;">
          <i class="el-icon-rank" style="margin-right:15px"></i>
          <el-input v-model="item.showName" size="mini" @blur="saveOrUpdateMinMenu()"></el-input>
        </div>
        <el-switch v-model="item.isDisplay" @change="saveOrUpdateMinMenu()"></el-switch>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      isCreateLoad: true,
      list: []
    }
  },
  created() {
    this.getMiniMenu()
  },
  computed: {
    color() {
      return this.$store.getters['editor/theme'].color1
    },
    personalMall() {
      return this.$store.state.editor.personalMall
    }
  },
  mounted() {
    this.onSort()
  },
  methods: {
    getMiniMenu() {
      this.$http.getMiniMenu().then((res) => {
        this.list = res.data.data.map((item) => {
          item.seqNum = item.seqNum2
          return item
        })
        if (this.isCreateLoad) {
          this.saveOrUpdateMinMenu()
          this.isCreateLoad = false
        }
      })
    },
    saveOrUpdateMinMenu(list = this.list) {
      this.$http.saveOrUpdateMinMenu(list).then((res) => {
        this.getMiniMenu()
      })
    },
    onSort() {
      const el = document.querySelector('.sort-list')
      this.sortable = new Sortable.create(el, {
        dragClass: 'sortable-ghost',
        forceFallback: true,
        handle: '.el-icon-rank',
        animation: 200,
        onEnd: (evt) => {
          if (evt.newIndex !== evt.oldIndex) {
            let newList = _.cloneDeep(this.list)
            const targetRow = newList.splice(evt.oldIndex, 1)[0]
            newList.splice(evt.newIndex, 0, targetRow)
            newList.map((item, index) => {
              item.seqNum2 = newList.length - index
              item.seqNum = newList.length - index
              return item
            })
            console.log(JSON.stringify(newList, 0, 1))
            this.saveOrUpdateMinMenu(newList)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sortable-ghost {
  background: #eee;
}
.simulator-personal {
  .menu-item {
    align-items: center;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdcdc;
  }
}
</style>
