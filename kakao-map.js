// Kakao Map
function bootKakaoMap(retryCount = 0) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if (!(window.kakao && window.kakao.maps && window.kakao.maps.load)) {
        if (retryCount < 10) {
            setTimeout(() => bootKakaoMap(retryCount + 1), 200);
        }
        return;
    }

    window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(36.0711247, 129.3782331);
        const map = new window.kakao.maps.Map(mapContainer, {
            center,
            level: 4,
            draggable: true
        });

        const zoomControl = new window.kakao.maps.ZoomControl();
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

        const markerEl = document.createElement('div');
        markerEl.className = 'map-pin';
        markerEl.innerHTML = '<span class="pin-core"></span><span class="pin-glow"></span>';

        new window.kakao.maps.CustomOverlay({
            position: center,
            map,
            content: markerEl,
            yAnchor: 1
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bootKakaoMap());
} else {
    bootKakaoMap();
}

