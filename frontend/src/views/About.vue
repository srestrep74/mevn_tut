<template>
  <div class="card">
    <div class="card-header">
      {{ title }}
    </div>
    <div class="card-body">
      <h5 class="card-title">
        <p>{{ description }}</p>
        <p>{{ team }}</p>
      </h5>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AboutView',
  data() {
    return {
      title: 'About us',
      description: 'This is the best movie application in the world!',
      team: 'Developed by Sebastian',
    };
  },
};
</script>
