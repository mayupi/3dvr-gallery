const touchEnabled = !!('ontouchstart' in window)

class JoyStick {
  
  constructor(options) {
    this.createDom()
    this.maxRadius = options.maxRadius || 40
    this.maxRadiusSquared = this.maxRadius *　this.maxRadius
    this.onMove = options.onMove
    this.game = options.game
    this.origin = {
      left: this.domElement.offsetLeft,
      top: this.domElement.offsetTop
    }
    console.log(this.origin)
    this.rotationDamping = options.rotationDamping || 0.06
    this.moveDamping = options.moveDamping || 0.01
    this.createEvent()
  }

  createEvent() {
    const joystick = this
    if(touchEnabled) {
      this.domElement.addEventListener('touchstart', function(e) {
        e.preventDefault()
        joystick.tap(e)
        e.stopPropagation()
      })
    } else {
      this.domElement.addEventListener('mousedown', function(e) {
        e.preventDefault()
        joystick.tap(e)
        e.stopPropagation()
      })
    }
  }

  getMousePosition(e) {
    let clientX = e.targetTouches ? e.targetTouches[0].pageX : e.clientX
		let clientY = e.targetTouches ? e.targetTouches[0].pageY : e.clientY
		return {
      x:clientX, 
      y:clientY
    }
  }

  tap(e) {
    this.offset = this.getMousePosition(e)
    const joystick = this
    this.onTouchMoved = function(e) {
      e.preventDefault()
      joystick.move(e)
    }
    this.onTouchEnded = function(e) {
      e.preventDefault()
      joystick.up(e)
    }
    if(touchEnabled) {
      document.addEventListener('touchmove', this.onTouchMoved)
      document.addEventListener('touchend', this.onTouchEnded)
    } else {
      document.addEventListener('mousemove', this.onTouchMoved)
      document.addEventListener('mouseup', this.onTouchEnded)
    }
  }

  move(e) {
		const mouse = this.getMousePosition(e)

		let left = mouse.x - this.offset.x
		let top = mouse.y - this.offset.y

		const sqMag = left * left + top * top

		if (sqMag > this.maxRadiusSquared){
			const magnitude = Math.sqrt(sqMag)
			left /= magnitude
			top /= magnitude
			left *= this.maxRadius
			top *= this.maxRadius
		}

		this.domElement.style.top = `${ top + this.domElement.clientHeight / 2 }px`
		this.domElement.style.left = `${ left + this.domElement.clientWidth / 2 }px`
		
		const forward = -(top - this.origin.top + this.domElement.clientHeight / 2) / this.maxRadius
		const turn = (left - this.origin.left + this.domElement.clientWidth / 2) / this.maxRadius

    if(this.onMove) {
      this.onMove(forward, turn)
    }

  }

  up(e) {
		if (touchEnabled){
      document.removeEventListener('touchmove', this.onTouchMoved)
      document.removeEventListener('touchend', this.onTouchEned)
		}else{
			document.removeEventListener('mousemove', this.onTouchMoved)
      document.removeEventListener('mouseup', this.onTouchEned)
		}
		this.domElement.style.top = `${this.origin.top}px`
		this.domElement.style.left = `${this.origin.left}px`
    if(this.onMove) {
      this.onMove(0, 0)
    }
	}
  
  createDom() {
    const circle = document.createElement('div')
    circle.style.cssText = `
      position: absolute;
      bottom: 35px;
      width: 80px;
      height: 80px;
      background: rgba(126, 126, 126, 0.2);
      border: #444 solid medium;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
    `
    const thumb = document.createElement('div')
    thumb.style.cssText = `
      position: absolute;
      left: 20px;
      top: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
    `
    circle.appendChild(thumb)
    document.body.appendChild(circle)
    this.domElement = thumb
  }
}