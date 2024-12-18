"use client";
import { useEffect } from "react";
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';

type BouncingBallProps = {
  startDrop: boolean;
  reset: boolean;
};

/** 떨어지는 동작과 초기화 동작 2가지 기능이 있으므로 2개의 상태를 props로 전달. */
const BouncingBall = ({ startDrop, reset }: BouncingBallProps) => {
  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    position: [0, 5, 0],
    material: { restitution: 0.7}
   }));

  useEffect(() => {
    //초기화 되면 공의 위치 초기화
    if (reset) {
      api.position.set(0, 10, 0);
      api.velocity.set(0, 0, 0);
    }
  }, [reset]);

  /** 
   * 매프레임 마다 물리 위치를 초기 값으로 설정하여 드랍 명령이 
   * 내려오기 전 까지 공이 떨어지지 않도록 설정
   */
  useFrame(() => {
    if (! startDrop) {
      api.position.set(0, 10, 0);
      api.velocity.set(0, 0, 0);
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      {/* @ts-ignore */}
      <meshStandardMaterial color="red" />
    </mesh>
  );
};
export default BouncingBall;