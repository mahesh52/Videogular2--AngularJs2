"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require('@angular/core');
var vg_player_1 = require('./vg-player/vg-player');
var vg_media_1 = require('./vg-media/vg-media');
var vg_cue_points_1 = require('./vg-cue-points/vg-cue-points');
var vg_api_1 = require('./services/vg-api');
var vg_fullscreen_api_1 = require('./services/vg-fullscreen-api');
var vg_utils_1 = require('./services/vg-utils');
// components
__export(require('./vg-player/vg-player'));
__export(require('./vg-media/vg-media'));
__export(require('./vg-cue-points/vg-cue-points'));
// services
__export(require('./services/vg-api'));
__export(require('./services/vg-fullscreen-api'));
__export(require('./services/vg-utils'));
// types
__export(require('./events/vg-events'));
__export(require('./states/vg-states'));
/**
 * @internal
 */
function coreDirectives() {
    return [
        vg_player_1.VgPlayer, vg_media_1.VgMedia, vg_cue_points_1.VgCuePoints
    ];
}
exports.coreDirectives = coreDirectives;
function coreServices() {
    return [
        vg_api_1.VgAPI, vg_fullscreen_api_1.VgFullscreenAPI, vg_utils_1.VgUtils
    ];
}
exports.coreServices = coreServices;
var VgCoreModule = (function () {
    function VgCoreModule() {
    }
    VgCoreModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: coreDirectives(),
                    exports: coreDirectives(),
                    providers: coreServices()
                },] },
    ];
    /** @nocollapse */
    VgCoreModule.ctorParameters = [];
    return VgCoreModule;
}());
exports.VgCoreModule = VgCoreModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHFCQUFtQyxlQUFlLENBQUMsQ0FBQTtBQUNuRCwwQkFBeUIsdUJBQXVCLENBQUMsQ0FBQTtBQUNqRCx5QkFBd0IscUJBQXFCLENBQUMsQ0FBQTtBQUM5Qyw4QkFBNEIsK0JBQStCLENBQUMsQ0FBQTtBQUM1RCx1QkFBc0IsbUJBQW1CLENBQUMsQ0FBQTtBQUMxQyxrQ0FBZ0MsOEJBQThCLENBQUMsQ0FBQTtBQUMvRCx5QkFBd0IscUJBQXFCLENBQUMsQ0FBQTtBQUc5QyxhQUFhO0FBQ2IsaUJBQWMsdUJBQXVCLENBQUMsRUFBQTtBQUN0QyxpQkFBYyxxQkFBcUIsQ0FBQyxFQUFBO0FBQ3BDLGlCQUFjLCtCQUErQixDQUFDLEVBQUE7QUFFOUMsV0FBVztBQUNYLGlCQUFjLG1CQUFtQixDQUFDLEVBQUE7QUFDbEMsaUJBQWMsOEJBQThCLENBQUMsRUFBQTtBQUM3QyxpQkFBYyxxQkFBcUIsQ0FBQyxFQUFBO0FBRXBDLFFBQVE7QUFDUixpQkFBYyxvQkFBb0IsQ0FBQyxFQUFBO0FBQ25DLGlCQUFjLG9CQUFvQixDQUFDLEVBQUE7QUFFbkM7O0dBRUc7QUFDSDtJQUNJLE1BQU0sQ0FBQztRQUNILG9CQUFRLEVBQUUsa0JBQU8sRUFBRSwyQkFBVztLQUNqQyxDQUFDO0FBQ04sQ0FBQztBQUplLHNCQUFjLGlCQUk3QixDQUFBO0FBRUQ7SUFDSSxNQUFNLENBQUM7UUFDSCxjQUFLLEVBQUUsbUNBQWUsRUFBRSxrQkFBTztLQUNsQyxDQUFDO0FBQ04sQ0FBQztBQUplLG9CQUFZLGVBSTNCLENBQUE7QUFHRDtJQUFBO0lBV0EsQ0FBQztJQVZNLHVCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGVBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDckIsWUFBWSxFQUFFLGNBQWMsRUFBRTtvQkFDOUIsT0FBTyxFQUFFLGNBQWMsRUFBRTtvQkFDekIsU0FBUyxFQUFFLFlBQVksRUFBRTtpQkFDNUIsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLDJCQUFjLEdBQTZELEVBQ2pGLENBQUM7SUFDRixtQkFBQztBQUFELENBQUMsQUFYRCxJQVdDO0FBWFksb0JBQVksZUFXeEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmdQbGF5ZXIgfSBmcm9tICcuL3ZnLXBsYXllci92Zy1wbGF5ZXInO1xuaW1wb3J0IHsgVmdNZWRpYSB9IGZyb20gJy4vdmctbWVkaWEvdmctbWVkaWEnO1xuaW1wb3J0IHsgVmdDdWVQb2ludHMgfSBmcm9tICcuL3ZnLWN1ZS1wb2ludHMvdmctY3VlLXBvaW50cyc7XG5pbXBvcnQgeyBWZ0FQSSB9IGZyb20gJy4vc2VydmljZXMvdmctYXBpJztcbmltcG9ydCB7IFZnRnVsbHNjcmVlbkFQSSB9IGZyb20gJy4vc2VydmljZXMvdmctZnVsbHNjcmVlbi1hcGknO1xuaW1wb3J0IHsgVmdVdGlscyB9IGZyb20gJy4vc2VydmljZXMvdmctdXRpbHMnO1xuXG5cbi8vIGNvbXBvbmVudHNcbmV4cG9ydCAqIGZyb20gJy4vdmctcGxheWVyL3ZnLXBsYXllcic7XG5leHBvcnQgKiBmcm9tICcuL3ZnLW1lZGlhL3ZnLW1lZGlhJztcbmV4cG9ydCAqIGZyb20gJy4vdmctY3VlLXBvaW50cy92Zy1jdWUtcG9pbnRzJztcblxuLy8gc2VydmljZXNcbmV4cG9ydCAqIGZyb20gJy4vc2VydmljZXMvdmctYXBpJztcbmV4cG9ydCAqIGZyb20gJy4vc2VydmljZXMvdmctZnVsbHNjcmVlbi1hcGknO1xuZXhwb3J0ICogZnJvbSAnLi9zZXJ2aWNlcy92Zy11dGlscyc7XG5cbi8vIHR5cGVzXG5leHBvcnQgKiBmcm9tICcuL2V2ZW50cy92Zy1ldmVudHMnO1xuZXhwb3J0ICogZnJvbSAnLi9zdGF0ZXMvdmctc3RhdGVzJztcblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcmVEaXJlY3RpdmVzKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIFZnUGxheWVyLCBWZ01lZGlhLCBWZ0N1ZVBvaW50c1xuICAgIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3JlU2VydmljZXMoKTogUHJvdmlkZXJbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgVmdBUEksIFZnRnVsbHNjcmVlbkFQSSwgVmdVdGlsc1xuICAgIF07XG59XG5cblxuZXhwb3J0IGNsYXNzIFZnQ29yZU1vZHVsZSB7XG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcbiAgICBkZWNsYXJhdGlvbnM6IGNvcmVEaXJlY3RpdmVzKCksXG4gICAgZXhwb3J0czogY29yZURpcmVjdGl2ZXMoKSxcbiAgICBwcm92aWRlcnM6IGNvcmVTZXJ2aWNlcygpXG59LCBdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5zdGF0aWMgY3RvclBhcmFtZXRlcnM6ICh7dHlwZTogYW55LCBkZWNvcmF0b3JzPzogRGVjb3JhdG9ySW52b2NhdGlvbltdfXxudWxsKVtdID0gW1xuXTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19