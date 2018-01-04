new Vue({
    el: '#popAnalysis',
    data: {
        fdId: 0,//告警类型id
        fdType: 0, //弹窗内容详情判断的条件
        stationId: 'gs', //电站id
        analysisForm: {
            /*fdArg1: 0,
            fdArg2: 0,
            fdArg3: 0,
            fdArg4: null,
            fdArg5: null,
            fdArg6: null,
            fdFaultName: '',
            fdFaultObj: '',
            fdFaultStatu: '',
            fdFreq: 0,
            fdStationCode: '',
            fdType: 0,
            id: 0*/
        }
    },
    methods: {
        // 电站功率/负载发生变化
        /*loadChange () {
            console.log(this.analysisForm.fdArg1)
        },*/
        formChange () {
            if ($('#statusOn').attr('checked')) {
                this.analysisForm.fdFaultStatu = 1
            } else {
                this.analysisForm.fdFaultStatu = 0
            }

            window.parent.analysisForm = this.analysisForm
            // console.log(window.parent.analysisForm)
        },
        formatTime (time) {
            return time + ':00'
        },
        getFdType (fdType) {
            switch (fdType) {
                case 1:
                this.fdType = 1
                break;
                case 2: 
                this.fdType = 2
                break;
                case 3: 
                this.fdType = 3
                break;
                case 4: 
                this.fdType = 4
                break;
                case 5: 
                this.fdType = 5
                break;
                case 6: 
                this.fdType = 6
                break;
                case 7: 
                this.fdType = 7
                break;
                case 8: 
                this.fdType = 8
                break;
            }
        },
        getAnalysisForm () {
            var  _this = this
            _this.fdId = window.parent.fdId
            var layerIndex = layer.load(0, 2);
            $.ajax({
                url: vlm.serverAddr + "tbfaultconfig/info/" + _this.fdId,    //请求地址
                dataType: "json",
                type : "GET",
                success:function(res){
                    layer.close(layerIndex);
                    if (res.code == 0) {
                        var form = res.tbfaultconfig
                        _this.analysisForm = res.tbFaultConfig
                        if (_this.fdId == 2 || _this.fdId == 7) {
                            _this.analysisForm.fdArg1 = _this.formatTime(_this.analysisForm.fdArg1)
                            _this.analysisForm.fdArg2 = _this.formatTime(_this.analysisForm.fdArg2)
                        }
                    }
                    window.parent.analysisForm = _this.analysisForm
                },
                error: function () {
                    console.log(error)
                }
            });
        }
    },
    mounted: function () {
    },
    created: function () {
        this.getFdType(window.parent.fdType)
        this.getAnalysisForm()
    },
    watch: {
        analysisForm (v1, v2) {
            console.log(v1)
            console.log(v2)
        }
    }

});