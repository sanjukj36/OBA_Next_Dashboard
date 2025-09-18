"use client";

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { App } from "@/lib/constants";

type GLTFResult = GLTF & {
  nodes: {
    Cylinder: THREE.Mesh;
    Plane: THREE.Mesh;
    Plane001: THREE.Mesh;
    Plane002: THREE.Mesh;
    Plane003: THREE.Mesh;
  };
};

export function PropellerModel({ label } : { label: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes } = useGLTF("/PROPELLER5.glb") as GLTFResult;
  const valueRef = useRef<number | undefined>(undefined);

  const { data: latestData } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { value } = data || {};

  valueRef.current = value;

  useFrame((_, delta) => {
    if (groupRef.current && valueRef.current && valueRef.current >= App.PropellerRotationRpm) {
      groupRef.current.rotation.x += delta;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={0.35}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder.geometry}
        material={nodes.Cylinder.material}
        position={[-0.064, -0.098, -0.062]}
        rotation={[0.926, 0.014, 1.595]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={nodes.Plane.material}
        position={[-0.02, -0.503, 0.161]}
        rotation={[-2.528, -0.023, 0.008]}
        scale={[0.925, 6.045, 3.781]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane001.geometry}
        material={nodes.Plane001.material}
        position={[-0.046, 0.146, 0.332]}
        rotation={[2.133, -0.004, -0.068]}
        scale={[0.925, 6.045, 3.781]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane002.geometry}
        material={nodes.Plane002.material}
        position={[-0.166, -0.189, -0.224]}
        rotation={[-1.013, 0.052, -0.034]}
        scale={[0.925, 6.045, 3.781]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003.geometry}
        material={nodes.Plane003.material}
        position={[-0.053, 0.148, -0.115]}
        rotation={[0.54, -0.047, -0.078]}
        scale={[0.925, 6.045, 3.781]}
      />
    </group>
  );
}

useGLTF.preload("/PROPELLER5.glb");
