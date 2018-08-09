<template>
  <div class="card">
    <div class="card-content">
      <div class="card-title">
        <div class="row">
          <div class="col s6">
            <i class="fa" :class="{'green-text fa-power-off': alive, 'red-text fa-warning': !alive}"></i>
            {{name}}
          </div>
          <div class="col s6 right-align">
            {{hashrate | hashrate}}
          </div>
        </div>
      </div>
    </div>

    <div class="card-action">
      <div class="row">
        <div class="col s6">Shares: {{shares}}</div>
        <div class="col s6 right-align">Score: {{score.toFixed(2)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Worker',
    props: ['name', 'score', 'shares', 'hashrate', 'alive'],
  };
</script>

<style scoped>
  .card-action span {
    margin-right: 2em;
  }

  .row {
    margin-bottom: 0;
  }
</style>
