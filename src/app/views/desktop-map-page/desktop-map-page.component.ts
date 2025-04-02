import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import svgPanZoom from 'svg-pan-zoom';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-desktop-map-page',
  templateUrl: './desktop-map-page.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./desktop-map-page.component.scss']
})
export class DesktopMapPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map', { static: false }) svgElement!: ElementRef;
  panZoomInstance: any;

  nodes = [
    { id: 1, x: 570, y: 326 },
    { id: 2, x: 586, y: 313 },
    { id: 3, x: 606, y: 310 },
    { id: 4, x: 624, y: 307 }
  ];

  //buffer for scaling differences can be modified
  bufferX = 5.1;
  bufferY = 1;

  // Paths connecting nodes
  paths: { d: string }[] = [];

  ngAfterViewInit() {




    this.generatePaths();

    const svg = document.getElementById('map');
    if (svg) {
      const beforePan = (oldPan: any, newPan: { x: number; y: number; }) => {
        const gutterWidth = 1100;
        const gutterHeight = 950;
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
        minZoom: 1,
        maxZoom: 3,
        zoomScaleSensitivity: 0.2,
      });

      // Set the beforePan function
      this.panZoomInstance.setBeforePan(beforePan);
    }
  }

  generatePaths() {
    this.paths = [];


    for (let i = 0; i < this.nodes.length - 1; i++) {
      const start = this.nodes[i];
      const end = this.nodes[i + 1];
      this.paths.push({ d: `M${start.x + this.bufferX},${start.y + this.bufferY} L${end.x + this.bufferX},${end.y + this.bufferY}` });
    }
  }

  ngOnDestroy() {
    if (this.panZoomInstance) {
      this.panZoomInstance.destroy();
    }
  }
}
