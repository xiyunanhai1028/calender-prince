/*
 * @Author: dfh
 * @Date: 2020-05-19 09:15:53
 * @Last Modified by: dfh
 * @Last Modified time: 2020-05-19 13:56:20
 * */
class Calender {
  constructor(options) {
    this.options = {
      element: false,
      index: 4, // 默认展示的月份
      delay: 4, //默认延迟几天可以选择
      bgColor: "#eb8300", // 默认选中后的背景颜色
      color: "#ffd101", // 默认选中的文字颜色
      unClickTxtColor: "#ccc", //不能选择的字体颜色
      headerBgColor: "white",
      weekendTxtColor: "#ffd101", //默认周六周日的文字颜色
      workDayTxtColor: "black",
      bgCalender: "white",
      arrayJSON: "", //传递的数据
      callback: function () {}, //确定后的回调
      ...options, //自定义的属性
    };
    this.init();
  }

  init() {
    if (!this.options.element || this.options.element.nodeType !== 1) return;
    const html = `
          <table style="background:${this.options.headerBgColor};" class="dateZone border-b" data-fixed="">
              <tr>
              <td style="background:${this.options.headerBgColor};color:${this.options.weekendTxtColor}">日</td>
              <td style="background:${this.options.headerBgColor};color:${this.options.workDayTxtColor}">一</td>
              <td style="background:${this.options.headerBgColor};color:${this.options.workDayTxtColor}">二</td>
              <td style="background:${this.options.headerBgColor};color:${this.options.workDayTxtColor}">三</td>
              <td style="background:${this.options.headerBgColor};color:${this.options.workDayTxtColor}">四</td>
              <td style="background:${this.options.headerBgColor};color:${this.options.workDayTxtColor}">五</td>
              <td style="background:${this.options.headerBgColor};color:${this.options.weekendTxtColor}">六</td>
              </tr>
          </table>
          <div class="tbody"></div>
          `;
    this.options.element.innerHTML = html;
    let tHTML,
      currentYear,
      currentMonth,
      setCurrentDate,
      firstDay,
      DaysInMonth = [],
      Ntd,
      Ntr,
      createTd,
      anyTd,
      p;

    for (let i = 0; i < this.options.index; i++) {
      tHTML = `
          <div class='itemMonth  border-b' style="background:${this.options.bgCalender}">
            <p class='month'></p><table class='table' style='width: 100%;position: relative'><tbody class='dateTable'></tbody></table>
          </div>
          `;
      this.options.element
        .querySelector(".tbody")
        .insertAdjacentHTML("beforeEnd", tHTML);
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + i);
      //当前的年
      currentYear = currentDate.getFullYear();
      //当前的月
      currentMonth = currentDate.getMonth();
      setCurrentDate = new Date(currentYear, currentMonth, 1);
      //当前的日
      firstDay = setCurrentDate.getDay();
      const month = currentMonth + 1;
      if (month < 10) {
        this.options.element.querySelectorAll(".month")[
          i
        ].innerText = `${currentYear}年0${month}月`;
      } else {
        this.options.element.querySelectorAll(".month")[
          i
        ].innerHTML = `${currentYear}年${month}月`;
      }
      if (this.isLeapYear(currentYear)) {
        //是闰年
        DaysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      } else {
        DaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      }

      Ntd = firstDay + DaysInMonth[currentMonth];
      Ntr = Math.ceil(Ntd / 7);
      for (let j = 0; j < Ntr; j++) {
        this.options.element
          .querySelectorAll(".dateTable")
          [i].insertAdjacentHTML("beforeEnd", `<tr></tr>`);
      }
      createTd = this.options.element
        .querySelectorAll(".dateTable")
        [i].querySelectorAll("tr");
      createTd.forEach((el) => {
        for (let i = 0; i < 7; i++) {
          el.insertAdjacentHTML("beforeEnd", `<td></td>`);
        }
      });
      anyTd = this.options.element
        .querySelectorAll(".dateTable")
        [i].querySelectorAll("td");
      for (let i = 0; i < DaysInMonth[currentMonth]; i++) {
        p = firstDay++;
        if (this.options.arrayJSON && this.options.arrayJSON.length > 0) {
          anyTd[p].innerHTML = `
            <div class="con">
                ${i + 1}
            </div>    
          `;
          let d = "",
            m = "";
          if (currentMonth < 10) {
            m = `0${currentMonth}`;
          } else {
            m = currentMonth;
          }
          if (i + 1 < 10) {
            d = `0${i + 1}`;
          } else {
            d = i + 1;
          }

          this.options.arrayJSON.forEach((el) => {
            if (
              m == el.date.substring(5, 7) &&
              currentYear == el.date.substring(0, 4) &&
              d == parseInt(el.date.substring(8, 10))
            ) {
              anyTd[p]
                .querySelector(".con")
                .insertAdjacentHTML(
                  "beforeEnd",
                  '<p class="fs10" data-id="' +
                    el.id +
                    '" data-price="' +
                    el.price +
                    '">' +
                    "<span>" +
                    el.price +
                    "</span>" +
                    "</p>"
                );
              anyTd[p].querySelector(".con").classList.add("border");
            }
          });
        } else {
          anyTd[p].innerText = i + 1;
        }
      }
    }
    this.initClick();
  }

  //是不是闰年
  isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  //点击事件
  initClick() {
    //获取当前的日期
    let strDays = new Date().getDate();
    const arr = [
      ...this.options.element.querySelector(".tbody").querySelectorAll("td"),
    ].reduce((prev, current) => {
      if (current.innerText !== "") {
        prev.push(current);
      }
      return prev;
    }, []);
    //设置今天之前的颜色设置为灰色
    for (let i = 0; i < strDays - 1 + this.options.delay; i++) {
      arr[i].style.color = this.options.unClickTxtColor;
    }
    let arr1 = [];
    //数字倒序
    for (var i = strDays - 1 + this.options.delay; i < arr.length; i++) {
      arr1.push(arr[i]);
    }
    console.log(this.options.element);
    this.selectDate(arr1);
  }

  selectDate(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].onclick = (event) => {
        event.preventDefault();
        arr.forEach((el) => {
          el.classList.remove("sel");
          el.style.color = "";
        });
        arr[i].classList.add("sel");
        arr[i].style.color = this.options.color;
        this.setResponse();
      };
    }
  }

  //设置点击后回调的值
  setResponse() {
    this.date = "";
    this.price = "";
    this.id = "";
    const sels = this.options.element.querySelectorAll(".sel");
    sels.forEach((item) => {
      const id = item.querySelector("p")
        ? item.querySelector("p").getAttribute("data-id")
        : item.innerText.substring(0, 2);
      const day =
        item.innerText.substring(0, 2) < 10
          ? `0${item.innerText.substring(0, 2)}`
          : item.innerText.substring(0, 2);
      //offsetParent：返回一个指向最近的（指包含层级上的最近）包含该元素的定位元素或者最近的 table,td,th,body元素
      //previousSibling:返回当前节点的前一个兄弟节点,注意不能有空格
      const startDayArrays = item.offsetParent.previousSibling.innerText.split(
        ""
      );
      let startDayArrayYear = [],
        startDayArrayMonth = [],
        startDayYear = "",
        startDayMonth = "",
        date = "",
        price = "";
      for (let i = 0; i < 4; i++) {
        startDayArrayYear.push(startDayArrays[i]);
      }
      startDayYear = startDayArrayYear.join("");
      for (let i = 5; i < 7; i++) {
        startDayArrayMonth.push(startDayArrays[i]);
      }
      startDayMonth = startDayArrayMonth.join("");
      date = `${startDayYear}-${startDayMonth}-${day}`;
      price = item.querySelector("p")
        ? item.querySelector("p").getAttribute("data-price")
        : "";
      this.price = price;
      this.date = date;
      this.id = id;
    });
    if (!this.date) return;
    this.callback();
  }

  checkColor(color, bgColor) {
    const sel = this.options.element.querySelectorAll(".sel");
    for (let i = 0; i < sel.length; i++) {
      sel[i].style.background = bgColor;
      sel[i].style.color = color;
    }
  }

  addEvent(el, type, fn) {
    if (window.attachEvent) {
      el.attachEvent(`on${type}`, fn);
    } else if (window.addEventListener) {
      el.addEventListener(type, fn, false);
    } else {
      el[`on${type}`] = fn;
    }
  }

  callback() {
    if (this.options.callback && typeof this.options.callback === "function") {
      this.options.callback({
        date: this.date || "",
        price: this.price || "",
        id: this.id || "",
      });
    }
  }
}
module.exports = Calender;
