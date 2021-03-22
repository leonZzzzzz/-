// import LoginDialog from '@/components/common/LoginDialog'

export default {
  // components: {
  //   LoginDialog,
  // },
  data() {
    return {
      digLogin: false,
      isAgain: false
    }
  },
  methods: {
    closeLogin(flag, isAgain) {
      this.isAgain = isAgain || false
      this.digLogin = flag
      console.log('closeLogin', flag, isAgain)
    },
  },
}
