import { EventEmitter, ElementRef, OnInit } from "@angular/core";
import 'rxjs/add/observable/fromEvent';
export declare class VgCuePoints implements OnInit {
    ref: ElementRef;
    onEnterCuePoint: EventEmitter<any>;
    onUpdateCuePoint: EventEmitter<any>;
    onExitCuePoint: EventEmitter<any>;
    onCompleteCuePoint: EventEmitter<any>;
    constructor(ref: ElementRef);
    ngOnInit(): void;
    onLoad(event: any): void;
    onEnter(event: any): void;
    onExit(event: any): void;
}
