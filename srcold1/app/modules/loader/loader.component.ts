import { Component, Input } from '@angular/core';

@Component({
    selector: 'loader',
    template: `
        <div class="h-100 content-loader">
            <div class="loding-box ">
                <span>{{ message }}</span>
                <p-progressSpinner strokeWidth="5"></p-progressSpinner>
            </div>
        </div>
    `,
})
export class LoaderComponent {
    @Input() public message: string = 'Loading...';
}
