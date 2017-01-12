import { OnChanges, ElementRef, SimpleChange, OnInit } from "@angular/core";
import { VgAPI } from "../../../core/services/vg-api";
export declare class VgScrubBarCuePoints implements OnInit, OnChanges {
    API: VgAPI;
    vgCuePoints: TextTrackCueList;
    vgFor: string;
    elem: HTMLElement;
    target: any;
    onLoadedMetadataCalled: boolean;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    onLoadedMetadata(): void;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
}
