import { ElementRef, SimpleChanges, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { VgAPI } from '../../core/services/vg-api';
export declare class VgDASH implements OnInit, OnChanges, OnDestroy {
    private ref;
    API: VgAPI;
    vgDash: string;
    vgFor: string;
    target: any;
    dash: any;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    ngOnChanges(changes: SimpleChanges): void;
    createPlayer(): void;
    destroyPlayer(): void;
    ngOnDestroy(): void;
}
