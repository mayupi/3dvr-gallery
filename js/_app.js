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


let player, activeCamera
let speed = 6 //移动速度
let turnSpeed = 2
let move = {
  forward: 0,
  turn: 0
}

function init() {
  createScene()
  createObjects()
  createColliders()
  createPlayer()
  createCamera()
  createLights()
  //createLightHelpers()
  createControls()
  createEvents()
  render()
}

function createEvents() {
  document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)
}

function createColliders() {
  const loader = new THREE.GLTFLoader()
  loader.load(
    'model/collider.glb',
    gltf => {
      gltf.scene.traverse(child => {
        console.log(child)
      })
    }
  )
}

function onKeyDown(event) {
  switch ( event.code ) {
    case 'ArrowUp':
    case 'KeyW':
      move.forward = 1
      break

    case 'ArrowLeft':
    case 'KeyA':
      move.turn = turnSpeed
      break

    case 'ArrowDown':
    case 'KeyS':
      move.forward = -1
      break

    case 'ArrowRight':
    case 'KeyD':
      move.turn = -turnSpeed
      break
    case 'Space':
      break
  }
}

function onKeyUp(event) {
  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      move.forward = 0
      break

    case 'ArrowLeft':
    case 'KeyA':
      move.turn = 0
      break

    case 'ArrowDown':
    case 'KeyS':
      move.forward = 0
      break

    case 'ArrowRight':
    case 'KeyD':
      move.turn = 0
      break

  }
}

function createPlayer() {
  const geometry = new THREE.BoxGeometry(1, 2, 1)
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
  })
  player = new THREE.Mesh(geometry, material)
  geometry.translate(0, 1, 0)
  player.position.set(-5, 0, 5)
  //scene.add(player)
}

function createCamera() {
  const back = new THREE.Object3D()
  back.position.set(0, 2, 1)
  back.parent = player
  //player.add(back)
  
  activeCamera = back
  
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

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
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
        //设置展画边框贴图
        if(child.name.includes('paint')) {
          initFrames(child)
        }
        //设置展画图片贴图
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
  const dt = clock.getDelta()
  update(dt)
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}

function update(dt) {
  updatePlayer(dt)
  updateCamera(dt)
}

function updatePlayer(dt) {
  if(move.forward !== 0) { 
    if (move.forward > 0) {
      console.log('dd')
      player.translateZ(-dt * speed)
    } else {
      player.translateZ(dt * speed * 0.5)
    }
  }
  if(move.turn !== 0) {
    player.rotateY(move.turn * dt)
  }
}

function updateCamera(dt) {
  //更新摄像机
camera.position.lerp(
  activeCamera.getWorldPosition(
    new THREE.Vector3()
  ), 
  0.05
)
	const pos = player.position.clone()
  pos.y += 2
	camera.lookAt(pos)
}

init()