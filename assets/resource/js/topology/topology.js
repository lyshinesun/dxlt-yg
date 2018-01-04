/*created by lyshi 2017-11-20*/
new Vue({
  el: '#stationTopology',
  data: {
    contextMenus: [{
      option: '选项一',
      disabled: true
    }, {
      option: '选项二',
      disabled: true
    },{
      option: '选项三',
      disabled: true
    }],
    contextMenuVisible: 'hidden',
    contextMenuPos: {
      top: '0px',
      left:'0px'
    }
  },
  methods: {
    /*阻止浏览器的右单击事件*/
    showContextMenu (e) {
      // console.log(e.clientX, e.clientY)
      this.contextMenuPos.top = e.clientY + 'px'
      this.contextMenuPos.left = e.clientX + 'px'
      document.oncontextmenu = function(){
        return false;
      } 
      this.contextMenuVisible = 'visible'
    },
    stopContextMenu () {
      this.contextMenuVisible = 'hidden'
    },
    selectOption () {
      this.contextMenuVisible = 'hidden'
    }
  }
  ,
  created:function () {
      
  },
  mounted: function () {
      
  }
})