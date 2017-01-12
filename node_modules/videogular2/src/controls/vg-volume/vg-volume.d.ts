import { ElementRef, OnInit } from '@angular/core';
import { VgAPI } from '../../core/services/vg-api';
export declare class VgVolume implements OnInit {
    API: VgAPI;
    vgFor: string;
    elem: HTMLElement;
    target: any;
    isDragging: boolean;
    mouseDownPosX: number;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    onMouseDown(event: {
        x: number;
    }): void;
    onDrag(event: {
        x: number;
    }): void;
    onStopDrag(event: {
        x: number;
    }): void;
    calculateVolume(mousePosX: number): number;
    setVolume(vol: number): void;
    getVolume(): number;
}
