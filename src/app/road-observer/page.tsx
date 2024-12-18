/**
 * We assume that the API always returns a valid road object.
 * Please use and modify the api/road route to get sample data.
 *  */

/**
 * canvas api를 이용하여 차량과 도로를 구현 하였습니다.
 * 가로가 좁고 세로가 긴 형태의 도로가 눈에 잘 들어오지 않아서
 * 90도 회전한 가로로 긴 형태의 도로를 구현하였습니다.
 */
"use client";
import { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { createOtherVehicles, createWatchVehicle, isInFOV } from "./utils/roadCanvas";

const getRoad = async (): Promise<Road> => {
  const data = await fetch('http://localhost:3000/api/road');
  return data.json();
};

const RoadObserverPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [roadInfo, setRoadInfo] = useState<Road>();


  useEffect(() => {
    fetchRoad();
  }, []);

  /**
   * 도로와 차량 정보를 가져온 후 canvas 그리기
   */
  useEffect(() => {
    if (! roadInfo) return;
    const canvas = canvasRef.current;
    if (! canvas) return;
    const ctx = canvas.getContext('2d');
    if (! ctx) return;
    const { observer, vehicles } = roadInfo;
    // 초기화
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    createWatchVehicle(ctx, observer);
    createOtherVehicles(ctx, observer, vehicles);    
  }, [roadInfo]);

  const fetchRoad = async () => {
    const road = await getRoad();
    setRoadInfo(road);
  };

  /**
   * 차량 클릭 이벤트
   * 차량이 시야각 안에 걸쳐 있는 경우 그 비율 만큼 팝업으로 표시
   */
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (! canvasRef.current || ! roadInfo ) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { observer, vehicles } = roadInfo;

    vehicles.forEach((vehicle) => {
      const { width, length } = vehicle;
      const {x: vx, y: vy} = vehicle.position;
      if (x >= vx && x <= vx + width && y >= vy && y <= vy + length) {
        const fovStatus = isInFOV(vehicle, observer);
        if (fovStatus.status === 'partial') {
          alert(`차량이 시야각 안에 ${Math.round(fovStatus.ratio! * 100)}% 만큼 포함되었습니다.`);
        }
      }
    });
  };

  return (
    <CanvasWrapper>
      <Canvas
        ref={canvasRef}
        width={880}
        height={80}
        onClick={handleCanvasClick}
      />
    </CanvasWrapper>
  );
};

export default RoadObserverPage;

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center; 
  align-items: center;
`;
const Canvas = styled.canvas`
  border: 1px solid black;
`;