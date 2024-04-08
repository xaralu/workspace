import * as THREE from 'three'
const textureLoader = new THREE.TextureLoader()

export function addBoilerPlateMesh() {
	const box = new THREE.BoxGeometry(1, 1, 1)
	const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(2, 0, 0)
	return boxMesh
}

export function addStandardMesh() {
	const box = new THREE.BoxGeometry(1, 1, 1)
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
	return boxMesh
}

export function addBackground() {
	const color = textureLoader.load('./color.jpg')
	const geometry = new THREE.PlaneGeometry(5, 5)
	const material = new THREE.MeshBasicMaterial(
		{map: color}
	)
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(0, 0, -2)

	return mesh
}

export function addGlassKnot () {
	const displace = textureLoader.load('./displace.png')
	const ambient = textureLoader.load('./ambient.jpg')
	const normals = textureLoader.load('./normal.jpg')
	const roughness = textureLoader.load('./roughness.jpg')

	const geometry = new THREE.TorusKnotGeometry(0.6, 0.01, 100, 100, 2, 3)
	const material = new THREE.MeshPhysicalMaterial({
		displacementMap: displace,
		aoMap: ambient,
		normalMap: normals,
		roughnessMap: roughness,
		displacementScale: 0.3,
		transmission: 1.0,
		ior: 2.33,
		metalness: 0.1, 
		roughness: 0.0,
		thickness: 1,
	})
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}

export function addMatCap() {
	const matcap = textureLoader.load('./matcap.png')
	const geometry = new THREE.TorusKnotGeometry(0.6, 0.5, 100, 100, 2, 3)
	const material = new THREE.MeshMatcapMaterial({
		matcap: matcap,
	})
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set (2, 0, 0)
	return mesh
}

export function addSides(num) {
	const img1 = textureLoader.load('./side1.jpg')
	const img2 = textureLoader.load('./side2.jpg')
	const img3 = textureLoader.load('./side3.jpg')
	const img4 = textureLoader.load('./side4.jpg')
	const geometry = new THREE.PlaneGeometry(20, 10)
	const material1 = new THREE.MeshBasicMaterial(
		{map: img1}
	)
	const material2 = new THREE.MeshBasicMaterial(
		{map: img2}
	)
	const material3 = new THREE.MeshBasicMaterial(
		{map: img3}
	)
	const material4 = new THREE.MeshBasicMaterial(
		{map: img4}
	)
	const side1 = new THREE.Mesh(geometry, material1)
	side1.position.set(0, 0, -5)

	const side2 = new THREE.Mesh(geometry, material2)
	side2.position.set(0, 0, -5)

	const side3 = new THREE.Mesh(geometry, material3)
	side3.position.set(0, 0, -5)
	

	const side4 = new THREE.Mesh(geometry, material4)
	side4.position.set(0, 0, -5)

	sides = [side1, side2, side3, side4];

	return sides[num];
}

