import { cn } from '@workspace/ui/lib/utils';
import React, { ComponentProps } from 'react';

const Logo = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      viewBox="0 0 48 48"
      {...props}
      className={cn('size-12', props.className)}
    >
      <defs>
        <linearGradient id="b">
          <stop
            offset={0}
            style={{
              stopColor: '#fd711e',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.284}
            style={{
              stopColor: '#f05a31',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.573}
            style={{
              stopColor: '#91436f',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.733}
            style={{
              stopColor: '#464598',
              stopOpacity: 1,
            }}
          />
        </linearGradient>
        <linearGradient id="a">
          <stop
            offset={0}
            style={{
              stopColor: '#fe7224',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.355}
            style={{
              stopColor: '#ea5436',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.573}
            style={{
              stopColor: '#91436f',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.656}
            style={{
              stopColor: '#464598',
              stopOpacity: 1,
            }}
          />
        </linearGradient>
        <linearGradient
          xlinkHref="#a"
          id="c"
          x1={0.374}
          x2={46.751}
          y1={0.374}
          y2={46.751}
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        />
        <linearGradient
          xlinkHref="#b"
          id="d"
          x1={8.029}
          x2={39.346}
          y1={5.339}
          y2={42.661}
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        />
        <linearGradient
          xlinkHref="#a"
          id="e"
          x1={0.374}
          x2={46.751}
          y1={0.374}
          y2={46.751}
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        />
      </defs>
      <g
        style={{
          mixBlendMode: 'normal',
          fill: 'url(#c)',
          fillOpacity: 1,
        }}
      >
        <path
          d="M24 0C10.77 0 0 10.77 0 24s10.77 24 24 24 24-10.77 24-24S37.23 0 24 0Zm0 4.115c11.007 0 19.885 8.878 19.885 19.885 0 11.007-8.878 19.885-19.885 19.885-11.007 0-19.885-8.878-19.885-19.885C4.115 12.993 12.993 4.115 24 4.115Z"
          style={{
            baselineShift: 'baseline',
            display: 'inline',
            overflow: 'visible',
            opacity: 1,
            mixBlendMode: 'normal',
            vectorEffect: 'none',
            fill: 'url(#d)',
            fillOpacity: 1,
            stroke: 'none',
            stopColor: '#000',
            stopOpacity: 1,
          }}
        />
        <path
          d="m15.72 14.555-.005 14.442a4.283 4.283 45.012 0 0 4.282 4.284h9.406a1.16 1.16 145.474 0 0 1.083-.745l.875-2.286a.713.713 55.474 0 0-.666-.969h-9.422a1.513 1.513 45 0 1-1.513-1.513v-1.231a1.208 1.208 134.827 0 1 1.2-1.208l6.435-.039a1.16 1.16 145.155 0 0 1.08-.751l.86-2.284a.713.713 55.18 0 0-.671-.965l-7.704.04a1.195 1.195 44.854 0 1-1.2-1.195v-1.59a1.2 1.2 135 0 1 1.2-1.201h8.41a1.168 1.168 145.679 0 0 1.088-.743l.896-2.292a.707.707 55.66 0 0-.66-.965l-13.772.01a1.202 1.202 134.993 0 0-1.201 1.201z"
          style={{
            baselineShift: 'baseline',
            display: 'inline',
            overflow: 'visible',
            opacity: 1,
            vectorEffect: 'none',
            fill: 'url(#e)',
            fillOpacity: 1,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeMiterlimit: 9,
            stopColor: '#000',
            stopOpacity: 1,
          }}
          transform="matrix(1.30198 0 0 1.30198 -6.54 -6.353)"
        />
      </g>
    </svg>
  );
};

export default Logo;
