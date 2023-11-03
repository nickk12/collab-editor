<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Editor from './components/Editor.vue';

</script>

<template>
  <header>
    
    <div class="wrapper">
      <HelloWorld msg="Leave a message" />
    </div>
  </header>

  <main>
    <Editor/>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    margin-bottom: 30px;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

</style>
