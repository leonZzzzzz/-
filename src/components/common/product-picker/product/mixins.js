export default {
  mounted() {
    this.$nextTick(() => {
      this.winodwChange()
      window.onresize = () => {
        this.winodwChange()
      }
    })
  },
  methods: {
    winodwChange() {
      this.option.height = window.innerHeight - 260 + 'px'
    }
  },
  destroyed() {
    window.onresize = ''
  }
}
