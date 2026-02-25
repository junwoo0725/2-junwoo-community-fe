// 로컬 개발 환경인지(localhost), EC2 배포 환경인지 자동으로 구분합니다.
// 로컬이면 내 컴퓨터의 8000번 백엔드를 찾고, 배포 환경이면 Nginx 리버스 프록시("")를 탑니다.
const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
export const API_BASE = isLocal ? "http://127.0.0.1:8000" : "";
