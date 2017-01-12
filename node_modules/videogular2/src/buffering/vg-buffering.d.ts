import { ElementRef, OnInit } from '@angular/core';
import { VgAPI } from '../core/services/vg-api';
import { IPlayable } from '../core/vg-media/i-playable';
export declare class VgBuffering implements OnInit {
    API: VgAPI;
    vgFor: string;
    elem: HTMLElement;
    target: IPlayable;
    checkBufferInterval: number;
    checkInterval: number;
    currentPlayPos: number;
    lastPlayPos: number;
    displayState: string;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    onUpdateBuffer(isBuffering: any): void;
    show(): void;
    hide(): void;
}
