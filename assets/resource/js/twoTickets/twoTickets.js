new Vue({
  el: '#work_ticket',
  data: {
    formSrc: './secondTicket.html'    
  },
  methods: {
    initPageSize () {
      $('.tendency_ri').height($(window).height() - 40).width($(window).width() - 50);
      $('.task_bot_table_wrap').css('maxHeight', $(window).height() - 210);
      $(window).resize(function () {
        $('.tendency_ri').height($(window).height() - 40).width($(window).width() - 50);
        $('.task_bot_table_wrap').css('maxHeight', $(window).height() - 210);
      })
    },
    selectTicket (e) {
      var _this = this,
      obj = $(e.target)
      if (obj.attr('id') == 'second_ticket') {
        _this.formSrc = './secondTicket.html'
      } else {
        _this.formSrc = './operTicket.html'
      }
    }
  },
  mounted () {
    this.initPageSize()
  }
})