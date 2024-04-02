// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var circleFixedRoute
var attackFixedRoute

var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 35.685666, lng: 122.660021, alt: 522806.4, heading: 319.6, pitch: -37.6 },
    clock: {
      startTime: "2022/12/23 08:00:00",
      stopTime: "2022/12/23 10:00:00"
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { top: "10px", left: "5px" }
  }
}

const staticResources = [
  {
    position: [116.380748, 39.896113],
    name: "Beijing",
    title: "Capital",
    desc: `<p>When loading for the first time, the flight will be slower, please wait patiently. </p>
    <p>The current time is December 23rd </p>`
  },
  {
    position: [112.549248, 37.857014],
    name: "Shanxi",
    ellipsoidStyle: {
      minimumClockDegree: -90.0, // There is a gap
      minimumConeDegree: 20, // There is a top
      scanColor: "rgba(255, 204, 0)", // Scanning surface yellow
      scanOutlineColor: "rgba(255, 204, 0, 0.1)"
    },
    title: "Battle of Taiyuan",
    desc: `<p>The Battle of Taiyuan was a large-scale battle and one of the 22 battles in the history of the Chinese Army’s eight-year Anti-Japanese War. </p>
    <p>The battlefield of this battle was in Shanxi Province controlled by the local warlord Yan Xishan. There were 5 battles before and after the battle, in chronological order: the Battle of Datong and the Battle of Pingxingguan (the Pingxingguan battle was not fought by the Chinese Communist Party,
      The Battle of Pingxingguan is only a small part of the battle. The Battle of Pingxingguan wiped out 5,000 to 8,000 enemies, of which the Chinese Communist Party wiped out more than 800 enemies), the Battle of Xinkou, the Battle of Niangziguan, and the Battle of Taiyuan. </p>
    <p>During the entire Taiyuan battle, the Chinese army used eight armies with a total strength of 580,000, and the Japanese army also used five divisions with a total strength of more than 150,000. </p>
    <p>In addition to several armies of the Central Army, the national army participating in the war also included two armies of the Shanxi-Sui Army, local warlords of other factions, and even the 18th Army of the Communist Party of China. military coordinated operations. </p>
    <p>And the Japanese army used a large number of its most elite troops. All those participating in the Taiyuan battle were the Japanese army's most powerful first-class troops, and they were all-in. </p>
    <p>The final outcome was that the Japanese army used all its strength, increased its troops many times, and even transferred a main division from the Hebei battlefield, and finally barely occupied the northern, central and eastern parts of Shanxi Province, while the National Army still firmly controlled They occupied the geographically important western and southern parts of Shanxi for eight years, and finally accepted the surrender of the Japanese army. </p>`
  },
  {
    position: [113.665412, 34.757975],
    name: "Henan",
    ellipsoidStyle: {
      scanColor: "rgba(0, 204, 0, 0.5)", // green
      minimumConeDegree: 20, // There is a top
      scanOutlineColor: "rgba(255, 204, 0,0.8)" // yellow
    },
    title: "Anti-Japanese War Province",
    desc: `<p>During the entire Anti-Japanese War, 109 of the 111 counties were ravaged by the Japanese army. Only two counties, Xincai and Shenqiu, were not occupied. On October 21, 1937, Linzhang County in northern Henan (now part of Hebei Province) was the first county to fall in Henan Province; in February 1945, Xichuan County in Nanyang was the last county to fall. </p>
    <p> Marching south along the Ping-Han Railway from the north, on November 5, Zhangde (now Anyang City), an important town in northern Henan, fell. After that, Henan gradually fell. On February 6, 1938, the army successively occupied Qingfeng, Puyang, Changyuan, Fengqiu and other counties, and attacked south of Xinxiang.
     From February 11 to mid-March, they successively occupied Tangyin, Qixian, Jixian, Huixian, and Xinxiang, and joined up with the Japanese troops on the way forward. After the two groups of Japanese armies joined together, they invaded westward. After the fall of Jiaozuo and Jiyuan, everything north of the Yellow River fell. </p>

    <p>From the east, on May 13, 1938, Japanese troops from the direction of Xuzhou occupied Yongcheng County in eastern Henan, and then occupied Shangqiu on the 28th. Beginning on June 1, the Japanese army successively occupied Qixian, Tongxu, Weishi, and Taikang, and the Kuomintang troops retreated to the mountainous areas of western Henan.
    On June 6, after the Japanese army occupied Kaifeng, the capital of Henan Province, they moved westward, invaded Zhongmou, and approached Zhengzhou. On June 9, the Nationalist Government opened the <span style="color:red">Huayuankou Yellow River Embankment</span> to stop the Japanese army from advancing. </p>

    <p>From the south, on October 12, 1938, after the Japanese troops from western Anhui captured Gushi, Guangshan, Luoshan, Shangcheng and other counties, they completely controlled the entire Xinyang, connecting eastern Henan and western Anhui into one, and Together with other Japanese troops, they formed a force to encircle Wuhan. </p>

    <p>Six years later, the unwilling Japanese army launched a new offensive, which was the famous 1944 Battle of Henan, Hunan and Guangxi, and the Henan Campaign broke out</p>

    <p>However, the harm caused by the explosion of Huayuankou is even greater, and the explosion of Huayuankou embankment will cause a catastrophe</p>
    <p>The Nationalist Government breached the Yellow River embankment at Huayuankou in Zhengzhou to prevent the Japanese army from advancing westward. After the embankment breached, the Yellow River Flood Area was formed. When flooding occurs, “some people are drowned in their sleep by water coming in at night; some people are carrying things in their houses and the house collapses and smashes them to death;
    Some fled in a hurry and were swept away by the rapids; some ran out of water and were buried in the belly of the fish; some were hit by rafts and scattered in the water and drowned; some were starved to death in the siege water; some were trapped in the mud and died. "The various forms of death are horrific.</p>
    <p>"Droughts, locust plagues, banditry and the flooding of the Yellow River came one after another." The famine from 1941 to 1943 was the most tragic disaster in the history of Henan in the past century. The number of hungry people in the province was waiting for food.<span style="color: red">10 million</span> people.
    By 1943, the disaster reached its peak, with a huge locust plague in western and northern Henan, and eastern Henan was flooded twice in spring and summer. The number of hungry people in the province increased to 30 million, and many people died of starvation in two years<span style="color: red">More than 2 million</span> people. </p>`
  },
  {
    position: [118.792939, 32.06266],
    name: "Nanjing",
    ellipsoidStyle: {
      radius: 200000, // range
      scanColor: "rgba(255, 204, 0, 0.9)", // yellow
      minimumConeDegree: 0, // No top port
      scanMinimumConeDegree: -30.0, // cross
      scanOutlineColor: "rgba(255, 204, 0, 0.1)"
    },
    title: "Nanjing Massacre",
    desc: `</p><span style="color:red">One</span> was one of the major tragedies during World War II. After the war, the International Military Tribunal for the Far East and the China Military Tribunal for the Trial of War Criminals conducted special trials on it.
      Although war criminals such as Matsui Iwane and Hisao Tani were punished, the Japanese, who had lived a good life, refused to admit it and tried to use the passage of time to make people forget their cruel nature. </p>
      <p>The scope of the massacre: "At that time, the Nanjing Municipal Government had jurisdiction over 7 districts in the city (including Xiaguan and the Prime Minister's Cemetery District) and 5 suburbs including Pukou Zhong, Xiaolingwei, Yanziji, Shangxinhe, and Cemetery. There were also surrounding areas around Nanjing Wulong Mountain, Qixia Mountain, Longtan, Jiangning, Jurong, Lishui, Chunhua, Hushu, Molingguan, Niushou Mountain, Jiangpu, Liuhe, Tangshan, Mengtang, Jiangpu, etc." </p>
      <p>For China, which is in the whirlpool of war, the Japanese army has attacked and destroyed lives. However, many reports of Japanese atrocities in occupied areas are mostly obtained after the fact, and the information is relatively lagging behind, and many of them are in unknown language. In contrast, the Japanese atrocities in Nanjing were particularly eye-catching due to their extensive coverage and rich information by Western mainstream media. </p>
      <p>As the Hankou Ta Kung Pao editorial said in the editorial "Avenging Every Man and Every Woman": "The Nanjing incident was spread by foreigners and known to the world. This alone has constituted an eternal crime of Japanese imperialism, not to mention the Nanjing incident. , this is actually the case in all places in the south of the Yangtze River... Wherever the enemy troops come, they are brutally killed, just like in Nanjing."</p>
      <p>The diary of a foreign expatriate staying in Nanjing: "The incidents of looting, massacre and rape have continued unabated. At least 1,000 women were raped during the day and night yesterday. One poor woman was raped 37 times. Once, when a beast soldier raped a 5-month-old baby, he suffocated him to death because he kept crying. The penalty for resistance was a bayonet. The hospital was crowded with victims. Wilson, our only surgeon, was too busy. Rest."</p>
      <p>"At noon, a man came to the office. His head was burned, his eyes and ears were cut off, and only half of his nose was left. It was terrible. I took him to the hospital, and he died a few hours later. What happened was this: The Japanese army tied hundreds of people together, poured gasoline on them, and burned them with fire. He was one of them, but he was tied outside, so the gasoline only passed over his head. Soon he was admitted to the hospital. The same patient was injured even more seriously.
      Naturally, he died too. It seems that the Japanese army fired machine guns first, but some people were spared death. The first one had no bullet wounds, but the second one did. Opposite the Zhuitian Drum Tower, I saw another dead man sleeping at the corner of the road with the same burn injuries on his head and arms. He obviously struggled a long way before he died. What an unbelievable act of brutality. ”</p>
      <p>At that time, Nanjing was guarded by Japanese troops at all levels, both outside and inside the city. The people could only be slaughtered by others, especially the inhumane "Hundred Killing" competition. Two Japanese officers gave a bottle of red wine as the prize. See Whoever kills 100 people first will get a bottle of red wine, and the matter will even be published in the newspapers, causing outrage. </p>
      <p>The commanders of the massacre at that time were Japan's Matsui Iwane, Hisao Tani, and King Asaka Palace Hatohiko. </p>
      `
  }
]

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = "Blue Basemap"

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  map.clock.multiplier = 50

  staticResources.forEach((item) => {
    if (!item.ellipsoidStyle) {
      addDivgraphic(item.position, { name: item.name, title: item.title, desc: item.desc })
      return
    }
    addEllipsoidGraphics(item)
  })

  addCircleFixRoute()
  addWeixinGraphic()

  map.on(mars3d.EventType.keydown, function (event) {
    // Space switches pause/continue
    if (event.keyCode === 32) {
      //Control the total time
      if (circleFixedRoute.isPause) {
        circleFixedRoute.proceed()
      } else {
        circleFixedRoute.pause()
      }
    }
    eventTarget.fire("changeFixedRoute")
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let isinShanxi = false
let isinHenan = false
let isinNanjing = false

function addEllipsoidGraphics({ position, name, ellipsoidStyle, title, desc }) {
  const model = new mars3d.graphic.ModelPrimitive({
    name: name + "ground station model",
    position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(model)

  const ellipsoid = new mars3d.graphic.EllipsoidEntity({
    name: name + "radar area",
    position,
    style: {
      radii: ellipsoidStyle.radius || 100000,
      minimumClockDegree: ellipsoidStyle.minimumClockDegree || -180.0,
      maximumClockDegree: 180.0,
      minimumConeDegree: ellipsoidStyle.minimumConeDegree,
      maximumConeDegree: 90.0,
      fill: false,
      outline: true,
      outlineColor: "rgba(0, 204, 0, 0.4)", // green
      stackPartitions: 30, // vertical
      slicePartitions: 30 // horizontal
    },
    //Add scanning surface
    scanPlane: {
      step: 1.0, // step size
      min: ellipsoidStyle.minimumClockDegree || -180.0,
      max: 180.0,
      style: {
        innerRadii: 1000,
        outline: true,
        color: ellipsoidStyle.scanColor,
        outlineColor: ellipsoidStyle.scanOutlineColor,
        minimumClockDegree: 90.0,
        maximumClockDegree: 100.0,

        minimumConeDegree: ellipsoidStyle.scanMinimumConeDegree || 20.0,
        maximumConeDegree: 70.0
      }
    },
    attr: { name, desc, title }
  })
  graphicLayer.addGraphic(ellipsoid)
}

function addCircleFixRoute() {
  // Calculate the circular route of the aircraft flight based on the center point
  let positionCircle = getCircleOutPositions([117.579907, 35.977162, 197], { radius: 460000, rotation: -80 })
  positionCircle = mars3d.PointUtil.setPositionsHeight(positionCircle, 20000)
  positionCircle.push(positionCircle[0]) // Closed circle

  attackFixedRoute = addAttackPlane(positionCircle[0])

  circleFixedRoute = new mars3d.graphic.FixedRoute({
    name: "my country's inspection machine",
    speed: 3000,
    positions: positionCircle,
    autoStop: true, // Automatically stop when reaching the end point
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.01,
      minimumPixelSize: 50
    },
    path: {
      color: "#ffff00",
      opacity: 0.5,
      width: 1,
      leadTime: 0
    }
  })
  graphicLayer.addGraphic(circleFixedRoute)

  const shanxiGraphic = graphicLayer.getGraphicByAttr("Shanxi Radar Area", "name")
  const henanGraphic = graphicLayer.getGraphicByAttr("Henan Radar Area", "name")
  const nanjingGraphic = graphicLayer.getGraphicByAttr("Nanjing Radar Area", "name")

  let oneTime = true
  circleFixedRoute.on(mars3d.EventType.change, (event) => {
    if (oneTime) {
      eventTarget.fire("changeFixedRoute")
      addDivgraphic(null)
      oneTime = false

      map.setCameraView({ lat: 19.77607, lng: 130.262434, alt: 1785470.8, heading: 352, pitch: -52.7 })
    }
    if (
      mars3d.PolyUtil.isInPoly(
        event.position,
        getCircleOutPositions([shanxiGraphic.centerPoint.lng, shanxiGraphic.centerPoint.lat], { radius: shanxiGraphic.style.radii })
      )
    ) {
      if (!isinShanxi) {
        shanxiGraphic.setStyle({ outlineColor: "rgba(255, 204, 0, 0.5)" })
        isinShanxi = true
        addDivgraphic(shanxiGraphic.coordinate, shanxiGraphic.attr)
      }
    } else if (
      mars3d.PolyUtil.isInPoly(
        event.position,
        getCircleOutPositions([henanGraphic.centerPoint.lng, henanGraphic.centerPoint.lat], { radius: henanGraphic.style.radii })
      )
    ) {
      if (!isinHenan) {
        henanGraphic.setOptions({
          style: { outlineColor: "rgba(36, 172, 242, 0.5)" },
          scanPlane: {
            style: { outlineColor: "rgba(36, 172, 242, 0.5)" }
          }
        })
        isinHenan = true
        addDivgraphic(henanGraphic.coordinate, henanGraphic.attr)
      }
    } else if (
      mars3d.PolyUtil.isInPoly(
        event.position,
        getCircleOutPositions([nanjingGraphic.centerPoint.lng, nanjingGraphic.centerPoint.lat], { radius: nanjingGraphic.style.radii })
      )
    ) {
      if (!isinNanjing) {
        nanjingGraphic.setStyle({ outlineColor: "rgba(189, 16, 0, 0.5)" })

        isinNanjing = true
        addDivgraphic(nanjingGraphic.coordinate, nanjingGraphic.attr)

        addDivgraphic(attackFixedRoute.position, {
          ...attackFixedRoute.attr,
          id: "attackDiv", // cannot be placed in the attr of the added vector object, the object's id will be replaced by the object
          desc: "I am a survey aircraft. The current patrol aircraft is in Nanjing. I came to Japan for a walk. I don't know how to do anything."
        })
      }
    } else {
      stopPlay(false)
    }
  })

  circleFixedRoute.on(mars3d.EventType.end, () => {
    eventTarget.fire("changeFixedRoute")
  })

  // Start roaming
  circleFixedRoute.start()
  attackFixedRoute.start()
}

// Determine whether it has left the radar range, restore the radar style, and delete the div description box
function stopPlay(isStop) {
  if (isStop) {
    circleFixedRoute.stop()
    attackFixedRoute.stop()
  }

  const shanxiGraphic = graphicLayer.getGraphicByAttr("Shanxi Radar Area", "name")
  const henanGraphic = graphicLayer.getGraphicByAttr("Henan Radar Area", "name")
  const nanjingGraphic = graphicLayer.getGraphicByAttr("Nanjing Radar Area", "name")
  if (isinShanxi) {
    shanxiGraphic.setStyle({ outlineColor: "rgba(0, 204, 0, 0.4)" })
    isinShanxi = false
    addDivgraphic(null)
  }
  if (isinHenan) {
    henanGraphic.setOptions({
      style: { outlineColor: "rgba(0, 204, 0, 0.4)" },
      scanPlane: {
        style: { outlineColor: "rgba(255, 204, 0,0.8)" }
      }
    })
    isinHenan = false
    addDivgraphic(null)
  }
  if (isinNanjing) {
    nanjingGraphic.setStyle({ outlineColor: "rgba(0, 204, 0, 0.4)" })
    isinNanjing = false
    addDivgraphic(null) // Clear the div within the radar range
    addDivgraphic(attackFixedRoute.position, {
      ...attackFixedRoute.attr,
      id: "attackDiv", // cannot be placed in the attr of the added vector object, the object's id will be replaced by the object
      desc: "Go back, go back"
    }) // Modify the div of the survey machine
    setTimeout(() => {
      addDivgraphic(null, {
        id: "attackDiv"
      }) // Clear the div of the survey machine
    }, 2000)
  }
}

//Add survey machine
function addAttackPlane(startPosition) {
  // Attack target location - 139.674147, 35.711477, 625.4
  const endPosition = startPosition.clone()
  let positionAttack = [
    startPosition,
    mars3d.LngLatPoint.toCartesian([139.674147, 35.711477, 10000]),
    mars3d.LngLatPoint.toCartesian([132.412501, 34.566365, 10000]),
    endPosition
  ]
  positionAttack = mars3d.PointUtil.setPositionsHeight(positionAttack, 80000)

  const attackPlane = new mars3d.graphic.FixedRoute({
    name: "Fighter",
    speed: 5000,
    positions: positionAttack,
    autoStop: true, // Automatically stop when reaching the end point
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.01,
      minimumPixelSize: 50
    },
    attr: { name: "Survey Machine-001" }
  })
  graphicLayer.addGraphic(attackPlane)

  // Start roaming
  return attackPlane
}

// Get the coordinates of the circular range
function getCircleOutPositions(position, param) {
  return mars3d.PolyUtil.getEllipseOuterPositions({ position, ...param })
}

//Add div description box
function addDivgraphic(position, attr) {
  const graphic = graphicLayer.getGraphicById("descPannel")
  if (attr?.id) {
    const attackDiv = graphicLayer.getGraphicById(attr?.id)
    attackDiv && attackDiv.remove()
  } else {
    graphic && graphic.remove()
  }

  if (!position) {
    return
  }

  const descGraphic = new mars3d.graphic.DivGraphic({
    id: attr?.id || "descPannel",
    position,
    pointerEvents: true,
    style: {
      html: `<div class="mars-city">
              <div class="mars-city-desc">
                <div class="mars-city-desc_title">${attr.name} ${attr?.title ? "-" + attr?.title : ""}</div>
                <div class="mars-city-desc_content">
                ${attr.desc}
                </div>
              </div>
              <div class="arrow"></div>
            </div>
          `,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
  })
  graphicLayer.addGraphic(descGraphic)

  // descGraphic.testPoint = true
}

//Add satellite object
function addWeixinGraphic() {
  const point = new mars3d.LngLatPoint(116.716398, 39.907914, 100000)

  //Add satellite
  const modelGraphic = new mars3d.graphic.ModelPrimitive({
    name: "Satellite Model",
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 30
    }
  })
  graphicLayer.addGraphic(modelGraphic)

  const pointQY = point.clone()
  pointQY.alt = pointQY.alt / 2

  const graphic = new mars3d.graphic.CylinderEntity({
    position: pointQY,
    style: {
      length: point.alt,
      topRadius: 0.0,
      bottomRadius: 10000,
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "rgba(255, 204, 102 , 0.5)",
        repeat: 30.0,
        thickness: 0.5
      }
    }
  })
  graphicLayer.addGraphic(graphic)
}
