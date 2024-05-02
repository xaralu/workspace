import Model from './Model'

export function addComputer() {
    const Computer = new Model({
    name: 'target1',
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
    })	
    Computer.init()
}
