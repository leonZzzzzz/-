<template>
  <div>
    <input type="text" v-model="model.a" />
    <Pp :my-data="model"></Pp>
  </div>
</template>

<script>
import Pp from './props'
export default {
  components: { Pp },
  data() {
    return {
      model: {
        a: 1,
        b: 2
      }
    }
  }
}
</script>

<style></style>
