import {Component, ElementRef, OnInit, OnDestroy} from "@angular/core";
@Component({
    selector: 'single-media-player',
    templateUrl: 'app/single-media-player.html'
})
export class SingleMediaPlayer implements OnInit, OnDestroy {
    sources:Array<Object>;
   private _elementRef: ElementRef
  private videoJSplayer : VideoJSPlayer

    constructor(elementRef: ElementRef) {
	  this._elementRef = elementRef
        this.sources = [
            {
                src: "http://static.videogular.com/assets/videos/videogular.mp4",
                type: "video/mp4"
            },
            {
                src: "http://static.videogular.com/assets/videos/videogular.ogg",
                type: "video/ogg"
            },
            {
                src: "http://static.videogular.com/assets/videos/videogular.webm",
                type: "video/webm"
            }
        ];
    }
	ngOnInit() {
        console.log('Init - Component initialized')
           this.videoJSplayer = videojs(document.getElementById('singleVideo'), {}, function() {
            // This is functionally the same as the previous example.
        });
    }

    ngOnDestroy() {
        console.log('Deinit - Destroyed Component')
       
    }
}