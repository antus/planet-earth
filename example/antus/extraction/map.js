/* 
  ************************************************************************
   Create flat examples and localization files (cn,en,it) from example.json
  ************************************************************************
*/
var i18n = {};
var examples= [];
var categories = {}
var currentCategory = [];

mars3d.Util.fetchJson({ url: "/config/example.json" }).then(function (data) {
  examples = setSamplesFlat(data);
  console.log(examples);
  console.log(Object.keys(categories).length);
  for (var i=0; i< Object.keys(categories).length;i++){
    const key = Object.keys(categories)[i];
    //console.log(key);
  }
  console.log("Total examples: " + examples.length);
  console.log("Total example localization keys: " + Object.keys(i18n).length);

  for (var i=0; i< Object.keys(categories).length;i++){
    const e = Object.keys(categories)[i];
    i18n[categories[e].name] = categories[e].name;
  }
  console.log("Total category localization keys: " + Object.keys(categories).length);
  console.log("Total category + example localization keys: " + Object.keys(i18n).length);
  
  var usecases = {
    categories: categories,
    examples: examples
  }

  mars3d.Util.downloadFile("examples.json", JSON.stringify(usecases))
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
      currentCategory.push(name);
		  addCategory(categories,currentCategory.join(), item);
      setSamplesFlat(item.children).forEach(function(e) {
          elements.push(e);
      });
      currentCategory.pop();
		} else {
      item.category = currentCategory.join(); 
      i18n[item.name] = item.name;
      elements.push(item);
		}
	}
	return elements;
}

function addCategory(categories, categoryKey, item) {
  categories[categoryKey] = {
    name: item.name,
    icon: item.icon
  };
}

function localizeInEnglish() {
  mars3d.Util.fetchJson({ url: "/config/i18n/examples/en.json" }).then(function (en) {
    t = {};
    for (var i=0; i< Object.keys(i18n).length;i++){
      const key = Object.keys(i18n)[i];
      var str = Object.keys(en)[i];
      t[key] = str.charAt(0).toUpperCase() + str.slice(1);
    }
    console.log(t);
    mars3d.Util.downloadFile("en.json", JSON.stringify(t))
  });
}

function localizeInItalian() {
  mars3d.Util.fetchJson({ url: "/config/i18n/examples/it.json" }).then(function (it) {
    t = {};
    for (var i=0; i< Object.keys(i18n).length;i++){
      const key = Object.keys(i18n)[i];
      var str = Object.keys(it)[i];
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
