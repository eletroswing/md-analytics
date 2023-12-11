import type { CSSProperties, ReactElement } from "react"
import { Children, cloneElement, isValidElement } from "react"
import { twj } from "tw-to-css"
import satori from 'satori';
import fs from 'node:fs';
import { join, resolve } from 'node:path';

type element = ReactElement<{
  className?: string
  style?: CSSProperties
  children?: element[]
}>

export async function transformToCss(el: element) {
  const jsx = inlineTailwind(el)

  function inlineTailwind(el: element): element {
    const { className, children, ...props } = el.props
    let style: element["props"]["style"] = {}

    if (className) {
      style = twj(className.split(" "))
    }

    return cloneElement(
      el,
      { ...props, style },
      Children.map(children, (child) => (isValidElement(child) ? inlineTailwind(child) : child)),
    )
  }


  return jsx
}

export async function transformToSvg(el: element, width: number = 1200) {
  const svg = await satori(await transformToCss(el), {
    width: width,
    fonts: [
      {
        name: 'Roboto',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'Roboto-Regular.ttf')),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Roboto',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'Roboto-Bold.ttf')),
        weight: 700,
        style: 'normal',
      },
      {
        name: 'NotoEmoji',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'NotoEmoji-Bold.ttf')),
        weight: 700,
        style: 'normal',
      },
    ]
  });
  return svg;
}