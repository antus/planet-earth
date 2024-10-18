"use script" //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends es5widget.BaseWidget {
    //外部资源配置
    get resources() {
      return ["view.css"]
    }
    //页面配置， append是添加DOM节点到html中的方式
    get view() {
      return {
        type: "append",
        url: "view.html"
      }
    }

    //初始化[仅执行1次]
    create() {

    }
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      const options = document.querySelector(".options"),
      allOption = options.querySelectorAll(".option"),
      arrowIcons = document.querySelectorAll(".icon i");

      let isDragging = false, prevTouch, prevScroll;

      const handleIcons = (scrollVal) => {
          let maxScrollableWidth = options.scrollWidth - options.clientWidth;
          arrowIcons[0].parentElement.style.display = scrollVal <= 0 ? "none" : "flex";
          arrowIcons[1].parentElement.style.display = maxScrollableWidth > scrollVal ? "flex" : "none";
      }

      arrowIcons.forEach(icon => {
          icon.addEventListener("click", () => {
              let scrollWidth = options.scrollLeft += icon.id === "left" ? -150 : 150;
              handleIcons(scrollWidth);
          });
      });

      allOption.forEach(option => {
          option.addEventListener("click", () => {
              if (options.querySelector(".active")) {
                const oldActive = options.querySelector(".active");
                options.querySelector(".active").classList.remove("active");
                //$(".panel").hide();
                $(".panel").removeClass("panel-show");
                if (oldActive != option) {
                  option.classList.add("active");
                  //$("." + option.dataset.originalTitle).show();
                  $("." + option.dataset.originalTitle).addClass("panel-show");
                }
              } else {
                option.classList.add("active");
                //$("." + option.dataset.originalTitle).show();
                $("." + option.dataset.originalTitle).addClass("panel-show");
              }
              console.log(option.dataset.originalTitle);


          });
      });

      const dragStart = (e) => {
          isDragging = true
          prevTouch = e.pageX || e.touches[0].pageX;
          prevScroll = options.scrollLeft;
      };

      const dragging = e => {
          if(!isDragging) return;
          options.classList.add("dragging");
          options.scrollLeft = prevScroll - ((e.pageX || e.touches[0].pageX) - prevTouch);
          handleIcons(options.scrollLeft);
      }

      const stopDragging = () => {
          isDragging = false;
          options.classList.remove("dragging");
      }

      options.addEventListener("mousedown", dragStart);
      options.addEventListener("touchstart", dragStart);
      options.addEventListener("mousemove", dragging);
      options.addEventListener("touchmove", dragging);
      document.addEventListener("mouseup", stopDragging);
      options.addEventListener("touchend", stopDragging);

      handleIcons(0);

      const myFunction = () => {
        handleIcons(0);
      }

      window.addEventListener("resize", myFunction);

      const setTheme = theme => document.documentElement.className = theme;

      $('[data-toggle="tooltip"]').tooltip();
    }
    //激活插件
    activate() {
      toastr.info("Activate_toolbar")
    }
    //释放插件
    disable() {
      toastr.info("Disable_toolbar")
    }

    isVisible() {
      return $(".wrapper").is(":visible");
    }

    show() {
      $(".wrapper").show();
    }

    hide() {
      $("..wrapper").hide();
    }
  }

  //注册到widget管理器中。
  es5widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
