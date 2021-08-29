import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

const scene = new THREE.Scene();

const size = 10;
const divisions = 10;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) ;


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(5,5,5)

scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.15);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('spacebg.jpg');
scene.background = spaceTexture;

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

moon.position.set(25, 0, 0)
scene.add(moon);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      earthTexture: {
        value: new THREE.TextureLoader().load('earthmap.jpg')
      }
    }
  })
);

scene.add(earth);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
);

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere)

const orbit = new THREE.Line(
  new THREE.CircleGeometry(25, 1000),
  new THREE.LineBasicMaterial({
    color: 'white',
    opacity: 0,
    transparent: true
  })
);

orbit.rotateX(90)
scene.add(orbit);

const orbitGroup = new THREE.Group();
orbitGroup.add(orbit);
orbitGroup.add(moon);

scene.add(orbitGroup)

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.003;
  orbitGroup.rotation.y += 0.02;
  controls.update();
  renderer.render(scene, camera);
}

animate()