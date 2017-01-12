/// <reference types="core-js" />
import { ElementRef, OnInit } from '@angular/core';
import { VgAPI } from '../../core/services/vg-api';
export declare class VgPlaybackButton implements OnInit {
    API: VgAPI;
    vgFor: string;
    elem: HTMLElement;
    target: any;
    playbackValues: Array<string>;
    playbackIndex: number;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    onClick(): void;
    getPlaybackRate(): any;
}
