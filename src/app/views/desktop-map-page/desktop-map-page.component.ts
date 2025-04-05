import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import svgPanZoom from 'svg-pan-zoom';
import { NgForOf } from '@angular/common';
import {GetMapService} from '../../services/get-map/get-map.service';
import {MapRequestResponse} from '../../services/interfaces/network-interfaces';
import {NodesToTraverseService} from '../../services/nodes-to-traverse/nodes-to-traverse.service';

@Component({
  selector: 'app-desktop-map-page',
  templateUrl: './desktop-map-page.component.html',
  imports: [NgForOf],
  styleUrls: ['./desktop-map-page.component.scss']
})
export class DesktopMapPageComponent implements AfterViewInit, OnDestroy {

  // Inject services
  getMapService = inject(GetMapService);
  nodesToTraverseService = inject(NodesToTraverseService);

  // Dictionary to store all nodes
  nodeDictionary: MapRequestResponse = {};

  ngOnInit() {
    this.nodeDictionary = this.getMapService.fetchMapFromStorage();

    // Example on how to iterate through each key value par in the dictionary
    // Object.entries(this.nodeDictionary).forEach(([key, node]) => {
    //   console.log(`Key: ${key}, x: ${node.x} y: ${node.y}`);
    // });
  }

  @ViewChild('map', { static: false }) svgElement!: ElementRef;
  panZoomInstance: any;

  nodes = [
    { id: 0, x: 570, y: 326 },
    { id: 1, x: 586, y: 313 },
    { id: 2, x: 642, y: 303 },
    { id: 3, x: 664, y: 275 },
    { id: 4, x: 690, y: 246 },
    { id: 5, x: 702, y: 236 },
    { id: 6, x: 709, y: 267 },
    { id: 7, x: 721, y: 256 },
    { id: 8, x: 723, y: 283 },
    { id: 9, x: 752, y: 252 },
    { id: 10, x: 758, y: 242 },
    { id: 11, x: 824, y: 292 },
    { id: 12, x: 849, y: 270 },
    { id: 13, x: 838, y: 262 },
    { id: 14, x: 829, y: 271 },
    { id: 15, x: 867, y: 284 },
    { id: 16, x: 862, y: 289 },
    { id: 17, x: 836, y: 301 },
    { id: 18, x: 842, y: 297 },
    { id: 19, x: 870, y: 331 },
    { id: 20, x: 883, y: 346 },
    { id: 21, x: 890, y: 341 },
    { id: 22, x: 849, y: 342 }
  ];

  bufferX = -130;
  bufferY = 1;
  paths: { d: string }[] = [];

  ngAfterViewInit() {
    this.generatePaths();

    const svg = document.getElementById('map') as unknown as SVGSVGElement;
    if (svg) {
      this.panZoomInstance = svgPanZoom(svg, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 1,
        maxZoom: 3,
        zoomScaleSensitivity: 0.2
      });

      // Get the actual image size
      const boundingBox = svg.getBoundingClientRect();
      const imageWidth = boundingBox.width;
      const imageHeight = boundingBox.height;

      const beforePan = (oldPan: any, newPan: { x: number; y: number; }) => {
        const zoom = this.panZoomInstance.getZoom();

        const leftLimit = -imageWidth * (zoom - 1);
        const rightLimit = imageWidth * (zoom - 1);
        const topLimit = -imageHeight * (zoom - 1);
        const bottomLimit = imageHeight * (zoom - 1);

        return {
          x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
          y: Math.max(topLimit, Math.min(bottomLimit, newPan.y))
        };
      };

      this.panZoomInstance.setBeforePan(beforePan);
    }
  }

  generatePaths() {
    this.paths = [];
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const start = this.nodes[i];
      const end = this.nodes[i + 1];
      this.paths.push({
        d: `M${start.x + this.bufferX},${start.y + this.bufferY} L${end.x + this.bufferX},${end.y + this.bufferY}`
      });
    }
  }

  ngOnDestroy() {
    if (this.panZoomInstance) {
      this.panZoomInstance.destroy();
    }
  }

  /**
   * Use to make API call to pull nodes to traverse into local storage
   */
  requestTraversalGraph() {
    this.nodesToTraverseService.requestTraversalGraph(1, 2);
  }

  /**
   * Use to fetch nodes to traverse
   */
  fetchNodesToTraverse() {
    console.log(this.nodesToTraverseService.fetchNodesToTraverse());
  }

}
