/**
 * ###문제 1번
 * 사실감있는 시뮬레이션을 위해 react-three-fiber와 cannon-es를 사용하여 공의 낙하 운동을 구현하였습니다.
 */

"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import styled from 'styled-components';
import BouncingBall from "./components/BouncingBall";
import Ground from "./components/Ground";

const BouncingBallPage = () => {
  const [startDrop, setStartDrop] = useState(false);
  const [reset, setReset] = useState(false);
  const clickCount = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  /**
   * 스페이스 바 입력 이벤트
   * 2번 눌렀을 경우 drop 시작
   * 3번 눌렀을 경우 reset
   * setTimeout을 사용하여 300ms 내에 입력하지 않으면 초기화
   * 2번~3번 까지의 입력만 처리하고 그 외의 입력은 초기화
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      clickCount.current++;
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        if (clickCount.current === 2) {
          setReset(false);
          setStartDrop(true);
        } else if (clickCount.current === 3) {
          setReset(true);
          setStartDrop(false);
        }
        clickCount.current = 0;
      }, 300);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CanvasWrapper>
      <Canvas camera={{ position: [0, 5, 30], fov: 50 }}>
        <ambientLight intensity={1} />
        <Physics gravity={[0, -9.8, 0]}>
          <Ground />
          <BouncingBall startDrop={startDrop} reset={reset} />
        </Physics>
      </Canvas>
    </CanvasWrapper>
  );
};
export default BouncingBallPage;

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;