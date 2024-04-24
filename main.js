import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh, addBackground, addGlassKnot, addMatCap, addSides} from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)


camera.position.set(9, 9, 10)


// let mesh
const meshes = {}
const mixers = []
const clock = new THREE.Clock()

const objects = [];
//need to add the bed here as an object. for now i will call the computer the object


let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()
	meshes.background = addBackground()
	meshes.knot = addGlassKnot()
	meshes.cap = addMatCap()
	meshes.side1 = addSides(0);
	meshes.side2 = addSides(1);
	meshes.side3 = addSides(2);
	meshes.side4 = addSides(3);
	meshes.side4 = addSides(4);
	meshes.side4 = addSides(5);
		let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
		floorGeometry.rotateX( - Math.PI / 2 );
		const floorMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const floor = new THREE.Mesh( floorGeometry, floorMaterial );
	scene.add( floor );

	//lights
	meshes.defaultLight = addLight()
	scene.fog = new THREE.Fog(0x3d4035, 0, 100);

	//scene operations
	scene.add(meshes.defaultLight)
	scene.add(meshes.side1)
	scene.add(meshes.side2)
	scene.add(meshes.side3)
	scene.add(meshes.side4)
	scene.add(meshes.side5)
	scene.add(meshes.side5)

	let controls = new PointerLockControls(camera, document.body)

	const blocker = document.getElementById( 'blocker' );
	const instructions = document.getElementById( 'instructions' );

	instructions.addEventListener( 'click', function () {
		controls.lock();
	} );

	controls.addEventListener( 'lock', function () {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
	} );

	controls.addEventListener( 'unlock', function () {
		blocker.style.display = 'block';
		instructions.style.display = '';
	} );

	scene.add( controls.getObject() );

	const onKeyDown = function ( event ) {
		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				moveForward = true;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = true;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = true;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = true;
				break;

			case 'Space':
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
		console.log("key pressed")
	};

	const onKeyUp = function ( event ) {
		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				moveForward = false;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = false;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = false;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = false;
				break;
		}
	};

	document.addEventListener( 'keydown', onKeyDown );
	document.addEventListener( 'keyup', onKeyUp );

	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	

	const time = performance.now();


	if ( controls.isLocked === true ) {

		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;

		const intersections = raycaster.intersectObjects( objects, false );

		const onObject = intersections.length > 0;

		const delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveRight ) - Number( moveLeft );
		direction.normalize(); // this ensures consistent movements in all directions

		if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

		if ( onObject === true ) {

			velocity.y = Math.max( 0, velocity.y );
			canJump = true;

		}

		controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );

		controls.getObject().position.y += ( velocity.y * delta ); // new behavior

		if ( controls.getObject().position.y < 10 ) {

			velocity.y = 0;
			controls.getObject().position.y = 10;

			canJump = true;

		}

	}
	prevTime = time;

	models()
	resize()
	animate()
}

function models() {
	const Computer = new Model({
		name: 'computer',
		url: '/test.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(0, -0.8, 3),
		// replace: true,
		// replaceURL: '/bubble3.jpg',
		//animationState: true,
		//mixers: mixers,
	})
	Computer.init()
	objects.push(Computer)
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	for (const mixer of mixers) {
		mixer.update(delta)
	}
	if (meshes.longLeaves) {
		meshes.longLeaves.rotation.y -= 0.002
	}
	// meshes.default.scale.x += 0.01


	//LIMITING THE CAMERA POSITION: 
	// if (camera.position.z !== 10) {
	// 	camera.position.z = 10
	// }

	//if the y is too large or to small just move the postiion back
	// if (camera.position.x > 10) {
	// 	camera.position.x = 10
	// } else if (camera.position.x < 0) {
	// 	camera.position.x = 0
	// }

	// //if y is out of bounds, move it back
	// if (camera.position.y > 5) {
	// 	camera.position.y = 5
	// } else if (camera.position.y < 0) {
	// 	camera.position.y = 0
	// }

	renderer.render(scene, camera)
	
}