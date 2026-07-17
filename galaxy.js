import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

let scene;
let camera;
let renderer;
let clock;

export function initGalaxy() {

    const background = document.getElementById("galaxy-bg");

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    camera.position.set(0, 0, 40);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100vw";
    renderer.domElement.style.height = "100vh";
    renderer.domElement.style.zIndex = "-1";
    renderer.domElement.style.pointerEvents = "none";

    background.appendChild(renderer.domElement);

    clock = new THREE.Clock();

/* ============================
   ENGINE STATE
============================ */

let elapsed = 0;

const engine = {

    mouseX: 0,
    mouseY: 0,

    targetX: 0,
    targetY: 0,

    width: window.innerWidth,
    height: window.innerHeight

};

    createLights();

    animate();

    window.addEventListener("resize", onResize);

    return {
        scene,
        camera,
        renderer,
        clock
    };
}

function createLights() {

    const ambient = new THREE.AmbientLight(
        0xffffff,
        1.2
    );

    scene.add(ambient);

    const directional =
        new THREE.DirectionalLight(
            0x66ccff,
            3
        );

    directional.position.set(
        10,
        15,
        8
    );

    scene.add(directional);

    const purple =
        new THREE.PointLight(
            0xaa66ff,
            80
        );

    purple.position.set(
        -15,
        -5,
        20
    );

    scene.add(purple);

}

function animate() {

    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    elapsed = time;
    
    updateCamera();

    camera.position.z = 40 + Math.sin(time * 0.25) * 2;
    
    updateFloatingCamera(time);
    
    camera.updateMatrixWorld();
    
    renderer.setPixelRatio(
    Math.min(window.devicePixelRatio,2)
);
    
    if(window.updateScene){
    window.updateScene(time);
}
    
    renderer.render(scene, camera);
    
    renderer.info.reset();
}


}

function onResize(){

    engine.width = window.innerWidth;

    engine.height = window.innerHeight;

    camera.aspect =
        engine.width / engine.height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        engine.width,
        engine.height
    );

}

/* ============================
   TAB VISIBILITY
============================ */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            renderer.setAnimationLoop(null);

        } else {

            animate();

        }

    }
);

/* ============================
   CAMERA PARALLAX
============================ */

const mouse = {
    x: 0,
    y: 0
};

window.addEventListener("mousemove", (event)=>{

    engine.targetX =
        (event.clientX / engine.width) * 2 - 1;

    engine.targetY =
        -(event.clientY / engine.height) * 2 + 1;

});

function updateCamera(){

    engine.mouseX +=
        (engine.targetX - engine.mouseX) * 0.05;

    engine.mouseY +=
        (engine.targetY - engine.mouseY) * 0.05;

    camera.position.x = engine.mouseX * 4;

    camera.position.y = engine.mouseY * 2;

    camera.lookAt(scene.position);

}

export {
    scene,
    camera,
    renderer,
    clock
};

/* ==========================================
   GALAXY ENVIRONMENT
========================================== */

scene.fog = new THREE.FogExp2(
    0x030712,
    0.003
);

/* ==========================================
   RENDER SETTINGS
========================================== */

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.2;

/* ==========================================
   CAMERA FLOAT
========================================== */

let cameraOffset = 0;

function updateFloatingCamera(time){

    cameraOffset += 0.002;

    camera.position.y +=
        Math.sin(cameraOffset) * 0.003;

    camera.position.x +=
        Math.cos(cameraOffset) * 0.002;

}

/* ==========================================
   FPS LIMIT
========================================== */

let lastFrame = 0;

const FPS = 60;

const interval = 1000 / FPS;

function animate(now = 0){

    requestAnimationFrame(animate);

    const delta = now - lastFrame;

    if(delta < interval) return;

    lastFrame = now - (delta % interval);

    const time = clock.getElapsedTime();

    updateCamera();

    updateFloatingCamera(time);

    renderer.render(scene,camera);

}

/* =====================================
   GALAXY ENGINE CONFIGURATION
===================================== */

export const GalaxyConfig = {

    version: "1.0.0",

    author: "MathKing",

    fps: 60,

    antialias: true,

    background: true

};

/* =====================================
   PUBLIC API
===================================== */

export function setCameraPosition(x, y, z){

    camera.position.set(x, y, z);

}

export function setExposure(value){

    renderer.toneMappingExposure = value;

}

export function getEngine(){

    return {

        scene,

        camera,

        renderer,

        clock

    };

}


/* ============================
   HELPERS
============================ */

export function getScene() {

    return scene;

}

export function getCamera() {

    return camera;

}

export function getRenderer() {

    return renderer;

}

export function getClock() {

    return clock;

}

