export default {
  methods: {
    clearForm(model) {
      this[model] = this.$options.data()[model]
      this.$nextTick(() => {
        this.$refs[model].clearValidate()
      })
    }
  }
}
