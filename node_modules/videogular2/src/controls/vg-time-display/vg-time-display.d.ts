import { ElementRef, OnInit, PipeTransform } from '@angular/core';
import { VgAPI } from '../../core/services/vg-api';
export declare class VgUtcPipe implements PipeTransform {
    transform(value: number, format: string): string;
}
export declare class VgTimeDisplay implements OnInit {
    API: VgAPI;
    vgFor: string;
    vgProperty: string;
    vgFormat: string;
    elem: HTMLElement;
    target: any;
    constructor(ref: ElementRef, API: VgAPI);
    ngOnInit(): void;
    onPlayerReady(): void;
    getTime(): number;
}
