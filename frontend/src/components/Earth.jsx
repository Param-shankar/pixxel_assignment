import { useTexture } from "@react-three/drei";
import { useRef } from "react";

function getCenterPoint(mesh) {
  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = new THREE.Vector3();
  geometry.boundingBox.getCenter(center);
  mesh.localToWorld(center);
  return center;
}

export default function Earth() {
  const [colorMap, normalMap, specularMap] = useTexture([
    "/textures/text.jpeg",
    "/textures/image.png",
    "/textures/image.png",
  ]);

  return (
    <>
      {/* Earth */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          shininess={25}
          specular="#ffffff"
        />
      </mesh>

      {/* Sun Light - positioned to create day/night split */}
      <directionalLight
        position={[10, 0, 0]} // Positioned to the right (positive X)
        intensity={1.5}
        color="#ffffff"
        castShadow={true}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Ambient light for night side illumination - increased to show map */}
      <ambientLight intensity={0.4} color="#404040" />

      {/* Additional light on the darker (night) side */}
      <directionalLight
        position={[-8, 0, 0]} // Positioned to the left (negative X) - night side
        intensity={0.3}
        color="#87ceeb"
      />
    </>
  );
}
