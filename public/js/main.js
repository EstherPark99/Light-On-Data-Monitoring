// 메인 JavaScript 로직
import { ref, onValue, off } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// DOM 요소들
const elements = {
    connectionStatus: document.getElementById('connectionStatus'),
    connectionText: document.getElementById('connectionText'),
    lastUpdateTime: document.getElementById('lastUpdateTime'),
    loadingMessage: document.getElementById('loadingMessage'),
    errorMessage: document.getElementById('errorMessage'),
    dataGrid: document.getElementById('dataGrid'),
    
    // 데이터 표시 요소들
    packVoltage: document.getElementById('packVoltage'),
    packCurrent: document.getElementById('packCurrent'),
    soc: document.getElementById('soc'),
    highTemp: document.getElementById('highTemp'),
    lowTemp: document.getElementById('lowTemp'),
    motorTemp: document.getElementById('motorTemp'),
    controllerTemp: document.getElementById('controllerTemp'),
    
    // 시간 표시 요소들
    voltageTime: document.getElementById('voltageTime'),
    currentTime: document.getElementById('currentTime'),
    socTime: document.getElementById('socTime'),
    highTempTime: document.getElementById('highTempTime'),
    lowTempTime: document.getElementById('lowTempTime'),
    motorTempTime: document.getElementById('motorTempTime'),
    controllerTempTime: document.getElementById('controllerTempTime')
};

// 전역 변수들
let database;
let carDataRef;
let isConnected = false;
let lastUpdateTimestamp = 0;
let updateInterval;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log("페이지 로드 완료");
    
    // Firebase 초기화 대기
    const checkFirebase = setInterval(() => {
        if (window.firebaseDatabase) {
            clearInterval(checkFirebase);
            initializeFirebase();
        }
    }, 100);
});

// Firebase 초기화
function initializeFirebase() {
    try {
        database = window.firebaseDatabase;
        carDataRef = ref(database, 'carData');
        
        console.log("Firebase 데이터베이스 연결 시도...");
        
        // 실시간 데이터 리스너 설정
        onValue(carDataRef, (snapshot) => {
            handleDataUpdate(snapshot);
        }, (error) => {
            handleConnectionError(error);
        });
        
        // 연결 상태 모니터링
        const connectedRef = ref(database, '.info/connected');
        onValue(connectedRef, (snapshot) => {
            const connected = snapshot.val();
            updateConnectionStatus(connected);
        });
        
        // 타임아웃 체크 시작
        startTimeoutCheck();
        
    } catch (error) {
        console.error("Firebase 초기화 실패:", error);
        showError("Firebase 연결 실패: " + error.message);
    }
}

// 데이터 업데이트 처리
function handleDataUpdate(snapshot) {
    try {
        const data = snapshot.val();
        
        if (data) {
            console.log("데이터 수신:", data);
            updateUI(data);
            updateConnectionStatus(true);
            lastUpdateTimestamp = Date.now();
        } else {
            console.log("데이터가 없습니다.");
            showError("데이터가 없습니다.");
        }
        
    } catch (error) {
        console.error("데이터 처리 오류:", error);
        showError("데이터 처리 오류: " + error.message);
    }
}

// UI 업데이트
function updateUI(data) {
    // 로딩 메시지 숨기기, 데이터 그리드 보이기
    elements.loadingMessage.style.display = 'none';
    elements.errorMessage.style.display = 'none';
    elements.dataGrid.style.display = 'grid';
    
    const currentTime = new Date().toLocaleTimeString();
    
    // 배터리 전압
    if (data.Pack_Voltage !== undefined) {
        elements.packVoltage.textContent = formatNumber(data.Pack_Voltage, 2);
        elements.voltageTime.textContent = currentTime;
    }
    
    // 배터리 전류
    if (data.Pack_Current !== undefined) {
        elements.packCurrent.textContent = formatNumber(data.Pack_Current, 2);
        elements.currentTime.textContent = currentTime;
    }
    
    // SOC (충전 상태)
    if (data.SOC !== undefined) {
        elements.soc.textContent = formatNumber(data.SOC, 1);
        elements.socTime.textContent = currentTime;
    }
    
    // 최고 온도
    if (data.High_Temp !== undefined) {
        elements.highTemp.textContent = formatNumber(data.High_Temp, 1);
        elements.highTempTime.textContent = currentTime;
    }
    
    // 최저 온도
    if (data.Low_Temp !== undefined) {
        elements.lowTemp.textContent = formatNumber(data.Low_Temp, 1);
        elements.lowTempTime.textContent = currentTime;
    }
    
    // 모터 온도
    if (data.Motor_Temp !== undefined) {
        elements.motorTemp.textContent = formatNumber(data.Motor_Temp, 1);
        elements.motorTempTime.textContent = currentTime;
    }
    
    // 컨트롤러 온도
    if (data.Controller_Temp !== undefined) {
        elements.controllerTemp.textContent = formatNumber(data.Controller_Temp, 1);
        elements.controllerTempTime.textContent = currentTime;
    }
    
    // 마지막 업데이트 시간
    elements.lastUpdateTime.textContent = `마지막 업데이트: ${currentTime}`;
}

// 연결 상태 업데이트
function updateConnectionStatus(connected) {
    isConnected = connected;
    
    if (connected) {
        elements.connectionStatus.classList.add('connected');
        elements.connectionText.textContent = 'Firebase 연결됨';
    } else {
        elements.connectionStatus.classList.remove('connected');
        elements.connectionText.textContent = 'Firebase 연결 끊어짐';
    }
}

// 연결 오류 처리
function handleConnectionError(error) {
    console.error("Firebase 연결 오류:", error);
    showError("연결 오류: " + error.message);
    updateConnectionStatus(false);
}

// 오류 메시지 표시
function showError(message) {
    elements.loadingMessage.style.display = 'none';
    elements.errorMessage.style.display = 'block';
    elements.errorMessage.textContent = message;
    elements.dataGrid.style.display = 'none';
}

// 숫자 포맷팅
function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined) return '-';
    
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    
    return num.toFixed(decimals);
}

// 타임아웃 체크 시작
function startTimeoutCheck() {
    updateInterval = setInterval(() => {
        if (lastUpdateTimestamp > 0) {
            const timeSinceUpdate = Date.now() - lastUpdateTimestamp;
            
            // 10초 이상 업데이트가 없으면 연결 상태 변경
            if (timeSinceUpdate > 10000) {
                updateConnectionStatus(false);
                elements.connectionText.textContent = 'Firebase 연결됨 (데이터 수신 없음)';
            }
        }
    }, 1000);
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (carDataRef) {
        off(carDataRef);
    }
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

console.log("메인 스크립트 로드 완료");