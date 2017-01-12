/// <reference types="core-js" />
import { ElementRef, OnInit } from '@angular/core';
import { VgAPI } from '../../core/services/vg-api';
export interface Option {
    id: string;
    label: string;
    selected: boolean;
}
export declare class VgTrackSelector implements OnInit {
    API: VgAPI;
    vgFor: string;
    elem: HTMLElement;
    target: any;
    tracks: Array<Option>;
    trackSelected: string;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    selectTrack(trackId: string): void;
}
