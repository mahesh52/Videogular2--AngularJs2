import { ElementRef, OnInit } from '@angular/core';
import { VgAPI } from '../../core/services/vg-api';
export declare class VgScrubBar implements OnInit {
    API: VgAPI;
    vgFor: string;
    elem: HTMLElement;
    target: any;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    onMouseDownScrubBar($event: any): void;
}
