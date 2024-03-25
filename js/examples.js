"use script"; 
			
const CONFIG_FILE = "config/examples.json";
const ALL_CATEGORIES = "all-categories";

const defaultIcon = "fa-circle";
const defaultThumbnail = "default.gif";
const editorUrl = "editor-es5.html"
const readUrl = "read-es5.html"

var dev = false;
var examples=[];
var searchText = "";
var selectedCategory = ALL_CATEGORIES;


// Synchronous loading examples
$.getJSON(CONFIG_FILE, '',function (data) {
	examples = data;
    // Is dev param present?
	const urlParams = new URLSearchParams(window.location.search);
	dev = urlParams.get('dev')!=undefined  
	// Set language
	initI18next();
    // Create sidebar withe categories
	$("#sidebar-menu").html(createSidebar(examples));
	// Create content
	loadContent();
	// Init searchbar
	initSearchbar();
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

// Create the page content
function loadContent() {
    const currentExamples = filterExamples();
    // Create content
	$("#content").html(createContent(currentExamples));
    // Set total examples
	$("#tolal-showcase").html(currentExamples.length);
    // set active category
    $(".active-category").removeClass("active-category");
    $("#" + selectedCategory).addClass("active-category");
    $("#selection").attr("data-i18n", selectedCategory);
}

// Filter examples by category and search text
function filterExamples() {
    return examples.filter((element) => {
        if (selectedCategory==ALL_CATEGORIES)
            return i18next.t(element.name).toLowerCase().indexOf(searchText)>-1;
        else {
            if (element.categories.includes(selectedCategory) && i18next.t(element.name).toLowerCase().indexOf(searchText)>-1)
                return true;
            else 
                return false;
        }
    });
}

// Create sidebar withe categories
function createSidebar(arr) {
    var categories = {};
    categories[ALL_CATEGORIES]= examples.length;
	var inhtml = "";
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = arr[i];
		const itemCategories = item.categories || [];
        for (var j = 0; j< itemCategories.length; j++) {
            if (!categories[itemCategories])
                categories[itemCategories] = 1;
            else 
                categories[itemCategories] = categories[itemCategories] + 1;
        }
    }
    for (var i=0; i< Object.keys(categories).length;i++){
        const category = Object.keys(categories)[i];
        const count = categories[category];
        inhtml += 
            `<li class="nav-item">
                <a id="` + category +`" href="#" class="nav-link" onclick="setCategory('` + category + `');event.preventDefault();">
                    <i class="nav-icon fa ` + defaultIcon + `"></i>
                    <p class="sidebar-text text-truncate" style="width: 130px;" data-i18n="[title]` + category + `;[prepend]` + category + `">
                        <span class="badge badge-info right">` + count + `</span>
                    </p>
                </a>
            </li>`;
    }
	return inhtml;
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
            openLink = readUrl + "?id=" + item.main;
            if (dev) {
                openLink = editorUrl + "?id=" + item.main //editor for local development
            }
            openLink = `<a style="cursor:pointer; float:right" onclick='showXQ("` + name + `","` + openLink + `")' class="card__button" data-i18n="app.open"></a>`;
        }
        var link ="";
        if (item.link && item.link.length>0) {
            link =  item.link;
            link = `<a style="cursor:pointer; float:left; margin-right:10px" href="` + link + `" target="_blank" class="card__button" data-i18n="app.description"></a>`;
        }
        var pdf ="";
        if (item.pdf && item.pdf.length>0) {
            pdf =  item.pdf;
            pdf = `<a style="cursor:pointer; float:left" onclick='showXQ("` + name + `","` + pdf + `")' class="card__button">PDF</a>`;
        }
		inhtml += 
            `<div class="card-envelope">
                <article class="card">
                    <img src="config/thumbnail/` + thumbnail + `" alt="" class="card__background" />
                    <div class="card__content | flow">
                        <div class="card__content--container | flow">
                            <h2 class="card__title" data-i18n="` + name + `">` + name + `</h2>
                            <p class="card__description" data-i18n="` + details + `"></p>
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
  
// Just for demonstration, you can click details
function showXQ(usecase, descriptionLink) {
	window.layer.open({
	  type: 2,
	  title: i18next.t(usecase),
	  fix: true,
	  shadeClose: true,
	  maxmin: true,
	  resize: false,
	  area: ["100%", "100%"],
	  content: descriptionLink,
	  skin: "layer-mars-dialog animation-scale-up",
	  success: function (layero) {},
	});
}


function showAuthors() {
	window.layer.open({
		type: 2,
		title: "GIS & RS practice",
		skin: "layer-mars-dialog animation-scale-up",
		resize: false,
		area: ["650px", "91%"], //宽高
		content: "/contacts.html"
	  })
}





