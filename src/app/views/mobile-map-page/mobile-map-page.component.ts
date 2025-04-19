import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, HostListener } from '@angular/core';
import svgPanZoom from 'svg-pan-zoom';
import { NgForOf, NgIf } from '@angular/common';
import { GetMapService } from '../../services/get-map/get-map.service';
import { FormsModule } from '@angular/forms';
import { MapRequestResponse, NodesToTraverse } from '../../services/interfaces/network-interfaces';
import { NodesToTraverseService } from '../../services/nodes-to-traverse/nodes-to-traverse.service';
import { GeolocatorService } from '../../services/geolocator/geolocator.service';

@Component({
  selector: 'app-mobile-map-page',
  templateUrl: './mobile-map-page.component.html',
  imports: [NgForOf, NgIf, FormsModule],
  styleUrls: ['./mobile-map-page.component.scss']
})
export class MobileMapPageComponent implements AfterViewInit, OnDestroy {
  // Inject services
  geoService = inject(GeolocatorService);
  getMapService = inject(GetMapService);
  requestNodesToTraverseService = inject(NodesToTraverseService);

  // Mobile UI specific properties
  activeTab: string = 'route';
  isPanelCollapsed: boolean = true;
  startY: number = 0;
  currentY: number = 0;
  isTouching: boolean = false;

  // Original properties
  nodeDictionary: MapRequestResponse = {};
  nodeKeys: number[] = [];
  bufferX = -130;
  bufferY = 1;
  paths: { d: string }[] = [];
  groupOptions: string[] = [];
  groupedNames: { [key: string]: string[] } = {};
  selectedGroup1: string = '';
  selectedGroup2: string = '';
  selectedName1: string = '';
  selectedName2: string = '';
  tagFilter = '';
  filteredTagGroups: string[] = [];
  expandedGroups: { [key: string]: boolean } = {};
  currentLong = 0;
  currentLat = 0;
  watchId: number | null = null;
  @ViewChild('map', {static: false}) svgElement!: ElementRef;
  panZoomInstance: any;

  ngOnInit() {
    // Make request upon open for nodes from back and cache
    this.getMapService.requestMapNodes();
    this.nodeDictionary = this.getMapService.fetchMapFromStorage();
    this.startWatchingGPS();
    this.getNodeFirstFromGeoLocation();

    // For populating all of the groupnames in the first drop down box
    const groups = new Set<string>();

    // Pulls all nodes from the node dictionary that aren't in path group
    for (const node of Object.values(this.nodeDictionary)) {
      if (node.group !== 'Path') {
        groups.add(node.group);
      }
    }

    this.groupOptions = Array.from(groups);
    this.groupedNames = {};

    for (const node of Object.values(this.nodeDictionary)) {
      if (node.group !== 'Path') {
        if (!this.groupedNames[node.group]) {
          this.groupedNames[node.group] = [];
        }
        this.groupedNames[node.group].push(node.name);
      }
    }

    // Populate the nodeKeys array from the dictionary (ensure keys are numbers)
    this.nodeKeys = Object.keys(this.nodeDictionary).map(key => parseInt(key, 10));
  }

  ngAfterViewInit() {
    // Zoom and pan functionality
    const svg = document.getElementById('map') as unknown as SVGSVGElement;
    if (svg) {
      this.panZoomInstance = svgPanZoom(svg, {
        zoomEnabled: true,
        controlIconsEnabled: false, // Hide controls for mobile
        fit: true,
        center: true,
        minZoom: 1,
        maxZoom: 3,
        zoomScaleSensitivity: 0.3
      });

      // Get image size
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

      // Set default pan zoom
      this.panZoomInstance.setBeforePan(beforePan);

      // This so it queries every tag to start
      this.filterByTag();
    }

    // Set up touch handling for the panel handle
    this.setupTouchHandling();
  }

  // Mobile UI specific methods
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  togglePanel() {
    this.isPanelCollapsed = !this.isPanelCollapsed;
  }

  resetPanZoom() {
    if (this.panZoomInstance) {
      this.panZoomInstance.resetZoom();
      this.panZoomInstance.center();
    }
  }

  onPanelHandleTouch(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
    this.isTouching = true;
    event.preventDefault();
  }

  setupTouchHandling() {
    const panelHandle = document.getElementById('panelHandle');
    if (panelHandle) {
      panelHandle.addEventListener('touchstart', (e) => this.onPanelHandleTouch(e), { passive: false });

      // Add touch move and end event listeners to the document
      document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    }
  }

  handleTouchMove(e: TouchEvent) {
    if (!this.isTouching) return;

    this.currentY = e.touches[0].clientY;
    const diff = this.startY - this.currentY;

    if (diff > 50) {
      // Swipe up - expand panel
      this.isPanelCollapsed = false;
    } else if (diff < -50) {
      // Swipe down - collapse panel
      this.isPanelCollapsed = true;
    }

    e.preventDefault();
  }

  handleTouchEnd() {
    this.isTouching = false;
  }

  // Original methods
  generatePaths() {
    this.paths = [];

    const startNodeKey = this.findNodeKeyByName(this.selectedName1);
    let endNodeKey;

    if (this.selectedName2 === "") {
      endNodeKey = this.selectedGroup2;
    } else {
      endNodeKey = this.findNodeKeyByName(this.selectedName2);
    }

    this.requestNodesToTraverseService.requestTraversalGraph(
      Number(startNodeKey),
      String(endNodeKey),
      this.selectedName2 === "",
      '/traverse',
      () => {

        const data = this.requestNodesToTraverseService.fetchNodesToTraverse() as NodesToTraverse;

        if (data) {
          for (let i = 0; i < data.ids.length - 1; i++) {
            const currentNodeId = data.ids[i];
            const nextNodeId = data.ids[i + 1];

            const start = this.nodeDictionary[Number(currentNodeId)];
            const end = this.nodeDictionary[Number(nextNodeId)];

            if (start && end) {
              this.paths.push({
                d: `M${start.x + this.bufferX},${start.y + this.bufferY} L${end.x + this.bufferX},${end.y + this.bufferY}`
              });
            }
            if(i === data.ids.length - 2) {this.selectedName2 = String(end.name);}
          }
        } else {
          console.log("No Traversable Nodes Found")
        }

      }
    );

    // Collapse panel after finding route on mobile
    this.isPanelCollapsed = true;
  }

  findNodeKeyByName(name: string): string | null {
    for (const [key, node] of Object.entries(this.nodeDictionary)) {
      if (node.name === name) {
        return key;
      }
    }
    return null;
  }

  filterByTag() {
    const tag = this.tagFilter?.toLowerCase() || '';
    const allTags = new Set<string>();

    for (const node of Object.values(this.nodeDictionary)) {
      if (node && node.tags) {
        node.tags.forEach((t: string) => {
          if (t) allTags.add(t);
        });
      }
    }

    const allTagArray = Array.from(allTags);
    this.filteredTagGroups = tag
      ? allTagArray.filter(t => t && t.toLowerCase().includes(tag))
      : allTagArray;
  }

  toggleGroup(tag: string) {
    this.expandedGroups[tag] = !this.expandedGroups[tag];
  }

  getNodesByTag(tag: string): string[] {
    return Object.values(this.nodeDictionary)
      .filter(node => node.tags?.includes(tag))
      .map(node => node.name);
  }

  getNodeKinds(name: string): number[] {
    const kinds = new Set<number>();
    for (const node of Object.values(this.nodeDictionary)) {
      if (node.name === name) {
        kinds.add(node.kind);
      }
    }
    return Array.from(kinds);
  }

  getNodeTags(name: string): string[] {
    const node = Object.values(this.nodeDictionary).find(n => n.name === name);
    return node?.tags ?? [];
  }

  getGroupByNode(name: string): string[] {
    const node = Object.values(this.nodeDictionary).find(n => n.name === name);
    return node?.group ?? [];
  }

  selectNodeByName(name: string) {
    const matchedNode = Object.values(this.nodeDictionary).find(node => node.name === name);
    if (matchedNode) {
      this.selectedGroup2 = matchedNode.group;
      this.selectedName2 = "";
      //uncomment if you want it to select the name too
      //this.selectedName2 = matchedNode.name;
    }
  }

  clear() {
    this.selectedName1 = "";
    this.selectedName2 = "";
    this.selectedGroup1 = "";
    this.selectedGroup2 = "";
    this.paths = [];
  }

  getNodeFirstFromGeoLocation() {
    this.geoService.fetchGPSLocation()
      .then((location) => {
        //console.log("GPS Location:", location);

        //starting with infinity because we want every distance to be smaller initially
        let closestDistance = Infinity;
        let nodeClosest = this.nodeDictionary[0];

        for(let i = 0; i < this.nodeKeys.length; i++) {
          const nodeNew = this.nodeDictionary[(this.nodeKeys)[i]];

          if (!nodeNew.is_path) {
            //euclidean distance formula
            const distance = Math.sqrt(
              Math.pow(location.latitude - nodeNew.x, 2) +
              Math.pow(location.longitude - nodeNew.y, 2)
            );

            if (distance < closestDistance) {
              closestDistance = distance;
              nodeClosest = nodeNew;
            }
          }
        }

        this.selectedName1 = nodeClosest.name;
        this.selectedGroup1 = nodeClosest.group;
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });
  }

  startWatchingGPS() {
    this.watchId = this.geoService.watchPosition(
      (location) => {
        this.currentLat = location.latitude;
        this.currentLong = location.longitude;
      },
      (error) => {
        console.error("GPS Error:", error);
      }
    );
  }

  // Clean up resources
  ngOnDestroy() {
    if (this.panZoomInstance) {
      this.panZoomInstance.destroy();
    }
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    // Clean up touch event listeners
    document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  // Detect orientation changes and resize events
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.panZoomInstance) {
      this.panZoomInstance.resize();
      this.panZoomInstance.center();
    }
  }
}
