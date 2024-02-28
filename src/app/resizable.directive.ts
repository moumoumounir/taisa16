import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appResizable]' // Attribute selector
})

export class ResizableDirective implements OnInit {


  @Input() resizableGrabWidth = 5; //8;
  @Input() resizableMinWidth = 6; //10;

  dragging = false;

  constructor(private el: ElementRef) {

    const self = this;

    const EventListenerMode = { capture: true };

    /*function preventGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'none';
    }*/

    function restoreGlobalMouseEvents() {
      document.body.style['pointer-events' as any] = 'auto';
    }


    const newWidth = (wid:any) => {
      const newWidth = Math.max(this.resizableMinWidth, wid);
      el.nativeElement.style.width = (newWidth) + "px";
      console.log(' el.nativeElement.style.width ',newWidth)
    }


    const mouseMoveG = (evt:any) => {
      //console.log('  mouseMoveG  evt.clientX ',evt.clientX)
      if (!this.dragging) {
        return;
      }
      newWidth(evt.clientX)
      evt.stopPropagation();
    };

    /*const dragMoveG = (evt:any) => {
      
      if (!this.dragging) {
        return;
      }
      const newWidth = Math.max(this.resizableMinWidth, (evt.clientX - el.nativeElement.offsetLeft)) + "px";
      console.log('  dragMoveG  ',newWidth,' evt',evt)
      
      el.nativeElement.style.width = (evt.clientX - el.nativeElement.offsetLeft) + "px";
      evt.stopPropagation();
    };*/

    const mouseUpG = (evt:any) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    const mouseDown = (evt:any) => {
      
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        //preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };


    const mouseMove = (evt:any) => {
      console.log('  mouseMove  dragging ',this.dragging, 'inDragRegion ',this.inDragRegion(evt) )
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = "col-resize";
      } else {
        el.nativeElement.style.cursor = "default";
      }
    }


    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }

  ngOnInit(): void {
    this.el.nativeElement.style["border-right"] = this.resizableGrabWidth + "px solid darkgrey";
  }

  inDragRegion(evt:any) {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabWidth;
  }

}
