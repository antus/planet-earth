$(function () {
  $(window).resize(refHeight)
  refHeight()

  //Switch tab
  $(".mp_tab_tit li").click(function () {
    if ($(this).hasClass("cur") || $(this).hasClass("disabled")) {
      return false
    } else {
      let that = $(this),
        index = that.index()
      that.addClass("cur").siblings("li").removeClass("cur")
      that.parent().siblings(".mp_tab_con").children().eq(index).addClass("cur").siblings().removeClass("cur")

      let _id = $(this).attr("id")
      localforage.setItem(storageName, _id)
    }
  })

  $("#tab_attr").click(function () {
    $(".mp_tab_ava").hide()
    $(".mp_tab_con").show()
  })

  $("#tab_availability").click(function () {
    $(".mp_tab_con").hide()
    $(".mp_tab_ava").show()
  })

  // mp_tree
  $(".open").click(changeOpenShowHide)
})

// function tab2plot() {
//     $("#tab_attr").addClass('disabled');
//     $("#tab_latlng").addClass('disabled');
//     $("#tab_plot").click();
// }

var storageName = "mars3d_plotAttr"

function tab2attr() {
  // $("#tab_attr").removeClass('disabled');
  // $("#tab_latlng").removeClass('disabled');

  // if ($("#tab_plot").hasClass('cur'))

  //Read localStorage value
  localforage.getItem(storageName).then(function (last_attr_tab) {
    if (last_attr_tab != null) {
      $("#" + last_attr_tab).click()
    } else {
      $("#tab_attr").click()
    }
  })
}

function changeOpenShowHide() {
  let openlis = $(this).siblings()
  let opent = $(this).children(".tree_icon")
  openlis.toggle()
  if (openlis.is(":hidden")) {
    opent.html("+")
  } else {
    opent.html("-")
  }
}

function refHeight() {
  $(".mp_tab_card").height($(".mp_box").height() - $(".mp_head").height() - 1)
  $(".mp_tree").height($(".mp_tab_card").height() - 32)
  $(".mp_mark").height($(".mp_tab_card").height() - 80)
}

;(function ($) {
  //Default parameters of drop-down menu
  let defaluts = {
    select: "mp_select",
    select_text: "mp_select_text",
    select_ul: "mp_select_ul"
  }

  $.fn.extend({
    // Drop-down menu
    select: function (options) {
      let opts = $.extend({}, defaluts, options)
      return this.each(function () {
        let that = $(this)
        //Simulate drop-down list
        if (that.data("value") !== undefined && that.data("value") !== "") {
          that.val(that.data("value"))
        }
        let _html = []
        _html.push('<div class="' + that.attr("class") + '">')
        _html.push('<div class="' + opts.select_text + '">' + that.find(":selected").text() + "</div>")
        _html.push('<ul class="' + opts.select_ul + '">')
        that.children("option").each(function () {
          let option = $(this)
          if (that.data("value") == option.val()) {
            _html.push('<li data-value="' + option.val() + '">' + option.text() + "</li>")
          } else {
            _html.push('<li data-value="' + option.val() + '">' + option.text() + "</li>")
          }
        })
        _html.push("</ul>")
        _html.push("</div>")
        let select = $(_html.join(""))
        let select_text = select.find("." + opts.select_text)
        let select_ul = select.find("." + opts.select_ul)
        that.after(select)
        that.hide()
        //drop-down list operation
        select.click(function (event) {
          $(this).toggleClass("mp_selected")
          $(this)
            .find("." + opts.select_ul)
            .slideToggle()
            .end()
            .siblings("div." + opts.select)
            .find("." + opts.select_ul)
            .slideUp()
          event.stopPropagation()
        })
        $("body").click(function () {
          select_ul.slideUp()
        })
        select_ul.on("click", "li", function () {
          let li = $(this)
          let val = li.addClass("selecton").siblings("li").removeClass("selecton").end().data("value").toString()
          if (val !== that.attr("data-value")) {
            select_text.text(li.text())
            that.attr("data-value", val)
            that.change()
          }
        })
      })
    },

    //Slider bar
    progress: function (max) {
      let opts = {
        progress: "puiprogress",
        progress_bg: "puiprogress_bg",
        progress_btn: "puiprogress_btn",
        progress_bar: "puiprogress_bar",
        progress_text: "puiprogress_text"
      }
      return this.each(function () {
        let that = $(this)
        //Simulate progress bar
        let _html = []
        _html.push('<div class="' + opts.progress + '">')
        _html.push('<div class="' + opts.progress_bg + '">')
        _html.push('<div class="' + opts.progress_bar + '">' + "</div>")
        _html.push("</div>")
        _html.push('<div class="' + opts.progress_btn + '">' + "</div>")
        _html.push('<div class="' + opts.progress_text + '">' + that.val() + "%</div>")
        _html.push("</div>")
        let pro = $(_html.join(""))
        let progress_bg = pro.find("." + opts.progress_bg)
        let progress_btn = pro.find("." + opts.progress_btn)
        let progress_bar = pro.find("." + opts.progress_bar)
        let progress_text = pro.find("." + opts.progress_text)
        that.after(pro)
        that.hide()
        //Progress bar operation
        let tag = false,
          ox = 0,
          left = 0,
          bgleft = 0
        pro.css("width", max)

        let _val = Number(that.val())
        left = (max * _val) / 100
        progress_btn.css("left", left)
        progress_bar.width(left)
        progress_text.html(parseInt(_val) + "%")

        progress_btn.mousedown(function (e) {
          ox = e.pageX - left
          tag = true
        })
        $(document).mouseup(function () {
          tag = false
        })
        pro.mousemove(function (e) {
          //mouse movement
          if (tag) {
            left = e.pageX - ox
            if (left <= 0) {
              left = 0
            } else if (left > max) {
              left = max
            }
            progress_btn.css("left", left)
            progress_bar.width(left)
            let _val = parseInt((left / max) * 100)
            progress_text.html(_val + "%")

            that.val(_val)
            that.change()
          }
        })
        progress_bg.click(function (e) {
          //Mouse click
          if (!tag) {
            bgleft = progress_bg.offset().left
            left = e.pageX - bgleft
            if (left <= 0) {
              left = 0
            } else if (left > max) {
              left = max
            }
            progress_btn.css("left", left)
            progress_bar.animate({ width: left }, max)
            let _val = parseInt((left / max) * 100)
            progress_text.html(_val + "%")
            that.val(_val)
            that.change()
          }
        })
      })
    }
  })
})(window.jQuery)