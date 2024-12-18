
  /**
   * 감시차량 생성
   * 시야각을 가시화해서 어떤 차량이 들어왔는지 알기 쉽게 표현
   */
  const range = 300;
  type StatusParamType = {
    direction: number,
    distance: number,
    angleToCarFront: number,
    angleToCarBack: number,
    fovStart: number,
    fovEnd: number,
  };

  export const createWatchVehicle = (ctx: CanvasRenderingContext2D, observer: Observer) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(observer.position.x, observer.position.y, observer.length, observer.width);

    /**
     * 시야각 가시화
     * 방향에 따라 시야각을 바꿔준다.
     */ 
    ctx.beginPath();
    if (observer.direction === 1) {
      // 시계방향으로 arc를 그린다.
      ctx.arc(observer.position.x + observer.length, observer.position.y, range, 
        -observer.fov / 2 * (Math.PI / 180), observer.fov / 2 *  (Math.PI / 180));
      // 감시차량에 시야각을 이어준다.
      ctx.lineTo(observer.position.x + observer.length, observer.position.y);
    } else {
      ctx.arc(observer.position.x, observer.position.y, range, 
        Math.PI - observer.fov / 2 * (Math.PI / 180), Math.PI + observer.fov / 2 *  (Math.PI / 180));
      ctx.lineTo(observer.position.x, observer.position.y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.fill();
  };

  /**
   * 다른 차량들 생성
   * 차량이 시야에 들어왔는지 여부에 따라 색상을 다르게 표현
   */
  export const createOtherVehicles = (ctx: CanvasRenderingContext2D, observer: Observer, 
    vehicles: Vehicle[]) => {
    vehicles.forEach((vehicle) => {
      const fovStatus = isInFOV(vehicle, observer);
      if (fovStatus.status === 'in') {
        ctx.fillStyle = 'green';
      } else if (fovStatus.status === 'out') {
        ctx.fillStyle = 'red';
      } else if (fovStatus.status === 'partial') {
        ctx.fillStyle = `rgba(0, 0, 255, ${fovStatus.ratio})`;
      }
      
      ctx.fillRect(vehicle.position.x, vehicle.position.y, vehicle.width, vehicle.length);
    });
  };

  /**
   * 차량이 시야에 들어왔는지 여부를 판단
   * 감시차량 방향에 따라 시야각을 y축 기준 반대로 바꿔준다. 
   */
  export const isInFOV = (car: Vehicle, observer: Observer) => {
    /**
     * x: 감시차량의 x좌표, y: 감시차량의 y좌표
     * fovStart: 시야각 시작, fovEnd: 시야각 끝
     */
    const {x, y, fovStart, fovEnd} = getObserverInfoByDirection(observer);
    /**
     * angeToCarFront: x축 기준 + 방향으로 더 멀리 있는 면과 시야각 중심 사이의 각도 계산
     */
    const { angle: angleToCarFront } = calculateAngleAndDistance(
      car.position.x + car.width, car.position.y + car.length, x, y);
    /**
     * angleToCarBack: x축 기준 - 방향으로 더 멀리 있는 면과 시야각 중심 사이의 각도 계산
     */
    const { angle: angleToCarBack, distance } = calculateAngleAndDistance(
      car.position.x, car.position.y, x, y);

    const statusParam = {
      direction: observer.direction,
      distance,
      angleToCarFront,
      angleToCarBack,
      fovStart,
      fovEnd,
    }
    return getObserverStatusByDirection(statusParam);
  };

  /**
   * 감시차량 방향에 따른 정보 가공하여 반환
   */
  const getObserverInfoByDirection = (observer: Observer) => {
    const x = observer.direction === 1 ? 
      observer.position.x + observer.length: observer.position.x;
    const y = observer.position.y;
    const angle = observer.fov * (Math.PI / 180);

    // 시야각 시작과 끝
    // atan2 반시계 방향 기준 각도 적용, 1,2사분면 +, 3,4사분면 - 
    const fovStart = observer.direction === 1 ? 
      -angle / 2: Math.PI - angle / 2;
    const fovEnd = observer.direction === 1 ?
      angle / 2 : -Math.PI + angle / 2;
    return { x, y, fovStart, fovEnd };
  };

  /**
   * 감시차량에 대한 다른 차량의 각도와 거리 얻기
   */
  const calculateAngleAndDistance = (carX: number, carY: number,
     observerX: number, observerY: number) => {
    const dx = carX - observerX;
    const dy = carY - observerY;
    return {
      angle: Math.atan2(dy, dx),
      distance: Math.sqrt(dx ** 2 + dy ** 2),
    };
  };

  /**
   * 감시 차량 방향에 따라서 감시 차량의 시야각 내에 다른 차량이 들어왔는지 판단
   * out: 거리가 정해진 range보다 멀거나 차량 전체가 시야각 밖에 있는 경우
   * in: 차량 전체가 시야각 안에 있는 경우
   * partial: 차량이 시야각에 걸쳐 있는 경우
   * 다른 차량의 앞면과 뒷면의 각도 대비
   * 시야각과 시야각 안으로 들어온 면의 각도 차이를 계산하여 비율을 얻는다.
   */
  const getObserverStatusByDirection = (statusParam: StatusParamType) => {
    const {direction, distance, angleToCarFront, angleToCarBack, fovStart, fovEnd} = statusParam;
    let intersectionRatio;
    if (direction === 1) {
      if (distance > range || 
        angleToCarFront <= fovStart || angleToCarFront >= fovEnd) 
        return { status: 'out' };
      else if (angleToCarBack >= fovStart && angleToCarBack <= fovEnd) 
        return { status: 'in' };
      else {
        /** 
         * 시야각 좌우 중에 가까운 방향에 있어야 하므로 min으로 처리
         * 사이각을 계산할거라 절대값으로 비교
         * */ 
        intersectionRatio = (Math.min(Math.abs(angleToCarFront - fovStart), 
        Math.abs(fovEnd - angleToCarFront)))/(Math.abs(angleToCarFront - angleToCarBack));
      }
    } else {
      if (distance > range || 
        (angleToCarBack <= fovStart && angleToCarBack >= fovEnd)) 
        return { status: 'out' };
      else if (angleToCarFront >= fovStart || angleToCarFront <= fovEnd) 
        return { status: 'in' };
      else {
        intersectionRatio = (Math.min(Math.abs(angleToCarBack - fovStart), 
        Math.abs(fovEnd - angleToCarBack)))/(Math.abs(angleToCarFront - angleToCarBack));
      }
    }
    return { status: 'partial', ratio: intersectionRatio };
  }