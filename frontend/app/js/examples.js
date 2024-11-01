"use script";

const KEYCLOAK_FILE = "config/keycloak.json";
const EXAMPLE_FILE = "config/example.json";
const APPLICATIONS_FILE = "config/applications.json";
const ALL_CATEGORIES = "all-categories";
const SEPARATOR = "__";

const defaultIcon = "fa-circle";
const defaultThumbnail = "default.gif";
const editorUrl = "editor-es5.html"
const readUrl = "read-es5.html"

const KC_URL = 'http://10.100.208.140:8888';
const REALM = 'master';
const CLIENT_ID = 'keycloak-planet-earth';

var searchText = "";
var selectAllCategories = true;
var selectedCategories = [];
// Is dev param present?
const urlParams = new URLSearchParams(window.location.search);
const dev = urlParams.get('dev')!=undefined

// authentication
window.onload =  async function () {
    // initialize keycloak
    window.keycloak = new Keycloak({
        url: KC_URL,
        realm: REALM,
        clientId: CLIENT_ID
    });
    window.keycloak._login = window.keycloak.login;
    window.keycloak.login = function (options) {
        if (options) {
            options.scope = "openid";
        }
        return window.keycloak._login.apply(window.keycloak, [options]);
    };
    // check if the user is already authenticated
    const authenticated = await keycloak.init({
        onLoad: 'login-required',
        // onLoad: 'check-sso',
        checkLoginIframe: true,
        checkLoginIframeInterval: 1,
        pkceMethod: 'S256'
    })
    if (authenticated) {
        showUserInfo();
        loadApplication();
    } else {
        showWelcome();
    }
    keycloak.onAuthLogout = showWelcome;
}

// show welcome message
function showWelcome() {
    alert("Authentication needed!");
}

// logout
function logout() {
    keycloak.logout();
}

// set user info
function showUserInfo() {
    keycloak.loadUserInfo().then(userinfo => {
        $('#username').text(userinfo.preferred_username);
    });
}

// loading examples and applications
function loadApplication() {

    $.getJSON(EXAMPLE_FILE, '',function (examples) {
        $.getJSON(APPLICATIONS_FILE, '',function (apps) {
            var data = [];
            apps.forEach(element => {
                data.push(element);
            });
            if (dev) {
                examples.forEach(element => {
                    data.push(element);
                });
            }
            applications = getApplicationList(data,[],[]);
            // Set language
            initI18next();
            // Create content
            loadContent();
            // Init searchbar
            initSearchbar();
        });
    });
}
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
            loadPath: 'config/i18n/applications/{{lng}}.json',
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

        // Show documentation
        showDocumentation();

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


function getApplicationList(arr, currentCategory, currentCategoryColor) {
	var elements = [];
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = arr[i];
		const name = item.name || "";
		if (item.children) {
            currentCategory.push(name);
            currentCategoryColor.push(item.color || "");
            getApplicationList(item.children,currentCategory,currentCategoryColor).forEach(function(e) {
                elements.push(e);
            });
            currentCategory.pop();
            currentCategoryColor.pop();
		} else {
            item.categories = currentCategory.join(SEPARATOR);
            if (currentCategoryColor.slice(-1)!="")
                item.color = currentCategoryColor.slice(-1);
            elements.push(item);
		}
	}
	return elements;
}

// Create the page content
function loadContent() {
    const currentApplications = filterApplications();
    // Create content
	$("#content").html(createContent(currentApplications));
    // Set total applications
	$("#total-showcase").html(currentApplications.length);
}

// Filter applications by search text
function filterApplications() {
    return applications.filter((element) => {
        return  matched(element);
    });
}

function matched(element) {
    const textArray = searchText.split(" ");
    var found=false;
    // prepare categories string
    var cardCategories = "";
    if (element.categories) {
        const categoryArray = element.categories.split(SEPARATOR);
        categoryArray.forEach(c => {
            cardCategories += i18next.t(c) + " ";
        });
    }

    if (!selectAllCategories) {
        const elementCategory = element.categories.split(SEPARATOR)[0];
        if (selectedCategories.indexOf(elementCategory) ==-1)
            return false;
    }

    textArray.forEach(text => {
        if (
            // name
            i18next.t(element.name).toLowerCase().indexOf(text)>-1 ||
            // details
            (element.details && i18next.t(element.details).toLowerCase().indexOf(text)>-1) ||
            // categories
            (cardCategories.toLowerCase().indexOf(text)>-1)
          )
            found= true;
    });
    return found;
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
        var quickOpenLink ="";
        var openLink ="";
        if (item.main && item.main.length>0) {
            openLink = readUrl;
            if (dev) {
                openLink = editorUrl; //editor for local development
            }
            openLink += "?id=" + item.main;
            quickOpenLink =  `style="cursor:pointer;" onclick='showInLocalWindow("` + name + `","` + openLink + `")' data-i18n="[title]app.start"`;
            openLink = `<a style="cursor:pointer; float:right" onclick='showInLocalWindow("` + name + `","` + openLink + `")' class="card__button" data-i18n="app.open"></a>`;
        }
        if (item.external && item.external.length>0) {
            quickOpenLink =  `style="cursor:pointer;" onclick='window.open("` + item.external + `")' data-i18n="[title]app.start"`;
            openLink = `<a style="cursor:pointer; float:right" href="` + item.external + `" target="_blank" class="card__button" data-i18n="app.open"></a>`;
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
        var infoLink = "";
        if (details !="" || link!="" || pdf !="" )
            infoLink = `<a id="show_info_` + i + `" style="cursor:pointer" onclick="showInfo('` + i + `'); "><i class="nav-icon fa fa-info-circle card-info"></i></a>` +
                       `<a id="close_info_` + i + `" style="cursor:pointer; display:none" onclick="hideInfo('` + i + `'); "><i class="nav-icon fa fa-times-circle card-info"></i></a>`;
        const category = item.categories.split(SEPARATOR)[0] || "";
        var mainIcon = `<span class="card-main-icon"><i class="nav-icon fa fa-lock card-lock"></i></span>`;
        if ((item.main && item.main.length>0) || (item.external && item.external.length>0))
            mainIcon = `<span class="card-main-icon" ` + quickOpenLink + `><i class="nav-icon fa fa-play card-play"></i></span>`;
        var categoryColor = item.color?"background-color:" + item.color + "DD": "";
		inhtml +=
            `<div class="card-envelope">
                <article id="application_` + i + `" class="card">
                    <span class="badge card-category" style="` + categoryColor + `" data-i18n="` + category + `"></span>` +
                    mainIcon +
                    `<img src="config/thumbnail/` + thumbnail + `" alt="" class="card__background" />
                    <div class="card__content | flow" style="` + categoryColor + `">
                        <div class="card__content--container | flow">
                            <h2 class="card__title" data-i18n="[prepend]` + name + `">` +
                            infoLink +
                            `</h2>` +
                            `<p class="card__description" data-i18n="` + details + `">` + details + `</p>
                        </div>
                        <span>`	+ link + pdf + openLink +`</span>
                    </div>
                </article>
            </div>`;
    }
    inhtml += "</section>"
	return inhtml;
}

function showInfo(i) {
    $("#application_" + i).addClass("card_hover");
    $("#show_info_" + i).hide();
    $("#close_info_" + i).show();
}

function hideInfo(i) {
    $("#application_" + i).removeClass("card_hover");
    $("#show_info_" + i).show();
    $("#close_info_" + i).hide();
}

function initSearchbar() {
    // fill categories filter
    const categories = getAllCategories();
    console.log(categories);
    var categoryFilterPanel = "";
    categories.forEach(element => {
        categoryFilterPanel +=
            `<div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input category-selection" id="` + element + `" onclick="setCategory('` + element + `', this)">
                <label class="custom-control-label" for="` + element + `" data-i18n="` + element + `">` + element + `</label>
            </div>`;
    });
    $("#categories-filter").html(categoryFilterPanel);

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

    // Content click handler
	$("#content").click(() => {
        $("#category-filter-panel").hide();
    });
}

function getAllCategories() {
    var c = {};
    for (var i = 0; i < applications.length; i++) {
		var item = applications[i];
        const category = item.categories.split(SEPARATOR)[0];
        c[category] = true;
    }
    return Object.keys(c);
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
function showInLocalWindow(application, descriptionLink) {
    //descriptionLink += "&lang=" + i18next.resolvedLanguage
	window.layer.open({
	  type: 2,
	  title: i18next.t(application),
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
function showDemo(application, descriptionLink) {
    descriptionLink += "&lang=" + i18next.resolvedLanguage + "&name=" + i18next.t(application)
    window.open(descriptionLink, '_blank');
}

// Show Authors of the application
function showAuthors() {
	window.layer.open({
		type: 2,
		title: "GIS & RS team",
		skin: "layer-mars-dialog animation-scale-up",
		resize: false,
		area: ["950px", "83%"],
		content: "/pages/contacts.html"
	  })
}

// Show the documentation of the application
function showDocumentation() {
    var link = "/pages/presentation-en.html";
    if (i18next.resolvedLanguage=="it")
        link = "/pages/presentation-it.html";
	window.layer.open({
		type: 2,
		title: i18next.t("app.documentation"),
		skin: "layer-mars-dialog animation-scale-up",
		resize: false,
		area: ["900px", "600px"],
		content: link
	  })
}

function showHideCategoryFilterPanel() {
    if ($("#category-filter-panel").is(":visible"))
        $("#category-filter-panel").hide();
    else
        $("#category-filter-panel").show    ();
}

function setAllCategories(cb) {
    console.log("Clicked all categories = " + cb.checked);
    selectAllCategories = cb.checked;
    if (cb.checked) {
        selectedCategories = [];
        $("#category-filter-icon").removeClass("red");
        for (var i=0; i<$(".category-selection").length; i++) {
            $(".category-selection")[i].checked = false;
        }
    }
    loadContent();
    rerender();
}

function setCategory(name, cb) {
    console.log("Clicked " + name + " = " + cb.checked);
    if (cb.checked) {
        selectedCategories.push(name);
        selectAllCategories = false;
        $(".category-all")[0].checked = false;
        $("#category-filter-icon").addClass("red");
    } else {
        const index = selectedCategories.indexOf(name);
        const x = selectedCategories.splice(index, 1);
    }
    loadContent();
    rerender();
}





