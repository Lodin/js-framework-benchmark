import hyperHTML from 'hyperhtml';

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

let startTime;
let lastMeasure;

const startMeasure = (name) => {
  startTime = performance.now();
  lastMeasure = name;
};

const stopMeasure = () => {
  const last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function () {
      lastMeasure = null;
      const stop = performance.now();
      const duration = 0;
      console.log(last + ' took ' + (stop - startTime));
    }, 0);
  }
};

class Store {
  constructor() {
    this.data = [];
    this.backup = null;
    this.selected = null;
    this.id = 1;
  }

  buildData(count = 1000) {
    const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
    const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
    const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: this.id++,
        label: `${adjectives[_random(adjectives.length)]}  ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
      });
    }
    return data;
  }

  updateData(mod = 10) {
    for (let i = 0; i < this.data.length; i += 10) {
      this.data[i].label += ' !!!';
    }
  }

  delete(id) {
    const idx = this.data.findIndex(d => d.id === id);
    this.data = this.data.filter((e, i) => i !== idx);
    return this;
  }

  run() {
    this.data = this.buildData();
    this.selected = null;
  }

  add() {
    this.data = this.data.concat(this.buildData(1000));
    this.selected = null;
  }

  update() {
    this.updateData();
    this.selected = null;
  }

  select(id) {
    this.selected = id;
  }

  hideAll() {
    this.backup = this.data;
    this.data = [];
    this.selected = null;
  }

  showAll() {
    this.data = this.backup;
    this.backup = null;
    this.selected = null;
  }

  runLots() {
    this.data = this.buildData(10000);
    this.selected = null;
  }

  clear() {
    this.data = [];
    this.selected = null;
  }

  swapRows() {
    if (this.data.length > 10) {
      const a = this.data[4];
      this.data[4] = this.data[9];
      this.data[9] = a;
    }
  }
}

const render = (arr, i) => arr[i] || (arr[i] = hyperHTML.wire());

class Main {
  constructor(props) {
    this.store = new Store();
    this.select = this.select.bind(this);
    this.delete = this.delete.bind(this);
    this.add = this.add.bind(this);
    this.run = this.run.bind(this);
    this.update = this.update.bind(this);
    this.trs = [];

    document.getElementById('main').addEventListener('click', e => {
      if (e.target.matches('#add')) {
        e.preventDefault();
        //console.log("add");
        this.add();
      }
      else if (e.target.matches('#run')) {
        e.preventDefault();
        //console.log("run");
        this.run();
      }
      else if (e.target.matches('#update')) {
        e.preventDefault();
        //console.log("update");
        this.update();
      }
      else if (e.target.matches('#hideall')) {
        e.preventDefault();
        //console.log("hideAll");
        this.hideAll();
      }
      else if (e.target.matches('#showall')) {
        e.preventDefault();
        //console.log("showAll");
        this.showAll();
      }
      else if (e.target.matches('#runlots')) {
        e.preventDefault();
        //console.log("runLots");
        this.runLots();
      }
      else if (e.target.matches('#clear')) {
        e.preventDefault();
        //console.log("clear");
        this.clear();
      }
      else if (e.target.matches('#swaprows')) {
        e.preventDefault();
        //console.log("swapRows");
        this.swapRows();
      }
    });

    this.tbody = document.getElementById('tbody');
  }

  render() {
    hyperHTML.bind(this.tbody)`${
      this.store.data.map((item, i) => render(this.trs, i)`
      <tr class="${item.id === this.store.selected ? 'danger' : ''}">
        <td class="col-md-1">${item.id}</td>
        <td class="col-md-4">
          <a onclick="${() => this.select(item.id)}">${item.label}</a>
        </td>
        <td class="col-md-1">
          <a onclick="${() => this.delete(item.id)}">
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </a>
        </td>
        <td class="col-md-6"></td>
      </tr>`
      )}`;
  }

  run() {
    startMeasure('run');
    this.store.run();
    this.render();
    stopMeasure();
  }

  add() {
    startMeasure('add');
    this.store.add();
    this.render();
    stopMeasure();
  }

  update() {
    startMeasure('update');
    this.store.update();
    this.render();
    stopMeasure();
  }

  select(id) {
    startMeasure('select');
    this.store.select(id);
    this.render();
    stopMeasure();
  }

  delete(id) {
    startMeasure('delete');
    this.store.delete(id);
    this.render();
    stopMeasure();
  }

  runLots() {
    startMeasure('runLots');
    this.store.runLots();
    this.render();
    stopMeasure();
  }

  clear() {
    startMeasure('clear');
    this.store.clear();
    this.render();
    stopMeasure();
  }

  swapRows() {
    startMeasure('swapRows');
    this.store.swapRows();
    this.render();
    stopMeasure();
  }
}

new Main();