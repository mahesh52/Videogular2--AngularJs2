import { ElementRef, OnInit } from '@angular/core';
import { VgAPI } from '../../core/services/vg-api';
export declare class VgPlayPause implements OnInit {
    API: VgAPI;
    vgFor: string;
    elem: HTMLElement;
    target: any;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    onClick(): void;
    getState(): any;
}
