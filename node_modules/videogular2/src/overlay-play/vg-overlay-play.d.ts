import { OnInit, ElementRef } from '@angular/core';
import { VgAPI } from '../core/services/vg-api';
export declare class VgOverlayPlay implements OnInit {
    API: VgAPI;
    vgFor: string;
    elem: HTMLElement;
    target: any;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    onClick(): void;
    getState(): string;
}
