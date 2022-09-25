import { trigger, transition, style, animate } from '@angular/animations';
export const routeTransitionAnimations = trigger('theTrigger', [
  transition('* <=> *', [
    // css styles at start of transition
    style({ opacity: 0 }),

    // animation and styles at end of transition
    animate('300ms', style({ opacity: 1 })),
  ]),
]);

// transition('* <=> *', [
//   query(':enter, :leave', style({ position: 'fixed', width:'100%' })),
//   group([
//     query(':enter', [
//       style({ transform: 'translateX(100%)' }),
//       animate('600ms ease-in-out', style({ transform: 'translateX(0%)' }))
//     ]),
//     query(':leave', [
//       style({ transform: 'translateX(0%)' }),
//       animate('600ms ease-in-out', style({ transform: 'translateX(-100%)' }))]),
//   ])
// ]),

// transition('* <=> *', [
//   query(':enter, :leave', [
//     style({
//       position: 'absolute',
//       top: 0,
//       width: '100%',
//       height: '100%',
//     }),
//   ]),
//   query(':enter', [style({ top: '-100%' })]),
//   group([
//     query(':leave', [animate('600ms ease', style({ top: '100%' }))]),
//     query(':enter', [animate('600ms ease', style({ top: '0%' }))]),
//   ]),
// ]),
