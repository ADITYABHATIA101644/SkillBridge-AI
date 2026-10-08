import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Environment,
  RoundedBox,
  Text,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

function Person({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  interviewer = false,
}) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;

    group.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.025;
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={interviewer ? 1.05 : 1}
    >
      {/* legs */}
      <mesh position={[-0.22, 0.48, 0]}>
        <capsuleGeometry args={[0.11, 0.65, 8, 16]} />
        <meshStandardMaterial color={interviewer ? "#20252d" : "#526173"} />
      </mesh>

      <mesh position={[0.22, 0.48, 0]}>
        <capsuleGeometry args={[0.11, 0.65, 8, 16]} />
        <meshStandardMaterial color={interviewer ? "#20252d" : "#526173"} />
      </mesh>

      {/* torso */}
      <RoundedBox
        args={[0.65, 0.75, 0.36]}
        radius={0.12}
        smoothness={5}
        position={[0, 1.08, 0]}
      >
        <meshStandardMaterial
          color={interviewer ? "#151922" : "#e9edf3"}
          roughness={0.28}
          metalness={0.08}
        />
      </RoundedBox>

      {/* head */}
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial
          color="#c98e72"
          roughness={0.55}
        />
      </mesh>

      {/* hair */}
      <mesh position={[0, 1.9, -0.01]}>
        <sphereGeometry args={[0.275, 32, 32]} />
        <meshStandardMaterial color="#22252b" />
      </mesh>

      {/* arms */}
      <mesh
        position={[-0.46, 1.08, 0]}
        rotation={[0, 0, -0.45]}
      >
        <capsuleGeometry args={[0.08, 0.55, 8, 16]} />
        <meshStandardMaterial
          color={interviewer ? "#151922" : "#e9edf3"}
        />
      </mesh>

      <mesh
        position={[0.46, 1.08, 0]}
        rotation={[0, 0, 0.45]}
      >
        <capsuleGeometry args={[0.08, 0.55, 8, 16]} />
        <meshStandardMaterial
          color={interviewer ? "#151922" : "#e9edf3"}
        />
      </mesh>
    </group>
  );
}

function Desk() {
  return (
    <group>
      <RoundedBox
        args={[3.8, 0.16, 1.55]}
        radius={0.08}
        smoothness={5}
        position={[0, 0.82, 0]}
      >
        <meshStandardMaterial
          color="#f4f6f8"
          roughness={0.2}
          metalness={0.15}
        />
      </RoundedBox>

      <mesh position={[-1.45, 0.38, 0]}>
        <boxGeometry args={[0.13, 0.8, 0.13]} />
        <meshStandardMaterial color="#dce1e7" />
      </mesh>

      <mesh position={[1.45, 0.38, 0]}>
        <boxGeometry args={[0.13, 0.8, 0.13]} />
        <meshStandardMaterial color="#dce1e7" />
      </mesh>
    </group>
  );
}

function Laptop() {
  return (
    <group position={[0, 1.03, 0.05]}>
      <RoundedBox
        args={[0.95, 0.05, 0.65]}
        radius={0.03}
        smoothness={4}
      >
        <meshStandardMaterial color="#252a32" metalness={0.5} />
      </RoundedBox>

      <mesh
        position={[0, 0.32, -0.22]}
        rotation={[-0.35, 0, 0]}
      >
        <boxGeometry args={[0.85, 0.5, 0.04]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#dfeaff"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}

function FloatingSkill({
  children,
  position,
  rotation = [0, 0, 0],
  color = "#ffffff",
}) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      rotation[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.8}
    >
      <group ref={ref} position={position} rotation={rotation}>
        <RoundedBox
          args={[1.2, 0.38, 0.1]}
          radius={0.1}
          smoothness={5}
        >
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.92}
            roughness={0.18}
            metalness={0.15}
          />
        </RoundedBox>

        <Text
          position={[0, 0, 0.08]}
          fontSize={0.15}
          color="#18202a"
          anchorX="center"
          anchorY="middle"
        >
          {children}
        </Text>
      </group>
    </Float>
  );
}

function QuestionBubble() {
  return (
    <Float
      speed={1.2}
      rotationIntensity={0.15}
      floatIntensity={0.6}
    >
      <group position={[-1.7, 2.55, 0]}>
        <RoundedBox
          args={[2.1, 0.75, 0.12]}
          radius={0.16}
          smoothness={6}
        >
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.18}
            metalness={0.05}
          />
        </RoundedBox>

        <Text
          position={[0, 0, 0.08]}
          fontSize={0.17}
          maxWidth={1.75}
          color="#1a2028"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          {"What's your ML\nproject experience?"}
        </Text>
      </group>
    </Float>
  );
}

function GapIndicator() {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;

    const pulse =
      0.85 + Math.sin(state.clock.elapsedTime * 2) * 0.12;

    ref.current.scale.setScalar(pulse);
  });

  return (
    <group ref={ref} position={[1.75, 2.15, 0]}>
      <mesh>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color="#ffb547"
          emissive="#ff9d00"
          emissiveIntensity={0.35}
        />
      </mesh>

      <Text
        position={[0, -0.38, 0]}
        fontSize={0.13}
        color="#5d6672"
        anchorX="center"
      >
        Skill Gap
      </Text>
    </group>
  );
}

function CareerPathOrb() {
  return (
    <Float
      speed={1}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <group position={[2.1, 0.8, -0.8]}>
        <mesh>
          <icosahedronGeometry args={[0.38, 2]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.12}
            emissive="#dceaff"
            emissiveIntensity={0.25}
          />
        </mesh>

        <Text
          position={[0, -0.62, 0]}
          fontSize={0.14}
          color="#5d6672"
          anchorX="center"
        >
          Career Intelligence
        </Text>
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.7} />

      <directionalLight
        position={[5, 7, 5]}
        intensity={3}
      />

      <pointLight
        position={[-4, 3, 2]}
        intensity={2}
      />

      <Environment preset="studio" />

      <group>
        <Desk />

        <Person
          position={[-1.15, 0, 0]}
          rotation={[0, 0.18, 0]}
          interviewer
        />

        <Person
          position={[1.15, 0, 0]}
          rotation={[0, -0.18, 0]}
        />

        <Laptop />

        <QuestionBubble />

        <GapIndicator />

        <CareerPathOrb />

        <FloatingSkill
          position={[-2.6, 1.35, -0.5]}
        >
          Python
        </FloatingSkill>

        <FloatingSkill
          position={[2.65, 1.65, -0.3]}
        >
          Machine Learning
        </FloatingSkill>

        <FloatingSkill
          position={[2.55, -0.05, 0]}
        >
          SQL
        </FloatingSkill>

        <FloatingSkill
          position={[-2.5, -0.15, -0.2]}
        >
          Deep Learning
        </FloatingSkill>
      </group>

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.25}
        scale={7}
        blur={2.5}
        far={4}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </>
  );
}

export default function ProblemScene3D() {
  return (
    <div className="skillbridge-3d-scene">
      <Canvas
        camera={{
          position: [0, 2.1, 7],
          fov: 34,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}