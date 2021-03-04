let arr = [
  {
    nameValue: "gordon",
    scoreValue: "99",
    salaryValue: "1.8",
  },
  {
    nameValue: "claudia",
    scoreValue: "98",
    salaryValue: "1.6",
  },
];
let flag = false;
function showData() {
  // 先清空数组
  $(".data").empty();
  // 遍历数组
  arr.forEach((item, index) => {
    let modData = `<div class="item" idx = ${index}>
                            <span class="metadata">
                                <span class="info">${item.nameValue}</span>
                                <input type="text" class="ipt-name el-none">
                            </span>
                            <span class="metadata">
                                <span class="info">${item.scoreValue}</span>
                                <input type="text" class="ipt-score el-none">
                            </span>
                            <span class="metadata">
                                <span class="info">${item.salaryValue}</span>
                                <input type="text" class="ipt-salary el-none">
                            </span>
                            <span class="metadata">
                                <i class="upd"></i>
                                <i class="del" index="1"></i>
                                <i class="yes el-none" index="1"></i>
                                <i class="no el-none"></i>
                            </span>
                        </div>
    `;
    $(".data").append(modData);
  });
}
// 一开始就展示
showData();
// ========================================
// 这是图表数据函数  传入类型就行 会返回其中的option
function getOption(text, type, xArr, numArr) {
  let option = {
    grid: {
      left: "7%",
      top: "13%",
      bottom: "9%",
      right: "3%",
    },
    title: {
      show: true,
      text: text,
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      type: "category",
      axisLabel: {
        color: "#fff",
      },
      axisLine: {
        show: true,
        onZero: true,
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#fff",
        },
      },
      data: xArr,
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: "#fff",
      },
      axisLine: {
        show: true,
        onZero: true,
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#fff",
        },
      },
    },
    series: [
      {
        data: numArr,
        type: type,
        itemStyle: {
          color: "#1e90ff",
        },
      },
    ],
  };
  return option;
}
// 图表数据更新函数==============
function upDate(text, type, Value) {
  // 获取数组中的X轴数据
  let xArr = arr.map((item) => item.nameValue);
  // 获取数组中的评分数据
  let numArr = arr.map((item) => item[Value]);
  // 获取与数组信息对应的图标数据
  let option = getOption(text, type, xArr, numArr);
  return option;
}
// 图表刷新
function refresh() {
  barEcharts.setOption(upDate("评分图示", "bar", "scoreValue"));
  lineEcharts.setOption(upDate("薪资图示", "line", "salaryValue"));
}
// ----------------------------------------
// 柱状图
$(function () {
  // 实例化echarts对象
  barEcharts = echarts.init($(".bar-view .bar")[0]);

  let option = upDate("评分图示", "bar", "scoreValue");
  // 绘制图表
  barEcharts.setOption(option);

  $(window).on("resize", function () {
    barEcharts.resize();
  });
});
// 折线图
$(function () {
  lineEcharts = echarts.init($(".line")[0]);
  let option = upDate("薪资图示", "line", "salaryValue");
  lineEcharts.setOption(option);
  $(window).on("resize", function () {
    lineEcharts.resize();
  });
});

// ===============================================
// 新增数据功能
$(function () {
  $(".add-btn").click(function () {
    if (flag === true) {
      alert("请完成当前操作！");
      return;
    }
    let nameValue = $(".name").val().trim();
    let scoreValue = $(".score").val().trim();
    let salaryValue = $(".salary").val().trim();
    if (nameValue === "" || scoreValue === "" || salaryValue === "") {
      alert("请输入完整信息！");
      return;
    } else if (scoreValue <= 0 || salaryValue <= 0) {
      alert("请输入大于0的数");
      return;
    } else {
      let obj = {
        nameValue,
        scoreValue,
        salaryValue,
      };
      arr.unshift(obj);
      $(".name").val("");
      $(".score").val("");
      $(".salary").val("");
    }
    // 展示数据
    showData();

    // 更新图表
    refresh();
  });
  $(".name").keyup(function (e) {
    if (e.keyCode === 13) {
      $(".add-btn").click();
    }
  });
  $(".score").keyup(function (e) {
    if (e.keyCode === 13) {
      $(".add-btn").click();
    }
  });
  $(".salary").keyup(function (e) {
    if (e.keyCode === 13) {
      $(".add-btn").click();
    }
  });
});

// 设置按键功能
$(function () {
  // 由于是动态生成的，所以要注册事件委托
  // 设置键
  $(".data").on("click", ".upd", function () {
    if (flag === true) {
      alert("请完成当前操作！");
      return;
    }
    $(this)
      .parent()
      .siblings()
      .children("input")
      .removeClass("el-none")
      .siblings(".info")
      .addClass("el-none");
    $(this)
      .addClass("el-none")
      .siblings(".del")
      .addClass("el-none")
      .siblings(".yes, .no")
      .removeClass("el-none");
    flag = true;
  });
  // 取消键
  $(".data").on("click", ".no", function () {
    flag = false;
    $(this)
      .parent()
      .siblings()
      .children("input")
      .addClass("el-none")
      .siblings(".info")
      .removeClass("el-none");
    $(this)
      .addClass("el-none")
      .siblings(".yes")
      .addClass("el-none")
      .siblings(".upd, .del")
      .removeClass("el-none");
  });

  // 保存键
  $(".data").on("click", ".yes", function () {
    let index = $(this).parents(".item").attr("idx");
    let tab0Val = $(this)
      .parent()
      .siblings()
      .children("input")
      .eq(0)
      .val()
      .trim();
    let tab1Val = $(this)
      .parent()
      .siblings()
      .children("input")
      .eq(1)
      .val()
      .trim();
    let tab2Val = $(this)
      .parent()
      .siblings()
      .children("input")
      .eq(2)
      .val()
      .trim();
    if (tab0Val === "") {
      alert("请输入完整数据");
      return;
    } else {
      arr[index].nameValue = tab0Val;
    }
    if (tab1Val === "") {
      alert("请输入完整数据");
      return;
    } else {
      arr[index].scoreValue = tab1Val;
    }
    if (tab2Val === "") {
      alert("请输入完整数据");
      return;
    } else {
      arr[index].salaryValue = tab2Val;
    }
    // 保存完成后，修改flag为false
    flag = false;
    showData();

    refresh();
  });

  // 删除键
  $(".data").on("click", ".del", function () {
    if (flag === true) {
      alert("请完成当前操作！");
      return;
    }
    let index = $(this).parents(".item").attr("idx");
    // 根据下标去删除
    arr.splice(index, 1);
    showData();
    // 刷新图表
    refresh();
  });
});
