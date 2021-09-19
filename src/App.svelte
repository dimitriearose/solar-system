<script lang="ts">
  import * as THREE from 'three'
  import * as dat from 'dat.gui'
  import { onMount, onDestroy } from 'svelte'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
  import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
  import Stats from 'stats.js'

  import { Cigarette, SatisfyMySoul, WaitingInVain } from './phrases/Phrases'
  import LoadingScreen from './components/LodingScreen.svelte'
  import RespectsPaid from './components/RespectsPaid.svelte'

  import SunVertexShader from './shaders/sun/sun.vert'
  import SunFragmentShader from './shaders/sun/sun.frag'
  import SunGlowVertexShader from './shaders/sun/sunGlow.vert'
  import SunGlowFragmentShader from './shaders/sun/sunGlow.frag'
  import SaturnRingVertexShader from './shaders/saturnRing/saturnRing.vert'
  import SaturnRingFragmentShader from './shaders/saturnRing/saturnRing.frag'
  import StarVertexShader from './shaders/stars/star.vert'
  import StarFragmentShader from './shaders/stars/star.frag'
  import NeptuneRingVertexShader from './shaders/neptuneRing/neptuneRing.vert'
  import NeptuneRingFragmentShader from './shaders/neptuneRing/neptuneRing.frag'
  import JupiterRingVertexShader from './shaders/jupiterRing/jupiterRing.vert'
  import JupiterRingFragmentShader from './shaders/jupiterRing/jupiterRIng.frag'
  import UranusRingVertexShader from './shaders/uranusRing/uranusRing.vert'
  import UranusRingFragmentShader from './shaders/uranusRing/uranusRing.frag'

  const stats = new Stats()

  const parameters = {
    sunGlowColour: '#e67e22',
  }

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  }

  let canvas: HTMLCanvasElement
  let renderer: THREE.WebGLRenderer
  let intersect: THREE.Intersection = null
  let percentageLoaded: number = 0
  let isLoading = true
  let respectsPaid = false
  let showRespects = false
  let currentEnteredPhrase = ''

  let lastEnteredTime = null

  let showWeed = false
  let hasShownWeed = false
  let hasPlayedCigarette = false
  let hasPlayedSatisfyMySoul = false
  let hasPlayedWaitingInVain = false

  const mouse = new THREE.Vector2()

  const onResize = () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  const onClick = () => {
    if (intersect) {
      switch (intersect.object) {
        case sun:
          console.log('Sun')
          break

        case mercury:
          console.log('Mercury')
          break

        case venus:
          console.log('Venus')
          break

        case earth:
          console.log('Earth')
          break

        case moon:
          console.log('Moon')
          break

        case mars:
          console.log('Mars')
          break

        case ceres:
          console.log('Ceres')
          break

        case jupiter:
          console.log('Jupiter')
          break

        case saturn:
          console.log('Saturn')
          break

        case uranus:
          console.log('Uranus')
          break

        case neptune:
          console.log('Neptune')
          break

        case pluto:
          console.log('Pluto')
          break

        case charon:
          console.log('Charon')
          break
      }
    }
  }

  const PayRespects = (e: KeyboardEvent) => {
    if (e.code === 'KeyF' && !respectsPaid) {
      respectsPaid = true
      showRespects = true
      return
    }
  }

  const Phrases = (e: KeyboardEvent) => {
    if (respectsPaid) {
      if (lastEnteredTime === null) {
        lastEnteredTime = Date.now()
      }

      if (!e.code.includes('Key')) {
        return
      }

      if (Date.now() > lastEnteredTime + 1200) {
        lastEnteredTime = Date.now()
        currentEnteredPhrase = ''
      }

      lastEnteredTime = Date.now()

      currentEnteredPhrase += e.code.replace('Key', '').toLowerCase()

      if (currentEnteredPhrase.toLowerCase() === 'cigarette') {
        if (hasPlayedCigarette) {
          return
        }

        Cigarette()
        currentEnteredPhrase = ''

        setTimeout(() => {
          hasPlayedCigarette = true
        }, 2500)
      }

      if (currentEnteredPhrase.toLowerCase() === 'satisfymysoul') {
        if (hasPlayedSatisfyMySoul) {
          return
        }

        SatisfyMySoul()
        currentEnteredPhrase = ''

        setTimeout(() => {
          hasPlayedSatisfyMySoul = true
        }, 2500)
      }

      if (currentEnteredPhrase.toLowerCase() === 'waitinginvain') {
        if (hasPlayedWaitingInVain) {
          return
        }

        WaitingInVain()
        currentEnteredPhrase = ''

        setTimeout(() => {
          hasPlayedWaitingInVain = true
        }, 2500)
      }

      if (currentEnteredPhrase.toLowerCase() === 'weed') {
        showWeed = true
        currentEnteredPhrase = ''

        setTimeout(() => {
          showWeed = false
          hasShownWeed == true
        }, 2500)
      }
    }

    setTimeout(() => {
      showRespects = false
    }, 2000)
  }

  const scene = new THREE.Scene()

  const raycaster = new THREE.Raycaster()
  const loadingManager = new THREE.LoadingManager(
    () => {
      setTimeout(() => {
        isLoading = false
      }, 1500)
    },
    (url: string, loaded: number, total: number) => {
      percentageLoaded = (loaded / total) * 100
    },
    (error) => {
      isLoading = false
    }
  )

  const dracoLoader = new DRACOLoader(loadingManager)
  dracoLoader.setDecoderPath('/draco/')

  const textureLoader = new THREE.TextureLoader(loadingManager)
  const gltfLoader = new GLTFLoader(loadingManager)
  gltfLoader.setDRACOLoader(dracoLoader)

  const sunTexture = textureLoader.load('/assets/sun.jpg')
  const mercuryTexture = textureLoader.load('./assets/mercury.jpg')
  const venusAtmosphereTexture = textureLoader.load('/assets/venus_atmosphere.jpg')
  const earthNormal = textureLoader.load('/assets/earth_normal.jpg')
  const marsTexture = textureLoader.load('/assets/mars.jpg')
  const moonTexture = textureLoader.load('/assets/moon.jpg')
  const jupiterTexture = textureLoader.load('/assets/jupiter.jpg')
  const saturnTexture = textureLoader.load('/assets/saturn.jpg')
  const saturnRing = textureLoader.load('/assets/saturn-rings-top.png')
  const uranusTexture = textureLoader.load('/assets/uranus.jpg')
  const neptuneTexture = textureLoader.load('/assets/neptune.jpg')
  const plutoTexture = textureLoader.load('/assets/pluto.jpg')
  const earthWithClouds = textureLoader.load('/assets/earthWithClouds.png')
  const plutoHeight = textureLoader.load('/assets/pluto_height.jpg')

  const neptuneRing = textureLoader.load('/assets/neptune_ring.png')
  const uranusRing = textureLoader.load('/assets/uranus_ring.png')
  const jupiterRing = textureLoader.load('/assets/jupiter_ring.png')

  const ceresTexture = textureLoader.load('/assets/ceres.jpg')

  const charonTexture = textureLoader.load('/assets/charon.jpg')

  const phobosTexture = textureLoader.load('/assets/phobos.jpg')
  const deimosTexture = textureLoader.load('/assets/deimos.jpg')

  const ganymedeTexure = textureLoader.load('/assets/ganymede.png')
  const callistoTexure = textureLoader.load('/assets/callisto.jpg')
  const amaltheaTexure = textureLoader.load('/assets/amalthea.jpg')
  const ioTexture = textureLoader.load('/assets/io.jpg')

  const titaniaTexutre = textureLoader.load('/assets/titania.jpg')

  const tritonTexutre = textureLoader.load('/assets/triton.jpg')

  const titanTexture = textureLoader.load('/assets/titan.jpg')
  const enceladusTexture = textureLoader.load('/assets/enceladus.jpg')

  const asteroidOneAlbedo = textureLoader.load('/assets/models/Asteroid/Asteroid_One/Asteroid_One_Albedo.png')
  const asteroidOneNormal = textureLoader.load('/assets/models/Asteroid/Asteroid_One/Asteroid_One_Normal.png')

  const asteroidTwoNormal = textureLoader.load('/assets/models/Asteroid/Asteroid_Two/Asteroid_Two_Normal.jpg')
  const asteroidTwoAlbedo = textureLoader.load('/assets/models/Asteroid/Asteroid_Two/Asteroid_Two_Albedo.jpg')

  const asteroidThreeNormal = textureLoader.load('/assets/models/Asteroid/Asteroid_Three/Asteroid_Three_Normal.jpg')
  const asteroidThreeAlbedo = textureLoader.load('/assets/models/Asteroid/Asteroid_Three/Asteroid_Three_Albedo.jpg')

  const stars = textureLoader.load('/assets/stars.jpg')
  scene.background = stars

  const asteroidBelt = new THREE.Group()

  const asteroidOneMaterial = new THREE.MeshStandardMaterial({
    map: asteroidOneAlbedo,
    normalMap: asteroidOneNormal,
  })

  const asteroidTwoMaterial = new THREE.MeshStandardMaterial({
    map: asteroidTwoAlbedo,
    normalMap: asteroidTwoNormal,
  })

  const asteroidThreeMaterial = new THREE.MeshStandardMaterial({
    map: asteroidThreeAlbedo,
    normalMap: asteroidThreeNormal,
  })

  const SUN_WIDTH = 1000
  const SUN_GLOW = SUN_WIDTH * 1.0002
  const ASTEROID_BELT_RADIUS = SUN_WIDTH + 650

  gltfLoader.load('/assets/models/Asteroid/Asteroid_One/Asteroid_One.gltf', (object) => {
    let asteroid: THREE.Mesh

    const radius = Math.sign((Math.random() - 0.5) * 2) * ASTEROID_BELT_RADIUS

    object.scene.traverse((model) => {
      if (model instanceof THREE.Mesh) {
        asteroid = model
      }
    })

    asteroid.material = asteroidOneMaterial

    for (let i = 0; i < 100; i++) {
      const asteroidClone = asteroid.clone()

      const angle = Math.random() * Math.PI * 2
      const randomness = Math.random() * 170

      asteroidClone.position.x = Math.cos(angle) * radius + randomness
      asteroidClone.position.z = Math.sin(angle) * radius + randomness
      asteroidClone.position.y = (Math.random() - 0.5) * 2 * 100

      asteroidClone.rotation.x = Math.random()
      asteroidClone.rotation.y = Math.random()
      asteroidClone.rotation.z = Math.random()
      asteroidClone.scale.setScalar(Math.random())

      asteroidBelt.add(asteroidClone)
    }
  })

  gltfLoader.load('/assets/models/Asteroid/Asteroid_Two/Asteroid_Two.gltf', (object) => {
    let asteroid: THREE.Mesh

    const radius = Math.sign((Math.random() - 0.5) * 2) * ASTEROID_BELT_RADIUS

    object.scene.traverse((model) => {
      if (model instanceof THREE.Mesh) {
        asteroid = model
      }
    })

    asteroid.material = asteroidTwoMaterial

    for (let i = 0; i < 1000; i++) {
      const asteroidClone = asteroid.clone()
      asteroidClone.material = asteroidTwoMaterial

      const angle = Math.random() * Math.PI * 2
      const randomness = Math.random() * 170

      asteroidClone.position.x = Math.cos(angle) * radius + randomness
      asteroidClone.position.z = Math.sin(angle) * radius + randomness
      asteroidClone.position.y = (Math.random() - 0.5) * 2 * 100

      asteroidClone.rotation.x = Math.random()
      asteroidClone.rotation.y = Math.random()
      asteroidClone.rotation.z = Math.random()
      asteroidClone.scale.setScalar(Math.random())
      asteroidBelt.add(asteroidClone)
    }
  })

  gltfLoader.load('/assets/models/Asteroid/Asteroid_Three/Asteroid_Three.gltf', (object) => {
    let asteroid: THREE.Mesh

    const radius = Math.sign((Math.random() - 0.5) * 2) * ASTEROID_BELT_RADIUS

    object.scene.traverse((model) => {
      if (model instanceof THREE.Mesh) {
        asteroid = model
      }
    })

    for (let i = 0; i < 1000; i++) {
      const asteroidClone = asteroid.clone()
      asteroidClone.material = asteroidThreeMaterial

      const angle = Math.random() * Math.PI * 2
      const randomness = Math.random() * 170

      asteroidClone.position.x = Math.cos(angle) * radius + randomness
      asteroidClone.position.z = Math.sin(angle) * radius + randomness
      asteroidClone.position.y = (Math.random() - 0.5) * 2 * 100

      asteroidClone.rotation.x = Math.random()
      asteroidClone.rotation.y = Math.random()
      asteroidClone.rotation.z = Math.random()
      asteroidClone.scale.setScalar(Math.random())

      asteroidBelt.add(asteroidClone)
    }
  })

  scene.add(asteroidBelt)

  const count = 2000

  const pointsGeometry = new THREE.BufferGeometry()

  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count * 1)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    positions[i3] = SUN_WIDTH * (Math.random() < 0.5 ? 1 : -1) * Math.random() * 5
    positions[i3 + 1] = SUN_WIDTH * (Math.random() < 0.5 ? 1 : -1) * Math.random() * 1.5
    positions[i3 + 2] = SUN_WIDTH * (Math.random() < 0.5 ? 1 : -1) * Math.random() * 4
    scales[i] = Math.random()
  }

  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pointsGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

  const pointsMaterial = new THREE.RawShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: { uTime: { value: 0 }, uSize: { value: 30 * sizes.pixelRatio } },
    vertexShader: StarVertexShader,
    fragmentShader: StarFragmentShader,
  })

  const points = new THREE.Points(pointsGeometry, pointsMaterial)
  scene.add(points)

  const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 1, 20000)
  camera.position.y = 10
  camera.position.z = 5000
  scene.add(camera)

  const ambientLight = new THREE.AmbientLight('#fff', 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight('#fff', 2, 4000, 1)
  pointLight.position.x = 1000
  scene.add(pointLight)

  const pointLightHelper = new THREE.PointLightHelper(pointLight)
  pointLightHelper.visible = true
  scene.add(pointLightHelper)

  const sunMaterial = new THREE.RawShaderMaterial({
    fragmentShader: SunFragmentShader,
    vertexShader: SunVertexShader,
    uniforms: {
      sunTexture: { value: sunTexture },
      uTime: { value: 0 },
    },
  })

  const sunGeometry = new THREE.SphereBufferGeometry(SUN_WIDTH, 64, 64)
  const sun = new THREE.Mesh(sunGeometry, sunMaterial)
  scene.add(sun)

  const sunGlowGeometry = new THREE.SphereBufferGeometry(SUN_GLOW, 64, 64)
  const sunGlowMaterial = new THREE.RawShaderMaterial({
    side: THREE.BackSide,
    vertexShader: SunGlowVertexShader,
    fragmentShader: SunGlowFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      sunGlowColor: { value: new THREE.Color(parameters.sunGlowColour) },
    },
  })
  const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial)
  scene.add(sunGlow)

  // * Mercury
  const mercuryGroup = new THREE.Group()
  const mercuryGeometry = new THREE.SphereBufferGeometry(20, 32, 32)
  const mercuryMaterial = new THREE.MeshStandardMaterial({
    map: mercuryTexture,
  })

  const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial)
  mercury.position.x = SUN_GLOW + 120
  mercuryGroup.add(mercury)
  scene.add(mercuryGroup)

  // Venus
  const venusGroup = new THREE.Group()
  const venusGeometry = new THREE.SphereBufferGeometry(25, 32, 32)
  const venusMaterial = new THREE.MeshStandardMaterial({
    map: venusAtmosphereTexture,
  })

  const venus = new THREE.Mesh(venusGeometry, venusMaterial)
  venus.position.x = SUN_GLOW + 200
  venusGroup.add(venus)
  scene.add(venusGroup)

  // Earth
  const earthGroup = new THREE.Group()
  const earthGeometry = new THREE.SphereBufferGeometry(40, 32, 32)
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthWithClouds,
    normalMap: earthNormal,
  })

  const earth = new THREE.Mesh(earthGeometry, earthMaterial)
  earth.position.x = SUN_GLOW + 300
  earthGroup.add(earth)
  scene.add(earthGroup)

  // * Moon
  const moonGroup = new THREE.Group()
  const moonGeometry = new THREE.SphereBufferGeometry(10, 32, 32)
  const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture })
  const moon = new THREE.Mesh(moonGeometry, moonMaterial)
  moonGroup.position.x = earth.position.x
  moon.position.z = -60
  moonGroup.add(moon)
  earthGroup.add(moonGroup)

  // Mars
  const marsGroup = new THREE.Group()
  const marsGeometry = new THREE.SphereBufferGeometry(25, 32, 32)
  const marsMaterial = new THREE.MeshStandardMaterial({
    map: marsTexture,
  })

  const mars = new THREE.Mesh(marsGeometry, marsMaterial)
  mars.position.x = SUN_GLOW + 420
  marsGroup.add(mars)
  scene.add(marsGroup)

  // Phobos
  const phobosGroup = new THREE.Group()
  const phobosGeometry = new THREE.SphereBufferGeometry(4, 32, 32)
  const phobosMaterial = new THREE.MeshStandardMaterial({ map: phobosTexture })
  const phobos = new THREE.Mesh(phobosGeometry, phobosMaterial)
  phobosGroup.position.x = mars.position.x
  phobos.position.z = -30
  phobos.position.y = 5
  phobosGroup.add(phobos)
  marsGroup.add(phobosGroup)

  // Deimos
  const deimosGroup = new THREE.Group()
  const deimosGeometry = new THREE.SphereBufferGeometry(4, 32, 32)
  const deimosMaterial = new THREE.MeshStandardMaterial({ map: deimosTexture })
  const deimos = new THREE.Mesh(deimosGeometry, deimosMaterial)
  deimosGroup.position.x = mars.position.x
  deimos.position.z = 30
  deimos.position.y = -2
  deimosGroup.add(deimos)
  marsGroup.add(deimosGroup)

  // Ceres
  const ceresGroup = new THREE.Group()
  const ceresGeometry = new THREE.SphereBufferGeometry(8, 32, 32)
  const ceresMaterial = new THREE.MeshStandardMaterial({
    map: ceresTexture,
  })

  const ceres = new THREE.Mesh(ceresGeometry, ceresMaterial)
  ceres.position.x = SUN_GLOW + 550
  ceresGroup.add(ceres)
  scene.add(ceresGroup)

  // Jupiter
  const jupiterGroup = new THREE.Group()
  const jupiterGeometry = new THREE.SphereBufferGeometry(120, 32, 32)
  const jupiterMaterial = new THREE.MeshStandardMaterial({
    map: jupiterTexture,
  })

  const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial)
  jupiter.position.x = SUN_GLOW + 1200
  jupiterGroup.add(jupiter)
  scene.add(jupiterGroup)

  const jupiterRingsGeometry = new THREE.RingBufferGeometry(124, 180, 64)
  const jupiterRingsMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      uRingTexture: { value: jupiterRing },
      innerRadius: { value: 124 },
      outerRadius: { value: 180 },
      uTime: { value: 0 },
    },
    vertexShader: JupiterRingVertexShader,
    fragmentShader: JupiterRingFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  })
  const jupiterRings = new THREE.Mesh(jupiterRingsGeometry, jupiterRingsMaterial)
  jupiterRings.rotation.x = -Math.PI * 0.6
  jupiterRings.position.x = SUN_GLOW + 1200
  jupiterGroup.add(jupiterRings)

  // Callisto
  const callistoGroup = new THREE.Group()
  const callistoGeometry = new THREE.SphereBufferGeometry(8, 32, 32)
  const callistorMaterial = new THREE.MeshStandardMaterial({ map: callistoTexure })
  const callisto = new THREE.Mesh(callistoGeometry, callistorMaterial)
  callistoGroup.position.x = jupiter.position.x
  callisto.position.z = -250
  callisto.position.y = 40
  callisto.position.x = 40
  callistoGroup.add(callisto)
  jupiterGroup.add(callistoGroup)

  // Ganymede
  const ganymedeGroup = new THREE.Group()
  const ganymedeGeometry = new THREE.SphereBufferGeometry(8, 32, 32)
  const ganymedeMaterial = new THREE.MeshStandardMaterial({ map: ganymedeTexure })
  const ganymede = new THREE.Mesh(ganymedeGeometry, ganymedeMaterial)
  ganymedeGroup.position.x = jupiter.position.x
  ganymede.position.z = 250
  ganymede.position.y = -20
  callistoGroup.add(ganymede)
  jupiterGroup.add(ganymedeGroup)

  // Io
  const ioGroup = new THREE.Group()
  const ioGeometry = new THREE.SphereBufferGeometry(8, 32, 32)
  const ioMaterial = new THREE.MeshStandardMaterial({ map: ioTexture })
  const io = new THREE.Mesh(ioGeometry, ioMaterial)
  ioGroup.position.x = jupiter.position.x
  io.position.z = 250
  io.position.y = -40
  ioGroup.add(io)
  jupiterGroup.add(ioGroup)

  // Amalthea
  const amaltheaGroup = new THREE.Group()
  const amaltheaGeometry = new THREE.SphereBufferGeometry(6, 32, 32)
  const amaltheaMaterial = new THREE.MeshStandardMaterial({ map: amaltheaTexure })
  const amalthea = new THREE.Mesh(amaltheaGeometry, amaltheaMaterial)
  amaltheaGroup.position.x = jupiter.position.x
  amalthea.position.z = -260
  amaltheaGroup.add(amalthea)
  jupiterGroup.add(amaltheaGroup)

  // Saturn
  const saturnGroup = new THREE.Group()
  const saturnGeometry = new THREE.SphereBufferGeometry(100, 32, 32)
  const saturnMaterial = new THREE.MeshStandardMaterial({
    map: saturnTexture,
  })

  const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial)
  saturn.position.x = SUN_GLOW + 1850
  saturnGroup.add(saturn)
  scene.add(saturnGroup)

  const saturnRingsGeometry = new THREE.RingBufferGeometry(103, 180, 64)
  const saturnRingsMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      uRingTexture: { value: saturnRing },
      innerRadius: { value: 103 },
      outerRadius: { value: 180 },
      uTime: { value: 0 },
    },
    vertexShader: SaturnRingVertexShader,
    fragmentShader: SaturnRingFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  })
  const saturnRings = new THREE.Mesh(saturnRingsGeometry, saturnRingsMaterial)
  saturnRings.rotation.x = -Math.PI * 0.45
  saturnRings.position.x = SUN_GLOW + 1850
  saturnGroup.add(saturnRings)

  // Titan
  const titanGroup = new THREE.Group()
  const titanGeometry = new THREE.SphereBufferGeometry(4, 32, 32)
  const titanMaterial = new THREE.MeshStandardMaterial({ map: titanTexture })
  const titan = new THREE.Mesh(titanGeometry, titanMaterial)
  titanGroup.position.x = saturn.position.x
  titan.position.z = -300
  titanGroup.add(titan)
  saturnGroup.add(titanGroup)

  // Enceladus
  const enceladusGroup = new THREE.Group()
  const enceladusGeometry = new THREE.SphereBufferGeometry(5, 32, 32)
  const enceladusMaterial = new THREE.MeshStandardMaterial({ map: enceladusTexture })
  const enceladus = new THREE.Mesh(enceladusGeometry, enceladusMaterial)
  enceladusGroup.position.x = saturn.position.x
  enceladus.position.z = 250
  enceladusGroup.add(enceladus)
  saturnGroup.add(enceladusGroup)

  // Uranus
  const uranusGroup = new THREE.Group()
  const uranusGeometry = new THREE.SphereBufferGeometry(45, 32, 32)
  const uranusMaterial = new THREE.MeshStandardMaterial({
    map: uranusTexture,
  })

  const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial)
  uranus.position.x = SUN_GLOW + 2350
  uranusGroup.add(uranus)
  scene.add(uranusGroup)

  const uranusRingsGeometry = new THREE.RingBufferGeometry(60, 80, 64)
  const uranusRingsMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      uRingTexture: { value: uranusRing },
      innerRadius: { value: 60 },
      outerRadius: { value: 80 },
      uTime: { value: 0 },
    },
    vertexShader: UranusRingVertexShader,
    fragmentShader: UranusRingFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  })
  const uranusRings = new THREE.Mesh(uranusRingsGeometry, uranusRingsMaterial)
  uranusRings.rotation.x = -Math.PI * 0.25
  uranusRings.position.x = SUN_GLOW + 2350
  uranusGroup.add(uranusRings)

  // Titania
  const titaniaGroup = new THREE.Group()
  const titaniaGeometry = new THREE.SphereBufferGeometry(4, 32, 32)
  const titaniaMaterial = new THREE.MeshStandardMaterial({ map: titaniaTexutre })
  const titania = new THREE.Mesh(titaniaGeometry, titaniaMaterial)
  titaniaGroup.position.x = uranus.position.x
  titania.position.z = 150
  titaniaGroup.add(titania)
  uranusGroup.add(titaniaGroup)

  // Neptune
  const neptuneGroup = new THREE.Group()
  const neptuneGeometry = new THREE.SphereBufferGeometry(42, 32, 32)
  const neptuneMaterial = new THREE.MeshStandardMaterial({
    map: neptuneTexture,
  })

  const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial)
  neptune.position.x = SUN_GLOW + 2600
  neptuneGroup.add(neptune)
  scene.add(neptuneGroup)

  const neptuneRingsGeometry = new THREE.RingBufferGeometry(45, 70, 64)
  const neptuneRingsMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      uRingTexture: { value: neptuneRing },
      innerRadius: { value: 45 },
      outerRadius: { value: 70 },
      uTime: { value: 0 },
    },
    vertexShader: NeptuneRingVertexShader,
    fragmentShader: NeptuneRingFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  })
  const neptuneRings = new THREE.Mesh(neptuneRingsGeometry, neptuneRingsMaterial)
  neptuneRings.rotation.x = -Math.PI * 0.51
  neptuneRings.position.x = SUN_GLOW + 2600
  neptuneGroup.add(neptuneRings)

  // Triton
  const tritonGroup = new THREE.Group()
  const tritonGeometry = new THREE.SphereBufferGeometry(5, 32, 32)
  const tritonMaterial = new THREE.MeshStandardMaterial({ map: tritonTexutre })
  const triton = new THREE.Mesh(tritonGeometry, tritonMaterial)
  tritonGroup.position.x = neptune.position.x
  triton.position.z = -100
  triton.position.y = 10
  tritonGroup.add(triton)
  neptuneGroup.add(tritonGroup)

  // Pluto
  const plutoGroup = new THREE.Group()
  const plutoGeometry = new THREE.SphereBufferGeometry(12, 32, 32)
  const plutoMaterial = new THREE.MeshStandardMaterial({
    map: plutoTexture,
    displacementMap: plutoHeight,
  })

  const pluto = new THREE.Mesh(plutoGeometry, plutoMaterial)
  pluto.position.x = SUN_GLOW + 2800
  plutoGroup.add(pluto)
  scene.add(plutoGroup)

  // Charon
  const charonGroup = new THREE.Group()
  const charonGeometry = new THREE.SphereBufferGeometry(6, 32, 32)
  const charonMaterial = new THREE.MeshStandardMaterial({
    map: charonTexture,
  })

  const charon = new THREE.Mesh(charonGeometry, charonMaterial)
  charonGroup.position.x = pluto.position.x
  charon.position.z = -50
  charonGroup.add(charon)
  plutoGroup.add(charonGroup)

  const bodies = [sun, mercury, venus, earth, moon, mars, ceres, jupiter, saturn, uranus, neptune, pluto, charon]

  onMount(() => {
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
    window.addEventListener('keyup', PayRespects)
    window.addEventListener('keydown', Phrases)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.enableZoom = true

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
    renderer.setClearColor('#111')
    renderer.render(scene, camera)

    const clock = new THREE.Clock()

    let mercuryRotation = (Math.random() - 0.5) * 2 * 4

    const raf = () => {
      const elapsedTime = clock.getElapsedTime()

      mercuryRotation += 0.005

      sunMaterial.uniforms.uTime.value = elapsedTime
      sunGlowMaterial.uniforms.uTime.value = elapsedTime
      saturnRingsMaterial.uniforms.uTime.value = elapsedTime
      pointsMaterial.uniforms.uTime.value = elapsedTime
      uranusRingsMaterial.uniforms.uTime.value = elapsedTime

      mercuryGroup.rotation.y = mercuryRotation * 0.3
      venusGroup.rotation.y = mercuryGroup.rotation.y / 2.55
      earthGroup.rotation.y = mercuryGroup.rotation.y / 4.14
      moonGroup.rotation.y = mercuryGroup.rotation.y * 2
      deimosGroup.rotation.y = mercuryGroup.rotation.y * 2
      phobosGroup.rotation.y = mercuryGroup.rotation.y * 2
      ioGroup.rotation.y = mercuryGroup.rotation.y * 0.9
      ganymedeGroup.rotation.y = mercuryGroup.rotation.y * 0.6
      amaltheaGroup.rotation.y = mercuryGroup.rotation.y * 1.2
      callistoGroup.rotation.y = mercuryGroup.rotation.y * 0.5
      titaniaGroup.rotation.y = mercuryGroup.rotation.y * 0.9
      enceladusGroup.rotation.y = mercuryGroup.rotation.y * 0.5
      tritonGroup.rotation.y = mercuryGroup.rotation.y * 0.5
      titanGroup.rotation.y = mercuryGroup.rotation.y * 1.2
      charonGroup.rotation.y = mercuryGroup.rotation.y * 1.2
      marsGroup.rotation.y = mercuryGroup.rotation.y / 7.8
      ceresGroup.rotation.y = mercuryGroup.rotation.y / 6
      jupiterGroup.rotation.y = mercuryGroup.rotation.y / 8
      saturnGroup.rotation.y = mercuryGroup.rotation.y / 10
      uranusGroup.rotation.y = mercuryGroup.rotation.y / 12
      neptuneGroup.rotation.y = mercuryGroup.rotation.y / 14
      plutoGroup.rotation.y = mercuryGroup.rotation.y / 16

      asteroidBelt.rotation.y = elapsedTime * 0.005

      mercury.rotation.y = elapsedTime * 0.1
      venus.rotation.y = elapsedTime * 0.2
      earth.rotation.y = elapsedTime * 0.4
      moon.rotation.y = elapsedTime * 0.5
      deimos.rotation.y = elapsedTime * 0.5
      phobos.rotation.y = elapsedTime * 0.5
      charon.rotation.y = elapsedTime * 0.5
      io.rotation.y = elapsedTime * 0.5
      ganymede.rotation.y = elapsedTime * 0.3
      amalthea.rotation.y = elapsedTime * 0.6
      callisto.rotation.y = elapsedTime * 0.2
      triton.rotation.y = elapsedTime * 0.9
      titania.rotation.y = mercuryGroup.rotation.y * 0.9
      enceladus.rotation.y = mercuryGroup.rotation.y * 0.9
      titan.rotation.y = mercuryGroup.rotation.y * 1.9
      mars.rotation.y = elapsedTime * 0.4
      ceres.rotation.y = elapsedTime * 0.4
      jupiter.rotation.y = elapsedTime * 0.2
      saturn.rotation.y = elapsedTime * 0.2
      uranus.rotation.y = elapsedTime * 0.2
      neptune.rotation.y = elapsedTime * 0.2
      pluto.rotation.y = elapsedTime * 0.09

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(bodies)

      if (intersects.length) {
        intersect = intersects[0]
      } else {
        intersect = null
      }

      controls.update()
      renderer.render(scene, camera)

      requestAnimationFrame(raf)
    }

    raf()
  })

  onDestroy(() => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('click', onClick)
    window.removeEventListener('keyup', PayRespects)
    window.removeEventListener('keydown', Phrases)
  })
</script>

{#if showRespects}
  <RespectsPaid />
{/if}

{#if isLoading}
  <LoadingScreen percentage={percentageLoaded} />
{/if}
<canvas bind:this={canvas} />

{#if showWeed && !hasShownWeed}
  <img src="/assets/weed.png" alt="" />
{/if}

<style>
  canvas {
    padding: 0;
    margin: 0;
    z-index: 1;
  }

  img {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 20rem;
    max-height: 20rem;
    z-index: 40;
    user-select: none;
  }
</style>
