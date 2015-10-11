/*jslint browser: true*/
/*global THREE, Stats, TWEEN*/

/*
---------------------------------------------------------------------------

PARTICLE DEMO
=============

Written By Kevin Ellis September 2015.

An experiment in particles (aka sprites) inspired by the Atari ST Demo
scene of the late 1980s.

---------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2015 Kevin Ellis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---------------------------------------------------------------------------
*/

function particleDemo() {
  'use strict';

  function initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    return stats;
  }

  //Global boilder plate stuff
  var stats = initStats();

  //Create canvas to draw text/images that particales should morph to.
  var canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 20;
  canvas.id = 'textPad';
  var ctx = canvas.getContext("2d");
  canvas.style.position = "absolute";
  canvas.style.left = '0px';
  canvas.style.top = '500px';
  canvas.style.width = 120;
  canvas.style.height = 20;
  canvas.style.border = "1px solid";
  canvas.style.zIndex = 30;
  ctx.font = "20px Arial";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("YorkshireKev", 0, 18);
  //ctx.fillText(".", 0, 30);
  document.body.appendChild(canvas); //remove this!

  //some globals
  var ix = 0,
    iy = 0,
    iz = 0,
    particle = [];
  var tween;
  var data = ctx.getImageData(0, 0, 120, 20).data;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);

  //renderer.shadowMapEnabled = true;
  // create the ground plane
  var planeGeometry = new THREE.PlaneBufferGeometry(150, 150);

  //Floor plane texture
  var planeTexture = THREE.ImageUtils.loadTexture("images/tile.png"),
    particleTexture = THREE.ImageUtils.loadTexture("images/particle.png");

  var planeMaterial = new THREE.MeshPhongMaterial({
    map: planeTexture
  });

  var particleMaterial = new THREE.SpriteMaterial({
    map: particleTexture,
    transparent: true
    //blending: THREE.NormalBlending
  });

  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.repeat.set(8, 8);

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = -15;
  plane.position.z = 0;
  // add the plane to the scene
  scene.add(plane);

  //Define the array of particles
  iz = 0;
  for (ix = 0; ix < 480; ix += 4) {
    for (iy = 0; iy < 20; iy += 1) {
      particle[iz] = new THREE.Sprite(particleMaterial);
      particle[iz].position.set((ix / 4) - 60, (50 - iy) - 15, -90);
      particle[iz].isHome = false;
      if (data[ix + (iy * 480)] !== 0) {
        particle[iz].formesWord = true;
      } else {
        particle[iz].formesWord = false;
      }
      tween = new TWEEN.Tween(particle[iz].position).to({
        x: ((ix / 4) - 60),
        y: ((50 - iy) - 15),
        z: particle[iz].formesWord ? 0 : -150
      }, 7000).easing(TWEEN.Easing.Quadratic.InOut).start(3000);
      scene.add(particle[iz]);
      iz += 1;
    }
  }

  function randomParticles() {
    TWEEN.removeAll();
    iz = 0;
    for (ix = 0; ix < 480; ix += 4) {
      for (iy = 0; iy < 20; iy += 1) {
        particle[iz].formesWord = true;
        tween = new TWEEN.Tween(particle[iz].position).to({
          x: -60 + (Math.random() * 120),
          y: -10 + (Math.random() * 40),
          z: 30 + (Math.random() * 10)
        }, 5000).easing(TWEEN.Easing.Quadratic.InOut).start();
        iz += 1;
      }
    }
  }

  function kickOffTween() {
    TWEEN.removeAll();
    data = ctx.getImageData(0, 0, 120, 20).data;
    iz = 0;
    for (ix = 0; ix < 480; ix += 4) {
      for (iy = 0; iy < 20; iy += 1) {
        if (data[ix + (iy * 480)] !== 0) {
          particle[iz].formesWord = true;
        } else {
          particle[iz].formesWord = false;
        }
        tween = new TWEEN.Tween(particle[iz].position).to({
          x: ((ix / 4) - 60),
          y: ((50 - iy) - 15),
          z: particle[iz].formesWord ? 0 : -150
        }, 7000).easing(TWEEN.Easing.Quadratic.InOut).start();
        iz += 1;
      }
    }
  }

  /*var data = ctx.getImageData(0, 0, 120, 20).data;
  for (ix = 0; ix < 480; ix += 4) {
    for (iy = 0; iy < 20; iy += 1) {
      particle[iz] = new THREE.Sprite(particleMaterial);
      particle[iz].position.set(-60 + (Math.random() * 120), -10 + (Math.random() * 40), 30 + (Math.random() * 10));
      particle[iz].isHome = false;
      if (data[ix + (iy * 480)] !== 0) {
        particle[iz].formesWord = true;
      } else {
        particle[iz].formesWord = false;
      }
      tween = new TWEEN.Tween(particle[iz].position).to({
        x: ((ix / 4) - 60),
        y: ((50 - iy) - 15),
        z: particle[iz].formesWord ? 0 : -150
      }, 7000).easing(TWEEN.Easing.Quadratic.InOut).start(0);
      scene.add(particle[iz]);
      iz += 1;
    }
  }*/

  function text1() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 120, 20);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Presents...", 0, 18);
    kickOffTween();
    //Set up next tect change here... <TODO>
  }

  //Set up first text change...
  setTimeout(function () {
    randomParticles();
  }, 11000);

  //Set up first text change...
  setTimeout(function () {
    text1();
  }, 15000);

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 10;
  camera.position.z = 120;
  camera.lookAt(scene.position);

  //Add an ambient light
  var ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(20, 50, 100);
  spotLight.castShadow = false;
  scene.add(spotLight);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize, false);

  // add the output of the renderer to the html element
  document.body.appendChild(renderer.domElement);

  var clock = new THREE.Clock();

  function renderScene() {
    stats.update();
    var delta = clock.getDelta();
    planeTexture.offset.y += delta * 1.4;
    if (planeTexture.offset.y > 1) {
      planeTexture.offset.y -= 1;
    }

    TWEEN.update();

    window.requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }

  renderScene();
} //end particleDemo

window.onload = particleDemo;