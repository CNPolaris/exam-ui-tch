<template>

</template>

<script>
import {createSmartPaper} from "@/api/exam";

export default {
  name: "smart",
  data(){
    return {
      queryParam: {
        subjectiveNum: 0
      }
    }
  },
  created() {
    createSmartPaper(this.queryParam).then(re => {
      console.log(re.data)
    })
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
