export class Transition {
  static disappear(object, time = 250, destroy = false) {
      const tweenConfig = {
          targets: object,
          alpha: 0,
          duration: time,
          ease: 'Linear',
          onComplete: () => {
              destroy && object.destroy(true)
          },
      }

      object.scene.tweens.add(tweenConfig)
  }

  static appear(object, time = 250) {
      const tweenConfig = {
          targets: object,
          alpha: 1,
          duration: time,
          ease: 'Linear',
      }

      object.scene.tweens.add(tweenConfig)
  }

  static press(object, time = 100, callback) {
      const tweenConfig = {
          targets: object,
          scale: object.scale * 0.9,
          ease: Phaser.Math.Easing.Cubic.Out,
          yoyo: true,
          duration: time,
          onYoyo: callback
      }

      object.scene.tweens.add(tweenConfig)
  }

  static blink(object, interval = 500) {
      const tweenConfig = {
          targets: object,
          alpha: 0,
          loop: -1,
          duration: interval,
          ease: 'Linear',
          yoyo: true
      }

      object.scene.tweens.add(tweenConfig)
  }

  static sceneSwitch(currentScene, toSceneKey, removeCurrentScene = false) {
      const toScene = currentScene.scene.get(toSceneKey)
      const duration = 400
      const fadeOutConfig = {
          targets: currentScene.cameras.main,
          alpha: {from: 1, to: 0},
          duration: duration
      }

      const fadeInConfig = {
          targets: toScene.cameras.main,
          alpha: {from: 0, to: 1},
          duration: duration,
          onComplete: () => {
              if (removeCurrentScene)
                  toScene.scene.remove(currentScene.scene.key)
              else
                  toScene.scene.stop(currentScene.scene.key)
          }
      }

      currentScene.scene.run(toScene.scene.key)
      currentScene.tweens.add(fadeOutConfig)
      toScene.tweens.add(fadeInConfig)
  }

  static sceneShow(currentScene, toSceneKey, data) {
      const duration = 400
      const toScene = currentScene.scene.get(toSceneKey)
      currentScene.scene.run(toScene.scene.key, data)

      if (!!toScene.cameras.main) {
          this.cameraFadeIn(toScene, toScene.cameras.main, duration)
          return
      }

      const cameraCheckInterval = setInterval(() => {
          if (!toScene.cameras.main)
              return

          clearInterval(cameraCheckInterval)

          this.cameraFadeIn(toScene, toScene.cameras.main, duration)
      }, 20)
  }

  static cameraFadeIn(scene, camera, duration) {
      const fadeInConfig = {
          targets: camera,
          alpha: {from: 0, to: 1},
          duration: duration
      }
      scene.tweens.add(fadeInConfig)
  }

  static sceneHide(scene) {
      const duration = 400
      const fadeInConfig = {
          targets: scene.cameras.main,
          alpha: {from: 1, to: 0},
          duration: duration,
          onComplete: () => {
              scene.scene.stop()
          }
      }

      scene.tweens.add(fadeInConfig)
  }
}
