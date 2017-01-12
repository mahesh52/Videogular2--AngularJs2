import { OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { VgAPI } from "../core/services/vg-api";
import 'rxjs/add/observable/fromEvent';
export declare class VgControls implements OnInit, AfterViewInit {
    private API;
    private ref;
    elem: HTMLElement;
    vgFor: string;
    target: any;
    isAdsPlaying: string;
    hideControls: boolean;
    vgAutohide: boolean;
    vgAutohideTime: number;
    private timer;
    constructor(API: VgAPI, ref: ElementRef);
    ngOnInit(): void;
    onPlayerReady(): void;
    ngAfterViewInit(): void;
    onStartAds(): void;
    onEndAds(): void;
    hide(): void;
    show(): void;
    private hideAsync();
}
