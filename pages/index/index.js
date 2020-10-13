//index.js
import {milks} from '../../data/milks.js';
import {isNumber} from '../../utils/util.js';
//获取应用实例
const app = getApp()

Page({
  data: {
    //indexShow: true,
    milkShow: false,
    submitShow: false,
    milkName: '',
    milks: [],
    progressValue: 0,
    milkPriceError:'',
    diapersPriceError: '',
    otherPriceError: '',
    isLoading: false,
    isDisable: false,
    isReadOnly: false,
    // 计算进度的数量
    priceCount: 3,
    // 以下参数都参与计算进度
    milkPrice: '',
    diapersPrice: '',
    otherPrice: '',
    total: 0
  },

  onLoad: function () {

  },
  submitHandler: function() {
    if (!this.data.milkPrice) {

      this.setData({
        milkPriceError: '请输入奶粉关键字选择奶粉'
      })
      return
    }
    if (!this.data.diapersPrice) {
      this.setData({
        diapersPriceError: '请完善尿不湿价格'
      })
      return
    }
    if (!this.data.otherPrice) {
      this.setData({
        otherPriceError: '请完善其他价格'
      })
      return
    }

    let total = this.getTotal();

    this.setData({
      isLoading:true,
      isDisable:true,
      isReadOnly:true,
      submitShow: true,
      total: total
    })


  },
  // disableIndexShow: function() {
  //   this.setData({
  //     indexShow: !this.data.indexShow
  //   })
  // },
  disableMilkShow: function() {
    this.setData({
      milkShow: false
    })
  },
  disableSubmitShow: function() {
    this.setData({
      isLoading:false,
      isDisable:false,
      isReadOnly:false,
      submitShow: false
    })
  },
  onConfirmMilk: function(event) {
    let {value} = event.detail;
    // console.log(`当前值：${value.text}, 当前索引：${index}`);
    this.setData({
      milkName: value.text,
      milkPrice: parseFloat(value.price).toFixed(2),
      milkPriceError: ''
    })

    this.doProgress()

    this.disableMilkShow();
  },
  inputMilkName: function(event) {
    //console.log(event);
    let _search = this.data.milkName
    let tmp = []
    if (_search) {
        //不区分大小写处理
        var reg = new RegExp(_search, 'ig')
        //es6 filter过滤匹配，有则返回当前，无则返回所有
        tmp = milks.filter(function(e) {
            //console.log(e);
            return e.text.match(reg);
        })
    };
    // console.log(milks);
    // console.log(tmp);
    // return list;
    this.setData({
      milks: tmp.length > 0 ? tmp : milks,
      milkShow: true
    })
  },
  handleDiapersPrice: function(event) {
    this.setData({
      diapersPriceError: ''
    })
    let value = event.detail;
    if (!isNumber(value)) {
      this.setData({
        diapersPriceError: '必须是正数'
      })
      return false
    }
    this.setData({
      diapersPrice: parseFloat(value).toFixed(2)
    })

    this.doProgress()

  },
  handleOtherPrice: function(event) {
    this.setData({
      otherPriceError: ''
    })
    let value = event.detail;
    if (!isNumber(value)) {
      this.setData({
        otherPriceError: '必须是正数'
      })
      return false
    }
    this.setData({
      otherPrice: parseFloat(value).toFixed(2)
    })

    this.doProgress()

  },
  doProgress: function() {
    let count = 0;
    if (this.data.milkPrice !== '') {
      count++;
    }
    if (this.data.diapersPrice !== '') {
      count++;
    }
    if (this.data.otherPrice !== '') {
      count++;
    }

    let progress = (count / this.data.priceCount) * 100
    this.setData({
      progressValue: parseInt(progress)
    })
  },
  getTotal: function() {
    let total = (this.data.milkPrice * 4) + (this.data.diapersPrice * 10 * 30) + (this.data.otherPrice * 1)
    return parseFloat(total).toFixed(2)
  }
})
