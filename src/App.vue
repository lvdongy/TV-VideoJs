<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',

  created(){
      const base = 1080; // 设计稿基准值
      const w = document.documentElement.clientWidth;
      let ratio = w / base;
      // if(ratio > 2) ratio = 2;
      // if(ratio < 1) ratio = 1;
      document.documentElement.style.fontSize = ratio * 100 + 'px';
      if(w < 768){
        document.body.style.fontSize = 0.48 + 'rem';
      }else{
        document.body.style.fontSize = 0.16 + 'px';
      }
  }
}
</script>

