# Anchor Calendar

심플하고 조용한 데스크톱 달력 앱

## 특징

- 📅 월간/연간 뷰 전환
- 🇰🇷 한국 공휴일 표시
- 📌 항상 위 기능
- 🎨 최소한의 UI 디자인
- 🌐 로컬 전용 (인터넷 연결 불필요)
- ⚙️ 공휴일 편집 기능
- 🖱️ 직관적인 클릭 인터랙션

## 기술 스택

- **프론트엔드**: HTML, CSS, Vanilla JavaScript
- **백엔드**: Tauri (Rust)
- **빌드 타겟**: Windows (MSI)

## 설치

### 최신 버전 (v0.1.0)

1. [Releases](https://github.com/papig-dev/anchor-calendar/releases) 페이지로 이동
2. `anchor-calendar_0.1.0_x64_ko-KR.msi` 다운로드
3. 설치 마법사 안내에 따라 설치

### 시스템 요구사항

- Windows 10/11 (x64)
- 최소 100MB 여유 공간

## 사용 방법

### 기본 조작
- **월간/연간 전환**: 상단 버튼 클릭
- **날짜 이동**: ◀/▶ 버튼 또는 월간/연간 버튼 클릭하여 오늘로 이동
- **날짜 선택**: 달력의 날짜를 클릭하여 하늘색으로 선택

### 공휴일 편집
1. 오른쪽 상단의 ⚙️ 아이콘 클릭
2. 날짜와 이름을 입력하여 공휴일 추가/수정/삭제
3. 변경사항은 앱 재시작까지 유지됨

### 단축키
- `ESC`: 모달 창 닫기

## 개발

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run tauri dev

# 빌드
npm run tauri build
```

## 변경 로그

### v0.1.0 (2026-01-20)

#### 🎉 최초 릴리즈
- 월간/연간 뷰 구현
- 한국 공휴일 표시 기능
- 항상 위 창 기능
- 최소한의 UI 디자인

#### ✨ 주요 기능
- 공휴일 편집 모달
- 날짜 선택 시 하늘색 하이라이트
- 주말 분홍색 배경 표시
- 휴일 이름 표시

#### 🎨 UI 개선
- 날짜 좌측 상단 정렬
- 톱니바퀴 아이콘으로 공휴일 편집 버튼 변경
- 마우스 오버 시 툴팁 표시
- 한국어 MSI 빌드 지원

## 라이선스

MIT License - [LICENSE](LICENSE) 파일 참조

## 기여

버그 리포트나 기능 요청은 [Issues](https://github.com/papig-dev/anchor-calendar/issues)를 통해 제출해주세요.

---

 Made with ❤️ by [papig](https://github.com/papig-dev)
