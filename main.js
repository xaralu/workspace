import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh, addBackground, addGlassKnot, addMatCap, addSides} from './addMeshes'
//import { addComputer } from "./addGlbs"
import { addLight } from './addLights'
//just made addlights instead of addLights
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { postprocessing } from './postprocessing'
import gsap from 'gsap'
import Model from './Model'


//Globals
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
const composer = postprocessing(scene, camera, renderer)
composer.outline.selectedObjects = []
const pointer = new THREE.Vector2()
let raycaster = new THREE.Raycaster()
const clock = new THREE.Clock()
let controls

camera.position.set(0,0,0)
const meshes = {}
const objects = [];
let selectedObjects = []
const mixers = []
//need to add the bed here as an object. for now i will call the computer the object
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

//not sure where this variable should be
let active = 'placeholder';

init()
animate()

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
	meshes.side5 = addSides(4);
		let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
		floorGeometry.rotateX( - Math.PI / 2 );
		const floorMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const floor = new THREE.Mesh( floorGeometry, floorMaterial );
	scene.add( floor );
	//meshes.computer = addComputer();

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
	//scene.add(meshes.computer)

	controls = new PointerLockControls(camera, document.body)

	const blocker = document.getElementById( 'blocker' );
	const instructions = document.getElementById( 'instructions' );
	const crosshair = document.getElementById( 'crosshair' );

	instructions.addEventListener( 'click', function () {
		controls.lock();
	} );

	controls.addEventListener( 'lock', function () {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
		crosshair.style.display = 'flex';

	} );

	controls.addEventListener( 'unlock', function () {
		blocker.style.display = 'block';
		instructions.style.display = '';
		crosshair.style.display = 'none';
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

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize );


	// scene.add( Computer )
	// objects.push(  )
	
	models()
	// raycast()
	window.addEventListener( 'pointermove', onPointerMove );

}
// objects.push(meshes.computer)
console.log(objects)


function models() {
	const Computer = new Model({
		name: 'computer',
		url: './test.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(0, 0, 0),
		// replace: true,
		// replaceURL: '/bubble3.jpg',
		//animationState: true,
		//mixers: mixers,
		// computer.userData.groupName = 'target1'
	}
	)	
	Computer.init()
}

function onPointerMove ( event ) {
	//primary thing
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

	checkIntersection();
}



function checkIntersection() {
	raycaster.setFromCamera(pointer, camera)
	const intersects = raycaster.intersectObjects(scene.children, true)
	console.log(intersects)
	if (intersects.length > 0) {
		const selectedObject = intersects[ 0 ].object
		addSelectedObject( selectedObject )
		composer.outline.selectedObjects = selectedObjects
		console.log("check intersection active is: " + active)
		console.log("active as a string is " + active.toString())
		//dont know if this is working actually. how to tell thetype of 
		//let strHopefully = active.toString();
		//just tested this in node and hopefully it is like. okay. 
		console.log()
		if (selectedObject.userData.groupName === 'computer' || selectedObject.userData.groupName === 'placeholder') {
			active = selectedObject.userData.groupName;
			checkActive(active);
		}
	} else {

		composer.outline.selectedObjects = [];

	}
}

function addSelectedObject( object ) {

	selectedObjects = [];
	selectedObjects.push( object );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function checkActive(active) {

	let activeEle = document.getElementById(active.toString());
	console.log("active is: " + active);
	//active is undefined?
	//oh i guess this isnt formatted right. 
	//click isnt working now. doesnt change from placeholder. 
	
	activeEle.addEventListener( 'click', function () {
		activeEle.style.display = 'flex'
	} );
}
//later on, I need to say: when exit button pressed, assign active to placeholder. 

function animate() {

	requestAnimationFrame(animate)
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


		//modify position
		if ( controls.getObject().position.z > 10 ) {
			controls.getObject().position.z = 10;
		}
		if ( controls.getObject().position.z < -10 ) {
			controls.getObject().position.z = -10;
		}
		if ( controls.getObject().position.x > 10 ) {
			controls.getObject().position.x = 10;
		}
		if ( controls.getObject().position.x < -10 ) {
			controls.getObject().position.x = -10;
		}
		

	}
	
	prevTime = time;

	//const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// renderer.render(scene, camera)	
	composer.composer.render()
}