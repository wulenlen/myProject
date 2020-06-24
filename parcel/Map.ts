interface Point {
    lat: number;
    lng: number;
}

export class Map {
    private BMap: BMap.Map;

    constructor(eleId: string = 'map') {
        this.BMap = new BMap.Map(eleId);

        var point = new BMap.Point(116.404, 39.915);  
        this.BMap.centerAndZoom(point, 1);
    }

    addMarker(o: Point) {
        const point = new BMap.Point(o.lat, o.lng),
            marker = new BMap.Marker(point)

        this.BMap.addOverlay(marker)

        marker.addEventListener('click', () => {
            var opts = {
                width: 300,
                height: 100,
                title: '标题'
            }

            const infoWindow = new BMap.InfoWindow('hi', opts)

            this.BMap.openInfoWindow(infoWindow, point)
        })
    }
}