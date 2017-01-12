"use strict";
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var TimerObservable_1 = require("rxjs/observable/TimerObservable");
var vg_states_1 = require('../states/vg-states');
var vg_api_1 = require('../services/vg-api');
var vg_events_1 = require('../events/vg-events');
require('rxjs/add/observable/fromEvent');
require('rxjs/add/observable/combineLatest');
var VgMedia = (function () {
    function VgMedia(ref, api) {
        this.api = api;
        this.state = vg_states_1.VgStates.VG_PAUSED;
        this.time = { current: 0, total: 0, left: 0 };
        this.buffer = { end: 0 };
        this.canPlay = false;
        this.canPlayThrough = false;
        this.isBufferDetected = false;
        this.isMetadataLoaded = false;
        this.isReadyToPlay = false;
        this.isWaiting = false;
        this.isCompleted = false;
        this.isLive = false;
        this.checkInterval = 200;
        this.currentPlayPos = 0;
        this.lastPlayPos = 0;
        this.playAtferSync = false;
        this.elem = ref.nativeElement;
    }
    VgMedia.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions = {
            // Native events
            abort: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_ABORT),
            canPlay: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_CAN_PLAY),
            canPlayThrough: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_CAN_PLAY_THROUGH),
            durationChange: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_DURATION_CHANGE),
            emptied: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_EMPTIED),
            encrypted: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_ENCRYPTED),
            ended: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_ENDED),
            error: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_ERROR),
            loadedData: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_LOADED_DATA),
            loadedMetadata: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_LOADED_METADATA),
            loadStart: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_LOAD_START),
            pause: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_PAUSE),
            play: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_PLAY),
            playing: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_PLAYING),
            progress: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_PROGRESS),
            rateChange: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_RATE_CHANGE),
            seeked: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_SEEKED),
            seeking: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_SEEKING),
            stalled: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_STALLED),
            suspend: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_SUSPEND),
            timeUpdate: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_TIME_UPDATE),
            volumeChange: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_VOLUME_CHANGE),
            waiting: Observable_1.Observable.fromEvent(this.elem, vg_events_1.VgEvents.VG_WAITING),
            // Advertisement only events
            startAds: Observable_1.Observable.fromEvent(window, vg_events_1.VgEvents.VG_START_ADS),
            endAds: Observable_1.Observable.fromEvent(window, vg_events_1.VgEvents.VG_END_ADS),
            // See changes on <source> child elements to reload the video file
            mutation: Observable_1.Observable.create(function (observer) {
                var domObs = new MutationObserver(function (mutations) {
                    observer.next(mutations);
                });
                domObs.observe(_this.elem, { childList: true });
                return function () {
                    domObs.disconnect();
                };
            }),
            // Custom buffering detection
            bufferDetected: Observable_1.Observable.create(function (observer) {
                _this.bufferObserver = observer;
                return function () {
                    observer.disconnect();
                };
            })
        };
        this.mutationObs = this.subscriptions.mutation.subscribe(this.onMutation.bind(this));
        this.canPlayObs = this.subscriptions.canPlay.subscribe(this.onCanPlay.bind(this));
        this.canPlayThroughObs = this.subscriptions.canPlayThrough.subscribe(this.onCanPlayThrough.bind(this));
        this.loadedMetadataObs = this.subscriptions.loadedMetadata.subscribe(this.onLoadMetadata.bind(this));
        this.waitingObs = this.subscriptions.waiting.subscribe(this.onWait.bind(this));
        this.progressObs = this.subscriptions.progress.subscribe(this.onProgress.bind(this));
        this.endedObs = this.subscriptions.ended.subscribe(this.onComplete.bind(this));
        this.playingObs = this.subscriptions.playing.subscribe(this.onStartPlaying.bind(this));
        this.playObs = this.subscriptions.play.subscribe(this.onPlay.bind(this));
        this.pauseObs = this.subscriptions.pause.subscribe(this.onPause.bind(this));
        this.timeUpdateObs = this.subscriptions.timeUpdate.subscribe(this.onTimeUpdate.bind(this));
        this.volumeChangeObs = this.subscriptions.volumeChange.subscribe(this.onVolumeChange.bind(this));
        this.errorObs = this.subscriptions.error.subscribe(this.onError.bind(this));
        this.isMaster = (this.vgMedia === 'master');
        if (this.isMaster) {
            this.api.playerReadyEvent.subscribe(function () {
                _this.prepareSync();
            });
        }
    };
    VgMedia.prototype.prepareSync = function () {
        var _this = this;
        var canPlayAll = [];
        for (var media in this.api.medias) {
            if (this.api.medias[media]) {
                canPlayAll.push(this.api.medias[media].subscriptions.canPlay);
            }
        }
        this.canPlayAllSubscription = Observable_1.Observable.combineLatest(canPlayAll, function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i - 0] = arguments[_i];
            }
            var allReady = params.some(function (event) { return event.target.readyState === 4; });
            if (allReady && !_this.syncSubscription) {
                _this.startSync();
                _this.syncSubscription.unsubscribe();
            }
        }).subscribe();
    };
    VgMedia.prototype.startSync = function () {
        var _this = this;
        this.syncSubscription = TimerObservable_1.TimerObservable.create(0, 1000).subscribe(function () {
            for (var media in _this.api.medias) {
                if (_this.api.medias[media] !== _this) {
                    var diff = _this.api.medias[media].currentTime - _this.currentTime;
                    if (diff < -0.3 || diff > 0.3) {
                        _this.playAtferSync = (_this.state === vg_states_1.VgStates.VG_PLAYING);
                        _this.pause();
                        _this.api.medias[media].pause();
                        _this.api.medias[media].currentTime = _this.currentTime;
                    }
                    else {
                        if (_this.playAtferSync) {
                            _this.play();
                            _this.api.medias[media].play();
                            _this.playAtferSync = false;
                        }
                    }
                }
            }
        });
    };
    VgMedia.prototype.onMutation = function (mutations) {
        var _this = this;
        this.elem.pause();
        this.elem.currentTime = 0;
        // TODO: This is ugly, we should find something cleaner
        setTimeout(function () { return _this.elem.load(); }, 1);
    };
    VgMedia.prototype.play = function () {
        this.elem.play();
    };
    VgMedia.prototype.pause = function () {
        this.elem.pause();
    };
    Object.defineProperty(VgMedia.prototype, "id", {
        get: function () {
            return this.elem.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgMedia.prototype, "duration", {
        get: function () {
            return this.elem.duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgMedia.prototype, "currentTime", {
        get: function () {
            return this.elem.currentTime;
        },
        set: function (seconds) {
            this.elem.currentTime = seconds;
            // this.elem.dispatchEvent(new CustomEvent(VgEvents.VG_SEEK));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgMedia.prototype, "volume", {
        get: function () {
            return this.elem.volume;
        },
        set: function (volume) {
            this.elem.volume = volume;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgMedia.prototype, "playbackRate", {
        get: function () {
            return this.elem.playbackRate;
        },
        set: function (rate) {
            this.elem.playbackRate = rate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VgMedia.prototype, "buffered", {
        get: function () {
            return this.elem.buffered;
        },
        enumerable: true,
        configurable: true
    });
    VgMedia.prototype.onCanPlay = function (event) {
        this.canPlay = true;
    };
    VgMedia.prototype.onCanPlayThrough = function (event) {
        this.canPlayThrough = true;
    };
    VgMedia.prototype.onLoadMetadata = function (event) {
        this.isMetadataLoaded = true;
        this.time.current = 0;
        this.time.left = 0;
        this.time.total = this.duration * 1000;
        this.state = vg_states_1.VgStates.VG_PAUSED;
        // Live streaming check
        var t = Math.round(this.time.total);
        this.isLive = (t === Infinity);
    };
    VgMedia.prototype.onWait = function (event) {
        this.isWaiting = true;
    };
    VgMedia.prototype.onComplete = function (event) {
        this.isCompleted = true;
        this.state = vg_states_1.VgStates.VG_ENDED;
    };
    VgMedia.prototype.onStartPlaying = function (event) {
        this.state = vg_states_1.VgStates.VG_PLAYING;
    };
    VgMedia.prototype.onPlay = function (event) {
        this.state = vg_states_1.VgStates.VG_PLAYING;
        if (this.isMaster) {
            if (!this.syncSubscription || this.syncSubscription.closed) {
                this.startSync();
            }
        }
        if (this.bufferObserver) {
            this.startBufferCheck();
        }
    };
    VgMedia.prototype.onPause = function (event) {
        this.state = vg_states_1.VgStates.VG_PAUSED;
        if (this.isMaster) {
            if (!this.playAtferSync) {
                this.syncSubscription.unsubscribe();
            }
        }
        if (this.bufferObserver) {
            this.stopBufferCheck();
        }
    };
    VgMedia.prototype.onTimeUpdate = function (event) {
        var end = this.buffered.length - 1;
        this.time.current = this.currentTime * 1000;
        this.time.left = (this.duration - this.currentTime) * 1000;
        if (end >= 0) {
            this.buffer.end = this.buffered.end(end) * 1000;
        }
    };
    VgMedia.prototype.onProgress = function (event) {
        var end = this.buffered.length - 1;
        if (end >= 0) {
            this.buffer.end = this.buffered.end(end) * 1000;
        }
    };
    VgMedia.prototype.onVolumeChange = function (event) {
        // TODO: Save to localstorage the current volume
    };
    VgMedia.prototype.onError = function (event) {
        // TODO: Handle error messages
    };
    // http://stackoverflow.com/a/23828241/779529
    VgMedia.prototype.bufferCheck = function () {
        var offset = 1 / this.checkInterval;
        this.currentPlayPos = this.currentTime;
        if (!this.isBufferDetected && this.currentPlayPos < (this.lastPlayPos + offset)) {
            this.isBufferDetected = true;
        }
        if (this.isBufferDetected && this.currentPlayPos > (this.lastPlayPos + offset)) {
            this.isBufferDetected = false;
        }
        this.bufferObserver.next(this.isBufferDetected);
        this.lastPlayPos = this.currentPlayPos;
    };
    VgMedia.prototype.startBufferCheck = function () {
        var _this = this;
        this.checkBufferSubscription = TimerObservable_1.TimerObservable.create(0, this.checkInterval).subscribe(function () {
            _this.bufferCheck();
        });
    };
    VgMedia.prototype.stopBufferCheck = function () {
        this.checkBufferSubscription.unsubscribe();
        this.isBufferDetected = false;
        this.bufferObserver.next(this.isBufferDetected);
    };
    VgMedia.prototype.seekTime = function (value, byPercent) {
        if (byPercent === void 0) { byPercent = false; }
        var second;
        var duration = this.duration;
        if (byPercent) {
            second = value * duration / 100;
        }
        else {
            second = value;
        }
        this.currentTime = second;
    };
    VgMedia.prototype.ngOnDestroy = function () {
        this.elem.src = '';
        this.mutationObs.unsubscribe();
        this.canPlayObs.unsubscribe();
        this.canPlayThroughObs.unsubscribe();
        this.loadedMetadataObs.unsubscribe();
        this.waitingObs.unsubscribe();
        this.progressObs.unsubscribe();
        this.endedObs.unsubscribe();
        this.playingObs.unsubscribe();
        this.playObs.unsubscribe();
        this.pauseObs.unsubscribe();
        this.timeUpdateObs.unsubscribe();
        this.volumeChangeObs.unsubscribe();
        this.errorObs.unsubscribe();
    };
    VgMedia.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[vgMedia]'
                },] },
    ];
    /** @nocollapse */
    VgMedia.ctorParameters = [
        { type: core_1.ElementRef, },
        { type: vg_api_1.VgAPI, },
    ];
    VgMedia.propDecorators = {
        'vgMedia': [{ type: core_1.Input },],
    };
    return VgMedia;
}());
exports.VgMedia = VgMedia;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmctbWVkaWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2Zy1tZWRpYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQWdFLGVBQWUsQ0FBQyxDQUFBO0FBRWhGLDJCQUEyQixpQkFBaUIsQ0FBQyxDQUFBO0FBQzdDLGdDQUFnQyxpQ0FBaUMsQ0FBQyxDQUFBO0FBR2xFLDBCQUF5QixxQkFBcUIsQ0FBQyxDQUFBO0FBQy9DLHVCQUFzQixvQkFBb0IsQ0FBQyxDQUFBO0FBQzNDLDBCQUF5QixxQkFBcUIsQ0FBQyxDQUFBO0FBRS9DLFFBQU8sK0JBQStCLENBQUMsQ0FBQTtBQUN2QyxRQUFPLG1DQUFtQyxDQUFDLENBQUE7QUFHM0M7SUErQ0ksaUJBQVksR0FBZSxFQUFVLEdBQVU7UUFBVixRQUFHLEdBQUgsR0FBRyxDQUFPO1FBMUMvQyxVQUFLLEdBQVcsb0JBQVEsQ0FBQyxTQUFTLENBQUM7UUFFbkMsU0FBSSxHQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUM5QyxXQUFNLEdBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFHekIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFDN0IsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUd4QixrQkFBYSxHQUFXLEdBQUcsQ0FBQztRQUM1QixtQkFBYyxHQUFXLENBQUMsQ0FBQztRQUMzQixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQU14QixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQW1CM0IsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO0lBQ2xDLENBQUM7SUFFRCwwQkFBUSxHQUFSO1FBQUEsaUJBaUZDO1FBaEZHLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDakIsZ0JBQWdCO1lBQ2hCLEtBQUssRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsUUFBUSxDQUFDO1lBQzlELE9BQU8sRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsV0FBVyxDQUFDO1lBQ25FLGNBQWMsRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsbUJBQW1CLENBQUM7WUFDbEYsY0FBYyxFQUFFLHVCQUFVLENBQUMsU0FBUyxDQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQztZQUNqRixPQUFPLEVBQUUsdUJBQVUsQ0FBQyxTQUFTLENBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxvQkFBUSxDQUFDLFVBQVUsQ0FBQztZQUNsRSxTQUFTLEVBQUUsdUJBQVUsQ0FBQyxTQUFTLENBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxvQkFBUSxDQUFDLFlBQVksQ0FBQztZQUN0RSxLQUFLLEVBQUUsdUJBQVUsQ0FBQyxTQUFTLENBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxvQkFBUSxDQUFDLFFBQVEsQ0FBQztZQUM5RCxLQUFLLEVBQUUsdUJBQVUsQ0FBQyxTQUFTLENBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxvQkFBUSxDQUFDLFFBQVEsQ0FBQztZQUM5RCxVQUFVLEVBQUUsdUJBQVUsQ0FBQyxTQUFTLENBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxvQkFBUSxDQUFDLGNBQWMsQ0FBQztZQUN6RSxjQUFjLEVBQUUsdUJBQVUsQ0FBQyxTQUFTLENBQU0sSUFBSSxDQUFDLElBQUksRUFBRSxvQkFBUSxDQUFDLGtCQUFrQixDQUFDO1lBQ2pGLFNBQVMsRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsYUFBYSxDQUFDO1lBQ3ZFLEtBQUssRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsUUFBUSxDQUFDO1lBQzlELElBQUksRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsT0FBTyxDQUFDO1lBQzVELE9BQU8sRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsVUFBVSxDQUFDO1lBQ2xFLFFBQVEsRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsV0FBVyxDQUFDO1lBQ3BFLFVBQVUsRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3pFLE1BQU0sRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsU0FBUyxDQUFDO1lBQ2hFLE9BQU8sRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsVUFBVSxDQUFDO1lBQ2xFLE9BQU8sRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsVUFBVSxDQUFDO1lBQ2xFLE9BQU8sRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsVUFBVSxDQUFDO1lBQ2xFLFVBQVUsRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3pFLFlBQVksRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFRLENBQUMsZ0JBQWdCLENBQUM7WUFDN0UsT0FBTyxFQUFFLHVCQUFVLENBQUMsU0FBUyxDQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQVEsQ0FBQyxVQUFVLENBQUM7WUFFbEUsNEJBQTRCO1lBQzVCLFFBQVEsRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBTSxNQUFNLEVBQUUsb0JBQVEsQ0FBQyxZQUFZLENBQUM7WUFDbEUsTUFBTSxFQUFFLHVCQUFVLENBQUMsU0FBUyxDQUFNLE1BQU0sRUFBRSxvQkFBUSxDQUFDLFVBQVUsQ0FBQztZQUU5RCxrRUFBa0U7WUFDbEUsUUFBUSxFQUFFLHVCQUFVLENBQUMsTUFBTSxDQUN2QixVQUFDLFFBQWE7Z0JBQ1YsSUFBSSxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFDLFNBQVM7b0JBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxPQUFPLENBQU0sS0FBSSxDQUFDLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUVwRCxNQUFNLENBQUM7b0JBQ0gsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUN4QixDQUFDLENBQUM7WUFDTixDQUFDLENBQ0o7WUFFRCw2QkFBNkI7WUFDN0IsY0FBYyxFQUFFLHVCQUFVLENBQUMsTUFBTSxDQUM3QixVQUFDLFFBQWE7Z0JBQ1YsS0FBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7Z0JBRS9CLE1BQU0sQ0FBQztvQkFDSCxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQzFCLENBQUMsQ0FBQztZQUNOLENBQUMsQ0FDSjtTQUNKLENBQUM7UUFFRixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTVFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDO1FBRTVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUMvQjtnQkFDSSxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELDZCQUFXLEdBQVg7UUFBQSxpQkFtQkM7UUFsQkcsSUFBSSxVQUFVLEdBQTJCLEVBQUUsQ0FBQztRQUU1QyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsS0FBSyxDQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFFLEtBQUssQ0FBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksQ0FBQyxzQkFBc0IsR0FBRyx1QkFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQzdEO1lBQUMsZ0JBQVM7aUJBQVQsV0FBUyxDQUFULHNCQUFTLENBQVQsSUFBUztnQkFBVCwrQkFBUzs7WUFDTixJQUFJLFFBQVEsR0FBWSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7WUFFNUUsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDckMsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNqQixLQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDeEMsQ0FBQztRQUNMLENBQUMsQ0FDSixDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCwyQkFBUyxHQUFUO1FBQUEsaUJBeUJDO1FBeEJHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxpQ0FBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUM3RDtZQUNJLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDaEMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsS0FBSyxDQUFFLEtBQUssS0FBSSxDQUFDLENBQUMsQ0FBQztvQkFDcEMsSUFBSSxJQUFJLEdBQVcsS0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsS0FBSyxDQUFFLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUM7b0JBRTNFLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsS0FBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLEtBQUssb0JBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFFMUQsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNiLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFFLEtBQUssQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNqQyxLQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxLQUFLLENBQUUsQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQztvQkFDNUQsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs0QkFDckIsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDOzRCQUNaLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFFLEtBQUssQ0FBRSxDQUFDLElBQUksRUFBRSxDQUFDOzRCQUNoQyxLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQzt3QkFDL0IsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsNEJBQVUsR0FBVixVQUFXLFNBQWM7UUFBekIsaUJBTUM7UUFMRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUUxQix1REFBdUQ7UUFDdkQsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFoQixDQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxzQkFBSSxHQUFKO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsdUJBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELHNCQUFJLHVCQUFFO2FBQU47WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw2QkFBUTthQUFaO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzlCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksZ0NBQVc7YUFLZjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNqQyxDQUFDO2FBUEQsVUFBZ0IsT0FBTztZQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7WUFDaEMsOERBQThEO1FBQ2xFLENBQUM7OztPQUFBO0lBTUQsc0JBQUksMkJBQU07YUFJVjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM1QixDQUFDO2FBTkQsVUFBVyxNQUFNO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzlCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksaUNBQVk7YUFJaEI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDbEMsQ0FBQzthQU5ELFVBQWlCLElBQUk7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLENBQUM7OztPQUFBO0lBTUQsc0JBQUksNkJBQVE7YUFBWjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM5QixDQUFDOzs7T0FBQTtJQUVELDJCQUFTLEdBQVQsVUFBVSxLQUFVO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxrQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBVTtRQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQsZ0NBQWMsR0FBZCxVQUFlLEtBQVU7UUFDckIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRXZDLElBQUksQ0FBQyxLQUFLLEdBQUcsb0JBQVEsQ0FBQyxTQUFTLENBQUM7UUFFaEMsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxHQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCx3QkFBTSxHQUFOLFVBQU8sS0FBVTtRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCw0QkFBVSxHQUFWLFVBQVcsS0FBVTtRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLG9CQUFRLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFFRCxnQ0FBYyxHQUFkLFVBQWUsS0FBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLG9CQUFRLENBQUMsVUFBVSxDQUFDO0lBQ3JDLENBQUM7SUFFRCx3QkFBTSxHQUFOLFVBQU8sS0FBVTtRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsb0JBQVEsQ0FBQyxVQUFVLENBQUM7UUFFakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzVCLENBQUM7SUFDTCxDQUFDO0lBRUQseUJBQU8sR0FBUCxVQUFRLEtBQVU7UUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLG9CQUFRLENBQUMsU0FBUyxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4QyxDQUFDO1FBQ0wsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzQixDQUFDO0lBQ0wsQ0FBQztJQUVELDhCQUFZLEdBQVosVUFBYSxLQUFVO1FBQ25CLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUUzRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNwRCxDQUFDO0lBQ0wsQ0FBQztJQUVELDRCQUFVLEdBQVYsVUFBVyxLQUFVO1FBQ2pCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVuQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNwRCxDQUFDO0lBQ0wsQ0FBQztJQUVELGdDQUFjLEdBQWQsVUFBZSxLQUFVO1FBQ3JCLGdEQUFnRDtJQUNwRCxDQUFDO0lBRUQseUJBQU8sR0FBUCxVQUFRLEtBQVU7UUFDZCw4QkFBOEI7SUFDbEMsQ0FBQztJQUVELDZDQUE2QztJQUM3Qyw2QkFBVyxHQUFYO1FBQ0ksSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDbEMsQ0FBQztRQUVELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRWhELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsa0NBQWdCLEdBQWhCO1FBQUEsaUJBTUM7UUFMRyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsaUNBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQ2xGO1lBQ0ksS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FDSixDQUFDO0lBQ04sQ0FBQztJQUVELGlDQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsMEJBQVEsR0FBUixVQUFTLEtBQVksRUFBRSxTQUF5QjtRQUF6Qix5QkFBeUIsR0FBekIsaUJBQXlCO1FBQzVDLElBQUksTUFBYSxDQUFDO1FBQ2xCLElBQUksUUFBUSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFcEMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNaLE1BQU0sR0FBRyxLQUFLLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLENBQUM7UUFFRCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztJQUM5QixDQUFDO0lBRUQsNkJBQVcsR0FBWDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBQ0Usa0JBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsZ0JBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLFdBQVc7aUJBQ3hCLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCxzQkFBYyxHQUE2RDtRQUNsRixFQUFDLElBQUksRUFBRSxpQkFBVSxHQUFHO1FBQ3BCLEVBQUMsSUFBSSxFQUFFLGNBQUssR0FBRztLQUNkLENBQUM7SUFDSyxzQkFBYyxHQUEyQztRQUNoRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFLLEVBQUUsRUFBRTtLQUM1QixDQUFDO0lBQ0YsY0FBQztBQUFELENBQUMsQUFoWkQsSUFnWkM7QUFoWlksZUFBTyxVQWdabkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIE9uSW5pdCwgRGlyZWN0aXZlLCBJbnB1dCwgT25EZXN0cm95IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IElQbGF5YWJsZSwgSU1lZGlhU3Vic2NyaXB0aW9ucyB9IGZyb20gXCIuL2ktcGxheWFibGVcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBUaW1lck9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9vYnNlcnZhYmxlL1RpbWVyT2JzZXJ2YWJsZVwiO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcInJ4anMvU3Vic2NyaXB0aW9uXCI7XG5pbXBvcnQgeyBPYnNlcnZlciB9IGZyb20gXCJyeGpzL09ic2VydmVyXCI7XG5pbXBvcnQgeyBWZ1N0YXRlcyB9IGZyb20gJy4uL3N0YXRlcy92Zy1zdGF0ZXMnO1xuaW1wb3J0IHsgVmdBUEkgfSBmcm9tICcuLi9zZXJ2aWNlcy92Zy1hcGknO1xuaW1wb3J0IHsgVmdFdmVudHMgfSBmcm9tICcuLi9ldmVudHMvdmctZXZlbnRzJztcblxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL2Zyb21FdmVudCc7XG5pbXBvcnQgJ3J4anMvYWRkL29ic2VydmFibGUvY29tYmluZUxhdGVzdCc7XG5cblxuZXhwb3J0IGNsYXNzIFZnTWVkaWEgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgSVBsYXlhYmxlIHtcbiAgICBlbGVtOiBhbnk7XG5cbiAgICAgdmdNZWRpYTogc3RyaW5nO1xuXG4gICAgc3RhdGU6IHN0cmluZyA9IFZnU3RhdGVzLlZHX1BBVVNFRDtcblxuICAgIHRpbWU6IGFueSA9IHsgY3VycmVudDogMCwgdG90YWw6IDAsIGxlZnQ6IDAgfTtcbiAgICBidWZmZXI6IGFueSA9IHsgZW5kOiAwIH07XG4gICAgc3Vic2NyaXB0aW9uczogSU1lZGlhU3Vic2NyaXB0aW9ucyB8IGFueTtcblxuICAgIGNhblBsYXk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBjYW5QbGF5VGhyb3VnaDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlzQnVmZmVyRGV0ZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBpc01ldGFkYXRhTG9hZGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgaXNSZWFkeVRvUGxheTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlzV2FpdGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlzQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgaXNMaXZlOiBib29sZWFuID0gZmFsc2U7XG5cblxuICAgIGNoZWNrSW50ZXJ2YWw6IG51bWJlciA9IDIwMDtcbiAgICBjdXJyZW50UGxheVBvczogbnVtYmVyID0gMDtcbiAgICBsYXN0UGxheVBvczogbnVtYmVyID0gMDtcblxuICAgIGJ1ZmZlck9ic2VydmVyOiBPYnNlcnZlcjxhbnk+O1xuICAgIGNoZWNrQnVmZmVyU3Vic2NyaXB0aW9uOiBhbnk7XG4gICAgc3luY1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICAgIGNhblBsYXlBbGxTdWJzY3JpcHRpb246IGFueTtcbiAgICBwbGF5QXRmZXJTeW5jOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBtdXRhdGlvbk9iczogU3Vic2NyaXB0aW9uO1xuICAgIGNhblBsYXlPYnM6IFN1YnNjcmlwdGlvbjtcbiAgICBjYW5QbGF5VGhyb3VnaE9iczogU3Vic2NyaXB0aW9uO1xuICAgIGxvYWRlZE1ldGFkYXRhT2JzOiBTdWJzY3JpcHRpb247XG4gICAgd2FpdGluZ09iczogU3Vic2NyaXB0aW9uO1xuICAgIHByb2dyZXNzT2JzOiBTdWJzY3JpcHRpb247XG4gICAgZW5kZWRPYnM6IFN1YnNjcmlwdGlvbjtcbiAgICBwbGF5aW5nT2JzOiBTdWJzY3JpcHRpb247XG4gICAgcGxheU9iczogU3Vic2NyaXB0aW9uO1xuICAgIHBhdXNlT2JzOiBTdWJzY3JpcHRpb247XG4gICAgdGltZVVwZGF0ZU9iczogU3Vic2NyaXB0aW9uO1xuICAgIHZvbHVtZUNoYW5nZU9iczogU3Vic2NyaXB0aW9uO1xuICAgIGVycm9yT2JzOiBTdWJzY3JpcHRpb247XG5cbiAgICBpc01hc3RlcjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBhcGk6IFZnQVBJKSB7XG4gICAgICAgIHRoaXMuZWxlbSA9IHJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSB7XG4gICAgICAgICAgICAvLyBOYXRpdmUgZXZlbnRzXG4gICAgICAgICAgICBhYm9ydDogT2JzZXJ2YWJsZS5mcm9tRXZlbnQoPGFueT50aGlzLmVsZW0sIFZnRXZlbnRzLlZHX0FCT1JUKSxcbiAgICAgICAgICAgIGNhblBsYXk6IE9ic2VydmFibGUuZnJvbUV2ZW50KDxhbnk+dGhpcy5lbGVtLCBWZ0V2ZW50cy5WR19DQU5fUExBWSksXG4gICAgICAgICAgICBjYW5QbGF5VGhyb3VnaDogT2JzZXJ2YWJsZS5mcm9tRXZlbnQoPGFueT50aGlzLmVsZW0sIFZnRXZlbnRzLlZHX0NBTl9QTEFZX1RIUk9VR0gpLFxuICAgICAgICAgICAgZHVyYXRpb25DaGFuZ2U6IE9ic2VydmFibGUuZnJvbUV2ZW50KDxhbnk+dGhpcy5lbGVtLCBWZ0V2ZW50cy5WR19EVVJBVElPTl9DSEFOR0UpLFxuICAgICAgICAgICAgZW1wdGllZDogT2JzZXJ2YWJsZS5mcm9tRXZlbnQoPGFueT50aGlzLmVsZW0sIFZnRXZlbnRzLlZHX0VNUFRJRUQpLFxuICAgICAgICAgICAgZW5jcnlwdGVkOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfRU5DUllQVEVEKSxcbiAgICAgICAgICAgIGVuZGVkOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfRU5ERUQpLFxuICAgICAgICAgICAgZXJyb3I6IE9ic2VydmFibGUuZnJvbUV2ZW50KDxhbnk+dGhpcy5lbGVtLCBWZ0V2ZW50cy5WR19FUlJPUiksXG4gICAgICAgICAgICBsb2FkZWREYXRhOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfTE9BREVEX0RBVEEpLFxuICAgICAgICAgICAgbG9hZGVkTWV0YWRhdGE6IE9ic2VydmFibGUuZnJvbUV2ZW50KDxhbnk+dGhpcy5lbGVtLCBWZ0V2ZW50cy5WR19MT0FERURfTUVUQURBVEEpLFxuICAgICAgICAgICAgbG9hZFN0YXJ0OiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfTE9BRF9TVEFSVCksXG4gICAgICAgICAgICBwYXVzZTogT2JzZXJ2YWJsZS5mcm9tRXZlbnQoPGFueT50aGlzLmVsZW0sIFZnRXZlbnRzLlZHX1BBVVNFKSxcbiAgICAgICAgICAgIHBsYXk6IE9ic2VydmFibGUuZnJvbUV2ZW50KDxhbnk+dGhpcy5lbGVtLCBWZ0V2ZW50cy5WR19QTEFZKSxcbiAgICAgICAgICAgIHBsYXlpbmc6IE9ic2VydmFibGUuZnJvbUV2ZW50KDxhbnk+dGhpcy5lbGVtLCBWZ0V2ZW50cy5WR19QTEFZSU5HKSxcbiAgICAgICAgICAgIHByb2dyZXNzOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfUFJPR1JFU1MpLFxuICAgICAgICAgICAgcmF0ZUNoYW5nZTogT2JzZXJ2YWJsZS5mcm9tRXZlbnQoPGFueT50aGlzLmVsZW0sIFZnRXZlbnRzLlZHX1JBVEVfQ0hBTkdFKSxcbiAgICAgICAgICAgIHNlZWtlZDogT2JzZXJ2YWJsZS5mcm9tRXZlbnQoPGFueT50aGlzLmVsZW0sIFZnRXZlbnRzLlZHX1NFRUtFRCksXG4gICAgICAgICAgICBzZWVraW5nOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfU0VFS0lORyksXG4gICAgICAgICAgICBzdGFsbGVkOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfU1RBTExFRCksXG4gICAgICAgICAgICBzdXNwZW5kOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfU1VTUEVORCksXG4gICAgICAgICAgICB0aW1lVXBkYXRlOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfVElNRV9VUERBVEUpLFxuICAgICAgICAgICAgdm9sdW1lQ2hhbmdlOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfVk9MVU1FX0NIQU5HRSksXG4gICAgICAgICAgICB3YWl0aW5nOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PnRoaXMuZWxlbSwgVmdFdmVudHMuVkdfV0FJVElORyksXG5cbiAgICAgICAgICAgIC8vIEFkdmVydGlzZW1lbnQgb25seSBldmVudHNcbiAgICAgICAgICAgIHN0YXJ0QWRzOiBPYnNlcnZhYmxlLmZyb21FdmVudCg8YW55PndpbmRvdywgVmdFdmVudHMuVkdfU1RBUlRfQURTKSxcbiAgICAgICAgICAgIGVuZEFkczogT2JzZXJ2YWJsZS5mcm9tRXZlbnQoPGFueT53aW5kb3csIFZnRXZlbnRzLlZHX0VORF9BRFMpLFxuXG4gICAgICAgICAgICAvLyBTZWUgY2hhbmdlcyBvbiA8c291cmNlPiBjaGlsZCBlbGVtZW50cyB0byByZWxvYWQgdGhlIHZpZGVvIGZpbGVcbiAgICAgICAgICAgIG11dGF0aW9uOiBPYnNlcnZhYmxlLmNyZWF0ZShcbiAgICAgICAgICAgICAgICAob2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZG9tT2JzID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChtdXRhdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBkb21PYnMub2JzZXJ2ZSg8YW55PnRoaXMuZWxlbSwgeyBjaGlsZExpc3Q6IHRydWUgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU9icy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKSxcblxuICAgICAgICAgICAgLy8gQ3VzdG9tIGJ1ZmZlcmluZyBkZXRlY3Rpb25cbiAgICAgICAgICAgIGJ1ZmZlckRldGVjdGVkOiBPYnNlcnZhYmxlLmNyZWF0ZShcbiAgICAgICAgICAgICAgICAob2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlck9ic2VydmVyID0gb2JzZXJ2ZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5tdXRhdGlvbk9icyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5tdXRhdGlvbi5zdWJzY3JpYmUodGhpcy5vbk11dGF0aW9uLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmNhblBsYXlPYnMgPSB0aGlzLnN1YnNjcmlwdGlvbnMuY2FuUGxheS5zdWJzY3JpYmUodGhpcy5vbkNhblBsYXkuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuY2FuUGxheVRocm91Z2hPYnMgPSB0aGlzLnN1YnNjcmlwdGlvbnMuY2FuUGxheVRocm91Z2guc3Vic2NyaWJlKHRoaXMub25DYW5QbGF5VGhyb3VnaC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5sb2FkZWRNZXRhZGF0YU9icyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5sb2FkZWRNZXRhZGF0YS5zdWJzY3JpYmUodGhpcy5vbkxvYWRNZXRhZGF0YS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy53YWl0aW5nT2JzID0gdGhpcy5zdWJzY3JpcHRpb25zLndhaXRpbmcuc3Vic2NyaWJlKHRoaXMub25XYWl0LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnByb2dyZXNzT2JzID0gdGhpcy5zdWJzY3JpcHRpb25zLnByb2dyZXNzLnN1YnNjcmliZSh0aGlzLm9uUHJvZ3Jlc3MuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZW5kZWRPYnMgPSB0aGlzLnN1YnNjcmlwdGlvbnMuZW5kZWQuc3Vic2NyaWJlKHRoaXMub25Db21wbGV0ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5wbGF5aW5nT2JzID0gdGhpcy5zdWJzY3JpcHRpb25zLnBsYXlpbmcuc3Vic2NyaWJlKHRoaXMub25TdGFydFBsYXlpbmcuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucGxheU9icyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5wbGF5LnN1YnNjcmliZSh0aGlzLm9uUGxheS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5wYXVzZU9icyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5wYXVzZS5zdWJzY3JpYmUodGhpcy5vblBhdXNlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnRpbWVVcGRhdGVPYnMgPSB0aGlzLnN1YnNjcmlwdGlvbnMudGltZVVwZGF0ZS5zdWJzY3JpYmUodGhpcy5vblRpbWVVcGRhdGUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMudm9sdW1lQ2hhbmdlT2JzID0gdGhpcy5zdWJzY3JpcHRpb25zLnZvbHVtZUNoYW5nZS5zdWJzY3JpYmUodGhpcy5vblZvbHVtZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lcnJvck9icyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5lcnJvci5zdWJzY3JpYmUodGhpcy5vbkVycm9yLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuaXNNYXN0ZXIgPSAodGhpcy52Z01lZGlhID09PSAnbWFzdGVyJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNNYXN0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYXBpLnBsYXllclJlYWR5RXZlbnQuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlU3luYygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmVwYXJlU3luYygpIHtcbiAgICAgICAgbGV0IGNhblBsYXlBbGw6IEFycmF5PE9ic2VydmFibGU8YW55Pj4gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBtZWRpYSBpbiB0aGlzLmFwaS5tZWRpYXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFwaS5tZWRpYXNbIG1lZGlhIF0pIHtcbiAgICAgICAgICAgICAgICBjYW5QbGF5QWxsLnB1c2godGhpcy5hcGkubWVkaWFzWyBtZWRpYSBdLnN1YnNjcmlwdGlvbnMuY2FuUGxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhblBsYXlBbGxTdWJzY3JpcHRpb24gPSBPYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QoY2FuUGxheUFsbCxcbiAgICAgICAgICAgICguLi5wYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYWxsUmVhZHk6IGJvb2xlYW4gPSBwYXJhbXMuc29tZShldmVudCA9PiBldmVudC50YXJnZXQucmVhZHlTdGF0ZSA9PT0gNCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWxsUmVhZHkgJiYgIXRoaXMuc3luY1N1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0U3luYygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICkuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgc3RhcnRTeW5jKCkge1xuICAgICAgICB0aGlzLnN5bmNTdWJzY3JpcHRpb24gPSBUaW1lck9ic2VydmFibGUuY3JlYXRlKDAsIDEwMDApLnN1YnNjcmliZShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtZWRpYSBpbiB0aGlzLmFwaS5tZWRpYXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXBpLm1lZGlhc1sgbWVkaWEgXSAhPT0gdGhpcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRpZmY6IG51bWJlciA9IHRoaXMuYXBpLm1lZGlhc1sgbWVkaWEgXS5jdXJyZW50VGltZSAtIHRoaXMuY3VycmVudFRpbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaWZmIDwgLTAuMyB8fCBkaWZmID4gMC4zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5QXRmZXJTeW5jID0gKHRoaXMuc3RhdGUgPT09IFZnU3RhdGVzLlZHX1BMQVlJTkcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLm1lZGlhc1sgbWVkaWEgXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLm1lZGlhc1sgbWVkaWEgXS5jdXJyZW50VGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGF5QXRmZXJTeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaS5tZWRpYXNbIG1lZGlhIF0ucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlBdGZlclN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgb25NdXRhdGlvbihtdXRhdGlvbnM6IGFueSkge1xuICAgICAgICB0aGlzLmVsZW0ucGF1c2UoKTtcbiAgICAgICAgdGhpcy5lbGVtLmN1cnJlbnRUaW1lID0gMDtcblxuICAgICAgICAvLyBUT0RPOiBUaGlzIGlzIHVnbHksIHdlIHNob3VsZCBmaW5kIHNvbWV0aGluZyBjbGVhbmVyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbGVtLmxvYWQoKSwgMSk7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5lbGVtLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5lbGVtLnBhdXNlKCk7XG4gICAgfVxuXG4gICAgZ2V0IGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtLmlkO1xuICAgIH1cblxuICAgIGdldCBkdXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS5kdXJhdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgY3VycmVudFRpbWUoc2Vjb25kcykge1xuICAgICAgICB0aGlzLmVsZW0uY3VycmVudFRpbWUgPSBzZWNvbmRzO1xuICAgICAgICAvLyB0aGlzLmVsZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoVmdFdmVudHMuVkdfU0VFSykpO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS5jdXJyZW50VGltZTtcbiAgICB9XG5cbiAgICBzZXQgdm9sdW1lKHZvbHVtZSkge1xuICAgICAgICB0aGlzLmVsZW0udm9sdW1lID0gdm9sdW1lO1xuICAgIH1cblxuICAgIGdldCB2b2x1bWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW0udm9sdW1lO1xuICAgIH1cblxuICAgIHNldCBwbGF5YmFja1JhdGUocmF0ZSkge1xuICAgICAgICB0aGlzLmVsZW0ucGxheWJhY2tSYXRlID0gcmF0ZTtcbiAgICB9XG5cbiAgICBnZXQgcGxheWJhY2tSYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtLnBsYXliYWNrUmF0ZTtcbiAgICB9XG5cbiAgICBnZXQgYnVmZmVyZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW0uYnVmZmVyZWQ7XG4gICAgfVxuXG4gICAgb25DYW5QbGF5KGV2ZW50OiBhbnkpIHtcbiAgICAgICAgdGhpcy5jYW5QbGF5ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkNhblBsYXlUaHJvdWdoKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgdGhpcy5jYW5QbGF5VGhyb3VnaCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25Mb2FkTWV0YWRhdGEoZXZlbnQ6IGFueSkge1xuICAgICAgICB0aGlzLmlzTWV0YWRhdGFMb2FkZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMudGltZS5jdXJyZW50ID0gMDtcbiAgICAgICAgdGhpcy50aW1lLmxlZnQgPSAwO1xuICAgICAgICB0aGlzLnRpbWUudG90YWwgPSB0aGlzLmR1cmF0aW9uICogMTAwMDtcblxuICAgICAgICB0aGlzLnN0YXRlID0gVmdTdGF0ZXMuVkdfUEFVU0VEO1xuXG4gICAgICAgIC8vIExpdmUgc3RyZWFtaW5nIGNoZWNrXG4gICAgICAgIGxldCB0Om51bWJlciA9IE1hdGgucm91bmQodGhpcy50aW1lLnRvdGFsKTtcbiAgICAgICAgdGhpcy5pc0xpdmUgPSAodCA9PT0gSW5maW5pdHkpO1xuICAgIH1cblxuICAgIG9uV2FpdChldmVudDogYW55KSB7XG4gICAgICAgIHRoaXMuaXNXYWl0aW5nID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkNvbXBsZXRlKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBWZ1N0YXRlcy5WR19FTkRFRDtcbiAgICB9XG5cbiAgICBvblN0YXJ0UGxheWluZyhldmVudDogYW55KSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBWZ1N0YXRlcy5WR19QTEFZSU5HO1xuICAgIH1cblxuICAgIG9uUGxheShldmVudDogYW55KSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBWZ1N0YXRlcy5WR19QTEFZSU5HO1xuXG4gICAgICAgIGlmICh0aGlzLmlzTWFzdGVyKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3luY1N1YnNjcmlwdGlvbiB8fCB0aGlzLnN5bmNTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFN5bmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmJ1ZmZlck9ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0QnVmZmVyQ2hlY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUGF1c2UoZXZlbnQ6IGFueSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gVmdTdGF0ZXMuVkdfUEFVU0VEO1xuXG4gICAgICAgIGlmICh0aGlzLmlzTWFzdGVyKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGxheUF0ZmVyU3luYykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3luY1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ1ZmZlckNoZWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRpbWVVcGRhdGUoZXZlbnQ6IGFueSkge1xuICAgICAgICBsZXQgZW5kID0gdGhpcy5idWZmZXJlZC5sZW5ndGggLSAxO1xuXG4gICAgICAgIHRoaXMudGltZS5jdXJyZW50ID0gdGhpcy5jdXJyZW50VGltZSAqIDEwMDA7XG4gICAgICAgIHRoaXMudGltZS5sZWZ0ID0gKHRoaXMuZHVyYXRpb24gLSB0aGlzLmN1cnJlbnRUaW1lKSAqIDEwMDA7XG5cbiAgICAgICAgaWYgKGVuZCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlci5lbmQgPSB0aGlzLmJ1ZmZlcmVkLmVuZChlbmQpICogMTAwMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUHJvZ3Jlc3MoZXZlbnQ6IGFueSkge1xuICAgICAgICBsZXQgZW5kID0gdGhpcy5idWZmZXJlZC5sZW5ndGggLSAxO1xuXG4gICAgICAgIGlmIChlbmQgPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5idWZmZXIuZW5kID0gdGhpcy5idWZmZXJlZC5lbmQoZW5kKSAqIDEwMDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblZvbHVtZUNoYW5nZShldmVudDogYW55KSB7XG4gICAgICAgIC8vIFRPRE86IFNhdmUgdG8gbG9jYWxzdG9yYWdlIHRoZSBjdXJyZW50IHZvbHVtZVxuICAgIH1cblxuICAgIG9uRXJyb3IoZXZlbnQ6IGFueSkge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgZXJyb3IgbWVzc2FnZXNcbiAgICB9XG5cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMzgyODI0MS83Nzk1MjlcbiAgICBidWZmZXJDaGVjaygpIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gMSAvIHRoaXMuY2hlY2tJbnRlcnZhbDtcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheVBvcyA9IHRoaXMuY3VycmVudFRpbWU7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzQnVmZmVyRGV0ZWN0ZWQgJiYgdGhpcy5jdXJyZW50UGxheVBvcyA8ICh0aGlzLmxhc3RQbGF5UG9zICsgb2Zmc2V0KSkge1xuICAgICAgICAgICAgdGhpcy5pc0J1ZmZlckRldGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzQnVmZmVyRGV0ZWN0ZWQgJiYgdGhpcy5jdXJyZW50UGxheVBvcyA+ICh0aGlzLmxhc3RQbGF5UG9zICsgb2Zmc2V0KSkge1xuICAgICAgICAgICAgdGhpcy5pc0J1ZmZlckRldGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1ZmZlck9ic2VydmVyLm5leHQodGhpcy5pc0J1ZmZlckRldGVjdGVkKTtcblxuICAgICAgICB0aGlzLmxhc3RQbGF5UG9zID0gdGhpcy5jdXJyZW50UGxheVBvcztcbiAgICB9XG5cbiAgICBzdGFydEJ1ZmZlckNoZWNrKCkge1xuICAgICAgICB0aGlzLmNoZWNrQnVmZmVyU3Vic2NyaXB0aW9uID0gVGltZXJPYnNlcnZhYmxlLmNyZWF0ZSgwLCB0aGlzLmNoZWNrSW50ZXJ2YWwpLnN1YnNjcmliZShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckNoZWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc3RvcEJ1ZmZlckNoZWNrKCkge1xuICAgICAgICB0aGlzLmNoZWNrQnVmZmVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuaXNCdWZmZXJEZXRlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ1ZmZlck9ic2VydmVyLm5leHQodGhpcy5pc0J1ZmZlckRldGVjdGVkKTtcbiAgICB9XG5cbiAgICBzZWVrVGltZSh2YWx1ZTpudW1iZXIsIGJ5UGVyY2VudDpib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHNlY29uZDpudW1iZXI7XG4gICAgICAgIGxldCBkdXJhdGlvbjpudW1iZXIgPSB0aGlzLmR1cmF0aW9uO1xuXG4gICAgICAgIGlmIChieVBlcmNlbnQpIHtcbiAgICAgICAgICAgIHNlY29uZCA9IHZhbHVlICogZHVyYXRpb24gLyAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWNvbmQgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSBzZWNvbmQ7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZWxlbS5zcmMgPSAnJztcbiAgICAgICAgdGhpcy5tdXRhdGlvbk9icy51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmNhblBsYXlPYnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5jYW5QbGF5VGhyb3VnaE9icy51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmxvYWRlZE1ldGFkYXRhT2JzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMud2FpdGluZ09icy51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLnByb2dyZXNzT2JzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuZW5kZWRPYnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5wbGF5aW5nT2JzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMucGxheU9icy51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLnBhdXNlT2JzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMudGltZVVwZGF0ZU9icy51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLnZvbHVtZUNoYW5nZU9icy51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmVycm9yT2JzLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogRGlyZWN0aXZlLCBhcmdzOiBbe1xuICAgIHNlbGVjdG9yOiAnW3ZnTWVkaWFdJ1xufSwgXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuc3RhdGljIGN0b3JQYXJhbWV0ZXJzOiAoe3R5cGU6IGFueSwgZGVjb3JhdG9ycz86IERlY29yYXRvckludm9jYXRpb25bXX18bnVsbClbXSA9IFtcbnt0eXBlOiBFbGVtZW50UmVmLCB9LFxue3R5cGU6IFZnQVBJLCB9LFxuXTtcbnN0YXRpYyBwcm9wRGVjb3JhdG9yczoge1trZXk6IHN0cmluZ106IERlY29yYXRvckludm9jYXRpb25bXX0gPSB7XG4ndmdNZWRpYSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbn07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==