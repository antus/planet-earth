"use script"; 
			
const EXAMPLE_FILE = "config/example.json";
const USECASES_FILE = "config/usecases.json";
const ALL_CATEGORIES = "all-categories";
const SEPARATOR = "__";

const defaultIcon = "fa-circle";
const defaultThumbnail = "default.gif";
const editorUrl = "editor-es5.html"
const readUrl = "read-es5.html"

var dev = false;
var examples=[];
var searchText = "";
var selectedCategory = ALL_CATEGORIES;


// Synchronous loading examples and use cases
$.getJSON(EXAMPLE_FILE, '',function (example) {
    $.getJSON(USECASES_FILE, '',function (usecases) {
        var data = [];
        usecases.forEach(element => {
            data.push(element);
        });
        example.forEach(element => {
            data.push(element);
        });
        examples = getExampleList(data,[]);
        // Is dev param present?
        const urlParams = new URLSearchParams(window.location.search);
        dev = urlParams.get('dev')!=undefined  
        // Set language
        initI18next();
        // Create sidebar withe categories
        $("#sidebar-menu").html(createSidebar(data, []));
        // set all-categories count
        $("#total").html(examples.length);
        // Create content
        loadContent();
        // Init searchbar
        initSearchbar();
    });
});

// Init i18next
function initI18next() {
    // use plugins and options as needed, for options, detail see
    // https://www.i18next.com
    i18next
      // i18next-http-backend
      // loads translations from your server
      // https://github.com/i18next/i18next-http-backend
      .use(i18nextHttpBackend)
      // detect user language
      // learn more: https://github.com/i18next/i18next-browser-languageDetector
      .use(i18nextBrowserLanguageDetector)
      // init i18next
      // for all options read: https://www.i18next.com/overview/configuration-options
      .init({
        debug: false,
		load: 'languageOnly',
        fallbackLng: 'en',
        lng: new URL(window.location.href).searchParams.get('lang'),
        backend: {
            loadPath: 'config/i18n/examples/{{lng}}.json',
        }
      }, (err, t) => {
        if (err) return console.error(err);
  
        // for options see https://github.com/i18next/jquery-i18next#initialize-the-plugin
        jqueryI18next.init(i18next, $, { useOptionsAttr: true });
  
		// switch locale handler
		$('.switch-locale').on('click', 'a', function(e) {
            e.preventDefault();
            if ($(this).data('locale')!==undefined) {
                i18next.changeLanguage($(this).data('locale'), () => {
                    rerender();
                });
            }
        });
        rerender();
      });
}

// refresh localization
function rerender() {
    // set UI
    const loc = i18next.resolvedLanguage=='en'?'gb':i18next.resolvedLanguage
    $("#locale-flag").removeClass();
    $("#locale-flag").addClass(["flag-icon", "flag-icon-selected", "flag-icon-" + loc]);
	// start localizing, details: https://github.com/i18next/jquery-i18next#usage-of-selector-function
    $('body').localize();
}


function getExampleList(arr, currentCategory) {
	var elements = [];
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = arr[i];
		const name = item.name || "";
		if (item.children) {
            currentCategory.push(name);
            getExampleList(item.children,currentCategory).forEach(function(e) {
                elements.push(e);
            });
            currentCategory.pop();
		} else {
            item.categories = currentCategory.join(SEPARATOR); 
            elements.push(item);
		}
	}
	return elements;
}

// Create sidebar withe categories
function createSidebar(arr, currentCategory) {
	var inhtml = "";
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = arr[i];
		const name = item.name || "Unknown";
		const icon = item.icon || defaultIcon;
		if (item.children) {
			const subGroups = hasSubCategories(item.children);
			const numOfUsecases = getTotalChildrens(item.children);
			if (numOfUsecases>0) {
				let open = "";
				if (item.open!=undefined && item.open==true)
					open = " menu-open";
				let color1 = "rgb(63,103,145)";
				//let color1 = "rgb(23,162,184)";
				const bgColor = pSBC ( 0.2* (currentCategory.length), color1 ); // #F3A + [40% Darker] => #c62884
				const style= item.style || "";
				const badgeStyle= item["badge-style"] || "background-color: " + bgColor + ";width:30px";
				let badge = `<span class="badge badge-info right" style="` + badgeStyle + `">` + numOfUsecases + `</span>`;        
				category = name;
				var group = "<span style='width:20px'></span>";
				if (subGroups)
					group = `<i class="nav-item d-none d-sm-inline-block right fas fa-angle-left"></i>`;
                currentCategory.push(name);
                inhtml += 
				    `<li class="nav-item` + open + `">
					<a id="` + currentCategory.join(SEPARATOR) +`" href="#" class="nav-link sidebar-icon" onclick="setCategory('` + currentCategory.join(SEPARATOR) + `');event.preventDefault();" style="` + style + `">
						<i class="nav-icon fa ` + icon + `"></i>
						<p class="sidebar-text text-truncate" style="width: 130px" data-i18n="[title]` + name + `;[prepend]` + name + `">` + name + 
							group + 
							//badge + 
						`</p>` + 
					`</a>
					<ul class="nav nav-treeview">`;
				inhtml += createSidebar(item.children, currentCategory);
				inhtml += "</ul></li>";
                currentCategory.pop();
			}
		} 
	}
	return inhtml;
}

// check if there are sub category
function hasSubCategories(arr) {
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = arr[i];
		if (item.children) {
			return true;
		}
	}
	return false;
}

// get total number of children of a category
function getTotalChildrens(arr) {
	var result = 0;
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = arr[i];
		if (item.children) {
			result += getTotalChildrens(item.children);
		} else {
			result++;
		}
	}
	return result;
}

// Create the page content
function loadContent() {
    const currentExamples = filterExamples();
    // Create content
	$("#content").html(createContent(currentExamples));
    // Set total examples
	$("#total-showcase").html(currentExamples.length);
    // Set active category
    
    $(".active-category").each(function() {
        $(this).removeClass("active-category");
    });
    $("#" + selectedCategory).addClass("active-category");
    
    // Selection
    var sel = selectedCategory;
    sel = sel.lastIndexOf(SEPARATOR)>-1?sel.substring(sel.lastIndexOf(SEPARATOR) + SEPARATOR.length): sel;
    $("#selection").attr("data-i18n", sel);
}

// Filter examples by category and search text
function filterExamples() {
    return examples.filter((element) => {
        if (selectedCategory==ALL_CATEGORIES)
            return  (i18next.t(element.name).toLowerCase().indexOf(searchText)>-1 ||
                    (element.details && i18next.t(element.details).toLowerCase().indexOf(searchText)>-1)
                    );
        else {
            if (element.categories.startsWith(selectedCategory) && 
                (i18next.t(element.name).toLowerCase().indexOf(searchText)>-1 ||
                 (element.details && i18next.t(element.details).toLowerCase().indexOf(searchText)>-1)
                )
               )
                return true;
            else 
                return false;
        }
    });
}

// Build html fragment for content
function createContent(arr) {
	var inhtml = "<section class='card-container'>";
	for (var i = 0; i < arr.length; i++) {
		var item = arr[i];
        const details = item.details || '';
        const name = item.name || "Unknown";
        const icon = item.icon || defaultIcon;
        const thumbnail = item.thumbnail || defaultThumbnail;
        var openLink ="";
        if (item.main && item.main.length>0) {
            openLink = readUrl;
            if (dev) {
                openLink = editorUrl; //editor for local development
            }
            openLink += "?id=" + item.main;
            openLink = `<a style="cursor:pointer; float:right" onclick='showDemo("` + name + `","` + openLink + `")' class="card__button" data-i18n="app.open"></a>`;
        }
        var link ="";
        if (item.link && item.link.length>0) {
            link =  item.link;
            link = `<a style="cursor:pointer; float:left; margin-right:10px" href="` + link + `" target="_blank" class="card__button" data-i18n="app.description"></a>`;
        }
        var pdf ="";
        if (item.pdf && item.pdf.length>0) {
            pdf =  item.pdf;
            pdf = `<a style="cursor:pointer; float:left" onclick='showInLocalWindow("` + name + `","` + pdf + `")' class="card__button">PDF</a>`;
        }
		inhtml += 
            `<div class="card-envelope">
                <article class="card">
                    <img src="config/thumbnail/` + thumbnail + `" alt="" class="card__background" />
                    <div class="card__content | flow">
                        <div class="card__content--container | flow">
                            <h2 class="card__title" data-i18n="` + name + `">` + name + `</h2>
                            <p class="card__description" data-i18n="` + details + `">` + details + `</p>
                        </div>
                        <span>`	+ link + pdf + openLink +`</span>
                    </div>
                </article>
            </div>`;
    }
    inhtml += "</section>"
	return inhtml;
}


function setCategory(category) {
    selectedCategory = category;
    loadContent();
    rerender();
}

function initSearchbar() {
    // Search text key down handler
    $("#searchText").bind("keydown", (event) => {
        if (event.keyCode == "13") {
            searchAction();
        }
    });

    // Serach text key down handler
    $("#searchText").bind("keyup", (event) => {
        searchAction();
    });

    // Search button click handler
    $("#searchButton").click(() => {
        searchAction();
    });

    // Delete search button click handler
	$("#deleteSearchButton").click(() => {
        $("#searchText").val("");
		searchAction();
    });
}  

function searchAction() {
	searchText = $.trim($("#searchText").val()).toLowerCase();
    const showDelete = searchText.length==0?"none":"block"
	$("#deleteSearchButton").css("display", showDelete);
    if (searchText.length < 3)
        searchText = "";
    loadContent();
    rerender();
}
  
// Show a url in local window
function showInLocalWindow(usecase, descriptionLink) {
    descriptionLink += "&lang=" + i18next.resolvedLanguage
	window.layer.open({
	  type: 2,
	  title: i18next.t(usecase),
	  fix: true,
	  shadeClose: true,
	  maxmin: true,
	  resize: false,
	  area: ["90%", "90%"],
	  content: descriptionLink,
	  skin: "layer-mars-dialog animation-scale-up",
	  success: function (layero) {},
	});
}

// Just for demonstration, you can click details
function showDemo(usecase, descriptionLink) {
    descriptionLink += "&lang=" + i18next.resolvedLanguage
    window.open(descriptionLink, '_blank');
}

// Show Authors of the usecases
function showAuthors() {
	window.layer.open({
		type: 2,
		title: "GIS & RS team",
		skin: "layer-mars-dialog animation-scale-up",
		resize: false,
		area: ["650px", "91%"], //宽高
		content: "/contacts.html"
	  })
}

// Create a new color from a colo and a % (0-1) of lighting
const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}



