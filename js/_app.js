/*
 *  作者: 行歌
 *  微信公众号: 码语派
 */

let camera, renderer, scene
let controls
let pointLight1, pointLight2, pointLight3
let pointLight4, pointLight5, pointLight6
let pointLight7
let ambientLight
let clock = new THREE.Clock()


let raycaster
const objects = []

/*
 * 控制参数
 */
let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let canJump = false

let prevTime = performance.now()
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
const vertex = new THREE.Vector3()
const color = new THREE.Color()

function init() {
  createScene()
  createObjects()
  createLights()
  //createLightHelpers()
  createControls()
  createRaycasts()
  createEvents()
  render()
}

function createEvents() {
  document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)
}

function onKeyDown(event) {
  switch ( event.code ) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = true
      break

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true
      break

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true
      break

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true
      break

    case 'Space':
      if ( canJump === true ) velocity.y += 350
      canJump = false
      break
  }
}

function onKeyUp(event) {
  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false
      break

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false
      break

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false
      break

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false
      break

  }
}

function createScene() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  // renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(-10, 2, 10)

  scene = new THREE.Scene()
  
  const container = document.querySelector('#container')
  container.appendChild(renderer.domElement)

  window.addEventListener('resize', onResize)
}

function createLights() {
  ambientLight = new THREE.AmbientLight(0xe0ffff, 0.6)
  scene.add(ambientLight)

  pointLight1 = new THREE.PointLight(0xe0ffff, 0.1, 20) 
  pointLight1.position.set(-2, 3, 2)

  scene.add(pointLight1)

  pointLight2 = new THREE.PointLight(0xe0ffff, 0.1, 20) 
  pointLight2.position.set(0, 3, -6)
  scene.add(pointLight2)

  pointLight3 = new THREE.PointLight(0xe0ffff, 0.1, 20) 
  pointLight3.position.set(-12, 3, 6)
  scene.add(pointLight3)

  pointLight4 = new THREE.PointLight(0xe0ffff, 0.1, 20) 
  pointLight4.position.set(-12, 4, -4)
  scene.add(pointLight4)

  pointLight5 = new THREE.PointLight(0xe0ffff, 0.1, 20) 
  pointLight5.position.set(12, 4, -8)
  scene.add(pointLight5)

  pointLight6 = new THREE.PointLight(0xe0ffff, 0.1, 20) 
  pointLight6.position.set(12, 4, 0)
  scene.add(pointLight6)

  pointLight7 = new THREE.PointLight(0xe0ffff, 0.1, 20) 
  pointLight7.position.set(12, 4, 8)
  scene.add(pointLight7)
}

function createLightHelpers() {
  
  const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1)
  scene.add(pointLightHelper1)

  const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1)
  scene.add(pointLightHelper2)

  const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1)
  scene.add(pointLightHelper3)

  const pointLightHelper4 = new THREE.PointLightHelper(pointLight4, 1)
  scene.add(pointLightHelper4)

  const pointLightHelper5 = new THREE.PointLightHelper(pointLight5, 1)
  scene.add(pointLightHelper5)

  const pointLightHelper6 = new THREE.PointLightHelper(pointLight6, 1)
  scene.add(pointLightHelper6)

  const pointLightHelper7 = new THREE.PointLightHelper(pointLight7, 1)
  scene.add(pointLightHelper7)
}

function createControls() {
  //controls = new THREE.OrbitControls(camera, renderer.domElement)
  //controls = new THREE.PointerLockControls(camera, document.body)
  controls = new THREE.FirstPersonControls(camera, renderer.domElement)
  controls.lookSpeed = 0.1
  controls.movementSpeed = 5
}

function createRaycasts() {
  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10)
}

function createObjects() {
  const loader = new THREE.GLTFLoader()
  loader.load(
    'model/gallery.glb',
    gltf => {
      gltf.scene.traverse(child => {
        switch(child.name) {
          case 'walls':
            initWalls(child)
            break
          case 'stairs':
            initStairs(child)
            break
        }
        if(child.name.includes('paint')) {
          initFrames(child)
        }
        if(child.name.includes('draw')) {
          initDraws(child)
        }
      })
      scene.add(gltf.scene)
    }
  )
}

function initDraws(child) {
  const index = child.name.split('draw')[1]
  const texture =  new THREE.TextureLoader().load(`img/${index}.jpg`)
  texture.encoding = THREE.sRGBEncoding
  texture.flipY = false
  const material = new THREE.MeshPhongMaterial({
    map: texture
  })
  child.material = material
}

function initFrames(child) {
  child.material = new THREE.MeshBasicMaterial({
    color: 0x7f5816
  })
}

function initStairs(child) {
  child.castShadow = true
  child.material = new THREE.MeshStandardMaterial({
    color: 0xd1cdb7
  })
  child.material.roughness = 0.5
  child.material.metalness = 0.6
}

function initWalls(child) {
  child.receiveShadow = true
  child.material = new THREE.MeshStandardMaterial({
    color: 0xffffff
  })
  child.material.roughness = 0.5
  child.material.metalness = 0.6
}

function onResize() {
  const w = window.innerWidth
  const h = window.innerHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}


function render() {
  window.requestAnimationFrame(render)
  const delta = clock.getDelta()
  controls.update(delta)
  //update()
  renderer.render(scene, camera)
 
}

function update() {

  const time = performance.now()
  if (controls.isLocked) {
    raycaster.ray.origin.copy(controls.getObject().position)
    raycaster.ray.origin.y -= 10

    const intersections = raycaster.intersectObjects(objects)

    const onObject = intersections.length > 0

    const delta = (time - prevTime) / 1000

    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta

    velocity.y -= 9.8 * 100.0 * delta

    direction.z = Number(moveForward) - Number(moveBackward)
    direction.x = Number(moveRight) - Number(moveLeft)
    direction.normalize()

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y)
      canJump = true
    }

    controls.moveRight(-velocity.x * delta)
    controls.moveForward(-velocity.z * delta)


    controls.getObject().position.y += (velocity.y * delta)

    if (controls.getObject().position.y < 10) {
      velocity.y = 0
      controls.getObject().position.y = 2
      canJump = true
    }

  }
  prevTime = time
}

init()