/*jslint browser: true*/
/*jslint indent: 2 */
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
  //document.body.appendChild(canvas); //remove this!

  //some globals
  var ix = 0,
    iy = 0,
    iz = 0,
    particle = [];
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

  function makeTextArray() {
    data = ctx.getImageData(0, 0, 120, 20).data;
    var textArray = [];
    for (ix = 0; ix < 480; ix += 4) {
      for (iy = 0; iy < 20; iy += 1) {
        if (data[ix + (iy * 480)] !== 0) {
          textArray.push(true);
        } else {
          textArray.push(false);
        }
      }
    }
    return textArray;
  }

  var textArr01,
    textArr02,
    textArr03,
    textArr04,
    textArr05;
  //Define the array of particles
  function defineParticles() {
    var tween1,
      tween2,
      tween3,
      tween4,
      tween5,
      tween6,
      tween7,
      tween8,
      tween9,
      tween10;
    iz = 0;
    for (ix = 0; ix < 120; ix += 1) {
      for (iy = 0; iy < 20; iy += 1) {
        particle[iz] = new THREE.Sprite(particleMaterial);
        particle[iz].position.set(ix - 60, (50 - iy) - 15, -90);
        particle[iz].isHome = false;
        particle[iz].formesWord = textArr01[iz];

        //First morph
        tween1 = new TWEEN.Tween(particle[iz].position).to({
          x: (ix - 60),
          y: ((50 - iy) - 15),
          z: particle[iz].formesWord ? 0 : -150
        }, 7000).easing(TWEEN.Easing.Quadratic.InOut);

        //2nd Morph
        tween2 = new TWEEN.Tween(particle[iz].position).to({
          x: (ix - 60),
          y: ((50 - iy) - 15),
          z: -150
        }, 4000).easing(TWEEN.Easing.Quadratic.InOut);

        tween3 = new TWEEN.Tween(particle[iz].position).to({
          x: -60 + (Math.random() * 120),
          y: -10 + (Math.random() * 40),
          z: 30 + (Math.random() * 30)
        }, 5000).easing(TWEEN.Easing.Quadratic.InOut);

        tween4 = new TWEEN.Tween(particle[iz].position).to({
          x: (ix - 60),
          y: ((50 - iy) - 15),
          z: textArr02[iz] ? 0 : -150
        }, 7000).easing(TWEEN.Easing.Quadratic.InOut);

        tween5 = new TWEEN.Tween(particle[iz].position).to({
          x: -60 + (Math.random() * 120),
          y: -10 + (Math.random() * 40),
          z: -150 + (Math.random() * 300)
        }, 5000).easing(TWEEN.Easing.Quadratic.InOut);

        tween6 = new TWEEN.Tween(particle[iz].position).to({
          x: (ix - 60),
          y: ((50 - iy) - 15),
          z: textArr03[iz] ? 0 : -200
        }, 7000).easing(TWEEN.Easing.Quadratic.InOut);

        tween7 = new TWEEN.Tween(particle[iz].position).to({
          x: -60 + (Math.random() * 120),
          y: -10 + (Math.random() * 40),
          z: -150 + (Math.random() * 150)
        }, 5000).easing(TWEEN.Easing.Quadratic.InOut);

        tween8 = new TWEEN.Tween(particle[iz].position).to({
          x: (ix - 60),
          y: ((50 - iy) - 15),
          z: textArr04[iz] ? ix / 3 : -100 + (iy * 3)
        }, 7000).easing(TWEEN.Easing.Quadratic.InOut);

        tween9 = new TWEEN.Tween(particle[iz].position).to({
          x: -60 + (Math.random() * 120),
          y: -10 + (Math.random() * 40),
          z: -30 + (Math.random() * 60)
        }, 3000).easing(TWEEN.Easing.Quadratic.InOut);

        tween10 = new TWEEN.Tween(particle[iz].position).to({
          x: (ix - 60),
          y: ((50 - iy) - 15),
          z: textArr05[iz] ? 10 + (ix / 3 ) : -75
        }, 7000).easing(TWEEN.Easing.Quadratic.InOut);

        //Chain tweens together
        tween1.chain(tween2);
        tween2.chain(tween3);
        tween3.chain(tween4);
        tween4.chain(tween5);
        tween5.chain(tween6);
        tween6.chain(tween7);
        tween7.chain(tween8);
        tween8.chain(tween9);
        tween9.chain(tween10);
        tween10.chain(tween5);
        tween1.start(3000);

        //Add paticles to scene.
        scene.add(particle[iz]);
        iz += 1;
      }
    }
  }

  function writeText01() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 120, 20);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("YorkshireKev", 0, 18);
  }

  function writeText02() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 120, 20);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Presents...", 10, 18);
  }

  function writeText03() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 120, 20);
    ctx.font = "19px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Particle Demo", 0, 17);
  }

  function writeText04() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 120, 20);
    ctx.font = "19px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("16bit retro", 0, 17);
  }

  function writeText05() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 120, 20);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("inspiration", 27, 18);
  }


  //Populat all arrays for text transformations...
  writeText01();
  textArr01 = makeTextArray();
  writeText02();
  textArr02 = makeTextArray();
  writeText03();
  textArr03 = makeTextArray();
  writeText04();
  textArr04 = makeTextArray();
  writeText05();
  textArr05 = makeTextArray();

  //Create particles...
  defineParticles();

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