import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
// import { ArrowHelper } from "@react-three/drei";
import { ArrowHelper } from "three";

export default function Satellite({ rotationcube, setrotationcube }) {
  // setting up thr ref to objects to sat body and external group
  const satRef = useRef();
  const bodyRef = useRef();

  const orbitRadius = 2.8;
  const speed = 0.001;
  let angle = useRef(30);

  
  // console.log("\n\n the value of rotation angle is ...");
  console.log(rotationcube);

  // usefram hook from three fiber to setup the smooth animation
  useFrame(() => {
    angle.current += speed;
    const x = orbitRadius * Math.cos(angle.current);
    const z = orbitRadius * Math.sin(angle.current);
    satRef.current.position.set(x, 0, z);

    // Create quaternions for X, Y, and Z rotations
    satRef.current.lookAt(0, 0, 0);

    //setting up the quaternion for z axis to rotated the cube using the calcuted angles
    const quaternionX = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      THREE.MathUtils.degToRad(rotationcube[0])
    );

    //setting up the quaternion for z axis to rotated the cube using the calcuted angles
    const quaternionY = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      THREE.MathUtils.degToRad(rotationcube[1])
    );

    //setting up the quaternion for z axis to rotated the cube using the calcuted angles
    const quaternionZ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(rotationcube[2])
    );

    // Combine the quaternions: Z * Y * X (order matters)
    const combinedQuaternion = new THREE.Quaternion();
    combinedQuaternion.multiplyQuaternions(quaternionX, quaternionY);
    combinedQuaternion.multiply(quaternionZ);
    bodyRef.current.quaternion.copy(combinedQuaternion);
  });

  // setting up the offest vector to using the arrowhelper in the threejs
  const dirX = new THREE.Vector3(1, 0, 0).normalize();
  const dirY = new THREE.Vector3(0, 1, 0).normalize();
  const dirZ = new THREE.Vector3(0, 0, 1).normalize();
  const origin = new THREE.Vector3(0, 0, 0);
  const length = 0.5;
  const hex = 0xffff00;
  const offsetArrowX = new ArrowHelper(dirX, origin, length, hex);
  const offsetArrowY = new ArrowHelper(dirY, origin, length, hex);
  const offsetArrowZ = new ArrowHelper(dirZ, origin, length, hex);

  //using the useeffect the add the arrow becz the cube is loaded till that
  useEffect(() => {
    if (satRef.current) {
      satRef.current.add(offsetArrowX);
      satRef.current.add(offsetArrowY);
      satRef.current.add(offsetArrowZ);
    }

    return () => {
      if (satRef.current) {
        satRef.current.remove(offsetArrowX);
        satRef.current.remove(offsetArrowY);
        satRef.current.remove(offsetArrowZ);
      }
    };
  }, []);

  return (
    <group ref={satRef}>
      <group ref={bodyRef}>
        {/* Main satellite body */}
        {/* // [X angle , Y angle , Z angle] */}
        <mesh>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="orange" />
        </mesh>

        {/* Red arrow pointing in X direction */}
        <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.2]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.02, 0.05]} />
          <meshBasicMaterial color="red" />
        </mesh>

        {/* Green arrow pointing in Y direction */}
        <mesh position={[0, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.2]} />
          <meshBasicMaterial color="green" />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI / 2, 0]}>
          <coneGeometry args={[0.02, 0.05]} />
          <meshBasicMaterial color="green" />
        </mesh>

        {/* Blue arrow pointing in Z direction */}
        <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.2]} />
          <meshBasicMaterial color="blue" />
        </mesh>
        <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.02, 0.05]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </group>
    </group>
  );
}
