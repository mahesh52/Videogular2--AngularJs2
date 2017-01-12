"use strict";
var core_1 = require('@angular/core');
var vg_utils_1 = require("./vg-utils");
var VgFullscreenAPI = (function () {
    function VgFullscreenAPI() {
    }
    VgFullscreenAPI.init = function (elem, medias) {
        this.videogularElement = elem;
        this.medias = medias;
        var APIs = {
            w3: {
                enabled: 'fullscreenEnabled',
                element: 'fullscreenElement',
                request: 'requestFullscreen',
                exit: 'exitFullscreen',
                onchange: 'fullscreenchange',
                onerror: 'fullscreenerror'
            },
            newWebkit: {
                enabled: 'webkitFullscreenEnabled',
                element: 'webkitFullscreenElement',
                request: 'webkitRequestFullscreen',
                exit: 'webkitExitFullscreen',
                onchange: 'webkitfullscreenchange',
                onerror: 'webkitfullscreenerror'
            },
            oldWebkit: {
                enabled: 'webkitIsFullScreen',
                element: 'webkitCurrentFullScreenElement',
                request: 'webkitRequestFullScreen',
                exit: 'webkitCancelFullScreen',
                onchange: 'webkitfullscreenchange',
                onerror: 'webkitfullscreenerror'
            },
            moz: {
                enabled: 'mozFullScreen',
                element: 'mozFullScreenElement',
                request: 'mozRequestFullScreen',
                exit: 'mozCancelFullScreen',
                onchange: 'mozfullscreenchange',
                onerror: 'mozfullscreenerror'
            },
            ios: {
                enabled: 'webkitFullscreenEnabled',
                element: 'webkitFullscreenElement',
                request: 'webkitEnterFullscreen',
                exit: 'webkitExitFullscreen',
                onchange: 'webkitfullscreenchange',
                onerror: 'webkitfullscreenerror'
            },
            ms: {
                enabled: 'msFullscreenEnabled',
                element: 'msFullscreenElement',
                request: 'msRequestFullscreen',
                exit: 'msExitFullscreen',
                onchange: 'MSFullscreenChange',
                onerror: 'MSFullscreenError'
            }
        };
        for (var browser in APIs) {
            if (APIs[browser].enabled in document) {
                this.polyfill = APIs[browser];
                break;
            }
        }
        this.isAvailable = (this.polyfill != null);
    };
    VgFullscreenAPI.toggleFullscreen = function (element) {
        if (element === void 0) { element = null; }
        if (this.isFullscreen) {
            this.exit();
        }
        else {
            this.request(element);
        }
    };
    VgFullscreenAPI.request = function (elem) {
        if (!elem) {
            elem = this.videogularElement;
        }
        this.isFullscreen = true;
        this.onChangeFullscreen.next(true);
        // Perform native full screen support
        if (this.isAvailable && this.nativeFullscreen) {
            // Fullscreen for mobile devices
            if (vg_utils_1.VgUtils.isMobileDevice()) {
                // We should make fullscreen the video object if it doesn't have native fullscreen support
                // Fallback! We can't set vg-player on fullscreen, only video/audio objects
                if (!this.polyfill.enabled && elem === this.videogularElement) {
                    elem = this.medias[0];
                }
                this.enterElementInFullScreen(elem);
            }
            else {
                this.enterElementInFullScreen(this.videogularElement);
            }
        }
    };
    VgFullscreenAPI.enterElementInFullScreen = function (elem) {
        elem[this.polyfill.request]();
    };
    VgFullscreenAPI.exit = function () {
        this.isFullscreen = false;
        this.onChangeFullscreen.next(false);
        // Exit from native fullscreen
        if (this.isAvailable && this.nativeFullscreen) {
            document[this.polyfill.exit]();
        }
    };
    VgFullscreenAPI.nativeFullscreen = true;
    VgFullscreenAPI.isFullscreen = false;
    VgFullscreenAPI.onChangeFullscreen = new core_1.EventEmitter();
    VgFullscreenAPI.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    VgFullscreenAPI.ctorParameters = [];
    return VgFullscreenAPI;
}());
exports.VgFullscreenAPI = VgFullscreenAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmctZnVsbHNjcmVlbi1hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2Zy1mdWxsc2NyZWVuLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQWtELGVBQWUsQ0FBQyxDQUFBO0FBQ2xFLHlCQUFzQixZQUFZLENBQUMsQ0FBQTtBQUluQztJQUFBO0lBbUlBLENBQUM7SUF2SFUsb0JBQUksR0FBWCxVQUFZLElBQWdCLEVBQUUsTUFBeUI7UUFDbkQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFNLElBQUksR0FBRztZQUNULEVBQUUsRUFBRTtnQkFDQSxPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixPQUFPLEVBQUUsaUJBQWlCO2FBQzdCO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLE9BQU8sRUFBRSx5QkFBeUI7Z0JBQ2xDLE9BQU8sRUFBRSx5QkFBeUI7Z0JBQ2xDLE9BQU8sRUFBRSx5QkFBeUI7Z0JBQ2xDLElBQUksRUFBRSxzQkFBc0I7Z0JBQzVCLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLE9BQU8sRUFBRSx1QkFBdUI7YUFDbkM7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLG9CQUFvQjtnQkFDN0IsT0FBTyxFQUFFLGdDQUFnQztnQkFDekMsT0FBTyxFQUFFLHlCQUF5QjtnQkFDbEMsSUFBSSxFQUFFLHdCQUF3QjtnQkFDOUIsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsT0FBTyxFQUFFLHVCQUF1QjthQUNuQztZQUNELEdBQUcsRUFBRTtnQkFDRCxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsT0FBTyxFQUFFLHNCQUFzQjtnQkFDL0IsT0FBTyxFQUFFLHNC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QUssQ0FBQztRQUMxQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLDhCQUE4QjtRQUM5QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDO0lBQ0wsQ0FBQztJQXhITSxnQ0FBZ0IsR0FBVyxJQUFJLENBQUM7SUFDaEMsNEJBQVksR0FBVyxLQUFLLENBQUM7SUFLN0Isa0NBQWtCLEdBQXFCLElBQUksbUJBQVksRUFBRSxDQUFDO0lBbUg5RCwwQkFBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxpQkFBVSxFQUFFO0tBQ25CLENBQUM7SUFDRixrQkFBa0I7SUFDWCw4QkFBYyxHQUE2RCxFQUNqRixDQUFDO0lBQ0Ysc0JBQUM7QUFBRCxDQUFDLEFBbklELElBbUlDO0FBbklZLHVCQUFlLGtCQW1JM0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyLCBRdWVyeUxpc3R9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtWZ1V0aWxzfSBmcm9tIFwiLi92Zy11dGlsc1wiO1xuaW1wb3J0IHtWZ01lZGlhfSBmcm9tIFwiLi4vdmctbWVkaWEvdmctbWVkaWFcIjtcblxuXG5leHBvcnQgY2xhc3MgVmdGdWxsc2NyZWVuQVBJIHtcbiAgICBzdGF0aWMgcG9seWZpbGw6YW55O1xuICAgIHN0YXRpYyBvbmNoYW5nZTpzdHJpbmc7XG4gICAgc3RhdGljIG9uZXJyb3I6c3RyaW5nO1xuICAgIHN0YXRpYyBuYXRpdmVGdWxsc2NyZWVuOmJvb2xlYW4gPSB0cnVlO1xuICAgIHN0YXRpYyBpc0Z1bGxzY3JlZW46Ym9vbGVhbiA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc0F2YWlsYWJsZTpib29sZWFuO1xuICAgIHN0YXRpYyB2aWRlb2d1bGFyRWxlbWVudDpIVE1MRWxlbWVudDtcbiAgICBzdGF0aWMgbWVkaWFzOlF1ZXJ5TGlzdDxWZ01lZGlhPjtcblxuICAgIHN0YXRpYyBvbkNoYW5nZUZ1bGxzY3JlZW46RXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBzdGF0aWMgaW5pdChlbGVtOkhUTUxFbGVtZW50LCBtZWRpYXM6UXVlcnlMaXN0PFZnTWVkaWE+KSB7XG4gICAgICAgIHRoaXMudmlkZW9ndWxhckVsZW1lbnQgPSBlbGVtO1xuICAgICAgICB0aGlzLm1lZGlhcyA9IG1lZGlhcztcblxuICAgICAgICBjb25zdCBBUElzID0ge1xuICAgICAgICAgICAgdzM6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiAnZnVsbHNjcmVlbkVuYWJsZWQnLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdmdWxsc2NyZWVuRWxlbWVudCcsXG4gICAgICAgICAgICAgICAgcmVxdWVzdDogJ3JlcXVlc3RGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICAgICBleGl0OiAnZXhpdEZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgICAgIG9uY2hhbmdlOiAnZnVsbHNjcmVlbmNoYW5nZScsXG4gICAgICAgICAgICAgICAgb25lcnJvcjogJ2Z1bGxzY3JlZW5lcnJvcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXdXZWJraXQ6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiAnd2Via2l0RnVsbHNjcmVlbkVuYWJsZWQnLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICd3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCcsXG4gICAgICAgICAgICAgICAgcmVxdWVzdDogJ3dlYmtpdFJlcXVlc3RGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICAgICBleGl0OiAnd2Via2l0RXhpdEZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgICAgIG9uY2hhbmdlOiAnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsXG4gICAgICAgICAgICAgICAgb25lcnJvcjogJ3dlYmtpdGZ1bGxzY3JlZW5lcnJvcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbGRXZWJraXQ6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiAnd2Via2l0SXNGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnd2Via2l0Q3VycmVudEZ1bGxTY3JlZW5FbGVtZW50JyxcbiAgICAgICAgICAgICAgICByZXF1ZXN0OiAnd2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4nLFxuICAgICAgICAgICAgICAgIGV4aXQ6ICd3ZWJraXRDYW5jZWxGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICAgICBvbmNoYW5nZTogJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLFxuICAgICAgICAgICAgICAgIG9uZXJyb3I6ICd3ZWJraXRmdWxsc2NyZWVuZXJyb3InXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW96OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogJ21vekZ1bGxTY3JlZW4nLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdtb3pGdWxsU2NyZWVuRWxlbWVudCcsXG4gICAgICAgICAgICAgICAgcmVxdWVzdDogJ21velJlcXVlc3RGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICAgICBleGl0OiAnbW96Q2FuY2VsRnVsbFNjcmVlbicsXG4gICAgICAgICAgICAgICAgb25jaGFuZ2U6ICdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgICAgICAgICAgICBvbmVycm9yOiAnbW96ZnVsbHNjcmVlbmVycm9yJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlvczoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6ICd3ZWJraXRGdWxsc2NyZWVuRW5hYmxlZCcsXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ3dlYmtpdEZ1bGxzY3JlZW5FbGVtZW50JyxcbiAgICAgICAgICAgICAgICByZXF1ZXN0OiAnd2Via2l0RW50ZXJGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICAgICBleGl0OiAnd2Via2l0RXhpdEZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgICAgIG9uY2hhbmdlOiAnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsXG4gICAgICAgICAgICAgICAgb25lcnJvcjogJ3dlYmtpdGZ1bGxzY3JlZW5lcnJvcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtczoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6ICdtc0Z1bGxzY3JlZW5FbmFibGVkJyxcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnbXNGdWxsc2NyZWVuRWxlbWVudCcsXG4gICAgICAgICAgICAgICAgcmVxdWVzdDogJ21zUmVxdWVzdEZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgICAgIGV4aXQ6ICdtc0V4aXRGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICAgICBvbmNoYW5nZTogJ01TRnVsbHNjcmVlbkNoYW5nZScsXG4gICAgICAgICAgICAgICAgb25lcnJvcjogJ01TRnVsbHNjcmVlbkVycm9yJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGJyb3dzZXIgaW4gQVBJcykge1xuICAgICAgICAgICAgaWYgKEFQSXNbYnJvd3Nlcl0uZW5hYmxlZCBpbiBkb2N1bWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9seWZpbGwgPSBBUElzW2Jyb3dzZXJdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pc0F2YWlsYWJsZSA9ICh0aGlzLnBvbHlmaWxsICE9IG51bGwpO1xuICAgIH1cblxuICAgIHN0YXRpYyB0b2dnbGVGdWxsc2NyZWVuKGVsZW1lbnQ6YW55ID0gbnVsbCkge1xuICAgICAgICBpZiAodGhpcy5pc0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZXhpdCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0KGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHJlcXVlc3QoZWxlbTphbnkpIHtcbiAgICAgICAgaWYgKCFlbGVtKSB7XG4gICAgICAgICAgICBlbGVtID0gdGhpcy52aWRlb2d1bGFyRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNGdWxsc2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZUZ1bGxzY3JlZW4ubmV4dCh0cnVlKTtcblxuICAgICAgICAvLyBQZXJmb3JtIG5hdGl2ZSBmdWxsIHNjcmVlbiBzdXBwb3J0XG4gICAgICAgIGlmICh0aGlzLmlzQXZhaWxhYmxlICYmIHRoaXMubmF0aXZlRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgLy8gRnVsbHNjcmVlbiBmb3IgbW9iaWxlIGRldmljZXNcbiAgICAgICAgICAgIGlmIChWZ1V0aWxzLmlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBzaG91bGQgbWFrZSBmdWxsc2NyZWVuIHRoZSB2aWRlbyBvYmplY3QgaWYgaXQgZG9lc24ndCBoYXZlIG5hdGl2ZSBmdWxsc2NyZWVuIHN1cHBvcnRcbiAgICAgICAgICAgICAgICAvLyBGYWxsYmFjayEgV2UgY2FuJ3Qgc2V0IHZnLXBsYXllciBvbiBmdWxsc2NyZWVuLCBvbmx5IHZpZGVvL2F1ZGlvIG9iamVjdHNcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucG9seWZpbGwuZW5hYmxlZCAmJiBlbGVtID09PSB0aGlzLnZpZGVvZ3VsYXJFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0gPSB0aGlzLm1lZGlhc1swXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVudGVyRWxlbWVudEluRnVsbFNjcmVlbihlbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZW50ZXJFbGVtZW50SW5GdWxsU2NyZWVuKHRoaXMudmlkZW9ndWxhckVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGVudGVyRWxlbWVudEluRnVsbFNjcmVlbihlbGVtOmFueSkge1xuICAgICAgICBlbGVtW3RoaXMucG9seWZpbGwucmVxdWVzdF0oKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZXhpdCgpIHtcbiAgICAgICAgdGhpcy5pc0Z1bGxzY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZUZ1bGxzY3JlZW4ubmV4dChmYWxzZSk7XG5cbiAgICAgICAgLy8gRXhpdCBmcm9tIG5hdGl2ZSBmdWxsc2NyZWVuXG4gICAgICAgIGlmICh0aGlzLmlzQXZhaWxhYmxlICYmIHRoaXMubmF0aXZlRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgZG9jdW1lbnRbdGhpcy5wb2x5ZmlsbC5leGl0XSgpO1xuICAgICAgICB9XG4gICAgfVxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogSW5qZWN0YWJsZSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuc3RhdGljIGN0b3JQYXJhbWV0ZXJzOiAoe3R5cGU6IGFueSwgZGVjb3JhdG9ycz86IERlY29yYXRvckludm9jYXRpb25bXX18bnVsbClbXSA9IFtcbl07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==