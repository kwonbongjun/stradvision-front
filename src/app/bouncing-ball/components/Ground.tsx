import { usePlane } from "@react-three/cannon";

/** 물리 엔진에서 바닥을 설정 */
const Ground = () => {
  const [ref] = usePlane(() => ({ 
    mass:0,  
    rotation: [-Math.PI / 2, 0, 0],
    material: { restitution: 0.7 }
  }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[1000, 1000]} />
    </mesh>
  )
};
export default Ground;