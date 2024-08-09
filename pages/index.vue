<template lang="pug">
section
  #input.gap-4.flex.flex-row
    u-input(
      v-model="prompt"
      @keydown.enter="loadNewImage"
      :loading="loading"
      :disabled="loading"
      class="md:block md:min-w-96"
      icon="i-heroicons-chat-bubble-bottom-center-text"
      size="xl"
      placeholder="Write a new prompt and hit [ENTER]"
      trailing
    )
    u-button(
      to="https://github.com/pwntus/replicate-holodeck"
      target="_blank"
      size="lg"
      icon="i-heroicons-code-bracket"
      variant="solid"
    ) Get the Code
  #panorama-container(
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @mouseenter="onMouseEnter"
  )
</template>

<script>
import * as THREE from 'three'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default {
  name: 'index',
  data: () => ({
    loading: false,
    prompt: '',

    currentImageUrl: '/initial.webp',
    isMouseInside: false,
    rotationSpeed: 0.75,
    lon: 0,
    lat: 0,
    phi: 0,
    theta: 0,
    mouseX: 0,
    mouseY: 0,
    autoRotateSpeed: 0.05,
    defaultLat: 0,
    verticalReturnSpeed: 0.02,
    zoom: 75,
    minZoom: 30,
    maxZoom: 90,
    zoomSpeed: 0.1
  }),
  methods: {
    onMouseMove(event) {
      if (this.isMouseInside) {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        this.mouseX = (event.clientX - centerX) / centerX // -1 to 1
        this.mouseY = (event.clientY - centerY) / centerY // -1 to 1
      }
    },
    onMouseEnter() {
      this.isMouseInside = true
    },
    onMouseLeave() {
      this.isMouseInside = false
    },
    onWheel(event) {
      event.preventDefault()

      // Adjust zoom based on wheel direction
      this.zoom -= event.deltaY * this.zoomSpeed

      // Clamp zoom between min and max values
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom))

      // Update camera FOV
      this.camera.fov = this.zoom
      this.camera.updateProjectionMatrix()
    },
    initPanorama() {
      const container = document.getElementById('panorama-container')
      this.camera = new THREE.PerspectiveCamera(
        this.zoom,
        window.innerWidth / window.innerHeight,
        1,
        1100
      )

      this.scene = new THREE.Scene()

      const geometry = new THREE.SphereGeometry(500, 60, 40)
      geometry.scale(-1, 1, 1)

      this.texture = new THREE.TextureLoader().load(this.currentImageUrl)
      const material = new THREE.MeshBasicMaterial({ map: this.texture })

      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)

      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      container.appendChild(this.renderer.domElement)

      this.animate()

      window.addEventListener('resize', this.onWindowResize)
    },
    animate() {
      requestAnimationFrame(this.animate)

      if (this.isMouseInside) {
        // Continuous panning based on mouse position
        this.lon += this.mouseX * this.rotationSpeed
        this.lat -= this.mouseY * this.rotationSpeed
      } else {
        // Continue horizontal rotation
        this.lon += this.autoRotateSpeed

        // Gradually return to default vertical position
        const deltaLat = this.defaultLat - this.lat
        this.lat += deltaLat * this.verticalReturnSpeed
      }

      this.lat = Math.max(-85, Math.min(85, this.lat))

      this.phi = THREE.MathUtils.degToRad(90 - this.lat)
      this.theta = THREE.MathUtils.degToRad(this.lon)

      const x = 500 * Math.sin(this.phi) * Math.cos(this.theta)
      const y = 500 * Math.cos(this.phi)
      const z = 500 * Math.sin(this.phi) * Math.sin(this.theta)

      this.camera.lookAt(x, y, z)

      this.renderer.render(this.scene, this.camera)
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    async loadNewImage() {
      this.loading = true

      try {
        const prediction_image = await this.createPrediction(
          'bfd2e4035cea655e508dd0c4a07addd1976e3223771d1a318a8dc698ccc2f3a0',
          {
            prompt: this.prompt,
            output_format: 'webp'
          }
        )

        const prediction_upscaled = await this.createPrediction(
          'dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e',
          {
            image: prediction_image.output[0],
            output_format: 'webp'
          }
        )

        const newImageUrl = prediction_upscaled.output[0]

        // Load the new texture
        const loader = new THREE.TextureLoader()
        loader.load(newImageUrl, (newTexture) => {
          this.mesh.material.map = newTexture
          this.mesh.material.needsUpdate = true
          this.currentImageUrl = newImageUrl
        })
      } catch (e) {
        console.error('--- error (loadNewImage):', e.message)
      } finally {
        this.loading = false
      }
    },
    async createPrediction(
      version,
      input,
      callback = () => {},
      poll_interval = 10000
    ) {
      try {
        const { data } = await $fetch('/api/prediction', {
          method: 'POST',
          body: {
            version,
            input
          }
        })

        let status = 'starting'
        let response = null

        // Poll
        while (status !== 'succeeded' && status !== 'failed') {
          response = await $fetch(`/api/prediction?id=${data?.id}`)
          callback(response.data)

          status = response.data.status
          if (status !== 'succeeded' && status !== 'failed') {
            await sleep(poll_interval)
          }
        }

        return response.data
      } catch (e) {
        console.log('--- error (createPrediction):', e.message)
      }
    }
  },
  mounted() {
    this.initPanorama()
  }
}
</script>

<style lang="stylus" scoped>
section
  #input
    position absolute
    top: 20px
    left 50%
    transform translateX(-50%)

  #panorama-container
    width 100vw
    height 100vh
    cursor crosshair
</style>
