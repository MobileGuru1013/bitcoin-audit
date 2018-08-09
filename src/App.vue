<template>
  <div>
    <nav class="light-blue lighten-1" role="navigation">
      <div class="nav-wrapper container">
        <a href="/" class="brand-logo">Bitcoin Auditor</a>

        <ul class="right hide-on-med-and-down">
          <li :class="{active: demo}"><a href="#demo" @click="fetch(true)">Demo</a></li>
          <li><a href="https://github.com/bhdouglass/bitcoin-auditor">About</a></li>
        </ul>

        <ul id="nav-mobile" class="side-nav">
          <li :class="{active: demo}"><a href="#demo" @click="fetch(true)">Demo</a></li>
          <li><a href="https://github.com/bhdouglass/bitcoin-auditor">About</a></li>
        </ul>

        <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="fa fa-bars"></i></a>
      </div>
    </nav>

    <div class="container">
      <div v-if="showToken">
        <div class="row">
          <form class="col s12">
            <h3 class="center-align">Track your <a href="http://slushpool.com" rel="nofollow noreferrer noopener">Slush Pool</a> bitcoin miners</h3>

            <div class="input-field">
              <input id="token" type="text" v-model="token" />
              <label for="token">API Token</label>
            </div>

            <a class="waves-effect waves-light btn" @click="fetch()">Go!</a>
          </form>
        </div>
      </div>

      <div v-else>
        <div class="center-align" v-if="loading">
          <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div>
              <div class="gap-patch">
                <div class="circle"></div>
              </div>
              <div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>

            <div class="spinner-layer spinner-red">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div>
              <div class="gap-patch">
                <div class="circle"></div>
              </div>
              <div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>

            <div class="spinner-layer spinner-yellow">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div>
              <div class="gap-patch">
                <div class="circle"></div>
              </div>
              <div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>

            <div class="spinner-layer spinner-green">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div>
              <div class="gap-patch">
                <div class="circle"></div>
              </div>
              <div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="row">
            <div class="col s12 m6">
              <div class="card cyan lighten-5">
                <div class="card-content">
                  <div class="card-title">
                    <i class="fa fa-btc green-text"></i>
                    {{reward}}
                  </div>
                </div>

                <div class="card-action">
                  {{threshold.toFixed(2)}}% of the way to a payout
                </div>
              </div>
            </div>

            <div class="col s12 m6">
              <div class="card cyan lighten-5">
                <div class="card-content">
                  <div class="card-title">
                    <i class="fa fa-dashboard" :class="{'green-text': (alive_workers == total_workers), 'red-text': (alive_workers === 0), 'yellow-text': (alive_workers > 0 && alive_workers < total_workers)}"></i>
                    {{hashrate | hashrate}}
                  </div>
                </div>

                <div class="card-action">
                  {{alive_workers}}/{{total_workers}} workers alive
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div v-for="(worker, index) in workers" class="col s12 m6" v-bind:class="{'offset-m3': (index == (workers.length - 1) && (workers.length % 2) == 1)}">
              <worker
                :name="worker.name"
                :score="worker.score"
                :shares="worker.shares"
                :hashrate="worker.hashrate"
                :alive="worker.alive"
              ></worker>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed-action-btn click-to-toggle">
      <a class="btn-floating btn-large red waves-effect waves-light" @click="fetch(false); $event.stopPropagation()" v-if="demo">
        <i class="fa fa-close"></i>
      </a>

      <a class="btn-floating btn-large green waves-effect waves-light" @click="fetch(false); $event.stopPropagation()" v-else>
        <i class="fa fa-refresh"></i>
      </a>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import axios from 'axios';
  import Worker from './components/Worker';
  import demoData from './assets/demo_data.json';

  export default {
    name: 'App',
    components: {
      worker: Worker,
    },
    created() {
      Vue.nextTick(() => {
        window.$('.button-collapse').sideNav();
      });

      if (window.location.hash === '#demo') {
        this.demo = true;
      }

      let token = window.localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.showToken = false;
      }

      this.fetch(this.demo);
    },
    data() {
      return {
        token: '',
        showToken: true,
        loading: false,
        demo: false,

        alive_workers: 0,
        total_workers: 0,
        reward: 0,
        threshold: 0,
        hashrate: 0,
        workers: [],
      };
    },
    methods: {
      fetch(demo) {
        this.demo = demo;
        if (window.location.hash === '#demo' && !this.demo) {
          window.location.hash = '';
        }

        if (this.demo) {
          this.loading = false;
          this.alive_workers = demoData.alive_workers;
          this.total_workers = demoData.total_workers;
          this.reward = demoData.reward;
          this.threshold = demoData.threshold;
          this.hashrate = demoData.hashrate;
          this.workers = demoData.workers;
        }
        else if (this.token) {
          this.showToken = false;
          this.loading = true;

          axios.get(`https://slushpool.com/accounts/profile/json/${this.token}`).then((res) => {
            let reward = parseFloat(res.data.unconfirmed_reward) +
              parseFloat(res.data.confirmed_reward);

            this.alive_workers = 0;
            this.total_workers = 0;
            this.reward = reward;
            this.threshold = (reward / parseFloat(res.data.send_threshold)) * 100;
            this.hashrate = parseInt(res.data.hashrate, 10);
            this.workers = [];

            Object.keys(res.data.workers).forEach((name) => {
              let worker = res.data.workers[name];

              this.workers.push({
                name: name.replace(`${res.data.username}.`, ''),
                score: parseFloat(worker.score),
                shares: parseFloat(worker.shares),
                hashrate: parseFloat(worker.hashrate),
                alive: worker.alive,
              });

              this.total_workers += 1;
              if (worker.alive) {
                this.alive_workers += 1;
              }
            });

            localStorage.setItem('token', this.token);
            this.loading = false;
          }).catch((err) => {
            console.error(err); // TODO error handling
          });
        }
        else {
          this.alive_workers = 0;
          this.total_workers = 0;
          this.reward = 0;
          this.threshold = 0;
          this.hashrate = 0;
          this.workers = [];
        }
      },
    },
  };
</script>

<style scoped>
  .center-align {
    margin-top: 2em;
  }
</style>
