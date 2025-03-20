import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import svgPanZoom from 'svg-pan-zoom';

@Component({
  selector: 'app-desktop-map-page',
  templateUrl: './desktop-map-page.component.html',
  styleUrls: ['./desktop-map-page.component.scss']
})
export class DesktopMapPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) svgElement!: ElementRef;
  panZoomInstance: any;

  ngAfterViewInit() {
    const svg = document.getElementById('map');
    if (svg) {
      // Define the beforePan function to limit panning
      const beforePan = (oldPan: any, newPan: { x: number; y: number; }) => {
        const gutterWidth = 1100;
        const gutterHeight = 1000;
        const sizes = this.panZoomInstance.getSizes();

        const leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth;
        const rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom);
        const topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight;
        const bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);

        return {
          x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
          y: Math.max(topLimit, Math.min(bottomLimit, newPan.y))
        };
      };

      // Initialize panZoom with constraints
      // @ts-ignore
      this.panZoomInstance = svgPanZoom(svg, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 1.5, // Minimum zoom level
        maxZoom: 3, // Maximum zoom level
        zoomScaleSensitivity: 0.2, // Adjust zoom sensitivity
      });

      // Set the beforePan function
      this.panZoomInstance.setBeforePan(beforePan);
    }
  }

  ngOnDestroy() {
    if (this.panZoomInstance) {
      this.panZoomInstance.destroy();
    }
  }
}
