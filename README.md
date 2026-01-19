# Anchor Calendar

심플하고 조용한 데스크톱 달력 앱

## 특징

- 월간/연간 뷰 전환
- 한국 공휴일 표시
- 항상 위 기능
- 최소한의 UI 디자인
- 로컬 전용 (인터넷 연결 불필요)
- 공휴일 편집 기능

## 기술 스택

- **프론트엔드**: HTML, CSS, Vanilla JavaScript
- **백엔드**: Tauri (Rust)
- **빌드 타겟**: Windows (MSI)

## 설치

1. [Releases](https://github.com/username/anchor-calendar/releases)에서 최신 버전 다운로드
2. `anchor-calendar_0.1.0_x64_en-US.msi` 실행
3. 설치 마법사 안내에 따라 설치

## 개발

```bash
# 설치
npm install

# 개발 모드 실행
npm run tauri dev

# 빌드
npm run tauri build
```

## 공휴일 편집

1. 앱 상단의 "공휴일 편집" 버튼 클릭
2. 날짜와 이름을 입력하여 공휴일 추가/수정/삭제
3. 변경사항은 앱 재시작까지 유지됨

## 라이선스

MIT
