/* 
  ************************************************************************
   Create flat examples and localization files (cn,en,it) from example.json
  ************************************************************************
*/
var i18n = {};
var examples= [];
var categories =[]
var currentCategory = "";
var firstCategories = {};

mars3d.Util.fetchJson({ url: "/config/example.json" }).then(function (data) {
  examples = setSamplesFlat(data,);
  console.log("Total examples: " + examples.length);
  console.log("Total example localization keys: " + Object.keys(i18n).length);

  for (var i=0; i< Object.keys(firstCategories).length;i++){
    const e = Object.keys(firstCategories)[i];
    i18n[e] = e;
  }
  console.log("Total tag localization keys: " + Object.keys(firstCategories).length);

  mars3d.Util.downloadFile("examples.json", JSON.stringify(examples))
  mars3d.Util.downloadFile("cn.json", JSON.stringify(i18n))
  localizeInEnglish();
  localizeInItalian();
  
});


function setSamplesFlat(arr) {
	var elements = [];
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = arr[i];
		const name = item.name || "";
		if (item.children) {
		  addCategory(categories,name);
      setSamplesFlat(item.children).forEach(function(e) {
          elements.push(e);
      });
      removeCategory();
		} else {
      item.categories = [categories[0]]; 
      i18n[item.name] = item.name;
      firstCategories[item.categories] = item.categories;
      elements.push(item);
		}
	}
	return elements;
}

function addCategory(categories, name) {
  var found = false;
  if (name=="")
    return false;
  categories.forEach(function(e) {
    if (e==name) {
      found = true;
      return;
    }
  });
  if (!found)
    categories.push(name);
}

function removeCategory() {
  categories.pop();
}

function localizeInEnglish() {
  mars3d.Util.fetchJson({ url: "/config/i18n/en.json" }).then(function (en) {
    t = {};
    for (var i=0; i< Object.keys(i18n).length;i++){
      const key = Object.keys(i18n)[i];
      var str = en[key];
      t[key] = str.charAt(0).toUpperCase() + str.slice(1);
    }
    console.log(t);
    mars3d.Util.downloadFile("en.json", JSON.stringify(t))
  });
}

function localizeInItalian() {
  mars3d.Util.fetchJson({ url: "/config/i18n/it.json" }).then(function (it) {
    t = {};
    for (var i=0; i< Object.keys(i18n).length;i++){
      const key = Object.keys(i18n)[i];
      var str = it[key];
      t[key] = str.charAt(0).toUpperCase() + str.slice(1);
    }
    console.log(t);
    mars3d.Util.downloadFile("it.json", JSON.stringify(t))
  });
}

// ************************************************************************


/*
mars3d.Util.fetchJson({ url: "/config/i18n/cn.json" }).then(function (cn) {
  mars3d.Util.fetchJson({ url: "/config/i18n/en.json" }).then(function (en) {
    t = {};
    for (var i=0; i< Object.keys(cn).length;i++){
      const key = Object.keys(cn)[i];
      const enKey = Object.keys(en)[i];
      var str = en[enKey];
      t[key] = str.charAt(0).toUpperCase() + str.slice(1);
    }
    console.log(t);
    mars3d.Util.downloadFile("en.json", JSON.stringify(t))
  });
});

mars3d.Util.fetchJson({ url: "/config/i18n/cn.json" }).then(function (cn) {
  mars3d.Util.fetchJson({ url: "/config/i18n/it.json" }).then(function (en) {
    t = {};
    for (var i=0; i< Object.keys(cn).length;i++){
      const key = Object.keys(cn)[i];
      const enKey = Object.keys(en)[i];
      var str = en[enKey];
      t[key] = str.charAt(0).toUpperCase() + str.slice(1);
    }
    console.log(t);
    mars3d.Util.downloadFile("it.json", JSON.stringify(t))
  });
});
*/
