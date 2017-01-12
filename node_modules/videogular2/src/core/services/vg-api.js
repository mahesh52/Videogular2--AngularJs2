"use strict";
var core_1 = require('@angular/core');
var vg_states_1 = require("../states/vg-states");
var VgAPI = (function () {
    function VgAPI() {
        this.medias = {}; // TODO: refactor to Set<IPlayable> 
        this.playerReadyEvent = new core_1.EventEmitter(true);
    }
    VgAPI.prototype.onPlayerReady = function () {
        this.playerReadyEvent.emit(this);
    };
    VgAPI.prototype.getDefaultMedia = function () {
        for (var item in this.medias) {
            if (this.medias[item]) {
                return this.medias[item];
            }
        }
    };
    VgAPI.prototype.getMasterMedia = function () {
        var master;
        for (var id in this.medias) {
            if (this.medias[id].vgMedia === 'true' || this.medias[id].vgMedia === true) {
                master = this.medias[id];
                break;
            }
        }
        return master || this.getDefaultMedia();
    };
    VgAPI.prototype.isMasterDefined = function () {
        var result = false;
        for (var id in this.medias) {
            if (this.medias[id].vgMedia === 'true' || this.medias[id].vgMedia === true) {
                result = true;
                break;
            }
        }
        return result;
    };
    VgAPI.prototype.getMediaById = function (id) {
        if (id === void 0) { id = null; }
        var media = this.medias[id];
        if (!id || id === '*') {
            media = this;
        }
        return media;
    };
    VgAPI.prototype.play = function () {
        for (var id in this.medias) {
            if (this.medias[id]) {
                this.medias[id].play();
            }
        }
    };
    VgAPI.prototype.pause = function () {
        for (var id in this.medias) {
            if (this.medias[id]) {
                this.medias[id].pause();
            }
        }
    };
    Object.defineProperty(VgAPI.prototype, "duration", {
        get: function () {
            return this.$$getAllProperties('duration');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "currentTime", {
        get: function () {
            return this.$$getAllProperties('currentTime');
        },
        set: function (seconds) {
            this.$$setAllProperties('currentTime', seconds);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "state", {
        get: function () {
            return this.$$getAllProperties('state');
        },
        set: function (state) {
            this.$$setAllProperties('state', state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "volume", {
        get: function () {
            return this.$$getAllProperties('volume');
        },
        set: function (volume) {
            this.$$setAllProperties('volume', volume);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "playbackRate", {
        get: function () {
            return this.$$getAllProperties('playbackRate');
        },
        set: function (rate) {
            this.$$setAllProperties('playbackRate', rate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "canPlay", {
        get: function () {
            return this.$$getAllProperties('canPlay');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "canPlayThrough", {
        get: function () {
            return this.$$getAllProperties('canPlayThrough');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "isMetadataLoaded", {
        get: function () {
            return this.$$getAllProperties('isMetadataLoaded');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "isWaiting", {
        get: function () {
            return this.$$getAllProperties('isWaiting');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "isCompleted", {
        get: function () {
            return this.$$getAllProperties('isCompleted');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "isLive", {
        get: function () {
            return this.$$getAllProperties('isLive');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "isMaster", {
        get: function () {
            return this.$$getAllProperties('isMaster');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "time", {
        get: function () {
            return this.$$getAllProperties('time');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "buffer", {
        get: function () {
            return this.$$getAllProperties('buffer');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "buffered", {
        get: function () {
            return this.$$getAllProperties('buffered');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgAPI.prototype, "subscriptions", {
        get: function () {
            return this.$$getAllProperties('subscriptions');
        },
        enumerable: true,
        configurable: true
    });
    VgAPI.prototype.seekTime = function (value, byPercent) {
        if (byPercent === void 0) { byPercent = false; }
        for (var id in this.medias) {
            if (this.medias[id]) {
                this.$$seek(this.medias[id], value, byPercent);
            }
        }
    };
    VgAPI.prototype.$$seek = function (media, value, byPercent) {
        if (byPercent === void 0) { byPercent = false; }
        var second;
        var duration = media.duration;
        if (byPercent) {
            if (this.isMasterDefined()) {
                duration = this.getMasterMedia().duration;
            }
            second = value * duration / 100;
        }
        else {
            second = value;
        }
        media.currentTime = second;
    };
    VgAPI.prototype.$$getAllProperties = function (property) {
        var medias = {};
        var result;
        for (var id in this.medias) {
            if (this.medias[id]) {
                medias[id] = this.medias[id];
            }
        }
        var nMedias = Object.keys(medias).length;
        switch (nMedias) {
            case 0:
                // Return default values until vgMedia is initialized
                switch (property) {
                    case 'state':
                        result = vg_states_1.VgStates.VG_PAUSED;
                        break;
                    case 'playbackRate':
                    case 'volume':
                        result = 1;
                        break;
                    case 'time':
                        result = { current: 0, total: 0, left: 0 };
                        break;
                }
                break;
            case 1:
                // If there's only one media element then return the plain value
                var firstMediaId = Object.keys(medias)[0];
                result = medias[firstMediaId][property];
                break;
            default:
                // TODO: return 'master' value
                var master = this.getMasterMedia();
                result = medias[master.id][property];
        }
        return result;
    };
    VgAPI.prototype.$$setAllProperties = function (property, value) {
        for (var id in this.medias) {
            if (this.medias[id]) {
                this.medias[id][property] = value;
            }
        }
    };
    VgAPI.prototype.registerElement = function (elem) {
        this.videogularElement = elem;
    };
    VgAPI.prototype.registerMedia = function (media) {
        this.medias[media.id] = media;
    };
    VgAPI.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    VgAPI.ctorParameters = [];
    return VgAPI;
}());
exports.VgAPI = VgAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmctYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmctYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBdUMsZUFBZSxDQUFDLENBQUE7QUFFdkQsMEJBQXVCLHFCQUFxQixDQUFDLENBQUE7QUFHN0M7SUFLSTtRQUpBLFdBQU0sR0FBVSxFQUFFLENBQUMsQ0FBQSxvQ0FBb0M7UUFFdkQscUJBQWdCLEdBQXNCLElBQUksbUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUk3RCxDQUFDO0lBRUQsNkJBQWEsR0FBYjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELCtCQUFlLEdBQWY7UUFDSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsOEJBQWMsR0FBZDtRQUNJLElBQUksTUFBVSxDQUFDO1FBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN6QixLQUFLLENBQUM7WUFDVixDQUFDO1FBQ0wsQ0FB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LGFBQUssUUFpUGpCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIEV2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0lQbGF5YWJsZX0gZnJvbSBcIi4uL3ZnLW1lZGlhL2ktcGxheWFibGVcIjtcbmltcG9ydCB7VmdTdGF0ZXN9IGZyb20gXCIuLi9zdGF0ZXMvdmctc3RhdGVzXCI7XG5cblxuZXhwb3J0IGNsYXNzIFZnQVBJIHtcbiAgICBtZWRpYXM6T2JqZWN0ID0ge307Ly8gVE9ETzogcmVmYWN0b3IgdG8gU2V0PElQbGF5YWJsZT4gXG4gICAgdmlkZW9ndWxhckVsZW1lbnQ6IGFueTtcbiAgICBwbGF5ZXJSZWFkeUV2ZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIG9uUGxheWVyUmVhZHkoKSB7XG4gICAgICAgIHRoaXMucGxheWVyUmVhZHlFdmVudC5lbWl0KHRoaXMpO1xuICAgIH1cblxuICAgIGdldERlZmF1bHRNZWRpYSgpOklQbGF5YWJsZSB7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gaW4gdGhpcy5tZWRpYXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lZGlhc1tpdGVtXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1lZGlhc1tpdGVtXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE1hc3Rlck1lZGlhKCk6SVBsYXlhYmxlIHtcbiAgICAgICAgbGV0IG1hc3Rlcjphbnk7XG4gICAgICAgIGZvciAobGV0IGlkIGluIHRoaXMubWVkaWFzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tZWRpYXNbaWRdLnZnTWVkaWEgPT09ICd0cnVlJyB8fCB0aGlzLm1lZGlhc1tpZF0udmdNZWRpYSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIG1hc3RlciA9IHRoaXMubWVkaWFzW2lkXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFzdGVyIHx8IHRoaXMuZ2V0RGVmYXVsdE1lZGlhKCk7XG4gICAgfVxuXG4gICAgaXNNYXN0ZXJEZWZpbmVkKCk6Ym9vbGVhbiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5tZWRpYXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lZGlhc1tpZF0udmdNZWRpYSA9PT0gJ3RydWUnIHx8IHRoaXMubWVkaWFzW2lkXS52Z01lZGlhID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGdldE1lZGlhQnlJZChpZDpzdHJpbmcgPSBudWxsKTpJUGxheWFibGUge1xuICAgICAgICBsZXQgbWVkaWEgPSB0aGlzLm1lZGlhc1tpZF07XG5cbiAgICAgICAgaWYgKCFpZCB8fCBpZCA9PT0gJyonKSB7XG4gICAgICAgICAgICBtZWRpYSA9IHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVkaWE7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5tZWRpYXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lZGlhc1tpZF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lZGlhc1sgaWQgXS5wbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5tZWRpYXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lZGlhc1tpZF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lZGlhc1tpZF0ucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBkdXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJCRnZXRBbGxQcm9wZXJ0aWVzKCdkdXJhdGlvbicpO1xuICAgIH1cblxuICAgIHNldCBjdXJyZW50VGltZShzZWNvbmRzKSB7XG4gICAgICAgIHRoaXMuJCRzZXRBbGxQcm9wZXJ0aWVzKCdjdXJyZW50VGltZScsIHNlY29uZHMpO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJCRnZXRBbGxQcm9wZXJ0aWVzKCdjdXJyZW50VGltZScpO1xuICAgIH1cblxuICAgIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgICAgICB0aGlzLiQkc2V0QWxsUHJvcGVydGllcygnc3RhdGUnLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kJGdldEFsbFByb3BlcnRpZXMoJ3N0YXRlJyk7XG4gICAgfVxuXG4gICAgc2V0IHZvbHVtZSh2b2x1bWUpIHtcbiAgICAgICAgdGhpcy4kJHNldEFsbFByb3BlcnRpZXMoJ3ZvbHVtZScsIHZvbHVtZSk7XG4gICAgfVxuXG4gICAgZ2V0IHZvbHVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJCRnZXRBbGxQcm9wZXJ0aWVzKCd2b2x1bWUnKTtcbiAgICB9XG5cbiAgICBzZXQgcGxheWJhY2tSYXRlKHJhdGUpIHtcbiAgICAgICAgdGhpcy4kJHNldEFsbFByb3BlcnRpZXMoJ3BsYXliYWNrUmF0ZScsIHJhdGUpO1xuICAgIH1cblxuICAgIGdldCBwbGF5YmFja1JhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiQkZ2V0QWxsUHJvcGVydGllcygncGxheWJhY2tSYXRlJyk7XG4gICAgfVxuXG4gICAgZ2V0IGNhblBsYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiQkZ2V0QWxsUHJvcGVydGllcygnY2FuUGxheScpO1xuICAgIH1cblxuICAgIGdldCBjYW5QbGF5VGhyb3VnaCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJCRnZXRBbGxQcm9wZXJ0aWVzKCdjYW5QbGF5VGhyb3VnaCcpO1xuICAgIH1cblxuICAgIGdldCBpc01ldGFkYXRhTG9hZGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kJGdldEFsbFByb3BlcnRpZXMoJ2lzTWV0YWRhdGFMb2FkZWQnKTtcbiAgICB9XG5cbiAgICBnZXQgaXNXYWl0aW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kJGdldEFsbFByb3BlcnRpZXMoJ2lzV2FpdGluZycpO1xuICAgIH1cblxuICAgIGdldCBpc0NvbXBsZXRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJCRnZXRBbGxQcm9wZXJ0aWVzKCdpc0NvbXBsZXRlZCcpO1xuICAgIH1cblxuICAgIGdldCBpc0xpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiQkZ2V0QWxsUHJvcGVydGllcygnaXNMaXZlJyk7XG4gICAgfVxuXG4gICAgZ2V0IGlzTWFzdGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kJGdldEFsbFByb3BlcnRpZXMoJ2lzTWFzdGVyJyk7XG4gICAgfVxuXG4gICAgZ2V0IHRpbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiQkZ2V0QWxsUHJvcGVydGllcygndGltZScpO1xuICAgIH1cblxuICAgIGdldCBidWZmZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiQkZ2V0QWxsUHJvcGVydGllcygnYnVmZmVyJyk7XG4gICAgfVxuXG4gICAgZ2V0IGJ1ZmZlcmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kJGdldEFsbFByb3BlcnRpZXMoJ2J1ZmZlcmVkJyk7XG4gICAgfVxuXG4gICAgZ2V0IHN1YnNjcmlwdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiQkZ2V0QWxsUHJvcGVydGllcygnc3Vic2NyaXB0aW9ucycpO1xuICAgIH1cblxuICAgIHNlZWtUaW1lKHZhbHVlOm51bWJlciwgYnlQZXJjZW50OmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLm1lZGlhcykge1xuICAgICAgICAgICAgaWYgKHRoaXMubWVkaWFzW2lkXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJCRzZWVrKHRoaXMubWVkaWFzWyBpZCBdLCB2YWx1ZSwgYnlQZXJjZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICQkc2VlayhtZWRpYTpJUGxheWFibGUsIHZhbHVlOm51bWJlciwgYnlQZXJjZW50OmJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBsZXQgc2Vjb25kOm51bWJlcjtcbiAgICAgICAgbGV0IGR1cmF0aW9uOm51bWJlciA9IG1lZGlhLmR1cmF0aW9uO1xuXG4gICAgICAgIGlmIChieVBlcmNlbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTWFzdGVyRGVmaW5lZCgpKSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSB0aGlzLmdldE1hc3Rlck1lZGlhKCkuZHVyYXRpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlY29uZCA9IHZhbHVlICogZHVyYXRpb24gLyAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWNvbmQgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1lZGlhLmN1cnJlbnRUaW1lID0gc2Vjb25kO1xuICAgIH1cblxuICAgICQkZ2V0QWxsUHJvcGVydGllcyhwcm9wZXJ0eTpzdHJpbmcpe1xuICAgICAgICBjb25zdCBtZWRpYXMgPSB7fTtcbiAgICAgICAgbGV0IHJlc3VsdDphbnk7XG5cbiAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5tZWRpYXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lZGlhc1tpZF0pIHtcbiAgICAgICAgICAgICAgICBtZWRpYXNbIGlkIF0gPSB0aGlzLm1lZGlhc1sgaWQgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5NZWRpYXMgPSBPYmplY3Qua2V5cyhtZWRpYXMpLmxlbmd0aDtcbiAgICAgICAgc3dpdGNoIChuTWVkaWFzKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIGRlZmF1bHQgdmFsdWVzIHVudGlsIHZnTWVkaWEgaXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3N0YXRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IFZnU3RhdGVzLlZHX1BBVVNFRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BsYXliYWNrUmF0ZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3ZvbHVtZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7Y3VycmVudDogMCwgdG90YWw6IDAsIGxlZnQ6IDB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBvbmx5IG9uZSBtZWRpYSBlbGVtZW50IHRoZW4gcmV0dXJuIHRoZSBwbGFpbiB2YWx1ZVxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0TWVkaWFJZCA9IE9iamVjdC5rZXlzKG1lZGlhcylbMF07XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbWVkaWFzW2ZpcnN0TWVkaWFJZF1bcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiByZXR1cm4gJ21hc3RlcicgdmFsdWVcbiAgICAgICAgICAgICAgICBsZXQgbWFzdGVyID0gdGhpcy5nZXRNYXN0ZXJNZWRpYSgpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG1lZGlhc1ttYXN0ZXIuaWRdW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAkJHNldEFsbFByb3BlcnRpZXMocHJvcGVydHk6c3RyaW5nLCB2YWx1ZTphbnkpe1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLm1lZGlhcykge1xuICAgICAgICAgICAgaWYgKHRoaXMubWVkaWFzW2lkXSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWVkaWFzWyBpZCBdWyBwcm9wZXJ0eSBdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdpc3RlckVsZW1lbnQoZWxlbTpIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLnZpZGVvZ3VsYXJFbGVtZW50ID0gZWxlbTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck1lZGlhKG1lZGlhOklQbGF5YWJsZSkge1xuICAgICAgICB0aGlzLm1lZGlhc1ttZWRpYS5pZF0gPSBtZWRpYTtcbiAgICB9XG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBJbmplY3RhYmxlIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5zdGF0aWMgY3RvclBhcmFtZXRlcnM6ICh7dHlwZTogYW55LCBkZWNvcmF0b3JzPzogRGVjb3JhdG9ySW52b2NhdGlvbltdfXxudWxsKVtdID0gW1xuXTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19