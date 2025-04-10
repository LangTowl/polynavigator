import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import svgPanZoom from 'svg-pan-zoom';
import { NgForOf, NgIf } from '@angular/common';
import { GetMapService } from '../../services/get-map/get-map.service';
import { FormsModule } from '@angular/forms';
import { MapRequestResponse } from '../../services/interfaces/network-interfaces';

interface MapNode {
  x: number;
  y: number;
  name: string;
  group: string;
}

@Component({
  selector: 'app-desktop-map-page',
  templateUrl: './desktop-map-page.component.html',
  imports: [NgForOf, NgIf, FormsModule],
  styleUrls: ['./desktop-map-page.component.scss']
})
export class DesktopMapPageComponent implements AfterViewInit, OnDestroy {
  // Inject services
  getMapService = inject(GetMapService);

  // Ensure nodeDictionary is typed as a map with string keys and MapNode values
  nodeDictionary: MapRequestResponse = this.getMapService.fetchMapFromStorage();

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

  @ViewChild('map', { static: false }) svgElement!: ElementRef;
  panZoomInstance: any;

  ngOnInit() {
    // Handle groups and names
    const groups = new Set<string>();

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

    // Optional: generate paths or any other initialization steps here
  }

  ngAfterViewInit() {
    // Zoom and pan functionality
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

  findDirectRoute() {
    // Clear any existing paths
    this.paths = [];

    if (!this.selectedName1 || !this.selectedName2) {
      console.error('Please select both start and end locations');
      return;
    }

    const startNodeKey = this.findNodeKeyByName(this.selectedName1);
    const endNodeKey = this.findNodeKeyByName(this.selectedName2);

    if (!startNodeKey || !endNodeKey) {
      console.error('Could not find the selected locations');
      return;
    }

    const startNode = this.nodeDictionary[Number(startNodeKey)];
    const endNode = this.nodeDictionary[Number(endNodeKey)];

    // Create a direct path between start and end
    this.paths = [{
      d: `M${startNode.x + this.bufferX},${startNode.y + this.bufferY} L${endNode.x + this.bufferX},${endNode.y + this.bufferY}`
    }];

    console.log('Path created:', this.paths);

    // Reset the pan and zoom to show the path
    if (this.panZoomInstance) {
      setTimeout(() => {
        this.panZoomInstance.updateBBox();
        this.panZoomInstance.fit();
        this.panZoomInstance.center();
      }, 100);
    }
  }

  generatePaths() {
    this.paths = [];

    const nodeKeys = [...this.nodeKeys].sort((a, b) => a - b); // Sort numerically

    for (let i = 0; i < nodeKeys.length - 1; i++) {
      const start = this.nodeDictionary[Number(nodeKeys[i])];
      const end = this.nodeDictionary[Number(nodeKeys[i + 1])];

      this.paths.push({
        d: `M${start.x + this.bufferX},${start.y + this.bufferY} L${end.x + this.bufferX},${end.y + this.bufferY}`
      });
    }
  }

  findNodeKeyByName(name: string): string | null {
    for (const [key, node] of Object.entries(this.nodeDictionary)) {
      if (node.name === name) {
        return key;
      }
    }
    return null;
  }

  ngOnDestroy() {
    if (this.panZoomInstance) {
      this.panZoomInstance.destroy();
    }
  }
}

//Lukas TEST CODE
/*
nodeDictionary: {[key: string]: {x: number, y: number, name: string, group: string, kind: number}} = {
  "0": { x: 570, y: 326, name: "IST South Entrance", group: "IST", kind: 0 },
  "1": { x: 586, y: 313, name: "", group: "Path", kind: 1 },
  "2": { x: 642, y: 303, name: "", group: "Path", kind: 1 },
  "3": { x: 664, y: 275, name: "", group: "Path", kind: 1 },
  "4": { x: 690, y: 246, name: "", group: "Path", kind: 1 },
  "5": { x: 702, y: 236, name: "", group: "Path", kind: 1 },
  "6": { x: 709, y: 267, name: "", group: "Path", kind: 1 },
  "7": { x: 721, y: 256, name: "Phase 1 North Entrance", group: "Phase 1", kind: 0 },
  "8": { x: 723, y: 283, name: "", group: "Path", kind: 1 },
  "9": { x: 752, y: 252, name: "", group: "Path", kind: 1 },
  "10": { x: 758, y: 242, name: "Phase 1 Main Entrance West", group: "Phase 1", kind: 0 },
  "11": { x: 824, y: 292, name: "", group: "Path", kind: 1 },
  "12": { x: 849, y: 270, name: "", group: "Path", kind: 1 },
  "13": { x: 838, y: 262, name: "", group: "Path", kind: 1 },
  "14": { x: 829, y: 271, name: "Phase 1 South Entrance", group: "Phase 1", kind: 0 },
  "15": { x: 867, y: 284, name: "", group: "Path", kind: 1 },
  "16": { x: 862, y: 289, name: "Phase 2 North East Entrance", group: "Phase 2", kind: 0 },
  "17": { x: 836, y: 301, name: "", group: "Path", kind: 1 },
  "18": { x: 842, y: 297, name: "Phase 2 North West Entrance", group: "Phase 2", kind: 0 },
  "19": { x: 870, y: 331, name: "", group: "Path", kind: 1 },
  "20": { x: 883, y: 346, name: "", group: "Path", kind: 1 },
  "21": { x: 890, y: 341, name: "Phase 2 Main Entrance West", group: "Phase 2", kind: 0 },
  "22": { x: 849, y: 342, name: "", group: "Path", kind: 1 },
  "23": { x: 820, y: 338, name: "", group: "Path", kind: 1 },
  "24": { x: 742, y: 262, name: "", group: "Path", kind: 1 },
  "25": { x: 759, y: 279, name: "Phase 3 North East Entrance", group: "Phase 3", kind: 0 },
  "26": { x: 796, y: 312, name: "", group: "Path", kind: 1 },
  "27": { x: 783, y: 317, name: "Phase 3 North Center Entrance", group: "Phase 3", kind: 0 },
  "28": { x: 787, y: 321, name: "Phase 3 South Center Entrance", group: "Phase 3", kind: 0 },
  "29": { x: 829, y: 340, name: "", group: "Path", kind: 1 },
  "30": { x: 828, y: 346, name: "", group: "Path", kind: 1 },
  "31": { x: 843, y: 362, name: "Phase 3 Main East Entrance", group: "Phase 3", kind: 0 },
  "32": { x: 827, y: 380, name: "Phase 3 Main West Entrance", group: "Phase 3", kind: 0 },
  "33": { x: 870, y: 391, name: "Phase 3 South East Entrance", group: "Phase 3", kind: 0 },
  "34": { x: 858, y: 379, name: "", group: "Path", kind: 1 },
  "35": { x: 887, y: 352, name: "", group: "Path", kind: 1 },
  "36": { x: 886, y: 408, name: "", group: "Path", kind: 1 },
  "37": { x: 900, y: 396, name: "", group: "Path", kind: 1 },
  "38": { x: 888, y: 386, name: "Phase 2 South Entrance", group: "Phase 2", kind: 0 },
  "39": { x: 908, y: 402, name: "", group: "Path", kind: 1 },
  "40": { x: 924, y: 388, name: "", group: "Path", kind: 1 },
  "41": { x: 929, y: 393, name: "Nest Entrance", group: "Wellness", kind: 0 },
  "42": { x: 930, y: 430, name: "Wellness Center Main Entrance", group: "Wellness", kind: 0 },
  "43": { x: 967, y: 467, name: "", group: "Path", kind: 1 },
  "44": { x: 990, y: 488, name: "", group: "Path", kind: 1 },
  "45": { x: 1037, y: 478, name: "", group: "Path", kind: 1 },
  "46": { x: 1076, y: 495, name: "", group: "Path", kind: 1 },
  "47": { x: 1081, y: 510, name: "", group: "Path", kind: 1 },
  "48": { x: 1065, y: 530, name: "", group: "Path", kind: 1 },
  "49": { x: 1076, y: 554, name: "", group: "Path", kind: 1 },
  "50": { x: 1093, y: 551, name: "", group: "Path", kind: 1 },
  "51": { x: 1089, y: 575, name: "SDC Main Entrance", group: "SDC", kind: 0 },
  "52": { x: 1084, y: 561, name: "", group: "Path", kind: 1 },
  "53": { x: 1093, y: 561, name: "", group: "Path", kind: 1 },
  "54": { x: 1093, y: 569, name: "", group: "Path", kind: 1 },
  "55": { x: 1084, y: 569, name: "", group: "Path", kind: 1 },
  "56": { x: 1068, y: 567, name: "", group: "Path", kind: 1 },
  "57": { x: 1049, y: 561, name: "", group: "Path", kind: 1 },
  "58": { x: 985, y: 568, name: "", group: "Path", kind: 1 },
  "59": { x: 1028, y: 564, name: "", group: "Path", kind: 1 },
  "60": { x: 1039, y: 618, name: "", group: "Path", kind: 1 },
  "61": { x: 1053, y: 617, name: "", group: "Path", kind: 1 },
  "62": { x: 1093, y: 633, name: "Soccer Field", group: "SDC", kind: 0 },
  "63": { x: 1098, y: 659, name: "Basketball Court", group: "SDC", kind: 0 },
  "64": { x: 1116, y: 689, name: "Volleyball Court", group: "SDC", kind: 0 },
  "65": { x: 1131, y: 706, name: "", group: "Path", kind: 1 },
  "66": { x: 1148, y: 704, name: "", group: "Path", kind: 1 },
  "67": { x: 1091, y: 596, name: "SDC Pool", group: "SDC", kind: 0 },
  "68": { x: 992, y: 888, name: "", group: "Path", kind: 1 },
  "69": { x: 1050, y: 844, name: "", group: "Path", kind: 1 },
  "70": { x: 1093, y: 799, name: "", group: "Path", kind: 1 },
  "71": { x: 1077, y: 782, name: "Outdoor Fitness", group: "SDC", kind: 0 },
  "72": { x: 1032, y: 543, name: "", group: "Path", kind: 1 },
  "73": { x: 1001, y: 541, name: "", group: "Path", kind: 1 },
  "74": { x: 974, y: 509, name: "", group: "Path", kind: 1 },
  "75": { x: 973, y: 495, name: "", group: "Path", kind: 1 },
  "76": { x: 1136, y: 620, name: "", group: "Path", kind: 1 },
  "77": { x: 1123, y: 564, name: "", group: "Path", kind: 1 },
  "78": { x: 1109, y: 525, name: "", group: "Path", kind: 1 },
  "79": { x: 1082, y: 463, name: "", group: "Path", kind: 1 },
  "80": { x: 1042, y: 395, name: "", group: "Path", kind: 1 },
  "81": { x: 992, y: 328, name: "", group: "Path", kind: 1 },
  "82": { x: 952, y: 361, name: "", group: "Path", kind: 1 },
  "83": { x: 938, y: 346, name: "", group: "Path", kind: 1 },
  "84": { x: 975, y: 310, name: "", group: "Path", kind: 1 },
  "85": { x: 929, y: 266, name: "", group: "Path", kind: 1 },
  "86": { x: 896, y: 306, name: "", group: "Path", kind: 1 },
  "87": { x: 910, y: 319, name: "", group: "Path", kind: 1 },
  "88": { x: 905, y: 326, name: "Phase 2 Main Entrance East", group: "Phase 2", kind: 0 },
  "89": { x: 879, y: 227, name: "", group: "Path", kind: 1 },
  "90": { x: 825, y: 193, name: "", group: "Path", kind: 1 },
  "91": { x: 800, y: 239, name: "", group: "Path", kind: 1 },
  "92": { x: 770, y: 224, name: "", group: "Path", kind: 1 },
  "93": { x: 762, y: 220, name: "", group: "Path", kind: 1 },
  "94": { x: 760, y: 234, name: "Phase 1 Main Entrance East", group: "Phase 1", kind: 0 },
  "95": { x: 786, y: 173, name: "", group: "Path", kind: 1 },
  "96": { x: 749, y: 206, name: "", group: "Path", kind: 1 },
  "97": { x: 744, y: 212, name: "", group: "Path", kind: 1 },
  "98": { x: 725, y: 202, name: "", group: "Path", kind: 1 },
  "99": { x: 763, y: 163, name: "", group: "Path", kind: 1 },
  "100": { x: 737, y: 192, name: "", group: "Path", kind: 1 },
  "101": { x: 742, y: 199, name: "", group: "Path", kind: 1 },
  "102": { x: 734, y: 207, name: "", group: "Path", kind: 1 },
  "103": { x: 995, y: 212, name: "", group: "Path", kind: 1 },
  "104": { x: 1013, y: 310, name: "", group: "Path", kind: 1 },
  "105": { x: 1022, y: 297, name: "", group: "Path", kind: 1 },
  "106": { x: 1041, y: 293, name: "", group: "Path", kind: 1 },
  "107": { x: 1048, y: 321, name: "Admissions Center", group: "Admissions", kind: 0 },
  "108": { x: 860, y: 432, name: "", group: "Path", kind: 1 },
  "109": { x: 770, y: 334, name: "", group: "Path", kind: 1 },
  "110": { x: 750, y: 358, name: "", group: "Path", kind: 1 },
  "111": { x: 717, y: 388, name: "", group: "Path", kind: 1 },
  "112": { x: 692, y: 419, name: "", group: "Path", kind: 1 },
  "113": { x: 662, y: 418, name: "", group: "Path", kind: 1 },
  "114": { x: 618, y: 479, name: "", group: "Path", kind: 1 },
  "115": { x: 592, y: 456, name: "", group: "Path", kind: 1 },
  "116": { x: 577, y: 445, name: "", group: "Path", kind: 1 },
  "117": { x: 542, y: 396, name: "", group: "Path", kind: 1 },
  "118": { x: 553, y: 344, name: "", group: "Path", kind: 1 },
  "119": { x: 624, y: 242, name: "", group: "Path", kind: 1 },
  "120": { x: 650, y: 128, name: "", group: "Path", kind: 1 },
  "121": { x: 706, y: 142, name: "", group: "Path", kind: 1 },
  "122": { x: 610, y: 214, name: "", group: "Path", kind: 1 },
  "123": { x: 583, y: 182, name: "", group: "Path", kind: 1 },
  "124": { x: 545, y: 152, name: "", group: "Path", kind: 1 },
  "125": { x: 507, y: 135, name: "", group: "Path", kind: 1 },
  "126": { x: 617, y: 121, name: "", group: "Path", kind: 1 },
  "127": { x: 564, y: 120, name: "", group: "Path", kind: 1 },
  "128": { x: 487, y: 145, name: "IST North Shuttle Bus", group: "Transportation", kind: 0 },
  "129": { x: 478, y: 153, name: "", group: "Path", kind: 1 },
  "130": { x: 470, y: 188, name: "", group: "Path", kind: 1 },
  "131": { x: 456, y: 192, name: "", group: "Path", kind: 1 },
  "132": { x: 451, y: 199, name: "IST North Entrance", group: "IST", kind: 0 },
  "133": { x: 444, y: 205, name: "", group: "Path", kind: 1 },
  "134": { x: 440, y: 216, name: "", group: "Path", kind: 1 },
  "135": { x: 404, y: 222, name: "", group: "Path", kind: 1 },
  "136": { x: 410, y: 208, name: "", group: "Path", kind: 1 },
  "137": { x: 437, y: 179, name: "", group: "Path", kind: 1 },
  "138": { x: 468, y: 155, name: "", group: "Path", kind: 1 },
  "139": { x: 395, y: 226, name: "", group: "Path", kind: 1 },
  "140": { x: 385, y: 249, name: "", group: "Path", kind: 1 },
  "141": { x: 372, y: 282, name: "", group: "Path", kind: 1 },
  "142": { x: 362, y: 329, name: "", group: "Path", kind: 1 },
  "143": { x: 363, y: 378, name: "Parking Lot 2", group: "Transportation", kind: 0 },
  "144": { x: 365, y: 390, name: "", group: "Path", kind: 1 },
  "145": { x: 479, y: 373, name: "", group: "Path", kind: 1 },
  "146": { x: 490, y: 395, name: "BARC Main Entrance", group: "BARC", kind: 0 },
  "147": { x: 496, y: 383, name: "", group: "Path", kind: 1 },
  "148": { x: 505, y: 418, name: "", group: "Path", kind: 1 },
  "149": { x: 480, y: 441, name: "", group: "Path", kind: 1 },
  "150": { x: 445, y: 452, name: "BARC South Entrance", group: "BARC", kind: 0 },
  "151": { x: 455, y: 462, name: "", group: "Path", kind: 1 },
  "152": { x: 397, y: 282, name: "", group: "Path", kind: 1 },
  "153": { x: 418, y: 318, name: "", group: "Path", kind: 1 },
  "154": { x: 442, y: 345, name: "", group: "Path", kind: 1 },
  "155": { x: 1004, y: 343, name: "Dorm Shuttle Bus", group: "Transportation", kind: 0 },
  "156": { x: 949, y: 335, name: "Parking Lot 3 South", group: "Transportation", kind: 0 },
  "157": { x: 758, y: 199, name: "Parking Lot 3 North", group: "Transportation", kind: 0 },
  "158": { x: 640, y: 125, name: "Parking Lot 1", group: "Transportation", kind: 0 },
  "159": { x: 378, y: 459, name: "", group: "Path", kind: 1 },
  "160": { x: 391, y: 507, name: "", group: "Path", kind: 1 },
  "161": { x: 431, y: 471, name: "", group: "Path", kind: 1 },
  "162": { x: 420, y: 481, name: "", group: "Path", kind: 1 },
  "163": { x: 425, y: 504, name: "Parking Lot 4 North", group: "Transportation", kind: 0 },
  "164": { x: 434, y: 496, name: "", group: "Path", kind: 1 },
  "165": { x: 440, y: 492, name: "", group: "Path", kind: 1 },
  "166": { x: 435, y: 480, name: "", group: "Path", kind: 1 },
  "167": { x: 427, y: 489, name: "Parking Lot 4 Shuttle Bus", group: "Transportation", kind: 0 },
  "168": { x: 398, y: 528, name: "", group: "Path", kind: 1 },
  "169": { x: 414, y: 571, name: "", group: "Path", kind: 1 },
  "170": { x: 462, y: 550, name: "", group: "Path", kind: 1 },
  "171": { x: 489, y: 602, name: "", group: "Path", kind: 1 },
  "172": { x: 443, y: 628, name: "", group: "Path", kind: 1 },
  "173": { x: 521, y: 651, name: "", group: "Path", kind: 1 },
  "174": { x: 479, y: 681, name: "", group: "Path", kind: 1 },
  "175": { x: 518, y: 732, name: "", group: "Path", kind: 1 },
  "176": { x: 545, y: 707, name: "Parking Lot 4 South", group: "Transportation", kind: 0 },
  "177": { x: 556, y: 698, name: "", group: "Path", kind: 1 },
  "178": { x: 562, y: 705, name: "", group: "Path", kind: 1 },
  "179": { x: 586, y: 712, name: "", group: "Path", kind: 1 },
  "180": { x: 531, y: 747, name: "", group: "Path", kind: 1 },
  "181": { x: 558, y: 722, name: "Parking Lot 6 North", group: "Transportation", kind: 0 },
  "182": { x: 580, y: 793, name: "", group: "Path", kind: 1 },
  "183": { x: 613, y: 754, name: "", group: "Path", kind: 1 },
  "184": { x: 630, y: 833, name: "", group: "Path", kind: 1 },
  "185": { x: 659, y: 791, name: "", group: "Path", kind: 1 },
  "186": { x: 684, y: 867, name: "", group: "Path", kind: 1 },
  "187": { x: 708, y: 822, name: "", group: "Path", kind: 1 },
  "188": { x: 774, y: 851, name: "", group: "Path", kind: 1 },
  "189": { x: 729, y: 890, name: "", group: "Path", kind: 1 },
  "190": { x: 760, y: 863, name: "Parking Lot 6 South", group: "Transportation", kind: 0 },
  "191": { x: 767, y: 865, name: "Parking Lot 6 Shuttle Bus", group: "Transportation", kind: 0 },
  "192": { x: 782, y: 871, name: "Parking Lot 8", group: "Transportation", kind: 0 },
  "193": { x: 768, y: 884, name: "", group: "Path", kind: 1 },
  "194": { x: 758, y: 902, name: "", group: "Path", kind: 1 },
  "195": { x: 819, y: 922, name: "", group: "Path", kind: 1 },
  "196": { x: 833, y: 873, name: "", group: "Path", kind: 1 },
  "197": { x: 841, y: 868, name: "", group: "Path", kind: 1 },
  "198": { x: 849, y: 869, name: "", group: "Path", kind: 1 },
  "199": { x: 853, y: 877, name: "", group: "Path", kind: 1 },
  "200": { x: 877, y: 882, name: "", group: "Path", kind: 1 },
  "201": { x: 893, y: 901, name: "Overflow Parking", group: "Transportation", kind: 0 },
  "202": { x: 879, y: 767, name: "", group: "Path", kind: 1 },
  "203": { x: 793, y: 861, name: "", group: "Path", kind: 1 },
  "204": { x: 748, y: 927, name: "", group: "Path", kind: 1 },
  "205": { x: 739, y: 927, name: "", group: "Path", kind: 1 },
  "206": { x: 727, y: 975, name: "Parking Entrance", group: "Transportation", kind: 0 },
  "207": { x: 694, y: 967, name: "Parking Exit", group: "Transportation", kind: 0 },
  "208": { x: 702, y: 936, name: "", group: "Path", kind: 1 },
  "209": { x: 713, y: 909, name: "", group: "Path", kind: 1 },
  "210": { x: 851, y: 930, name: "", group: "Path", kind: 1 },
  "211": { x: 1144, y: 986, name: "", group: "Path", kind: 1 },
  "212": { x: 1154, y: 986, name: "", group: "Path", kind: 1 },
  "213": { x: 1174, y: 967, name: "", group: "Path", kind: 1 },
  "214": { x: 1174, y: 958, name: "", group: "Path", kind: 1 },
  "215": { x: 1201, y: 956, name: "", group: "Path", kind: 1 },
  "216": { x: 1203, y: 967, name: "", group: "Path", kind: 1 },
  "217": { x: 1219, y: 975, name: "", group: "Path", kind: 1 },
  "218": { x: 1229, y: 986, name: "", group: "Path", kind: 1 },
  "219": { x: 1234, y: 1006, name: "", group: "Path", kind: 1 },
  "220": { x: 1231, y: 1024, name: "", group: "Path", kind: 1 },
  "221": { x: 1218, y: 1042, name: "", group: "Path", kind: 1 },
  "222": { x: 1189, y: 1053, name: "", group: "Path", kind: 1 },
  "223": { x: 1154, y: 1103, name: "Roundabout Entrance", group: "Transportation", kind: 0 },
  "224": { x: 1153, y: 1111, name: "", group: "Path", kind: 1 },
  "225": { x: 1117, y: 1087, name: "Roundabout Exit", group: "Transportation", kind: 0 },
  "226": { x: 827, y: 997, name: "Free Parking East", group: "Transportation", kind: 0 },
  "227": { x: 521, y: 939, name: "Free Parking West", group: "Transportation", kind: 0 },
  "228": { x: 983, y: 1034, name: "", group: "Path", kind: 1 },
  "229": { x: 1053, y: 1056, name: "", group: "Path", kind: 1 },
  "230": { x: 1140, y: 1014, name: "", group: "Path", kind: 1 },
  "231": { x: 1150, y: 1018, name: "", group: "Path", kind: 1 },
  "232": { x: 1154, y: 1029, name: "", group: "Path", kind: 1 },
  "233": { x: 1151, y: 1036, name: "", group: "Path", kind: 1 },
  "234": { x: 963, y: 856, name: "", group: "Path", kind: 1 },
  "235": { x: 929, y: 821, name: "", group: "Path", kind: 1 },
  "236": { x: 912, y: 795, name: "", group: "Path", kind: 1 },
  "237": { x: 896, y: 779, name: "", group: "Path", kind: 1 },
  "238": { x: 910, y: 747, name: "", group: "Path", kind: 1 },
  "239": { x: 942, y: 719, name: "", group: "Path", kind: 1 },
  "240": { x: 979, y: 675, name: "", group: "Path", kind: 1 },
  "241": { x: 1024, y: 723, name: "", group: "Path", kind: 1 },
  "242": { x: 1044, y: 750, name: "", group: "Path", kind: 1 },
  "243": { x: 1062, y: 766, name: "", group: "Path", kind: 1 },
  "244": { x: 980, y: 621, name: "", group: "Path", kind: 1 },
  "245": { x: 957, y: 644, name: "", group: "Path", kind: 1 },
  "246": { x: 892, y: 579, name: "", group: "Path", kind: 1 },
  "247": { x: 926, y: 564, name: "", group: "Path", kind: 1 },
  "248": { x: 868, y: 611, name: "", group: "Path", kind: 1 },
  "249": { x: 818, y: 655, name: "", group: "Path", kind: 1 },
  "250": { x: 791, y: 671, name: "", group: "Path", kind: 1 },
  "251": { x: 829, y: 713, name: "", group: "Path", kind: 1 },
  "252": { x: 844, y: 737, name: "", group: "Path", kind: 1 },
  "253": { x: 770, y: 664, name: "", group: "Path", kind: 1 },
  "254": { x: 737, y: 633, name: "", group: "Path", kind: 1 }
};
*/
