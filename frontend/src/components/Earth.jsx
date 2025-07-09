import { useTexture } from "@react-three/drei";

export default function Earth() {
  const [colorMap, normalMap, specularMap] = useTexture([
    "/public/textures/text.jpeg",
    "/public/textures/image.png",
    "/public/textures/image.png"
  ]);

  return (
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
  );
}
