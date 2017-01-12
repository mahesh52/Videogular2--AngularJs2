"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var vg_dash_1 = require("./vg-dash/vg-dash");
var vg_hls_1 = require("./vg-hls/vg-hls");
var VgStreamingModule = (function () {
    function VgStreamingModule() {
    }
    VgStreamingModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: [
                        vg_dash_1.VgDASH, vg_hls_1.VgHLS
                    ],
                    exports: [
                        vg_dash_1.VgDASH, vg_hls_1.VgHLS
                    ]
                },] },
    ];
    /** @nocollapse */
    VgStreamingModule.ctorParameters = [];
    return VgStreamingModule;
}());
exports.VgStreamingModule = VgStreamingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RyZWFtaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBOEIsZUFBZSxDQUFDLENBQUE7QUFDOUMsdUJBQTZCLGlCQUFpQixDQUFDLENBQUE7QUFDL0Msd0JBQXVCLG1CQUFtQixDQUFDLENBQUE7QUFDM0MsdUJBQXNCLGlCQUFpQixDQUFDLENBQUE7QUFHeEM7SUFBQTtJQWNBLENBQUM7SUFkc0MsNEJBQVUsR0FBMEI7UUFDM0UsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUNyQixPQUFPLEVBQUUsQ0FBRSxxQkFBWSxDQUFFO29CQUN6QixZQUFZLEVBQUU7d0JBQ1YsZ0JBQU0sRUFBRSxjQUFLO3FCQUNoQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsZ0JBQU0sRUFBRSxjQUFLO3FCQUNoQjtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsZ0NBQWMsR0FBNkQsRUFDakYsQ0FBQztJQUNGLHdCQUFDO0FBQUQsQ0FBQyxBQWRELElBY0M7QUFkWSx5QkFBaUIsb0JBYzdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9ICAgICAgZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVmdEQVNIIH0gZnJvbSBcIi4vdmctZGFzaC92Zy1kYXNoXCI7XG5pbXBvcnQgeyBWZ0hMUyB9IGZyb20gXCIuL3ZnLWhscy92Zy1obHNcIjtcblxuXG5leHBvcnQgY2xhc3MgVmdTdHJlYW1pbmdNb2R1bGUge3N0YXRpYyBkZWNvcmF0b3JzOiBEZWNvcmF0b3JJbnZvY2F0aW9uW10gPSBbXG57IHR5cGU6IE5nTW9kdWxlLCBhcmdzOiBbe1xuICAgIGltcG9ydHM6IFsgQ29tbW9uTW9kdWxlIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFZnREFTSCwgVmdITFNcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgVmdEQVNILCBWZ0hMU1xuICAgIF1cbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSBbXG5dO1xufVxuXG5pbnRlcmZhY2UgRGVjb3JhdG9ySW52b2NhdGlvbiB7XG4gIHR5cGU6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG59XG4iXX0=