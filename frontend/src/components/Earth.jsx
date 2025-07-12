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
  // const [ref] = useRef(null);
  return (
    <>
      <mesh rotation={[Math.PI, 0, 0]}>
        {/* Rotation Y by PI to face correct */}
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          // normalMap={normalMap}
          // specularMap={specularMap}
          shininess={10}
        />
      </mesh>
    </>
  );
}
