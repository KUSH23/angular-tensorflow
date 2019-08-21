import { Directive, HostListener, Renderer, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {
  touchmoveListenFunc: Function = null;
  touchendListenFunc: Function = null;
  touchcancelListenFunc: Function = null;
  oversize = 80;
  containerWidth: number = 0;
  touchX: number = 0;
  moveX: number = 0;
  positionX: number = 0;
  arrow: number = 0;
  constructor(private elementRef: ElementRef, private renderer: Renderer) {
    this.containerWidth = this.elementRef.nativeElement.parentElement.offsetWidth;
    this.childrenResize();

    this.renderer.listen(window, 'resize', (e) => {
      this.containerWidth = this.elementRef.nativeElement.parentElement.offsetWidth;
      this.childrenResize();
    });
  }

  ngAfterContentInit() {
    this.childrenResize();
  }

  
  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onStart(event) {
        
    if (event.touches) {
      this.touchX =  event.touches[0].clientX;
      this.removePreviousTouchListeners();
      this.touchmoveListenFunc = this.renderer.listen(event.target, 'touchmove', (e) => { this.onMove(e); });
      this.touchendListenFunc = this.renderer.listen(event.target, 'touchend', (e) => { this.removePreviousTouchListeners(); this.onEnd(e); });
      this.touchcancelListenFunc = this.renderer.listen(event.target, 'touchcancel', (e) => { this.removePreviousTouchListeners(); this.onEnd(e); });
    }
    else{
      this.touchX = event.clientX ;
      this.touchmoveListenFunc = this.renderer.listenGlobal(event.target, 'mousemove', (e) => { this.onMove(e); });
      this.touchendListenFunc = this.renderer.listenGlobal(event.target, 'mouseup', (e) => { this.removePreviousTouchListeners(); this.onEnd(e); });
      this.touchcancelListenFunc = this.renderer.listenGlobal(event.target, 'onmouseleave', (e) => { this.removePreviousTouchListeners(); this.onEnd(e); });
      
     
    }
  }

  // @HostListener('touchmove', ['$event'])
  onMove(event) {
      let clientX =  event.clientX || event.touches[0].clientX;
      this.moveX = clientX- this.touchX;
      this.renderer.setElementStyle(this.elementRef.nativeElement, 'transition', null);
      this.renderer.setElementStyle(this.elementRef.nativeElement, '-webkit-transform', 'translate3d(' + (this.positionX + this.moveX) + 'px,0px,0px)');
      this.renderer.setElementStyle(this.elementRef.nativeElement, 'transform', 'translate3d(' + (this.positionX + this.moveX) + 'px,0px,0px)');
  }


  // @HostListener('touchend', ['$event'])     
  // @HostListener('touchcancel', ['$event']) 
  onEnd(event) {
      this.removePreviousTouchListeners();
    if (Math.abs(this.moveX) > this.oversize) {
      this.next(this.moveX > 0 ? 1 : -1);
    }
    else {
      this.next(0);
    }
  }


  /**
   * Dom Animation이 끝난후에 작업
   * @param event 
   */
  @HostListener('animationend', ['$event'])
  @HostListener('webkitAnimationEnd', ['$event'])
  @HostListener('MSAnimationEnd', ['$event'])
  @HostListener('transitionend', ['$event'])
  @HostListener('webkitTransitionEnd', ['$event'])
  onAnimationEnd(event) {
    if (this.arrow == -1) {
      //앞에있는 자식을 뒤로 보낸다
      this.elementRef.nativeElement.appendChild(this.elementRef.nativeElement.children[0]);
    } else if (this.arrow == 1) {
      //뒤에 있는 자식을 앞으로 보낸다.
      this.elementRef.nativeElement.prepend(this.elementRef.nativeElement.children[2]);
    }
    this.init();
  }


  ngOnDestroy() {
    this.removePreviousTouchListeners();
  }

  /**
   * Touch이벤트 취소
   */
  removePreviousTouchListeners() {
    if (this.touchmoveListenFunc !== null)
      this.touchmoveListenFunc();             // remove previous listener
    if (this.touchendListenFunc !== null)
      this.touchendListenFunc();              // remove previous listener
    if (this.touchcancelListenFunc !== null)
      this.touchcancelListenFunc();           // remove previous listener
    this.touchmoveListenFunc = null;
    this.touchendListenFunc = null;
    this.touchcancelListenFunc = null;
  }

  /**
   * 자식 사이즈 변경
   */
  childrenResize() {
    let children: Array<any> = this.elementRef.nativeElement.children;
    if (children) {
      let cnt = children.length;
      //wrap 사이즈 변경
      this.elementRef.nativeElement.style.width = ((this.containerWidth * cnt) + 'px');
      for (var i = 0; i < cnt; i++) {
        children[i].style.width = (this.containerWidth + 'px');
      }
    }
    this.init();
  }

  /**
   * 초기화 
   */
  init() {
    this.renderer.setElementStyle(this.elementRef.nativeElement, 'transition', null);
    this.positionX = (this.containerWidth * -1);
    //wrap를 가운데로 이동시킴
    this.renderer.setElementStyle(this.elementRef.nativeElement, '-webkit-transform', 'translate3d(' + this.positionX + 'px, 0px, 0px)');
  }

  /**
   * 이동방향으로 페이지 넘김
   * @param arrow 
   */
  next(arrow: number) {
    this.arrow = arrow;
    let pos = this.containerWidth * arrow;
    this.positionX += pos;
    this.renderer.setElementStyle(this.elementRef.nativeElement, '-webkit-transform', '-webkit-transform 0.2s ease-in');
    this.renderer.setElementStyle(this.elementRef.nativeElement, 'transition', 'transform 0.2s');
    this.renderer.setElementStyle(this.elementRef.nativeElement, '-webkit-transform', 'translate3d(' + this.positionX + 'px, 0px, 0px)');
  }
}
