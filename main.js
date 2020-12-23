new Vue({
  data: {
    seconds: 0,
    timer: null,
    speed: 1000,
    showScore: false,
    count: 0,
    currentNumber: 0,
    scores: []
  },
  methods: {
    quit() {
      clearInterval(this.timer);
      this.seconds = 0;
      this.count = 0;
      this.timer = null;
      this.currentNumber = null;
    },
    start() {
      this.seconds = 0;
      this.count = 0;
      
      if(this.timer != null) {
        clearInterval(this.timer)
      }

      
      this.timer = setInterval(() => {

        if(this.count > 2) {
          this.speed = 800;
        } 
        
        if (this.count > 4) {
          this.speed = 500;
        }  
        
        if(this.count > 15) {
          this.speed = 200;
        }

        this.setRandomNum();
        this.seconds++;
      }, this.speed);

      this.setRandomNum();
    },

    setRandomNum() {
      this.currentNumber = Math.floor((Math.random() * 25) + 1);
    },

    buttonClass(num) {
      var classNames = ['circle-button'];
      if(num == this.currentNumber) {
        classNames.push('current-button');
      }

      return classNames;
    },

    strPad(num) {
      let str = num.toString();

      if(str.toString().length == 1) {
        str = '0' + str;
      }

      return str;
    },

    score(num, count) {
      if(num == this.currentNumber) {
        this.count = count + 1;
      }
    },

    sendScore(data) {
      fetch(`https://whack-a-mole-d24d1-default-rtdb.firebaseio.com/score.json`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(res => {
        return res.json();
      }).then(result => {
        console.log('Score has been saved', result);
        this.showScore = true;
      }).catch((err) => {
        throw new Error(err);
      })
    },

    getScores () {
      fetch(`https://whack-a-mole-d24d1-default-rtdb.firebaseio.com/score.json`)
      .then(res => {
        return res.json();
      }).then(data => {
        console.log(data);

        for(const key in data) {
          const score = {
            id: key,
            name: data[key].name,
            score: data[key].score,
            time: data[key].time
          };
    
          this.scores.push(score);
        }

      }).catch((err) => {
        throw new Error(err);
      })
    },

    triggerPopup() {
      this.showScore = !this.showScore;
    }
    
  },
  computed: {
    secInHMS() {
      const hrs = Math.floor(this.seconds / 3600);
      const mins = Math.floor(this.seconds % 3600 / 60);
      const secs = Math.floor(this.seconds % 3600 % 60);
      return this.strPad(hrs) + ':' + this.strPad(mins) + ':' + this.strPad(secs);
    },
  },
  watch: {
    count() {
      if (this.count == 8) {
        let name = prompt('Your name?');
        alert(`${name} your high score is ${this.count}`);
        const data = {
          name: name,
          score: this.count,
          time: this.secInHMS
        };

        this.sendScore(data);
        this.quit();
      }
    }
  },
  created() {
    this.getScores();
  }
}).$mount('#app');