/*jslint browser: true*/
/*global THREE, Stats*/

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
  canvas.width = 150;
  canvas.height = 20;
  canvas.id = 'textPad';
  var ctx = canvas.getContext("2d");
  canvas.style.position = "absolute";
  canvas.style.left = '0px';
  canvas.style.top = '500px';
  canvas.style.width = 150;
  canvas.style.height = 20;
  canvas.style.border = "1px solid";
  canvas.style.zIndex = 30;
  ctx.font = "25px Arial";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("YorkshireKev", 0, 20);
  //ctx.fillText(".", 0, 30);
  document.body.appendChild(canvas); //remove this!


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
  var ix = 0,
    iy = 0,
    iz = 0,
    particle = [];
  var data = ctx.getImageData(0, 0, 150, 50).data;
  for (ix = 0; ix < 600; ix += 4) {
    for (iy = 0; iy < 20; iy += 1) {
      particle[iz] = new THREE.Sprite(particleMaterial);
      if (data[ix + (iy * 600)] !== 0) {
        particle[iz].position.set((ix / 4) - 75, (50 - iy) - 15, (Math.random() * 100));
        scene.add(particle[iz]);
        particle[iz].spare = false;
        //iz += 1;
      } else {
        particle[iz].position.set((Math.random() * 150) - 75, (Math.random() * 50) - 15, (Math.random() * 100));
        scene.add(particle[iz]);
        particle[iz].spare = true;
      }
      iz += 1;
    }
  }
  console.log(iz);

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
  spotLight.castShadow = true;
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

  function renderScene() { //particle.position.set(ix, ix, 0);
    //particle.scale.set(4, 4, 4);
    stats.update();
    var delta = clock.getDelta();
    planeTexture.offset.y += delta * 1.4;
    if (planeTexture.offset.y > 1) {
      planeTexture.offset.y -= 1;
    }

    for (iz = 0; iz < particle.length; iz++) {
      if (particle[iz].position.z > 0 && particle[iz].spare === false) {
        particle[iz].position.z -= delta * 10;
      }
      if (particle[iz].position.z > -100 && particle[iz].spare === true) {
        particle[iz].position.z -= delta * 10;
      }
    }

    window.requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }

  renderScene();
} //end particleDemo

window.onload = particleDemo;