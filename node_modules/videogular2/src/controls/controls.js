"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var vg_controls_1 = require('./vg-controls');
var vg_fullscreen_1 = require('./vg-fullscreen/vg-fullscreen');
var vg_mute_1 = require('./vg-mute/vg-mute');
var vg_volume_1 = require('./vg-volume/vg-volume');
var vg_play_pause_1 = require('./vg-play-pause/vg-play-pause');
var vg_playback_button_1 = require('./vg-playback-button/vg-playback-button');
var vg_scrub_bar_1 = require('./vg-scrub-bar/vg-scrub-bar');
var vg_scrub_bar_buffering_time_1 = require('./vg-scrub-bar/vg-scrub-bar-buffering-time/vg-scrub-bar-buffering-time');
var vg_scrub_bar_cue_points_1 = require('./vg-scrub-bar/vg-scrub-bar-cue-points/vg-scrub-bar-cue-points');
var vg_scrub_bar_current_time_1 = require('./vg-scrub-bar/vg-scrub-bar-current-time/vg-scrub-bar-current-time');
var vg_time_display_1 = require('./vg-time-display/vg-time-display');
var vg_track_selector_1 = require('./vg-track-selector/vg-track-selector');
var VgControlsModule = (function () {
    function VgControlsModule() {
    }
    VgControlsModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: [
                        vg_controls_1.VgControls,
                        vg_fullscreen_1.VgFullscreen,
                        vg_mute_1.VgMute,
                        vg_volume_1.VgVolume,
                        vg_play_pause_1.VgPlayPause,
                        vg_playback_button_1.VgPlaybackButton,
                        vg_scrub_bar_1.VgScrubBar,
                        vg_scrub_bar_buffering_time_1.VgScrubBarBufferingTime,
                        vg_scrub_bar_cue_points_1.VgScrubBarCuePoints,
                        vg_scrub_bar_current_time_1.VgScrubBarCurrentTime,
                        vg_time_display_1.VgTimeDisplay,
                        vg_time_display_1.VgUtcPipe,
                        vg_track_selector_1.VgTrackSelector
                    ],
                    exports: [
                        vg_controls_1.VgControls,
                        vg_fullscreen_1.VgFullscreen,
                        vg_mute_1.VgMute,
                        vg_volume_1.VgVolume,
                        vg_play_pause_1.VgPlayPause,
                        vg_playback_button_1.VgPlaybackButton,
                        vg_scrub_bar_1.VgScrubBar,
                        vg_scrub_bar_buffering_time_1.VgScrubBarBufferingTime,
                        vg_scrub_bar_cue_points_1.VgScrubBarCuePoints,
                        vg_scrub_bar_current_time_1.VgScrubBarCurrentTime,
                        vg_time_display_1.VgTimeDisplay,
                        vg_time_display_1.VgUtcPipe,
                        vg_track_selector_1.VgTrackSelector
                    ]
                },] },
    ];
    /** @nocollapse */
    VgControlsModule.ctorParameters = [];
    return VgControlsModule;
}());
exports.VgControlsModule = VgControlsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb250cm9scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLHVCQUE2QixpQkFBaUIsQ0FBQyxDQUFBO0FBQy9DLDRCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUMzQyw4QkFBNkIsK0JBQStCLENBQUMsQ0FBQTtBQUM3RCx3QkFBdUIsbUJBQW1CLENBQUMsQ0FBQTtBQUMzQywwQkFBeUIsdUJBQXVCLENBQUMsQ0FBQTtBQUNqRCw4QkFBNEIsK0JBQStCLENBQUMsQ0FBQTtBQUM1RCxtQ0FBaUMseUNBQXlDLENBQUMsQ0FBQTtBQUMzRSw2QkFBMkIsNkJBQTZCLENBQUMsQ0FBQTtBQUN6RCw0Q0FBd0Msd0VBQXdFLENBQUMsQ0FBQTtBQUNqSCx3Q0FBb0MsZ0VBQWdFLENBQUMsQ0FBQTtBQUNyRywwQ0FBc0Msb0VBQW9FLENBQUMsQ0FBQTtBQUMzRyxnQ0FBeUMsbUNBQW1DLENBQUMsQ0FBQTtBQUM3RSxrQ0FBZ0MsdUNBQXVDLENBQUMsQ0FBQTtBQUd4RTtJQUFBO0lBdUNBLENBQUM7SUF0Q00sMkJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUNyQixPQUFPLEVBQUUsQ0FBRSxxQkFBWSxDQUFFO29CQUN6QixZQUFZLEVBQUU7d0JBQ1Ysd0JBQVU7d0JBQ1YsNEJBQVk7d0JBQ1osZ0JBQU07d0JBQ04sb0JBQVE7d0JBQ1IsMkJBQVc7d0JBQ1gscUNBQWdCO3dCQUNoQix5QkFBVTt3QkFDVixxREFBdUI7d0JBQ3ZCLDZDQUFtQjt3QkFDbkIsaURBQXFCO3dCQUNyQiwrQkFBYTt3QkFDYiwyQkFBUzt3QkFDVCxtQ0FBZTtxQkFDbEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLHdCQUFVO3dCQUNWLDRCQUFZO3dCQUNaLGdCQUFNO3dCQUNOLG9CQUFRO3dCQUNSLDJCQUFXO3dCQUNYLHFDQUFnQjt3QkFDaEIseUJBQVU7d0JBQ1YscURBQXVCO3dCQUN2Qiw2Q0FBbUI7d0JBQ25CLGlEQUFxQjt3QkFDckIsK0JBQWE7d0JBQ2IsMkJBQVM7d0JBQ1QsbUNBQWU7cUJBQ2xCO2lCQUNKLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCwrQkFBYyxHQUE2RCxFQUNqRixDQUFDO0lBQ0YsdUJBQUM7QUFBRCxDQUFDLEFBdkNELElBdUNDO0FBdkNZLHdCQUFnQixtQkF1QzVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFZnQ29udHJvbHMgfSBmcm9tICcuL3ZnLWNvbnRyb2xzJztcbmltcG9ydCB7IFZnRnVsbHNjcmVlbiB9IGZyb20gJy4vdmctZnVsbHNjcmVlbi92Zy1mdWxsc2NyZWVuJztcbmltcG9ydCB7IFZnTXV0ZSB9IGZyb20gJy4vdmctbXV0ZS92Zy1tdXRlJztcbmltcG9ydCB7IFZnVm9sdW1lIH0gZnJvbSAnLi92Zy12b2x1bWUvdmctdm9sdW1lJztcbmltcG9ydCB7IFZnUGxheVBhdXNlIH0gZnJvbSAnLi92Zy1wbGF5LXBhdXNlL3ZnLXBsYXktcGF1c2UnO1xuaW1wb3J0IHsgVmdQbGF5YmFja0J1dHRvbiB9IGZyb20gJy4vdmctcGxheWJhY2stYnV0dG9uL3ZnLXBsYXliYWNrLWJ1dHRvbic7XG5pbXBvcnQgeyBWZ1NjcnViQmFyIH0gZnJvbSAnLi92Zy1zY3J1Yi1iYXIvdmctc2NydWItYmFyJztcbmltcG9ydCB7IFZnU2NydWJCYXJCdWZmZXJpbmdUaW1lIH0gZnJvbSAnLi92Zy1zY3J1Yi1iYXIvdmctc2NydWItYmFyLWJ1ZmZlcmluZy10aW1lL3ZnLXNjcnViLWJhci1idWZmZXJpbmctdGltZSc7XG5pbXBvcnQgeyBWZ1NjcnViQmFyQ3VlUG9pbnRzIH0gZnJvbSAnLi92Zy1zY3J1Yi1iYXIvdmctc2NydWItYmFyLWN1ZS1wb2ludHMvdmctc2NydWItYmFyLWN1ZS1wb2ludHMnO1xuaW1wb3J0IHsgVmdTY3J1YkJhckN1cnJlbnRUaW1lIH0gZnJvbSAnLi92Zy1zY3J1Yi1iYXIvdmctc2NydWItYmFyLWN1cnJlbnQtdGltZS92Zy1zY3J1Yi1iYXItY3VycmVudC10aW1lJztcbmltcG9ydCB7IFZnVGltZURpc3BsYXksIFZnVXRjUGlwZSB9IGZyb20gJy4vdmctdGltZS1kaXNwbGF5L3ZnLXRpbWUtZGlzcGxheSc7XG5pbXBvcnQgeyBWZ1RyYWNrU2VsZWN0b3IgfSBmcm9tICcuL3ZnLXRyYWNrLXNlbGVjdG9yL3ZnLXRyYWNrLXNlbGVjdG9yJztcblxuXG5leHBvcnQgY2xhc3MgVmdDb250cm9sc01vZHVsZSB7XG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcbiAgICBpbXBvcnRzOiBbIENvbW1vbk1vZHVsZSBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBWZ0NvbnRyb2xzLFxuICAgICAgICBWZ0Z1bGxzY3JlZW4sXG4gICAgICAgIFZnTXV0ZSxcbiAgICAgICAgVmdWb2x1bWUsXG4gICAgICAgIFZnUGxheVBhdXNlLFxuICAgICAgICBWZ1BsYXliYWNrQnV0dG9uLFxuICAgICAgICBWZ1NjcnViQmFyLFxuICAgICAgICBWZ1NjcnViQmFyQnVmZmVyaW5nVGltZSxcbiAgICAgICAgVmdTY3J1YkJhckN1ZVBvaW50cyxcbiAgICAgICAgVmdTY3J1YkJhckN1cnJlbnRUaW1lLFxuICAgICAgICBWZ1RpbWVEaXNwbGF5LFxuICAgICAgICBWZ1V0Y1BpcGUsXG4gICAgICAgIFZnVHJhY2tTZWxlY3RvclxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBWZ0NvbnRyb2xzLFxuICAgICAgICBWZ0Z1bGxzY3JlZW4sXG4gICAgICAgIFZnTXV0ZSxcbiAgICAgICAgVmdWb2x1bWUsXG4gICAgICAgIFZnUGxheVBhdXNlLFxuICAgICAgICBWZ1BsYXliYWNrQnV0dG9uLFxuICAgICAgICBWZ1NjcnViQmFyLFxuICAgICAgICBWZ1NjcnViQmFyQnVmZmVyaW5nVGltZSxcbiAgICAgICAgVmdTY3J1YkJhckN1ZVBvaW50cyxcbiAgICAgICAgVmdTY3J1YkJhckN1cnJlbnRUaW1lLFxuICAgICAgICBWZ1RpbWVEaXNwbGF5LFxuICAgICAgICBWZ1V0Y1BpcGUsXG4gICAgICAgIFZnVHJhY2tTZWxlY3RvclxuICAgIF1cbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSBbXG5dO1xufVxuXG5pbnRlcmZhY2UgRGVjb3JhdG9ySW52b2NhdGlvbiB7XG4gIHR5cGU6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG59XG4iXX0=