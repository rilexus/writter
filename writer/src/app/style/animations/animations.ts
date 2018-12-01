import {animate, query, stagger, state, style, transition, trigger} from "@angular/animations";


export const slideAnimation = trigger('slideAnimation',[
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(50%)'
    }),
    animate(200)

  ]),
  transition(':leave', animate(100, style({
    opacity: 0,
    transform: 'translateX(-50%)'

  })))
]);


export const slideBottom = trigger('slideBottom',[
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(100%)'
    }),
    animate('0.2s ease-in')
  
  ]),
  transition(':leave', animate('0.2s ease-out', style({
    opacity: 0,
    transform: 'translateY(100%)'
  })))
]);

export const slideTop = trigger('slideTop', [
  transition(':enter', [
    style({
      transform: 'translateY(-60%)'
    }),
    animate('0.2s ease-in')
  
  ]),
  transition(':leave', animate('0.2s ease-out', style({
    transform: 'translateY(-60%)'
    
  })))
]);

export const fading = trigger('fading',[
  transition(':enter', [
    style({
      opacity: 0,
    }),
    animate('0.2s ease-in')
  
  ]),
  transition(':leave', animate('0.2s ease-out', style({
    opacity: 0,
  })))
]);



export const grow = trigger('grow',[
  transition(':enter', [
    style({
      opacity: 0,
      height: 0
    }),
    animate('0.2s ease-in')

  ]),
  transition(':leave', animate('0.2s ease-out', style({
    opacity: 0,
    height: 0
  })))
]);



export const shrink = trigger('shrink', [
  transition(':leave', [
    style({
      height: '*',
    }),
    animate(200,
      style({
        transform: 'scale(0.5)',
        height: 0,
        opacity: 0
      })
    )
  ])
]);

export const fadeOut = trigger('fadeOut', [
  transition(':leave',
    animate(100,
      style({
        opacity: 0
      })
    )
  )
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(200)
  ]),
]);

export const popUp = trigger('popUp', [
  transition(':enter', [
    style({
      transform: 'scale(0.9)',
      opacity: 0
    }),
    animate(200)
  ]),
]);


export const popDown = trigger('popDown', [
  transition(':leave',
    animate(200,
      style({
        transform: 'scale(0.9)',
        opacity: 0
      })
    )
  )
]);



export const listAnimation = trigger('listAnimation', [
  transition('* => *', [ // each time the binding value changes
    query(':leave', [
      stagger(10, [ // wait
        animate('0.1s', style({
          opacity: 0
        }))
      ])
    ], { optional: true }),
    
    query(':enter', [ // trigger at init
      style({ // init style (start)
        opacity: 0 // from
      }),
      stagger(30, [ // wait for 100ms
        animate('0.1s',
          style({ // finish style
            opacity: 1 // to
          })
        )
      ])
    ], { optional: true })
  ])
]);


export const openFromClick = trigger('openFromClickTrigger', [
  transition(':enter', [
    style({
      position: 'absolute',
      top: '{{clickY}}',
      left: '{{clickX}}',
      // height: '0px',
      // width: '0px',
      transform: 'scale(0)',
      opacity: 0,
    }),
    animate(170)
  ]),
]);
