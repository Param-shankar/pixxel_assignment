import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function LEOOrbit() {
//   const orbitRef = useRef();

//   useFrame(() => {
//     orbitRef.current.rotation.y += 0.001;
//   });

  return (
    <mesh  rotation={[Math.PI / 2, 0, 0]}>
      {/* first args is the thickness , second is the distance from the sphere    */}
      <ringGeometry args={[2.8, 2.81, 128]} />
      <meshBasicMaterial color="cyan" side={2} />
    </mesh>
  );
}
