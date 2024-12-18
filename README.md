## StradVision Frontend Screening Test

### Overview

This project is a boilerplate for StradVision Frontend screening test. It provides a starting point for candidates to showcase their frontend development skills. The boilerplate includes a basic folder structure, configuration files, and some initial code setup. Candidates can build upon this boilerplate to complete the screening test tasks and demonstrate their abilities in HTML, CSS, and JavaScript. Good luck with the test👍

### Getting Started

Follow these instructions to set up and run the project.

#### Prerequisites

- Node.js (version > 20) and npm installed on your machine.

#### Steps

1. Clone the repository.
2. Install the dependencies
3. Run the development server

### Submission

- Ensure your code is clean, well-documented, and follows best practices.
- Submit the project repository link and any additional notes in the README.md.

### Problem 1
낙하 실험을 할 때 사실적인 묘사를 위해 3D와 물리엔진을 사용했습니다.
중력을 이용하여 좀 더 현실과 비슷하고 쉽게 구현이 가능하기 때문입니다.

스페이스 바를 2번, 3번에 대한 로직을 처리하고 그 외에는 아무 동작하지 않습니다.
너무 긴 텀을 가지고 입력하면 안 되기 때문에 최대 0.3초 정도가 연속 입력으로 정했습니다.

물리엔진에서 공이 중력 때문에 바로 떨어지기 때문에 매 프레임마다 
위치와 속도를 초기화 시켜줍니다.
그리고 떨어지는 이벤트가 발생했을 때 중력에 의해 떨어집니다.

공이 떨어졌을 때 축구공 처럼 탄성이 있는 것을 가정하였습니다.
restitution 이라는 탄성계수값을 줘서 바닥에 닿았을 때 공이 튀기게 됩니다.

### Problem 2
모니터가 주로 가로 사이즈가 길기 때문에 편의상 도로를 가로 방향으로 표시하였습니다.

차량의 시야각에 다른 차량이 들어가는 것을 시각화 하기 위해서
캔버스 api를 이용하여 시야각을 다른 색깔로 표시했습니다.

좀 더 사실감있는 시야각을 표시하기 위해 시야각 최대 길이를 설정하였고
그 밖에 있는 것은 시야각 밖에 있다고 판단했습니다. 
이 때 시야각 안에 다 들어와있고 거리 기준으로 걸쳐있다면 안에 있다고 판단했습니다.

차량 클릭 이벤트를 처리할 때 마우스 포인터가 캔버스 안에 있도록 했고, 파란색 차량일 경우 팝업을 띄웠습니다.

감시차량은 다른 차량과의 구분을 위해 검정색으로 표시하였습니다.
시야각은 canvas api의 arc를 이용하여 부채꼴 모양을 그렸습니다.

시야각에 들어와있는지 판단은 다음과 같이 했습니다.
- out: 거리가 정해진 range보다 멀거나 차량 전체가 시야각 밖에 있는 경우
- in: 차량 전체가 시야각 안에 있는 경우
- partial: 차량이 시야각에 걸쳐 있는 경우

이 때 partial의 비율 계산은 다음과 같습니다.
감시차량과 파란색(시야각에 걸친)차량의 앞, 뒷면의 사이각 대비
시야각과 파란색 차량의 (감시차량과 먼 방향의)면 사이각을 계산하여
전체 차량의 사이각 중에 얼마만큼이 시야각에 들어왔는지를 알 수 있었습니다.


