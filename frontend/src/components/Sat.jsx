import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Satellite() {
  const satRef = useRef();
  const orbitRadius = 2.8;
  const speed = 0.001;
  let angle = useRef(30);

  useFrame(() => {
    angle.current += speed;
    const x = orbitRadius * Math.cos(angle.current);
    const z = orbitRadius * Math.sin(angle.current);
    satRef.current.position.set(x, 0, z);
    satRef.current.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={satRef}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
