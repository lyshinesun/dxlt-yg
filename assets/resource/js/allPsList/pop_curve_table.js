new Vue({
  el: '#popCurve',
  data: {
    curveData:[],
    newData:[]
  },
  methods: {
    formateData: function (data) {
      var newData = []
        /*for (var j=0; j< data[0].length; j++) {
          newData[j] = {}
          newData[j].time = data[0][j].fd_datetime
          for (var i=0; i < data.length; i++) {
            if (data[i][j].fd_value) {
              newData[j]['value' + i ] = data[i][j].fd_value
            } else {
              newData[j]['value' + i ] = '--'
            }
          }
        }*/

        for (var j=0; j< data[0].length; j++) {
          newData[j] = []
          newData[j][0] = data[0][j].fd_datetime
          for (var i=0; i < data.length; i++) {
            if (data[i][j]) {
              newData[j][i+1] = data[i][j].fd_value
            } else {
              newData[j][i+1] = '--'
            }
          }
        }
      return newData
    },
    fillTable: function () {
      for (var item in this.newData) {

      }
    }
  },
  mounted: function () {
    this.curveData = window.parent.curveData
    this.newData = this.formateData(window.parent.curveData)
    console.log(this.curveData)
  }
});


/*var list = [
  [{
    time: 1,
    value: 10
  }, {
    time: 2,
    value: 20
  }, {
    time: 3,
    value: 30
  }],[{
    time: 1,
    value: 11
  }, {
    time: 2,
    value: 21
  }, {
    time: 3,
    value: 31
  }],[{
    time: 1,
    value: 12
  }, {
    time: 2,
    value: 22,
  }, {
    time: 3,
    value: 32,
  }]
]
var list = [
  {
    time: 1,
    value1: 10,
    value2: 11,
    value3: 12
  }, {
    time: 2,
    value1: 20,
    value2: 21,
    value3: 22
  }, {
    time: 3,
    value1: 30,
    value2: 31,
    value3: 32
  }
]*/